---
title: HTTPS, TLS, HTTP/2 et HTTP/3
description: Configurer TLS dans Nginx (certificats, chaîne, protocoles, suites, sessions, OCSP), Let's Encrypt avec certbot ou acme.sh, HSTS, HTTP/2, HTTP/3 (QUIC), certificats clients et SNI, avec un extrait réutilisable.
tags: [nginx, https, tls, letsencrypt, http2, http3, quic, hsts]
icon: lock
---

## Site HTTPS

```nginx /etc/nginx/conf.d/intranet.conf
server {
    listen 80;
    listen [::]:80;
    server_name intranet.exemple.fr;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;                                   # 1.25.1+ (avant : « listen 443 ssl http2; »)
    server_name intranet.exemple.fr;

    ssl_certificate     /etc/nginx/certs/intranet.exemple.fr.fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/intranet.exemple.fr.key;
    include /etc/nginx/snippets/tls.conf;

    root /srv/www/intranet;
    location / { try_files $uri $uri/ =404; }
}
```

## Extrait TLS réutilisable

```nginx /etc/nginx/snippets/tls.conf
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305;
ssl_prefer_server_ciphers off;
ssl_ecdh_curve X25519:prime256v1:secp384r1;

ssl_session_cache shared:SSL:20m;      # ~80 000 sessions
ssl_session_timeout 1d;
ssl_session_tickets off;

ssl_stapling on;
ssl_stapling_verify on;
ssl_trusted_certificate /etc/nginx/certs/chaine-ac.pem;   # AC racine + intermédiaires pour vérifier la réponse OCSP
resolver 10.0.10.53 10.0.10.54 valid=300s;
resolver_timeout 5s;

add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

> [!NOTE]
> `ssl_certificate` doit contenir le certificat **suivi des intermédiaires** (*fullchain*). Une chaîne incomplète fonctionne dans les navigateurs (qui complètent seuls) mais échoue avec curl, Java, Android ou les sondes de supervision.

> [!NOTE]
> Let's Encrypt a arrêté son service OCSP en 2025 (ses certificats ne contiennent plus d'URL OCSP) : l'agrafage OCSP ne sert plus qu'avec les AC qui publient encore un répondeur (AC commerciales, PKI interne). Laisser `ssl_stapling on` est sans effet négatif.

Plusieurs paires de clés (RSA + ECDSA) peuvent coexister : répétez `ssl_certificate`/`ssl_certificate_key` ; Nginx choisit selon les capacités du client.

## Let's Encrypt

### certbot

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d intranet.exemple.fr -d www.intranet.exemple.fr --redirect -m admin@exemple.fr --agree-tos
sudo certbot renew --dry-run
systemctl list-timers | grep certbot
```

Méthode « webroot », sans que certbot modifie la configuration :

```nginx
location ^~ /.well-known/acme-challenge/ {
    root /var/www/acme;
    default_type text/plain;
}
```

```bash
sudo certbot certonly --webroot -w /var/www/acme -d intranet.exemple.fr --deploy-hook "systemctl reload nginx"
```

### acme.sh (sans dépendance Python, DNS-01 pour les wildcards)

```bash
curl https://get.acme.sh | sh -s email=admin@exemple.fr
~/.acme.sh/acme.sh --issue --dns dns_nsupdate -d '*.exemple.fr' -d exemple.fr     # vers un BIND dynamique (variables NSUPDATE_SERVER / NSUPDATE_KEY)
~/.acme.sh/acme.sh --install-cert -d '*.exemple.fr' \
  --key-file /etc/nginx/certs/wildcard.key --fullchain-file /etc/nginx/certs/wildcard.fullchain.pem \
  --reloadcmd "systemctl reload nginx"
```

## HTTP/3 (QUIC)

Disponible dans Nginx **1.25+** compilé avec `--with-http_v3_module` (paquets nginx.org récents).

```nginx
server {
    listen 443 ssl;
    listen 443 quic reuseport;          # « reuseport » une seule fois par couple IP:port
    http2 on;
    http3 on;
    server_name www.exemple.fr;

    ssl_certificate     /etc/nginx/certs/www.fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/www.key;
    ssl_protocols TLSv1.3 TLSv1.2;      # QUIC exige TLS 1.3

    add_header Alt-Svc 'h3=":443"; ma=86400' always;
}
```

Ouvrir **UDP 443** sur le pare-feu. Test : `curl --http3 -I https://www.exemple.fr` (curl compilé avec HTTP/3) ou les outils de développement du navigateur (colonne *Protocol* = `h3`).

## Certificats clients (mTLS)

```nginx
server {
    listen 443 ssl;
    server_name api-partenaires.exemple.fr;
    ssl_certificate     /etc/nginx/certs/api.fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/api.key;

    ssl_client_certificate /etc/nginx/certs/ac-partenaires.pem;   # AC autorisée
    ssl_crl                /etc/nginx/certs/ac-partenaires.crl;
    ssl_verify_client on;            # « optional » pour gérer l'erreur soi-même
    ssl_verify_depth 2;

    location / {
        if ($ssl_client_verify != SUCCESS) { return 403; }
        proxy_set_header X-Client-DN $ssl_client_s_dn;
        proxy_set_header X-Client-Serial $ssl_client_serial;
        proxy_pass http://127.0.0.1:8080;
    }
}
```

## Pass-through TLS par SNI (sans déchiffrer)

Pour router du HTTPS vers différents backends selon le nom demandé **sans** terminer le TLS, utilisez le module `stream` avec `ssl_preread` : voir [[08-stream-logs-depannage]].

## Vérifications

```bash
sudo nginx -t
openssl s_client -connect intranet.exemple.fr:443 -servername intranet.exemple.fr -status </dev/null 2>/dev/null | grep -E "Protocol|Cipher|OCSP Response Status|Verify return code"
curl -sI --http2 https://intranet.exemple.fr | head -1
echo | openssl s_client -connect intranet.exemple.fr:443 -servername intranet.exemple.fr 2>/dev/null | openssl x509 -noout -dates -subject -ext subjectAltName
```

| Erreur | Cause |
| --- | --- |
| `SSL_CTX_use_PrivateKey_file … key values mismatch` | Clé et certificat ne correspondent pas |
| `no "ssl_certificate" is defined for the "listen ... ssl"` | Un `server` en `listen … ssl` sans certificat (cas du serveur par défaut : utiliser `ssl_reject_handshake on`) |
| `could not build optimal server_names_hash` | Trop de noms : `server_names_hash_bucket_size 128;` |
| OCSP stapling inactif | `resolver` absent, `ssl_trusted_certificate` incomplet, accès sortant vers l'URL OCSP bloqué |
