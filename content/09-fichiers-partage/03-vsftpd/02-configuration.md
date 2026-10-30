---
title: "Configuration : utilisateurs locaux, chroot, utilisateurs virtuels"
description: Configurer vsftpd — écoute IPv4/IPv6, mode passif et adresse publique, utilisateurs locaux enfermés (chroot) dans leur dossier, listes d'utilisateurs autorisés, accès anonyme en lecture seule, utilisateurs virtuels via PAM (pam_userdb) avec configuration par utilisateur, et limites de connexions et de débit.
tags: [vsftpd, chroot, utilisateurs virtuels, pam_userdb, passif, anonyme, userlist]
icon: settings-2
---

## Configuration de base (utilisateurs locaux)

```vsftpd /etc/vsftpd.conf
# Écoute (une seule des deux lignes à YES ; listen_ipv6 couvre aussi IPv4)
listen=NO
listen_ipv6=YES

# Authentification
anonymous_enable=NO
local_enable=YES
write_enable=YES
local_umask=022
pam_service_name=vsftpd

# Enfermer chaque utilisateur dans son dossier
chroot_local_user=YES
allow_writeable_chroot=NO
user_sub_token=$USER
local_root=/srv/ftp/$USER

# N'autoriser que les comptes listés
userlist_enable=YES
userlist_deny=NO
userlist_file=/etc/vsftpd.userlist

# Mode passif
pasv_enable=YES
pasv_min_port=40000
pasv_max_port=40100
pasv_address=203.0.113.20
port_enable=NO

# Divers
ftpd_banner=Serveur FTP Exemple - accès réservé
hide_ids=YES
use_localtime=YES
xferlog_enable=YES
dual_log_enable=YES
```

```bash
echo "partenaire1" | sudo tee -a /etc/vsftpd.userlist
sudo systemctl restart vsftpd
```

### Le chroot et l'erreur « writable root »

vsftpd refuse un dossier racine de chroot **accessible en écriture** à l'utilisateur (risque d'évasion). Deux solutions :

```bash
# 1. Racine non modifiable + sous-dossier d'échange (recommandé)
sudo useradd -d /srv/ftp/partenaire1 -s /usr/sbin/nologin partenaire1
sudo passwd partenaire1
sudo mkdir -p /srv/ftp/partenaire1/depot
sudo chown root:root /srv/ftp/partenaire1 && sudo chmod 755 /srv/ftp/partenaire1
sudo chown partenaire1: /srv/ftp/partenaire1/depot
```

2. `allow_writeable_chroot=YES` : plus simple mais moins sûr.

> [!NOTE]
> Avec un shell `/usr/sbin/nologin`, la pile PAM de vsftpd (module `pam_shells`) refuse la connexion si ce shell n'est pas listé dans `/etc/shells`. Ajoutez-le, ou utilisez des utilisateurs **virtuels** (ci-dessous) pour ne créer aucun compte système interactif.

## Accès anonyme en lecture seule

```vsftpd
anonymous_enable=YES
anon_root=/srv/ftp/public
no_anon_password=YES
anon_upload_enable=NO
anon_mkdir_write_enable=NO
anon_other_write_enable=NO
anon_max_rate=2000000
```

## Utilisateurs virtuels (PAM + pam_userdb)

Les comptes FTP n'existent pas dans `/etc/passwd` : ils sont tous mappés sur un utilisateur système unique.

```bash
sudo apt install db-util            # RHEL : dnf install libdb-utils
sudo useradd -r -d /srv/ftp -s /usr/sbin/nologin ftpvirt
# Fichier source : identifiant puis mot de passe, une ligne chacun
printf 'partenaire1\nMotDePasse1\npartenaire2\nMotDePasse2\n' | sudo tee /etc/vsftpd/virtuels.txt >/dev/null
sudo db_load -T -t hash -f /etc/vsftpd/virtuels.txt /etc/vsftpd/virtuels.db
sudo chmod 600 /etc/vsftpd/virtuels.* && sudo shred -u /etc/vsftpd/virtuels.txt
```

```text /etc/pam.d/vsftpd-virtuel
auth     required pam_userdb.so db=/etc/vsftpd/virtuels
account  required pam_userdb.so db=/etc/vsftpd/virtuels
```

```vsftpd /etc/vsftpd.conf (ajouts)
pam_service_name=vsftpd-virtuel
guest_enable=YES
guest_username=ftpvirt
virtual_use_local_privs=YES
user_config_dir=/etc/vsftpd/utilisateurs
local_root=/srv/ftp/$USER
user_sub_token=$USER
chroot_local_user=YES
```

```vsftpd /etc/vsftpd/utilisateurs/partenaire2
# Surcharge par utilisateur : lecture seule et débit limité
write_enable=NO
local_max_rate=500000
```

```bash
sudo mkdir -p /srv/ftp/partenaire1/depot && sudo chown ftpvirt: /srv/ftp/partenaire1/depot
```

`pam_userdb` stocke des mots de passe **en clair** dans la base (hachage `crypt=crypt` possible selon les versions) : protégez le fichier, ou préférez `pam_pwdfile` (fichier `htpasswd` haché) ou une authentification **LDAP/AD** via `pam_sss`/`pam_ldap`.

## Limites

| Paramètre | Effet |
| --- | --- |
| `max_clients=50` | Connexions simultanées totales |
| `max_per_ip=5` | Connexions par adresse IP |
| `local_max_rate` / `anon_max_rate` | Débit maximal (octets/s) |
| `idle_session_timeout=300` | Déconnexion après inactivité |
| `data_connection_timeout=120` | Connexion de données bloquée |
| `delay_failed_login=3` / `max_login_fails=3` | Ralentir le force brute |
| `deny_file={*.exe,*.php}` | Noms refusés |
