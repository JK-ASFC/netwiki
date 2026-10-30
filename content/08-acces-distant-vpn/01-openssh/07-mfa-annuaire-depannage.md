---
title: MFA, annuaire (AD, FreeIPA) et dépannage
description: Ajouter un second facteur à SSH (TOTP avec Google Authenticator, Duo, FIDO2, RADIUS), connecter des comptes Active Directory ou FreeIPA via SSSD (realm join, clés dans l'annuaire, Kerberos/GSSAPI), protéger contre le brute force avec Fail2ban, et résoudre les erreurs SSH fréquentes.
tags: [openssh, mfa, totp, sssd, active directory, freeipa, kerberos, fail2ban, dépannage]
icon: bug
---

## Second facteur

### TOTP (application d'authentification)

```bash
sudo apt install libpam-google-authenticator          # RHEL : google-authenticator (EPEL)
# Pour chaque utilisateur (génère ~/.google_authenticator et un QR code)
google-authenticator -t -d -f -r 3 -R 30 -w 3
```

```text /etc/pam.d/sshd (ajout en tête)
auth required pam_google_authenticator.so nullok
# Retirer/commenter « @include common-auth » si l'on ne veut PAS de mot de passe (clé + OTP uniquement)
```

```sshconfig /etc/ssh/sshd_config.d/60-mfa.conf
UsePAM yes
KbdInteractiveAuthentication yes
AuthenticationMethods publickey,keyboard-interactive
```

Résultat : clé SSH **puis** code à 6 chiffres. `nullok` laisse passer les comptes qui n'ont pas encore configuré l'OTP : retirez-le une fois le déploiement terminé.

### Autres seconds facteurs

| Méthode | Mise en œuvre |
| --- | --- |
| **Clé FIDO2** (`ed25519-sk` avec `verify-required`) | Possession + PIN, sans PAM (voir [[04-cles-certificats]]) |
| **Duo** | Module `pam_duo` ou `login_duo` (push sur smartphone) |
| **RADIUS** (FreeRADIUS + privacyIDEA, Entra ID NPS) | `pam_radius_auth` : l'OTP est validé par le serveur RADIUS (voir [[01-freeradius/10-accounting-proxy-realms\|MFA par proxy RADIUS]]) |
| **Certificats SSH via SSO** | Teleport, Vault, step-ca : le MFA a lieu lors de l'émission du certificat |

## Comptes Active Directory avec SSSD

```bash
sudo apt install realmd sssd sssd-tools adcli krb5-user packagekit libnss-sss libpam-sss oddjob oddjob-mkhomedir
# RHEL : dnf install realmd sssd adcli oddjob oddjob-mkhomedir
sudo realm discover corp.exemple.fr
sudo realm join -U adm-joindre corp.exemple.fr --computer-ou="OU=Serveurs-Linux,OU=Corp,DC=corp,DC=exemple,DC=fr"
sudo realm permit -g ssh-admins@corp.exemple.fr          # seuls ces groupes peuvent se connecter
sudo pam-auth-update --enable mkhomedir                  # Debian : création du dossier personnel
id alice@corp.exemple.fr
```

```ini /etc/sssd/sssd.conf (extrait)
[domain/corp.exemple.fr]
id_provider = ad
access_provider = ad
use_fully_qualified_names = False      # « alice » au lieu de « alice@corp.exemple.fr »
fallback_homedir = /home/%u
default_shell = /bin/bash
ad_gpo_access_control = enforcing      # applique les droits de connexion des GPO (Autoriser l'ouverture de session…)
ldap_user_extra_attrs = altSecurityIdentities:altSecurityIdentities
ldap_user_ssh_public_key = altSecurityIdentities
```

```bash
sudo systemctl restart sssd
```

### Clés publiques stockées dans l'annuaire

```sshconfig /etc/ssh/sshd_config.d/70-sssd.conf
AuthorizedKeysCommand /usr/bin/sss_ssh_authorizedkeys
AuthorizedKeysCommandUser nobody
```

La clé publique de l'utilisateur est lue dans un attribut AD (ici `altSecurityIdentities`, ou un attribut de schéma dédié `sshPublicKey`) : ajout et révocation centralisés, plus besoin de `authorized_keys`.

### SSO Kerberos (GSSAPI)

```sshconfig
# Serveur
GSSAPIAuthentication yes
GSSAPICleanupCredentials yes
# Client (~/.ssh/config)
Host *.corp.exemple.fr
    GSSAPIAuthentication yes
    GSSAPIDelegateCredentials no
```

Un utilisateur ayant un ticket Kerberos (`kinit`, ou session Windows du domaine avec un client compatible) se connecte sans mot de passe ni clé. Le serveur doit avoir un keytab (`realm join` le crée) et un SPN `host/serveur.corp.exemple.fr`.

## FreeIPA / IdM

FreeIPA gère nativement les clés SSH des utilisateurs et des hôtes, les règles d'accès (**HBAC**), `sudo` centralisé et la publication des clés d'hôtes : `ipa-client-install` configure SSSD, `sshd` (`AuthorizedKeysCommand`) et les `known_hosts` globaux. Article dédié prévu dans la feuille de route (lot 12).

## Fail2ban

```bash
sudo apt install fail2ban
```

```ini /etc/fail2ban/jail.d/sshd.local
[sshd]
enabled  = true
port     = ssh
backend  = systemd
maxretry = 5
findtime = 10m
bantime  = 1h
bantime.increment = true
ignoreip = 127.0.0.1/8 10.0.10.0/24
```

```bash
sudo systemctl restart fail2ban
sudo fail2ban-client status sshd
sudo fail2ban-client set sshd unbanip 203.0.113.50
```

Alternative collaborative : **CrowdSec** (réputation partagée des IP malveillantes).

## Dépannage

### Côté client

```bash
ssh -vvv alice@srv01            # négociation, clés proposées, méthodes acceptées par le serveur
ssh -G srv01                    # configuration client effective pour cet hôte (après ~/.ssh/config)
ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no alice@srv01   # tester le mot de passe seul
```

### Côté serveur

```bash
sudo sshd -t                                    # syntaxe
sudo sshd -T -C user=alice,host=poste,addr=10.0.10.5 | less    # config effective pour ce cas (Match)
sudo journalctl -u ssh -f                       # RHEL : -u sshd
sudo /usr/sbin/sshd -d -p 2222                  # instance de débogage sur un autre port (une seule connexion)
```

### Erreurs fréquentes

| Message | Cause | Solution |
| --- | --- | --- |
| `Permission denied (publickey)` | Clé non déposée, mauvaise clé proposée, droits `~/.ssh`, utilisateur hors `AllowGroups` | `ssh -v` (quelle clé est proposée), journal serveur : `Authentication refused: bad ownership or modes` |
| `WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!` | Serveur réinstallé / IP réattribuée… ou attaque | Vérifier l'empreinte par un autre canal, puis `ssh-keygen -R hôte` |
| `no matching key exchange method found` / `no matching host key type found` | Équipement ancien | Options `+algorithme` ciblées dans `~/.ssh/config` |
| `Connection refused` | sshd arrêté, mauvais port, `ListenAddress` | `ss -tlnp`, `systemctl status` |
| `Connection timed out` | Pare-feu, routage | `nc -vz hôte 22`, traceroute |
| `Connection reset by peer` / `kex_exchange_identification: read: Connection reset` | `MaxStartups` atteint, Fail2ban, TCP wrappers, pénalités `PerSourcePenalties` | Journal serveur, liste de bannissement |
| `Too many authentication failures` | Agent qui propose trop de clés | `IdentitiesOnly yes` + `IdentityFile` précis |
| `Could not resolve hostname` | DNS | `ssh -G`, `getent hosts` |
| Connexion lente (pause de quelques secondes) | Résolution inverse (`UseDNS yes`) ou GSSAPI qui expire | `UseDNS no`, `GSSAPIAuthentication no` côté client si inutile |
| Windows : clé administrateur ignorée | Clé dans `~\.ssh\authorized_keys` au lieu de `administrators_authorized_keys`, ACL | Voir [[02-installation]] |
| `client_loop: send disconnect: Broken pipe` | Coupure NAT/pare-feu sur session inactive | `ServerAliveInterval 60` côté client |
