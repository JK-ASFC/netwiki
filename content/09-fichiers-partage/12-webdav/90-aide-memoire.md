---
title: WebDAV — aide-mémoire des commandes
description: Commandes WebDAV avec exemples — serveurs (Apache mod_dav, Nginx dav, Caddy, IIS WebDAV), tests avec curl (PROPFIND, MKCOL, PUT, MOVE, COPY, DELETE, LOCK), montage client (davfs2, rclone, cadaver), lecteur réseau Windows (net use, WebClient), macOS Finder, dépannage.
tags: [aide-mémoire, webdav, davfs2, rclone, curl, net use]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-serveurs|WebDAV]].

## Serveurs

```apache
# Apache : a2enmod dav dav_fs auth_basic
DavLockDB /var/lib/apache2/dav/lockdb
<VirtualHost *:443>
    ServerName dav.exemple.fr
    SSLEngine on
    SSLCertificateFile /etc/ssl/certs/dav.crt
    SSLCertificateKeyFile /etc/ssl/private/dav.key
    Alias /partage /srv/dav
    <Location /partage>
        DAV On
        AuthType Basic
        AuthName "WebDAV"
        AuthUserFile /etc/apache2/dav.htpasswd
        Require valid-user
    </Location>
</VirtualHost>
```

```nginx
# Nginx (module dav_ext pour PROPFIND)
location /partage/ {
    root /srv/dav;
    dav_methods PUT DELETE MKCOL COPY MOVE;
    dav_ext_methods PROPFIND OPTIONS;
    create_full_put_path on;
    client_max_body_size 2g;
    auth_basic "WebDAV";
    auth_basic_user_file /etc/nginx/dav.htpasswd;
}
```

```powershell
# IIS
Install-WindowsFeature Web-DAV-Publishing, Web-Basic-Auth
Set-WebConfigurationProperty -Filter "/system.webServer/webdav/authoring" -Name enabled -Value $true -PSPath "IIS:\" -Location "Default Web Site"
```

## Tests avec curl

```bash
U="amartin:MotDePasse"; D=https://dav.exemple.fr/partage
curl -u $U -X PROPFIND -H "Depth: 1" $D/ | xmllint --format - | head -40
curl -u $U -X MKCOL $D/rapports/
curl -u $U -T rapport.pdf $D/rapports/rapport.pdf
curl -u $U -X MOVE -H "Destination: $D/rapports/rapport-2026.pdf" $D/rapports/rapport.pdf
curl -u $U -X COPY -H "Destination: $D/archives/rapport-2026.pdf" $D/rapports/rapport-2026.pdf
curl -u $U -X DELETE $D/rapports/rapport-2026.pdf
curl -u $U -X OPTIONS -i $D/ | grep -i "^dav\|^allow"
```

## Clients

```bash
sudo apt install davfs2
sudo mount -t davfs https://dav.exemple.fr/partage /mnt/dav           # identifiants dans /etc/davfs2/secrets
rclone config create dav webdav url=https://dav.exemple.fr/partage vendor=other user=amartin pass=$(rclone obscure 'MotDePasse')
rclone ls dav:
rclone sync ./documents dav:documents --progress
cadaver https://dav.exemple.fr/partage/                                # client interactif (ls, put, get, mkcol)
```

```powershell
# Windows : service WebClient requis
Start-Service WebClient; Set-Service WebClient -StartupType Automatic
net use W: https://dav.exemple.fr/partage /user:amartin * /persistent:yes
net use W: /delete
```

macOS : Finder → *Aller → Se connecter au serveur* → `https://dav.exemple.fr/partage`.

## Dépannage

| Symptôme | Piste |
| --- | --- |
| `405 Method Not Allowed` sur PROPFIND | Module PROPFIND absent (Nginx dav_ext), méthodes non autorisées |
| Windows refuse l'authentification Basic en HTTP | Exiger HTTPS (paramètre `BasicAuthLevel` du WebClient) |
| Fichiers > 50 Mo refusés sous Windows | `FileSizeLimitInBytes` du WebClient (registre), `client_max_body_size` côté serveur |
