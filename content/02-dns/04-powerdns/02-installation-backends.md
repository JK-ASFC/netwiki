---
title: Installation et backends (MariaDB, PostgreSQL, BIND, LMDB)
description: Installer PowerDNS Authoritative depuis la distribution ou repo.powerdns.com, choisir et configurer un backend (gmysql, gpgsql, bind, lmdb, sqlite3), créer le schéma, activer l'API et le serveur web, réglages de base, macOS/Windows/Docker et vérification.
tags: [powerdns, installation, backend, mariadb, postgresql, lmdb, api]
icon: download
---

## Dépôt officiel (recommandé)

```bash
# Debian 12, branche 4.9 (adapter « auth-49 » / « auth-50 »)
sudo install -d /etc/apt/keyrings
curl https://repo.powerdns.com/FD380FBB-pub.asc | sudo tee /etc/apt/keyrings/auth-49-pub.asc
echo "deb [signed-by=/etc/apt/keyrings/auth-49-pub.asc] http://repo.powerdns.com/debian bookworm-auth-49 main" | sudo tee /etc/apt/sources.list.d/pdns.list
printf "Package: auth*\nPin: origin repo.powerdns.com\nPin-Priority: 600\n" | sudo tee /etc/apt/preferences.d/auth-49
sudo apt update
sudo apt install pdns-server pdns-backend-mysql      # ou pdns-backend-pgsql, -bind, -lmdb, -sqlite3
```

```bash
# RHEL / Rocky / Alma 9
sudo dnf install epel-release
sudo curl -o /etc/yum.repos.d/powerdns-auth-49.repo https://repo.powerdns.com/repo-files/el-auth-49.repo
sudo dnf install pdns pdns-backend-mysql
```

> [!NOTE]
> Sous Debian/Ubuntu, le paquet de la distribution installe un service `pdns` qui démarre avec le backend **bind** par défaut. Vérifiez qu'aucun autre service (systemd-resolved, BIND) n'occupe le port 53 de l'adresse publique.

## Choisir un backend

| Backend | Paquet | Usage |
| --- | --- | --- |
| **gmysql** (MariaDB/MySQL) | `pdns-backend-mysql` | Le plus courant ; réplication Galera ou primaire/réplique |
| **gpgsql** (PostgreSQL) | `pdns-backend-pgsql` | Équivalent, si PostgreSQL est la norme interne |
| **bind** | `pdns-backend-bind` | Fichiers de zone BIND (migration progressive, zones statiques) |
| **lmdb** | `pdns-backend-lmdb` | Base embarquée très rapide, sans serveur SQL (réplication via transferts ou synchronisation) |
| **sqlite3** | `pdns-backend-sqlite3` | Petits déploiements, tests |
| **geoip**, **lua2**, **remote**, **pipe** | | Réponses géographiques, backends programmés |

Plusieurs backends peuvent être chargés : `launch=gmysql,bind` (interrogés dans l'ordre).

## Backend MariaDB

```bash
sudo apt install mariadb-server
sudo mysql <<'EOF'
CREATE DATABASE pdns CHARACTER SET utf8mb4;
CREATE USER 'pdns'@'localhost' IDENTIFIED BY 'MotDePassePdns';
GRANT SELECT, INSERT, UPDATE, DELETE ON pdns.* TO 'pdns'@'localhost';
EOF
sudo mysql pdns < /usr/share/doc/pdns-backend-mysql/schema.mysql.sql     # RHEL : /usr/share/doc/pdns-backend-mysql/schema.mysql.sql
```

```ini /etc/powerdns/pdns.d/gmysql.conf
launch=gmysql
gmysql-host=127.0.0.1
gmysql-port=3306
gmysql-dbname=pdns
gmysql-user=pdns
gmysql-password=MotDePassePdns
gmysql-dnssec=yes
```

## Backend PostgreSQL

```bash
sudo -u postgres createuser -P pdns
sudo -u postgres createdb -O pdns pdns
sudo -u postgres psql pdns < /usr/share/doc/pdns-backend-pgsql/schema.pgsql.sql
sudo -u postgres psql pdns -c "GRANT ALL ON ALL TABLES IN SCHEMA public TO pdns; GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO pdns;"
```

```ini /etc/powerdns/pdns.d/gpgsql.conf
launch=gpgsql
gpgsql-host=127.0.0.1
gpgsql-dbname=pdns
gpgsql-user=pdns
gpgsql-password=MotDePassePdns
gpgsql-dnssec=yes
```

## Backend BIND (fichiers existants)

```ini /etc/powerdns/pdns.d/bind.conf
launch=bind
bind-config=/etc/powerdns/named.conf          # fichier listant les zones (syntaxe named.conf : zone { file …; })
bind-dnssec-db=/var/lib/powerdns/bind-dnssec.sqlite3
```

```bash
sudo pdnsutil create-bind-db /var/lib/powerdns/bind-dnssec.sqlite3   # pour stocker les clés DNSSEC
```

Pratique pour migrer depuis BIND ; ensuite `zone2sql --gmysql --named-conf=/etc/bind/named.conf.local | mysql pdns` importe les zones en base.

## Configuration principale

```ini /etc/powerdns/pdns.conf
# Écoute
local-address=0.0.0.0, ::
local-port=53

# Identité et sécurité
server-id=ns1.exemple.fr
version-string=anonymous
setuid=pdns
setgid=pdns
disable-axfr=no
allow-axfr-ips=127.0.0.1/8                 # restreint ; voir l'article réplication

# Paramètres SOA par défaut des nouvelles zones
default-soa-content=ns1.exemple.fr hostmaster.@ 0 10800 3600 1209600 3600
default-ttl=3600

# API REST et serveur web
api=yes
api-key=$scrypt$ln=10,p=1,r=8$...            # pdnsutil hash-password (clé hachée, 4.6+) ; ou une valeur en clair longue
webserver=yes
webserver-address=127.0.0.1
webserver-port=8081
webserver-allow-from=127.0.0.1,10.0.30.0/24

# Performance
receiver-threads=2
distributor-threads=4
cache-ttl=20
query-cache-ttl=20
negquery-cache-ttl=60

include-dir=/etc/powerdns/pdns.d
```

```bash
sudo pdns_server --config=check            # vérifier (versions récentes)
sudo systemctl restart pdns
sudo systemctl status pdns
dig @127.0.0.1 version.bind CH TXT +short  # « anonymous »
```

> [!WARNING]
> Un serveur PowerDNS Authoritative **ne fait pas de récursion** : un client qui lui demande `www.google.com` reçoit REFUSED. Les postes doivent utiliser un résolveur ([[05-recursor|Recursor]], Unbound, BIND récursif).

## macOS, Windows, Docker

| Plateforme | Méthode |
| --- | --- |
| macOS | `brew install pdns` (autoritaire) et `brew install pdnsrec`, `brew install dnsdist` — développement uniquement |
| Windows | Pas de version native : WSL2, Docker ou VM Linux |
| Docker | Images officielles `powerdns/pdns-auth-49`, `powerdns/pdns-recursor-52`, `powerdns/dnsdist-19` (numéros de branche) |

```bash
docker run -d --name pdns -p 53:53/udp -p 53:53/tcp -p 127.0.0.1:8081:8081 \
  -e PDNS_AUTH_API_KEY=CleApiLongue -v pdns-data:/var/lib/powerdns \
  powerdns/pdns-auth-49        # backend sqlite3/lmdb par défaut selon l'image
```

## Vérifications

```bash
sudo pdnsutil list-all-zones
sudo pdnsutil check-all-zones
curl -s -H "X-API-Key: CleApiLongue" http://127.0.0.1:8081/api/v1/servers/localhost | jq '.version'
ss -lunp | grep ':53 '
```
