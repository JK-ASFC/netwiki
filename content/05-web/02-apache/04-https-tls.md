---
title: HTTPS, TLS et HTTP/2
description: Configurer mod_ssl (certificats, chaîne, protocoles et suites recommandés), Let's Encrypt avec certbot ou mod_md, redirection et HSTS, agrafage OCSP, HTTP/2, plusieurs certificats par SNI et authentification par certificat client.
tags: [apache, https, tls, ssl, letsencrypt, hsts, http2, mod_md]
icon: lock
---

## Activer TLS

```bash
# Debian / Ubuntu
sudo a2enmod ssl headers http2 socache_shmcb
# RHEL : paquet mod_ssl (charge le module et crée /etc/httpd/conf.d/ssl.conf avec un certificat de test)
sudo dnf install mod_ssl
```

## Virtual host HTTPS

```apache /etc/apache2/sites-available/intranet-ssl.conf
<VirtualHost *:80>
    ServerName intranet.exemple.fr
    Redirect permanent / https://intranet.exemple.fr/
</VirtualHost>

<VirtualHost *:443>
    ServerName intranet.exemple.fr
    DocumentRoot /srv/www/intranet/public
    Protocols h2 http/1.1

    SSLEngine on
    SSLCertificateFile    /etc/ssl/exemple/intranet.exemple.fr.fullchain.pem   # certificat + intermédiaires
    SSLCertificateKeyFile /etc/ssl/exemple/intranet.exemple.fr.key

    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"

    <Directory /srv/www/intranet/public>
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/intranet-ssl-error.log
    CustomLog ${APACHE_LOG_DIR}/intranet-ssl-access.log combined
</VirtualHost>
```

> [!NOTE]
> Depuis Apache 2.4.8, `SSLCertificateFile` peut contenir la **chaîne complète** (certificat suivi des intermédiaires) ; `SSLCertificateChainFile` est obsolète.

```bash
sudo chmod 600 /etc/ssl/exemple/*.key
sudo a2ensite intranet-ssl && sudo apache2ctl configtest && sudo systemctl reload apache2
```

## Paramètres TLS globaux recommandés

Inspirés du profil *intermediate* du générateur Mozilla SSL Configuration :

```apache /etc/apache2/conf-available/tls-moderne.conf
SSLProtocol             -all +TLSv1.2 +TLSv1.3
SSLCipherSuite          ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305
SSLHonorCipherOrder     off
SSLSessionTickets       off
SSLCompression          off

SSLUseStapling          on
SSLStaplingCache        "shmcb:logs/ssl_stapling(32768)"
SSLStaplingResponderTimeout 5
SSLStaplingReturnResponderErrors off

SSLSessionCache         "shmcb:logs/ssl_scache(512000)"
SSLSessionCacheTimeout  300
```

```bash
sudo a2enconf tls-moderne && sudo systemctl reload apache2
```

> [!NOTE]
> L'agrafage OCSP (`SSLUseStapling`) n'a d'effet qu'avec une AC qui publie un répondeur OCSP : Let's Encrypt a arrêté le sien en 2025. Le laisser activé est sans inconvénient.

Tester :

```bash
openssl s_client -connect intranet.exemple.fr:443 -servername intranet.exemple.fr -status </dev/null | grep -E "Protocol|Cipher|OCSP Response Status"
curl -sI --http2 https://intranet.exemple.fr | head -1        # HTTP/2 200
nmap --script ssl-enum-ciphers -p 443 intranet.exemple.fr
```

## Let's Encrypt avec certbot

```bash
sudo apt install certbot python3-certbot-apache        # RHEL : dnf install certbot python3-certbot-apache (EPEL)
sudo certbot --apache -d intranet.exemple.fr -d www.intranet.exemple.fr --redirect --hsts -m admin@exemple.fr --agree-tos
sudo certbot certificates
sudo systemctl list-timers | grep certbot             # renouvellement automatique
sudo certbot renew --dry-run
```

Pour un certificat **wildcard**, utilisez le défi DNS : `certbot certonly --dns-rfc2136 …` vers un [[01-bind9/08-ddns-nsupdate|BIND dynamique]], ou un plugin de votre fournisseur DNS.

## Let's Encrypt intégré : mod_md

`mod_md` (Managed Domains) gère ACME directement dans Apache, sans outil externe :

```apache
MDomain intranet.exemple.fr www.intranet.exemple.fr
MDCertificateAgreement accepted
MDContactEmail admin@exemple.fr
MDPrivateKeys RSA 3072
# MDCertificateAuthority https://acme.mon-ac-interne.exemple.fr/directory   # ACME interne (step-ca, AD CS + passerelle)

<VirtualHost *:443>
    ServerName intranet.exemple.fr
    ServerAlias www.intranet.exemple.fr
    SSLEngine on
    # pas de SSLCertificateFile : mod_md fournit le certificat
</VirtualHost>

<Location /md-status>
    SetHandler md-status
    Require ip 10.0.0.0/8
</Location>
```

```bash
sudo a2enmod md && sudo systemctl reload apache2
# Le certificat est obtenu en arrière-plan ; un « reload » l'active ensuite
sudo journalctl -u apache2 | grep -i md
```

## Plusieurs sites HTTPS sur une même IP (SNI)

Chaque `<VirtualHost *:443>` avec son `ServerName` et son certificat suffit : le client indique le nom recherché dans le **SNI**. Tous les clients modernes le supportent.

## Certificats clients (authentification mutuelle)

```apache
<VirtualHost *:443>
    ServerName admin.exemple.fr
    SSLEngine on
    SSLCertificateFile    /etc/ssl/exemple/admin.fullchain.pem
    SSLCertificateKeyFile /etc/ssl/exemple/admin.key

    SSLCACertificateFile  /etc/ssl/exemple/corp-issuing-ca.pem     # AC des certificats clients
    SSLCARevocationFile   /etc/ssl/exemple/corp-issuing-ca.crl
    SSLCARevocationCheck  chain

    <Location />
        SSLVerifyClient require
        SSLVerifyDepth 2
        SSLOptions +StdEnvVars
        Require expr "%{SSL_CLIENT_S_DN_O} == 'Exemple' && %{SSL_CLIENT_I_DN_CN} == 'Corp Issuing CA'"
    </Location>

    # Transmettre l'identité au backend
    RequestHeader set X-Client-Cert-DN "%{SSL_CLIENT_S_DN}s"
</VirtualHost>
```

Les certificats clients peuvent provenir de votre PKI [[01-active-directory/10-adcs-pki|AD CS]].

## Activer HTTP/2

```apache
Protocols h2 http/1.1          # dans le vhost TLS (ou globalement)
H2Push off
```

> [!WARNING]
> HTTP/2 est **incompatible avec le MPM prefork** : Apache le désactive silencieusement. Passez au MPM event (avec PHP-FPM).

## Erreurs fréquentes

| Erreur | Cause |
| --- | --- |
| `AH00526: … SSLCertificateFile: file does not exist or is empty` | Chemin ou droits du certificat |
| `AH02565: Certificate and private key … do not match` | Clé ne correspondant pas au certificat (`openssl x509 -noout -modulus` vs `openssl rsa -noout -modulus`) |
| `SSL_ERROR_RX_RECORD_TOO_LONG` (navigateur) | Le port 443 répond en HTTP clair : `SSLEngine on` absent ou mauvais vhost |
| Avertissement de chaîne incomplète (Android, Java) | Intermédiaires absents du fichier `fullchain` |
| `AH01909: … server certificate does NOT include an ID which matches the server name` | `ServerName` absent des SAN du certificat |
