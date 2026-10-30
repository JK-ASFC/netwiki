---
title: "Configuration de base : frontends, backends, sondes"
description: Section global (threads, maxconn, socket), defaults et délais, frontends et bind, backends et algorithmes de répartition, paramètres des serveurs, sondes de santé HTTP/TCP/agent, persistance par cookie, mode TCP pour bases de données, files d'attente et pages d'erreur.
tags: [haproxy, frontend, backend, balance, health check, timeouts, persistance]
icon: settings
---

## Configuration complète commentée

```haproxy /etc/haproxy/haproxy.cfg
global
    log /dev/log local0 info
    chroot /var/lib/haproxy
    user haproxy
    group haproxy
    daemon
    maxconn 50000                       # connexions simultanées pour tout le processus
    nbthread 4                          # par défaut : un thread par cœur disponible
    stats socket /run/haproxy/admin.sock mode 660 level admin expose-fd listeners
    stats timeout 30s
    # TLS par défaut (voir l'article TLS)
    ssl-default-bind-options ssl-min-ver TLSv1.2 no-tls-tickets
    ssl-default-bind-ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305
    ssl-default-bind-ciphersuites TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256

defaults
    mode http
    log global
    option httplog
    option dontlognull                  # pas de ligne pour les connexions sans requête (sondes TCP)
    option http-server-close            # ou « option http-keep-alive » (défaut moderne)
    option forwardfor except 127.0.0.0/8   # ajoute X-Forwarded-For
    option redispatch                   # renvoyer vers un autre serveur si celui choisi est tombé
    retries 3
    timeout connect 5s
    timeout client  30s
    timeout server  30s
    timeout http-request 10s            # temps max pour recevoir les en-têtes (anti-Slowloris)
    timeout http-keep-alive 2s
    timeout queue 30s
    timeout check 3s
    timeout tunnel 1h                   # WebSocket, CONNECT
    errorfile 503 /etc/haproxy/errors/503.http

frontend fe_http
    bind :80
    bind :::80 v4v6
    http-request redirect scheme https code 301 unless { ssl_fc }

frontend fe_https
    bind :443 ssl crt /etc/haproxy/certs/ alpn h2,http/1.1
    http-request set-header X-Forwarded-Proto https
    acl host_api hdr(host) -i api.exemple.fr
    use_backend be_api if host_api
    default_backend be_web

backend be_web
    balance roundrobin
    option httpchk
    http-check send meth GET uri /health ver HTTP/1.1 hdr Host www.exemple.fr
    http-check expect status 200
    cookie SRVID insert indirect nocache httponly secure
    default-server inter 5s fall 3 rise 2 maxconn 500
    server web01 10.0.20.11:8080 check cookie w1
    server web02 10.0.20.12:8080 check cookie w2
    server web03 10.0.20.13:8080 check cookie w3 backup

backend be_api
    balance leastconn
    option httpchk GET /api/health
    http-check expect string "status":"up"
    server api01 10.0.20.31:8080 check
    server api02 10.0.20.32:8080 check
```

## Délais (timeouts)

| Délai | Mesure |
| --- | --- |
| `timeout client` | Inactivité côté client |
| `timeout server` | Inactivité côté serveur (doit couvrir la requête la plus lente) |
| `timeout connect` | Établissement de la connexion TCP au serveur |
| `timeout http-request` | Réception complète des en-têtes de la requête |
| `timeout http-keep-alive` | Attente d'une nouvelle requête sur une connexion persistante |
| `timeout queue` | Attente en file quand les serveurs sont saturés (`maxconn` atteint) |
| `timeout tunnel` | Connexions longues après mise à niveau (WebSocket) |
| `timeout check` | Réponse à une sonde |

> [!WARNING]
> Sans `timeout client` / `server` / `connect`, HAProxy émet un avertissement et des connexions peuvent rester ouvertes indéfiniment (épuisement des ressources).

## Algorithmes de répartition (`balance`)

| Algorithme | Usage |
| --- | --- |
| `roundrobin` | Tourniquet pondéré, poids modifiable à chaud (défaut) |
| `static-rr` | Tourniquet sans changement de poids à chaud |
| `leastconn` | Moins de connexions : requêtes longues, bases de données, WebSocket |
| `first` | Remplit le premier serveur jusqu'à `maxconn`, puis le suivant (économie d'instances) |
| `source` | Hachage de l'IP source (persistance sans cookie) |
| `uri` / `url_param` | Hachage de l'URI / d'un paramètre (caches) |
| `hdr(nom)` | Hachage d'un en-tête |
| `random(2)` | Deux serveurs au hasard, le moins chargé |

`hash-type consistent` limite les redistributions quand un serveur entre ou sort (caches).

## Paramètres des serveurs

| Paramètre | Effet |
| --- | --- |
| `check` | Active les sondes de santé |
| `inter 5s fall 3 rise 2` | Sonde toutes les 5 s ; 3 échecs → DOWN ; 2 succès → UP |
| `weight 50` | Poids (0-256) |
| `maxconn 500` | Connexions simultanées vers ce serveur (au-delà : file d'attente) |
| `backup` | Utilisé seulement si tous les serveurs non-backup sont DOWN |
| `disabled` | Démarré en maintenance |
| `slowstart 30s` | Montée progressive du trafic après un retour |
| `ssl verify required ca-file …` | Connexion TLS vers le serveur |
| `send-proxy-v2` | Ajoute l'en-tête PROXY (IP cliente) pour le serveur |
| `resolvers dns init-addr last,libc,none` | Résolution DNS dynamique du nom du serveur |

`default-server` définit ces valeurs pour tous les serveurs du backend.

### Modèles de serveurs (découverte DNS)

```haproxy
resolvers dns_interne
    nameserver ns1 10.0.10.53:53
    nameserver ns2 10.0.10.54:53
    hold valid 10s
    accepted_payload_size 8192

backend be_app
    balance roundrobin
    server-template app 1-10 _app._tcp.service.consul resolvers dns_interne resolve-prefer ipv4 check
```

## Sondes de santé

```haproxy
# HTTP avec Host et code attendu
option httpchk
http-check send meth GET uri /health ver HTTP/1.1 hdr Host app.exemple.fr
http-check expect status 200-399

# TCP simple : la connexion suffit
option tcp-check

# Séquence TCP (ex. Redis : seul le maître répond « role:master »)
option tcp-check
tcp-check send PING\r\n
tcp-check expect string +PONG
tcp-check send info\ replication\r\n
tcp-check expect string role:master

# Agent externe : le serveur annonce son poids ou son état (« 50% », « drain », « down »)
server app01 10.0.20.31:8080 check agent-check agent-port 9999 agent-inter 5s
```

Sondes spécialisées : `option mysql-check user haproxy`, `option pgsql-check user haproxy`, `option ldap-check`, `option smtpchk`, `option redis-check`, `option ssl-hello-chk`.

## Persistance (affinité)

```haproxy
# Cookie inséré par HAProxy
cookie SRVID insert indirect nocache httponly secure
server web01 10.0.20.11:8080 check cookie w1

# Préfixe sur un cookie applicatif existant
cookie JSESSIONID prefix nocache

# Par IP via une stick-table (mode tcp ou http)
stick-table type ip size 200k expire 30m
stick on src
```

## Mode TCP : exemple MariaDB / PostgreSQL

```haproxy
listen mariadb_ecriture
    bind :3306
    mode tcp
    option tcplog
    balance first
    option mysql-check user haproxy_check post-41
    server db01 10.0.40.11:3306 check
    server db02 10.0.40.12:3306 check backup
    server db03 10.0.40.13:3306 check backup

listen postgresql_primaire
    bind :5432
    mode tcp
    option httpchk GET /primary           # API Patroni
    http-check expect status 200
    default-server inter 3s fall 3 rise 2 on-marked-down shutdown-sessions
    server pg01 10.0.40.21:5432 check port 8008
    server pg02 10.0.40.22:5432 check port 8008
    server pg03 10.0.40.23:5432 check port 8008
```

`on-marked-down shutdown-sessions` coupe les sessions vers un serveur déclaré DOWN (les clients se reconnectent sur le nouveau primaire).

## File d'attente et protection des serveurs

```haproxy
backend be_app
    balance leastconn
    timeout queue 20s
    default-server maxconn 100 maxqueue 500
    server app01 10.0.20.31:8080 check
```

Quand un serveur atteint `maxconn`, les requêtes **attendent** dans la file d'HAProxy au lieu de surcharger l'application : c'est l'un des grands atouts d'HAProxy face aux pics.

## Pages d'erreur personnalisées

```text /etc/haproxy/errors/503.http
HTTP/1.1 503 Service Unavailable
Cache-Control: no-cache
Connection: close
Content-Type: text/html; charset=utf-8

<html><body><h1>Service momentanément indisponible</h1><p>Merci de réessayer dans quelques minutes.</p></body></html>
```

Avec `http-errors` + `errorfiles` on peut définir des jeux de pages par frontend/backend.
