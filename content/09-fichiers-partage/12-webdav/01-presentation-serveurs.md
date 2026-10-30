---
title: Présentation et serveurs WebDAV
description: WebDAV, extension de HTTP pour gérer des fichiers à distance (méthodes PROPFIND, MKCOL, COPY, MOVE, LOCK), usages (montage réseau, CalDAV/CardDAV, plateformes de fichiers), serveurs Apache mod_dav, nginx dav et dav_ext, rclone serve webdav devant un stockage local, SFTP ou S3, IIS, authentification et TLS.
tags: [webdav, http, apache, nginx, rclone, iis, partage, serveur]
icon: info
---

**WebDAV** (*Web Distributed Authoring and Versioning*, RFC 4918) étend HTTP avec des méthodes de gestion de fichiers. Il traverse les pare-feu et proxys comme du HTTPS (443), ce qui en fait un accès aux fichiers pratique depuis l'extérieur, sans VPN ni SMB exposé. Nextcloud, ownCloud, Seafile, SharePoint et de nombreux NAS l'utilisent ; **CalDAV** et **CardDAV** (agendas, contacts) en sont des extensions.

| Méthode | Rôle |
| --- | --- |
| `PROPFIND` | Lister un répertoire, lire les propriétés |
| `PROPPATCH` | Modifier des propriétés |
| `MKCOL` | Créer un répertoire (collection) |
| `PUT` / `GET` / `DELETE` | Écrire, lire, supprimer |
| `COPY` / `MOVE` | Copier, déplacer (en-tête `Destination`) |
| `LOCK` / `UNLOCK` | Verrouillage (édition par les suites bureautiques) |

## Apache : mod_dav

```bash
sudo a2enmod dav dav_fs auth_basic authn_file ssl headers     # Debian / Ubuntu
sudo mkdir -p /srv/webdav/partage /var/lib/dav && sudo chown www-data: /srv/webdav/partage /var/lib/dav
sudo htpasswd -c /etc/apache2/webdav.htpasswd alice
```

```apache /etc/apache2/sites-available/webdav.conf
DavLockDB /var/lib/dav/lockdb

<VirtualHost *:443>
    ServerName dav.corp.exemple.fr
    SSLEngine on
    SSLCertificateFile    /etc/ssl/certs/dav.corp.exemple.fr.crt
    SSLCertificateKeyFile /etc/ssl/private/dav.corp.exemple.fr.key

    Alias /partage /srv/webdav/partage
    <Directory /srv/webdav/partage>
        DAV On
        Options Indexes
        AuthType Basic
        AuthName "WebDAV"
        AuthUserFile /etc/apache2/webdav.htpasswd
        Require valid-user
        # Interdire l'envoi et l'exécution de scripts
        <FilesMatch "\.(php|phtml|phar|cgi|pl|py)$">
            Require all denied
        </FilesMatch>
    </Directory>
</VirtualHost>
```

Authentification AD : `mod_authnz_ldap` (LDAPS) ou Kerberos (`mod_auth_gssapi`). Voir [[02-apache/01-presentation|Apache]].

## nginx

Le module `ngx_http_dav_module` gère PUT/DELETE/MKCOL/COPY/MOVE ; **PROPFIND** et **OPTIONS** nécessitent le module tiers `dav_ext` (paquet `libnginx-mod-http-dav-ext` sous Debian).

```nginx /etc/nginx/sites-available/webdav.conf
server {
    listen 443 ssl;
    server_name dav.corp.exemple.fr;
    ssl_certificate     /etc/ssl/certs/dav.corp.exemple.fr.crt;
    ssl_certificate_key /etc/ssl/private/dav.corp.exemple.fr.key;

    location /partage/ {
        alias /srv/webdav/partage/;
        dav_methods PUT DELETE MKCOL COPY MOVE;
        dav_ext_methods PROPFIND OPTIONS LOCK UNLOCK;
        dav_ext_lock zone=verrous;
        create_full_put_path on;
        dav_access user:rw group:r;
        client_max_body_size 4G;
        auth_basic "WebDAV";
        auth_basic_user_file /etc/nginx/webdav.htpasswd;
        autoindex on;
    }
}
dav_ext_lock_zone zone=verrous:10m;
```

La directive `dav_ext_lock_zone` se place dans le bloc `http` (fichier inclus au niveau `http`, comme les sites). Les verrous `LOCK` sont indispensables aux clients Windows et macOS pour écrire correctement.

## rclone serve webdav

**rclone** expose n'importe quel stockage qu'il sait lire (disque local, SFTP, S3/MinIO, SMB, Google Drive…) en WebDAV, avec un binaire unique sous Linux, Windows et macOS :

```bash
sudo apt install rclone            # ou : winget install Rclone.Rclone / brew install rclone
rclone config                      # définir un « remote », ex. s3corp: (type s3, fournisseur Minio)

# Servir un compartiment S3 en WebDAV avec authentification et TLS
rclone serve webdav s3corp:partage-equipe \
  --addr :8443 --cert /etc/rclone/dav.crt --key /etc/rclone/dav.key \
  --htpasswd /etc/rclone/htpasswd \
  --vfs-cache-mode writes --dir-cache-time 30s

# Lecture seule pour un dépôt de documentation
rclone serve webdav /srv/docs --addr 127.0.0.1:8080 --read-only
```

`--vfs-cache-mode writes` (ou `full`) est nécessaire pour les applications qui modifient des fichiers en place. Placez un reverse proxy devant (TLS, journaux, limitation) en production, et lancez rclone comme service systemd (sous Windows : service via NSSM ou WinSW).

## IIS (Windows Server)

```powershell
Install-WindowsFeature Web-DAV-Publishing, Web-Basic-Auth, Web-Windows-Auth -IncludeManagementTools
```

Activez la publication WebDAV sur le site (*Règles de création WebDAV* : utilisateurs, groupes, droits Lecture/Écriture/Source), l'authentification Windows ou Basic sur HTTPS, et ajustez `maxAllowedContentLength` pour les gros fichiers. Voir [[01-iis/01-presentation|IIS]].

Suite : [[02-clients-securite-depannage|clients, sécurité et dépannage]].
