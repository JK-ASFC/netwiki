---
title: SSSD et realmd — aide-mémoire des commandes
description: Référence complète des commandes SSSD, realmd et adcli avec exemples — paquets par distribution, prérequis (DNS SRV, heure, nom d'hôte), découverte et jonction à Active Directory (OU, nom et version du système, logiciel de jonction), sortie du domaine, droits de connexion (realm permit, simple_allow_groups, filtre d'accès, GPO), sssd.conf commenté (noms courts, répertoire personnel, cache, mises à jour DNS, site), sudo pour un groupe AD, répertoire personnel automatique (authselect, pam-auth-update), adcli (test, info, mot de passe du compte machine, SPN), Kerberos (keytab, kinit machine, ldapsearch GSSAPI), cache (sss_cache, sssctl cache-remove), diagnostic sssctl (domaines, utilisateur, vérification PAM, analyse des requêtes, configuration, journaux, niveau de débogage) et problèmes fréquents.
tags: [aide-mémoire, sssd, realmd, adcli, active directory, linux, kerberos, pam, nss, sudo]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-configuration|SSSD et realmd]]. Exemples : domaine `corp.exemple.fr`, royaume `CORP.EXEMPLE.FR`, serveur `srv-lin01`, compte de jonction `adm-jonction`, groupe `GG-Admins-Linux`.

## Paquets et prérequis

```bash
# RHEL / Rocky / Alma / Fedora
sudo dnf install realmd sssd sssd-tools oddjob oddjob-mkhomedir adcli samba-common-tools krb5-workstation
# Debian / Ubuntu
sudo apt install realmd sssd sssd-tools libnss-sss libpam-sss adcli samba-common-bin oddjob oddjob-mkhomedir packagekit krb5-user

# Nom d'hôte complet, DNS des contrôleurs, heure
sudo hostnamectl set-hostname srv-lin01.corp.exemple.fr
dig +short -t SRV _ldap._tcp.corp.exemple.fr
dig +short -t SRV _kerberos._tcp.corp.exemple.fr
chronyc tracking                                     # écart d'horloge inférieur à 5 minutes (Kerberos)
```

## Découverte, jonction, sortie

```bash
realm discover corp.exemple.fr
realm discover -v corp.exemple.fr                    # détail : contrôleurs, logiciels requis
sudo realm join corp.exemple.fr -U adm-jonction --computer-ou="OU=Serveurs Linux,DC=corp,DC=exemple,DC=fr"
sudo realm join corp.exemple.fr -U adm-jonction --computer-ou="OU=Serveurs Linux,DC=corp,DC=exemple,DC=fr" --os-name="Rocky Linux" --os-version="9" --membership-software=adcli --client-software=sssd
sudo realm join corp.exemple.fr -U adm-jonction --user-principal="host/srv-lin01.corp.exemple.fr@CORP.EXEMPLE.FR"
realm list
sudo realm leave corp.exemple.fr -U adm-jonction --remove                          # sortir et supprimer le compte ordinateur
```

## Droits de connexion

```bash
sudo realm deny --all
sudo realm permit -g GG-Admins-Linux
sudo realm permit -g "GG-Support Linux"
sudo realm permit alice@corp.exemple.fr
sudo realm permit --all
sudo realm permit -x -g "GG-Support Linux"                                          # retirer un groupe
```

## /etc/sssd/sssd.conf (extrait commenté)

```ini /etc/sssd/sssd.conf
[sssd]
domains = corp.exemple.fr
services = nss, pam

[domain/corp.exemple.fr]
id_provider = ad
access_provider = simple
simple_allow_groups = GG-Admins-Linux, GG-Support Linux
ad_domain = corp.exemple.fr
krb5_realm = CORP.EXEMPLE.FR
# Noms courts (alice au lieu de alice@corp.exemple.fr)
use_fully_qualified_names = False
fallback_homedir = /home/%u
default_shell = /bin/bash
# Identifiants UID/GID calculés depuis le SID (pas d'attributs POSIX dans l'AD)
ldap_id_mapping = True
# Connexion hors ligne avec le dernier mot de passe valide
cache_credentials = True
# Mise à jour DNS dynamique de l'enregistrement du serveur
dyndns_update = True
# Contrôles d'accès par GPO : enforcing, permissive (journalise seulement) ou disabled
ad_gpo_access_control = permissive
# Forcer un site AD (sinon déterminé automatiquement)
# ad_site = Paris
```

```bash
sudo chmod 600 /etc/sssd/sssd.conf
sudo sssctl config-check
sudo systemctl restart sssd
```

Variante par filtre LDAP (au lieu de `access_provider = simple`) : `access_provider = ad` et `ad_access_filter = (memberOf:1.2.840.113556.1.4.1941:=CN=GG-Admins-Linux,OU=Groupes,DC=corp,DC=exemple,DC=fr)` (groupes imbriqués compris).

## sudo pour un groupe AD

```bash
# Noms courts ; un espace dans un nom de groupe s'échappe par une barre oblique inverse
echo '%GG-Admins-Linux ALL=(ALL) ALL' | sudo tee /etc/sudoers.d/admins-ad
echo '%GG-Support\ Linux ALL=(ALL) /usr/bin/systemctl, /usr/bin/journalctl' | sudo tee -a /etc/sudoers.d/admins-ad
sudo chmod 440 /etc/sudoers.d/admins-ad
sudo visudo -c
sudo -l -U alice
```

## Répertoire personnel automatique

```bash
sudo authselect current
sudo authselect select sssd with-mkhomedir --force      # RHEL / Fedora
sudo systemctl enable --now oddjobd
sudo pam-auth-update --enable mkhomedir                 # Debian / Ubuntu
```

## adcli et compte ordinateur

```bash
sudo adcli testjoin                                     # le compte machine est-il valide ?
adcli info corp.exemple.fr                              # contrôleurs, site, niveau fonctionnel
sudo adcli update --computer-password-lifetime=30       # renouvellement du mot de passe machine
sudo adcli update --add-service-principal=HTTP/srv-lin01.corp.exemple.fr
sudo adcli join --domain=corp.exemple.fr -U adm-jonction --domain-ou="OU=Serveurs Linux,DC=corp,DC=exemple,DC=fr"   # jonction sans realmd
```

## Kerberos

```bash
sudo klist -kte /etc/krb5.keytab                        # clés du compte machine et SPN
sudo kinit -k 'SRV-LIN01$@CORP.EXEMPLE.FR' && sudo klist   # la keytab permet-elle d'obtenir un ticket ?
kinit alice@CORP.EXEMPLE.FR ; klist ; kdestroy
ldapsearch -Y GSSAPI -H ldap://dc01.corp.exemple.fr -b "DC=corp,DC=exemple,DC=fr" "(sAMAccountName=alice)" memberOf
```

## Cache

```bash
sudo sss_cache -E                                       # invalider tout le cache
sudo sss_cache -u alice                                 # un utilisateur
sudo sss_cache -g GG-Admins-Linux                       # un groupe
sudo sssctl cache-remove                                # supprimer les bases de cache (SSSD redémarré)
sudo sssctl cache-expire -E                             # équivalent sssctl de « sss_cache -E »
```

## Diagnostic

```bash
id alice
getent passwd alice
getent group GG-Admins-Linux
sudo sssctl domain-list
sudo sssctl domain-status corp.exemple.fr
sudo sssctl domain-status corp.exemple.fr --servers     # contrôleurs découverts et actifs
sudo sssctl user-show alice
sudo sssctl group-show GG-Admins-Linux
sudo sssctl user-checks alice -s sshd                   # recherche, authentification et accès PAM
sudo sssctl user-checks alice -a acct -s sshd           # contrôle d'accès seul
sudo sssctl analyze request list                        # requêtes récentes (SSSD 2.6+)
sudo sssctl analyze request show 1
sudo sssctl debug-level 6
sudo sssctl logs-remove && sudo systemctl restart sssd  # journaux propres avant de reproduire un problème
sudo sssctl logs-fetch /tmp/sssd-logs.tar
sudo tail -f /var/log/sssd/sssd_corp.exemple.fr.log
journalctl -u sssd --since "10 min ago"
```

| Symptôme | Cause | Correction |
| --- | --- | --- |
| `realm: Couldn't join realm: Insufficient permissions` | Compte de jonction sans droits sur l'OU | Déléguer « Créer des objets ordinateur » sur l'OU |
| `id alice` ne renvoie rien | DNS, heure ou cache | `sssctl domain-status`, `chronyc tracking`, `sss_cache -E` |
| Connexion refusée, `id` fonctionne | Contrôle d'accès (realm permit, GPO) | `sssctl user-checks alice -a acct -s sshd` ; `ad_gpo_access_control = permissive` pour tester |
| Lenteur des ouvertures de session | Énumération des groupes imbriqués | `ignore_group_members = True`, cache chaud |
| `Preauthentication failed` dans les journaux | Mot de passe faux ou horloge | Heure, compte verrouillé |
| Ticket machine impossible | Mot de passe machine désynchronisé | `adcli testjoin`, rejoindre le domaine |
