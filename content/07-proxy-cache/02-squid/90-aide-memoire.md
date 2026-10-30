---
title: Squid — aide-mémoire des commandes
description: Commandes Squid avec exemples — vérification (squid -k parse), rechargement et rotation (squid -k reconfigure, rotate, shutdown), cache (squid -z), gestionnaire de cache (squidclient mgr:info, mgr:5min, mgr:objects), ACL et règles d'accès, authentification (basic NCSA, Kerberos/Negotiate), interception SSL (ssl_bump, security_file_certgen), listes de blocage, journaux (access.log, codes TCP_), tests avec curl.
tags: [aide-mémoire, squid, proxy, cache, acl, ssl-bump]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation|Squid]].

## Service et contrôle

```bash
sudo squid -k parse                       # vérifier squid.conf
sudo squid -k reconfigure                 # recharger la configuration
sudo squid -k rotate                      # rotation des journaux
sudo squid -k shutdown
sudo systemctl restart squid
sudo squid -z                             # créer les répertoires de cache (service arrêté)
squid -v | head -3
```

## Gestionnaire de cache

```bash
squidclient -h 127.0.0.1 -p 3128 mgr:info | grep -E "Number of clients|Hit Ratios|Storage"
squidclient mgr:5min | grep -E "client_http.requests|hit_ratio"
squidclient mgr:utilization | head
squidclient mgr:active_requests
squidclient mgr:objects | head
squidclient -m PURGE http://www.exemple.com/logo.png      # purger (acl PURGE autorisée)
```

## ACL et règles (extrait de squid.conf)

```squid
acl reseau_interne src 10.0.0.0/8
acl SSL_ports port 443
acl Safe_ports port 80 443 21
acl CONNECT method CONNECT
acl sites_bloques dstdomain "/etc/squid/listes/bloques.txt"
acl heures_bureau time MTWHF 08:00-19:00
acl telechargements urlpath_regex -i \.(exe|msi|iso)$

http_access deny !Safe_ports
http_access deny CONNECT !SSL_ports
http_access deny sites_bloques
http_access deny telechargements !heures_bureau
http_access allow localhost manager
http_access deny manager
http_access allow reseau_interne
http_access deny all

http_port 3128
cache_dir ufs /var/spool/squid 20000 16 256
cache_mem 512 MB
maximum_object_size 200 MB
visible_hostname proxy.exemple.fr
forwarded_for delete
via off
```

## Authentification

```bash
sudo htpasswd -c /etc/squid/passwd amartin       # base locale (basic_ncsa_auth)
/usr/lib/squid/basic_ncsa_auth /etc/squid/passwd  # test : saisir « amartin MotDePasse » → OK/ERR
```

```squid
auth_param basic program /usr/lib/squid/basic_ncsa_auth /etc/squid/passwd
auth_param basic realm Proxy Exemple
acl authentifies proxy_auth REQUIRED
http_access allow authentifies
# Kerberos (SSO Active Directory)
auth_param negotiate program /usr/lib/squid/negotiate_kerberos_auth -k /etc/squid/HTTP.keytab -s HTTP/proxy.exemple.fr@CORP.EXEMPLE.FR
```

## Interception SSL (ssl_bump)

```bash
sudo /usr/lib/squid/security_file_certgen -c -s /var/lib/squid/ssl_db -M 20MB
```

```squid
http_port 3128 ssl-bump tls-cert=/etc/squid/ac-proxy.pem generate-host-certificates=on dynamic_cert_mem_cache_size=20MB
sslcrtd_program /usr/lib/squid/security_file_certgen -s /var/lib/squid/ssl_db -M 20MB
acl pas_dechiffrer ssl::server_name .banque.fr .impots.gouv.fr .sante.fr
acl etape1 at_step SslBump1
ssl_bump peek etape1
ssl_bump splice pas_dechiffrer
ssl_bump bump all
```

## Journaux et tests

```bash
sudo tail -f /var/log/squid/access.log
awk '{print $4}' /var/log/squid/access.log | cut -d/ -f1 | sort | uniq -c | sort -rn     # TCP_HIT, TCP_MISS, TCP_DENIED…
awk '{print $3}' /var/log/squid/access.log | sort | uniq -c | sort -rn | head          # clients
curl -x http://proxy.exemple.fr:3128 -I https://www.exemple.com
curl -x http://amartin:MotDePasse@proxy.exemple.fr:3128 -I http://www.exemple.com
curl -x http://proxy.exemple.fr:3128 -sI http://www.exemple.com/ | grep -i x-cache
```

| Code | Sens |
| --- | --- |
| `TCP_HIT` / `TCP_MEM_HIT` | Servi depuis le cache |
| `TCP_MISS` | Récupéré sur le serveur d'origine |
| `TCP_DENIED/403` | Refusé par une ACL |
| `TCP_DENIED/407` | Authentification requise |
| `TCP_TUNNEL` | Tunnel CONNECT (HTTPS non déchiffré) |
