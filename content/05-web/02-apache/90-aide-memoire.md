---
title: Apache HTTP Server — aide-mémoire des commandes
description: Référence complète des commandes Apache HTTP Server avec exemples — installation (Debian/Ubuntu, RHEL, Alpine, Arch, FreeBSD, macOS, Windows), service, vérification et inspection (apachectl -S, -M, -V, DUMP_INCLUDES, a2query), modules, sites et configurations Debian, MPM event avec PHP-FPM, hôte virtuel HTTPS, proxy inverse, authentification (htpasswd bcrypt), Let's Encrypt, durcissement (en-têtes, ModSecurity et CRS), SELinux, page server-status, journaux (format avec durée, analyse awk, GoAccess), test de charge ab et Windows.
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

## Installation

```bash
sudo apt install apache2                               # Debian / Ubuntu (service apache2, /etc/apache2)
sudo dnf install httpd mod_ssl                         # RHEL / Rocky / Alma (service httpd, /etc/httpd)
sudo apk add apache2 apache2-ssl                       # Alpine
sudo pacman -S apache                                  # Arch (service httpd)
sudo pkg install apache24 && sudo sysrc apache24_enable=YES   # FreeBSD
brew install httpd                                     # macOS
sudo systemctl enable --now apache2                    # RHEL : httpd
sudo firewall-cmd --permanent --add-service=http --add-service=https && sudo firewall-cmd --reload
```

## Inspection de la configuration

```bash
sudo apachectl -S                                      # hôtes virtuels, ports, fichiers, hôte par défaut
sudo apachectl -M                                      # modules chargés
apachectl -V                                           # version, MPM, chemins compilés
sudo apachectl -t -D DUMP_INCLUDES                     # fichiers de configuration inclus
sudo apachectl -t -D DUMP_RUN_CFG                      # utilisateur, répertoires d'exécution
a2query -m ; a2query -s                                # Debian : modules et sites activés
sudo apachectl graceful                                # recharger sans couper les connexions
sudo apachectl graceful-stop
```

## MPM event et PHP-FPM (Debian)

```bash
sudo a2dismod php8.2 mpm_prefork
sudo a2enmod mpm_event proxy_fcgi setenvif http2
sudo a2enconf php8.2-fpm
sudo apachectl configtest && sudo systemctl restart apache2
apachectl -V | grep -i mpm
```

## Durcissement et sécurité

```apache /etc/apache2/conf-available/securite.conf
ServerTokens Prod
ServerSignature Off
TraceEnable Off
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "SAMEORIGIN"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
```

```bash
sudo a2enmod headers && sudo a2enconf securite && sudo systemctl reload apache2
# Pare-feu applicatif ModSecurity avec les règles OWASP CRS
sudo apt install libapache2-mod-security2 modsecurity-crs
sudo cp /etc/modsecurity/modsecurity.conf-recommended /etc/modsecurity/modsecurity.conf
sudo sed -i 's/^SecRuleEngine DetectionOnly/SecRuleEngine On/' /etc/modsecurity/modsecurity.conf   # après une période en détection seule
sudo systemctl restart apache2
sudo tail -f /var/log/apache2/modsec_audit.log
# htpasswd : bcrypt, suppression, vérification
sudo htpasswd -B -C 12 /etc/apache2/.htpasswd amartin
sudo htpasswd -D /etc/apache2/.htpasswd ancien
htpasswd -v /etc/apache2/.htpasswd amartin
# SELinux (RHEL) : proxy inverse, port non standard, contenu inscriptible
sudo setsebool -P httpd_can_network_connect 1
sudo semanage port -a -t http_port_t -p tcp 8081
sudo semanage fcontext -a -t httpd_sys_rw_content_t "/var/www/app/uploads(/.*)?" && sudo restorecon -Rv /var/www/app
```

## server-status

```apache /etc/apache2/mods-available/status.conf (extrait)
<Location /server-status>
    SetHandler server-status
    Require ip 127.0.0.1 10.0.99.0/24
</Location>
ExtendedStatus On
```

```bash
curl -s http://127.0.0.1/server-status?auto | grep -E "Total Accesses|ReqPerSec|BusyWorkers|IdleWorkers"
```

## Journaux : durée des requêtes et analyse

```apache
LogFormat "%h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-Agent}i\" %D" combinedduree
CustomLog ${APACHE_LOG_DIR}/intranet-access.log combinedduree
```

```bash
awk '{print $9}' /var/log/apache2/access.log | sort | uniq -c | sort -rn             # répartition des codes HTTP
awk '{print $1}' /var/log/apache2/access.log | sort | uniq -c | sort -rn | head      # adresses les plus actives
awk '$9 >= 500' /var/log/apache2/access.log | tail                                  # erreurs serveur
awk '{print $NF/1000 " ms " $7}' /var/log/apache2/intranet-access.log | sort -rn | head   # requêtes les plus lentes (%D en µs)
goaccess /var/log/apache2/access.log --log-format=COMBINED -o /var/www/html/rapport.html
ab -n 1000 -c 50 https://intranet.exemple.fr/                                       # test de charge (paquet apache2-utils)
```
