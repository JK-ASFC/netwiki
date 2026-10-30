---
title: "TLS : terminaison, SNI, pass-through, mTLS, ACME"
description: Terminer le TLS dans HAProxy (format des certificats, dossier et crt-list, SNI), réglages de sécurité, HTTP/2 et HTTP/3, rechiffrement vers les serveurs, pass-through TLS par SNI en mode tcp, certificats clients, renouvellement Let's Encrypt (acme.sh, client ACME intégré 3.2) et mise à jour à chaud des certificats.
tags: [haproxy, tls, ssl, sni, letsencrypt, acme, mtls, http3]
icon: lock
---

## Format des certificats

HAProxy attend un fichier **PEM unique** contenant le certificat, les intermédiaires et la clé privée (ou la clé dans un fichier `.key` du même nom depuis 2.2) :

```bash
cat www.exemple.fr.crt intermediaire.crt www.exemple.fr.key > /etc/haproxy/certs/www.exemple.fr.pem
chmod 600 /etc/haproxy/certs/*.pem
```

## Terminaison TLS

```haproxy
global
    ssl-default-bind-options ssl-min-ver TLSv1.2 no-tls-tickets
    ssl-default-bind-ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305
    ssl-default-bind-ciphersuites TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256
    ssl-default-server-options ssl-min-ver TLSv1.2
    tune.ssl.default-dh-param 2048

frontend fe_https
    # Un dossier : HAProxy charge tous les .pem et choisit selon le SNI (et le CN/SAN)
    bind :443 ssl crt /etc/haproxy/certs/ alpn h2,http/1.1
    bind :::443 ssl crt /etc/haproxy/certs/ alpn h2,http/1.1
    http-response set-header Strict-Transport-Security "max-age=31536000; includeSubDomains"
```

Le **premier** certificat chargé (ordre alphabétique) sert de certificat par défaut pour les clients sans SNI : nommez-le `00-defaut.pem`.

### crt-list : contrôle fin par certificat

```text /etc/haproxy/crt-list.txt
/etc/haproxy/certs/00-defaut.pem
/etc/haproxy/certs/www.exemple.fr.pem [alpn h2,http/1.1]
/etc/haproxy/certs/api.exemple.fr.pem [ssl-min-ver TLSv1.3] api.exemple.fr
/etc/haproxy/certs/partenaires.pem [verify required ca-file /etc/haproxy/ca/partenaires.pem] partenaires.exemple.fr
```

```haproxy
bind :443 ssl crt-list /etc/haproxy/crt-list.txt
```

## HTTP/3 (QUIC)

Nécessite HAProxy compilé avec QUIC (paquets récents 2.8+ avec OpenSSL compatible / quictls ; vérifier `haproxy -vv | grep -i quic`).

```haproxy
frontend fe_https
    bind :443 ssl crt /etc/haproxy/certs/ alpn h2,http/1.1
    bind quic4@:443 ssl crt /etc/haproxy/certs/ alpn h3
    http-response set-header alt-svc "h3=\":443\"; ma=86400"
```

## Rechiffrer vers les serveurs

```haproxy
backend be_app_tls
    server app01 10.0.20.31:8443 ssl verify required ca-file /etc/haproxy/ca/corp-ca.pem sni str(app.corp.exemple.fr) check check-ssl
    server app02 10.0.20.32:8443 ssl verify required ca-file /etc/haproxy/ca/corp-ca.pem sni str(app.corp.exemple.fr) check check-ssl
```

## Pass-through TLS par SNI (sans déchiffrer)

```haproxy
frontend fe_tls_passthrough
    mode tcp
    bind :443
    tcp-request inspect-delay 5s
    tcp-request content accept if { req.ssl_hello_type 1 }
    use_backend be_vpn  if { req.ssl_sni -i vpn.exemple.fr }
    use_backend be_git  if { req.ssl_sni -i git.exemple.fr }
    default_backend be_https_local

backend be_vpn
    mode tcp
    server vpn01 10.0.70.10:443 check

backend be_git
    mode tcp
    server git01 10.0.50.20:443 check send-proxy-v2

backend be_https_local
    mode tcp
    server local 127.0.0.1:8443 send-proxy-v2     # frontend HTTP local qui termine le TLS (bind 127.0.0.1:8443 ssl … accept-proxy)
```

## Certificats clients (mTLS)

```haproxy
frontend fe_partenaires
    bind :8443 ssl crt /etc/haproxy/certs/partenaires.pem ca-file /etc/haproxy/ca/partenaires-ca.pem crl-file /etc/haproxy/ca/partenaires.crl verify required
    http-request set-header X-Client-DN %{+Q}[ssl_c_s_dn]
    http-request set-header X-Client-Serial %[ssl_c_serial,hex]
    http-request deny unless { ssl_c_used } { ssl_c_verify 0 }
    default_backend be_api
```

`verify optional` permet d'accepter la connexion et de décider ensuite (ex. exiger le certificat seulement sur `/admin`).

## Let's Encrypt

### Client ACME intégré (HAProxy 3.2+)

```haproxy
global
    expose-experimental-directives        # selon la version : la fonction a d'abord été expérimentale

acme LE
    directory https://acme-v02.api.letsencrypt.org/directory
    account-key /etc/haproxy/acme/compte.key
    contact admin@exemple.fr
    challenge HTTP-01
    keytype ECDSA
    map virt@acme                          # carte virtuelle où HAProxy publie les jetons de défi

frontend fe_web
    bind :80
    bind :443 ssl
    http-request return status 200 content-type text/plain lf-string "%[path,field(-1,/)].%[path,field(-1,/),map(virt@acme)]\n" if { path_beg '/.well-known/acme-challenge/' }
    ssl-f-use crt "/etc/haproxy/certs/www.exemple.fr.pem" acme LE domains "www.exemple.fr,exemple.fr"
```

```bash
echo "acme renew /etc/haproxy/certs/www.exemple.fr.pem" | socat stdio /run/haproxy/admin.sock
echo "acme status" | socat stdio /run/haproxy/admin.sock
```

> [!NOTE]
> La syntaxe du client ACME intégré a évolué entre 3.2 et les versions suivantes (renouvellement automatique, DNS-01) : vérifiez la documentation de votre version. Pour les versions antérieures, utilisez acme.sh ci-dessous.

### acme.sh avec déploiement à chaud (sans rechargement)

```bash
curl https://get.acme.sh | sh -s email=admin@exemple.fr
# Défi HTTP servi par HAProxy en mode « stateless » (clé de compte publiée dans la configuration)
~/.acme.sh/acme.sh --issue -d www.exemple.fr --stateless
DEPLOY_HAPROXY_HOT_UPDATE=yes DEPLOY_HAPROXY_STATS_SOCKET=/run/haproxy/admin.sock DEPLOY_HAPROXY_PEM_PATH=/etc/haproxy/certs \
  ~/.acme.sh/acme.sh --deploy -d www.exemple.fr --deploy-hook haproxy
```

```haproxy
global
    setenv ACCOUNT_THUMBPRINT 'empreinte-du-compte-acme'      # affichée par acme.sh --register-account
frontend fe_http
    bind :80
    http-request return status 200 content-type text/plain lf-string "%[path,field(-1,/)].${ACCOUNT_THUMBPRINT}\n" if { path_beg '/.well-known/acme-challenge/' }
    http-request redirect scheme https code 301 unless { path_beg '/.well-known/acme-challenge/' }
```

## Mettre à jour un certificat à chaud (API runtime)

```bash
SOCK=/run/haproxy/admin.sock
echo -e "set ssl cert /etc/haproxy/certs/www.exemple.fr.pem <<\n$(cat nouveau.pem)\n" | socat stdio $SOCK
echo "commit ssl cert /etc/haproxy/certs/www.exemple.fr.pem" | socat stdio $SOCK
echo "show ssl cert /etc/haproxy/certs/www.exemple.fr.pem" | socat stdio $SOCK      # vérifier les dates
cp nouveau.pem /etc/haproxy/certs/www.exemple.fr.pem    # persister pour le prochain démarrage
```

## Vérifications

```bash
openssl s_client -connect lb.exemple.fr:443 -servername www.exemple.fr </dev/null 2>/dev/null | grep -E "subject=|Protocol|Cipher"
echo "show ssl cert" | socat stdio /run/haproxy/admin.sock            # certificats chargés
curl -sv --http2 https://www.exemple.fr -o /dev/null 2>&1 | grep -i "ALPN"
```

| Erreur | Cause |
| --- | --- |
| `unable to load SSL private key from PEM file` | Clé absente du `.pem`, protégée par mot de passe, ou mauvais ordre |
| `inconsistencies between private key and certificate` | Clé ne correspondant pas |
| Mauvais certificat présenté | SNI absent côté client → certificat par défaut ; CN/SAN ne correspondant pas |
| `SSL handshake failure` dans les journaux | Version/suites incompatibles, certificat client refusé (`ssl_c_verify` ≠ 0) |
