---
title: Présentation et configuration
description: Joindre un serveur Linux à Active Directory (ou FreeIPA) avec realmd et SSSD — rôle de chaque outil, prérequis (DNS, heure, compte de jonction), installation sur Debian/Ubuntu et RHEL/Rocky/Alma, découverte et jointure (realm discover, realm join, unité d'organisation), sssd.conf (noms courts, répertoires personnels, cache, contrôle d'accès GPO ou simple), autorisation de connexion par groupe (realm permit), sudo pour un groupe AD, SSH (Kerberos, clés dans l'annuaire), dépannage (sssctl, journaux, kinit).
tags: [sssd, realmd, active directory, linux, jointure de domaine, kerberos, sudo]
icon: info
---

| Outil | Rôle |
| --- | --- |
| **realmd** | Découvre le domaine et **réalise la jonction** (installe les paquets, crée le compte machine, configure Kerberos, SSSD, PAM et NSS) |
| **SSSD** | Démon permanent : résout les utilisateurs et groupes (NSS), authentifie (PAM, Kerberos), applique le contrôle d'accès, garde un **cache** pour fonctionner hors ligne |
| adcli / samba-common-bin | Outils de jonction utilisés par realmd |

Résultat : les comptes [[01-active-directory/01-presentation|Active Directory]] (ou [[03-freeipa/01-presentation-installation|FreeIPA]]) se connectent en SSH et sur la console, avec répertoire personnel créé automatiquement, droits `sudo` par groupe et mot de passe vérifié par Kerberos.

## Prérequis

- **DNS** : le serveur résout le domaine et ses enregistrements SRV (`dig -t SRV _ldap._tcp.corp.exemple.fr`) — en pratique, DNS = contrôleurs de domaine.
- **Heure** synchronisée avec les DC (écart < 5 min, Kerberos) : [[01-chrony/01-presentation-client|Chrony]].
- Nom d'hôte **FQDN** (`srv-web-01.corp.exemple.fr`), 15 caractères maximum pour la partie courte (nom NetBIOS du compte machine).
- Compte autorisé à joindre des machines (délégation sur l'unité d'organisation).

## Installation

```bash
sudo apt install realmd sssd sssd-tools libnss-sss libpam-sss adcli samba-common-bin oddjob oddjob-mkhomedir packagekit krb5-user   # Debian/Ubuntu
sudo dnf install realmd sssd oddjob oddjob-mkhomedir adcli samba-common-tools krb5-workstation                                        # RHEL/Rocky/Alma
```

## Jointure

```bash
sudo realm discover corp.exemple.fr
sudo realm join corp.exemple.fr -U adm-jonction --computer-ou="OU=Serveurs Linux,DC=corp,DC=exemple,DC=fr"
sudo realm list
id alice@corp.exemple.fr
```

Ubuntu/Debian : activer la création automatique des répertoires personnels : `sudo pam-auth-update --enable mkhomedir`. RHEL : `sudo authselect select sssd with-mkhomedir --force && sudo systemctl enable --now oddjobd`.

## sssd.conf

```ini /etc/sssd/sssd.conf (extrait)
[domain/corp.exemple.fr]
id_provider = ad
access_provider = ad
ad_domain = corp.exemple.fr
krb5_realm = CORP.EXEMPLE.FR
cache_credentials = True
use_fully_qualified_names = False      # se connecter avec « alice » au lieu de « alice@corp.exemple.fr »
fallback_homedir = /home/%u
default_shell = /bin/bash
ldap_id_mapping = True                 # UID/GID calculés depuis le SID (False si attributs POSIX dans l'AD)
ad_gpo_access_control = enforcing      # applique « Autoriser l'ouverture de session locale / par RDP » des GPO
```

```bash
sudo chmod 600 /etc/sssd/sssd.conf && sudo systemctl restart sssd && sudo sss_cache -E
```

## Qui peut se connecter, et avec quels droits

```bash
sudo realm deny --all
sudo realm permit -g GG-Admins-Linux GG-Exploitation    # contrôle d'accès « simple » (alternative aux GPO)
echo '%GG-Admins-Linux ALL=(ALL) ALL' | sudo tee /etc/sudoers.d/ad-admins && sudo visudo -c
```

SSH : authentification par mot de passe AD (PAM), par **Kerberos** (`GSSAPIAuthentication yes`, ticket du poste Windows ou `kinit`), ou par **clés publiques stockées dans l'annuaire** (`ldap_user_ssh_public_key = altSecurityIdentities` et `AuthorizedKeysCommand /usr/bin/sss_ssh_authorizedkeys`).

## Dépannage

```bash
sudo sssctl domain-status corp.exemple.fr
sudo sssctl user-checks alice
sudo sssctl config-check
kinit alice@CORP.EXEMPLE.FR && klist
sudo sss_cache -E && sudo systemctl restart sssd
journalctl -u sssd -f        # niveau de détail : debug_level = 6 dans la section [domain/…]
```

| Symptôme | Cause et correction |
| --- | --- |
| `realm: Couldn't join realm` | DNS (SRV introuvables), heure, droits du compte de jonction, nom d'hôte trop long |
| `id alice` ne renvoie rien | SSSD arrêté, cache périmé (`sss_cache -E`), `use_fully_qualified_names` |
| Connexion refusée malgré le bon mot de passe | Contrôle d'accès : GPO (`ad_gpo_access_control`) ou `realm permit` |
| Lenteur des connexions | Groupes imbriqués très nombreux : `ignore_group_members = True`, `ldap_use_tokengroups` |

Commandes : [[90-aide-memoire|aide-mémoire]].
