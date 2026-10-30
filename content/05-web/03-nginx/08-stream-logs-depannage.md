---
title: Proxy TCP/UDP, journaux et dépannage
description: Module stream pour répartir du TCP/UDP (bases de données, DNS, syslog, LDAP), routage TLS par SNI sans déchiffrement (ssl_preread), formats de journaux (JSON, temps upstream), stub_status, commandes de diagnostic et erreurs fréquentes.
tags: [nginx, stream, tcp, udp, sni, logs, stub_status, dépannage]
icon: bug
---

## Proxy TCP/UDP : le module stream

```bash
sudo apt install libnginx-mod-stream      # Debian/Ubuntu (déjà inclus dans les paquets nginx.org et RHEL)
```

```nginx /etc/nginx/nginx.conf
stream {
    log_format stream_basic '$remote_addr [$time_local] $protocol $status $bytes_sent $bytes_received $session_time "$upstream_addr"';
    access_log /var/log/nginx/stream.log stream_basic;
    include /etc/nginx/stream.d/*.conf;
}
```

### Répartir des serveurs MariaDB / PostgreSQL

```nginx /etc/nginx/stream.d/bdd.conf
upstream mariadb_lecture {
    least_conn;
    server 10.0.40.11:3306 max_fails=2 fail_timeout=10s;
    server 10.0.40.12:3306 max_fails=2 fail_timeout=10s;
}
server {
    listen 3306;
    proxy_pass mariadb_lecture;
    proxy_connect_timeout 3s;
    proxy_timeout 1h;              # inactivité tolérée sur une connexion
    allow 10.0.20.0/24;
    deny all;
}
```

### DNS et syslog (UDP)

```nginx
upstream resolveurs {
    server 10.0.10.53:53;
    server 10.0.10.54:53;
}
server {
    listen 53 udp reuseport;
    proxy_pass resolveurs;
    proxy_responses 1;             # une réponse attendue par datagramme
    proxy_timeout 2s;
}

upstream collecteurs_syslog {
    hash $remote_addr consistent;  # un même émetteur toujours vers le même collecteur
    server 10.0.60.21:514;
    server 10.0.60.22:514;
}
server {
    listen 514 udp;
    proxy_pass collecteurs_syslog;
    proxy_responses 0;             # syslog n'attend pas de réponse
}
```

### Terminer le TLS pour un service TCP (LDAPS → LDAP)

```nginx
server {
    listen 636 ssl;
    ssl_certificate     /etc/nginx/certs/ldap.fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/ldap.key;
    proxy_pass 10.0.10.21:389;
}
```

### Routage par SNI sans déchiffrer (ssl_preread)

Plusieurs services HTTPS derrière une seule IP:443, chacun gardant **son propre certificat** (pass-through) :

```nginx
map $ssl_preread_server_name $backend_tls {
    vpn.exemple.fr        10.0.70.10:443;
    git.exemple.fr        10.0.50.20:443;
    default               127.0.0.1:8443;     # Nginx HTTP local (écoute sur 8443 ssl)
}
server {
    listen 443;
    ssl_preread on;
    proxy_pass $backend_tls;
    proxy_protocol on;           # transmettre l'IP cliente (le backend doit accepter le protocole PROXY)
}
```

## Journaux HTTP

### Format enrichi

```nginx
log_format principal '$remote_addr - $remote_user [$time_local] "$request" $status $body_bytes_sent '
                     '"$http_referer" "$http_user_agent" host=$host rt=$request_time '
                     'uct=$upstream_connect_time urt=$upstream_response_time ua=$upstream_addr cs=$upstream_cache_status';
access_log /var/log/nginx/access.log principal buffer=64k flush=5s;
```

### JSON (SIEM, ELK, Loki)

```nginx
log_format json escape=json '{'
  '"time":"$time_iso8601","host":"$host","client":"$remote_addr","method":"$request_method",'
  '"uri":"$request_uri","status":$status,"bytes":$body_bytes_sent,"duration":$request_time,'
  '"upstream":"$upstream_addr","upstream_time":"$upstream_response_time","ua":"$http_user_agent",'
  '"referer":"$http_referer","request_id":"$request_id"}';
access_log /var/log/nginx/access.json json;
```

### Journalisation conditionnelle et syslog

```nginx
map $request_uri $a_journaliser {
    ~^/health   0;
    default     1;
}
access_log /var/log/nginx/access.log principal if=$a_journaliser;
access_log syslog:server=10.0.60.21:514,facility=local7,tag=nginx,severity=info json;
error_log  syslog:server=10.0.60.21:514 warn;
```

### Traçabilité de bout en bout

```nginx
proxy_set_header X-Request-ID $request_id;     # identifiant unique transmis au backend et journalisé
add_header X-Request-ID $request_id always;
```

## stub_status

```nginx
server {
    listen 127.0.0.1:8081;
    location = /nginx_status {
        stub_status;
        allow 127.0.0.1;
        deny all;
    }
}
```

```bash
curl -s http://127.0.0.1:8081/nginx_status
# Active connections: 291
# server accepts handled requests
#  16630948 16630948 31070465
# Reading: 6 Writing: 179 Waiting: 106
```

Exploité par la supervision : Prometheus `nginx-prometheus-exporter`, Centreon `apps::nginx::serverstatus::plugin`, Zabbix (modèle Nginx by HTTP).

## Commandes de diagnostic

| Commande | Usage |
| --- | --- |
| `nginx -t` | Tester la configuration |
| `nginx -T` | Afficher toute la configuration effective (tous les `include`) |
| `nginx -T \| grep -n "server_name"` | Trouver quel fichier déclare un nom |
| `curl -v -H "Host: site.exemple.fr" http://127.0.0.1/` | Tester un site sans DNS |
| `curl -v --resolve site.exemple.fr:443:10.0.20.5 https://site.exemple.fr/` | Tester un serveur précis en HTTPS (SNI correct) |
| `error_log /var/log/nginx/debug.log debug;` | Journal de débogage (binaire compilé `--with-debug` : `nginx-debug`) |
| `debug_connection 10.0.10.5;` | Débogage limité à une IP cliente (contexte `events`) |
| `ss -tanp \| grep nginx` | Connexions ouvertes |

## Erreurs fréquentes

| Message | Cause | Solution |
| --- | --- | --- |
| `bind() to 0.0.0.0:80 failed (98: Address already in use)` | Port occupé (Apache, autre instance) | `ss -tlnp 'sport = :80'` |
| `"server_name" … conflicting server name … ignored` | Même nom déclaré dans deux `server` | Fusionner ou supprimer le doublon |
| `could not build server_names_hash` | Trop de noms ou noms longs | `server_names_hash_bucket_size 128;` |
| `413 Request Entity Too Large` | `client_max_body_size` | Augmenter pour le site concerné |
| `403 Forbidden` + `directory index … is forbidden` | Pas d'`index` et `autoindex off` | Ajouter le fichier ou `try_files` |
| `403` + `(13: Permission denied)` | Droits Unix (bit `x` sur les dossiers parents) ou SELinux | `namei -l`, `ls -Z`, `restorecon` |
| `open() "…" failed (2: No such file or directory)` | Mauvais `root`/`alias` | Vérifier la combinaison `location` + `root`/`alias` |
| `rewrite or internal redirection cycle` | Boucle `try_files` / `rewrite` | Le dernier élément de `try_files` doit exister ou être un code (`=404`) |
| `502` + `upstream sent too big header` | En-têtes de réponse volumineux | `proxy_buffer_size 16k;` |
| `worker_connections are not enough` | Limite atteinte | Augmenter `worker_connections` et `worker_rlimit_nofile` |
| `"add_header" … ignored` (en-têtes absents) | Héritage `add_header` | Réinclure l'extrait dans la `location` |

### Méthode

1. `nginx -t`, puis `nginx -T` pour voir la configuration **réelle**.
2. Quel `server` et quelle `location` traitent la requête ? (ajouter temporairement `add_header X-Debug-Location "nom" always;`).
3. `curl -v` local avec l'en-tête `Host` / `--resolve`.
4. `error.log` (niveau `info` ou `debug` ciblé).
5. Backend : temps `upstream_response_time`, journaux de l'application.
