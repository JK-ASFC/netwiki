---
title: Apache HTTP Server — aide-mémoire des commandes
description: Commandes Apache avec exemples — service et vérification (apachectl configtest, -S, -M, -V), activation de modules, sites et configurations (a2enmod, a2ensite, a2enconf sous Debian), hôtes virtuels HTTP/HTTPS, redirections, proxy inverse (mod_proxy), authentification (htpasswd), certificats Let's Encrypt (certbot), journaux, tests (curl), équivalents RHEL et Windows.
tags: [aide-mémoire, apache, httpd, apachectl, a2ensite, certbot]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation|Apache]]. Debian/Ubuntu : service `apache2`, configuration dans `/etc/apache2/` ; RHEL : service `httpd`, `/etc/httpd/`.

## Service et vérification

```bash
sudo apachectl configtest                 # Syntax OK ?
sudo apachectl -S                         # hôtes virtuels chargés et fichiers d'origine
sudo apachectl -M                         # modules chargés
sudo apachectl -V                         # compilation, MPM, chemins
sudo systemctl reload apache2             # recharger sans couper les connexions
sudo apachectl graceful                   # équivalent
sudo systemctl restart apache2
```

## Modules, sites et configurations (Debian)

```bash
sudo a2enmod ssl headers rewrite proxy proxy_http http2
sudo a2dismod status autoindex
sudo a2ensite intranet.conf
sudo a2dissite 000-default.conf
sudo a2enconf security
sudo a2query -m                           # modules activés
sudo a2query -s                           # sites activés
```

## Hôte virtuel HTTPS

```apache
# /etc/apache2/sites-available/intranet.conf
<VirtualHost *:80>
    ServerName intranet.exemple.fr
    Redirect permanent / https://intranet.exemple.fr/
</VirtualHost>

<VirtualHost *:443>
    ServerName intranet.exemple.fr
    DocumentRoot /var/www/intranet
    Protocols h2 http/1.1
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/intranet.exemple.fr/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/intranet.exemple.fr/privkey.pem
    Header always set Strict-Transport-Security "max-age=31536000"
    <Directory /var/www/intranet>
        Options -Indexes +FollowSymLinks
        AllowOverride None
        Require all granted
    </Directory>
    ErrorLog ${APACHE_LOG_DIR}/intranet-error.log
    CustomLog ${APACHE_LOG_DIR}/intranet-access.log combined
</VirtualHost>
```

## Proxy inverse et restrictions

```apache
<VirtualHost *:443>
    ServerName app.exemple.fr
    SSLEngine on
    SSLCertificateFile /etc/ssl/certs/app.crt
    SSLCertificateKeyFile /etc/ssl/private/app.key
    ProxyPreserveHost On
    ProxyPass        /  http://10.0.30.21:8080/
    ProxyPassReverse /  http://10.0.30.21:8080/
    RequestHeader set X-Forwarded-Proto "https"
    <Location /admin>
        Require ip 10.0.99.0/24
    </Location>
</VirtualHost>
```

## Authentification de base

```bash
sudo htpasswd -c -B /etc/apache2/.htpasswd amartin        # créer (bcrypt)
sudo htpasswd -B /etc/apache2/.htpasswd bpetit            # ajouter
sudo htpasswd -D /etc/apache2/.htpasswd bpetit            # supprimer
```

## Certificats Let's Encrypt

```bash
sudo apt install certbot python3-certbot-apache
sudo certbot --apache -d intranet.exemple.fr -m admin@exemple.fr --agree-tos --redirect
sudo certbot certificates
sudo certbot renew --dry-run
```

## Durcissement rapide

```apache
# /etc/apache2/conf-available/security.conf
ServerTokens Prod
ServerSignature Off
TraceEnable Off
```

```bash
sudo a2enmod ssl && echo 'SSLProtocol -all +TLSv1.2 +TLSv1.3' | sudo tee /etc/apache2/conf-available/tls.conf && sudo a2enconf tls
```

## Journaux et tests

```bash
sudo tail -f /var/log/apache2/error.log
sudo tail -f /var/log/apache2/access.log | awk '{print $1, $7, $9}'
awk '{print $9}' /var/log/apache2/access.log | sort | uniq -c | sort -rn        # codes HTTP
curl -I https://intranet.exemple.fr
curl -vk --resolve intranet.exemple.fr:443:10.0.30.10 https://intranet.exemple.fr/
sudo ss -ltnp | grep -E ':80|:443'
```

## Windows (Apache Lounge)

```powershell
httpd.exe -k install -n "Apache24"
httpd.exe -t
httpd.exe -k restart -n "Apache24"
```
