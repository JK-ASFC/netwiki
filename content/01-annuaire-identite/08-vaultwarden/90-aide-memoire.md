---
title: Vaultwarden — aide-mémoire des commandes
description: Référence complète des commandes Vaultwarden avec exemples — conteneur Docker et Compose, installation Arch et FreeBSD, variables essentielles (DOMAIN, inscriptions, invitations, ADMIN_TOKEN haché argon2, SMTP, base PostgreSQL ou MariaDB, limitation des tentatives, journal, notifications mobiles), page /admin et config.json, mandataire HTTPS, fail2ban (connexions et page d'administration), sauvegarde et restauration (SQLite en ligne, PostgreSQL, clés RSA, pièces jointes, chiffrement de l'archive, contrôle d'intégrité), mise à jour, santé et journaux, client en ligne de commande Bitwarden bw (connexion par clé d'API, recherche, création et modification d'éléments, organisations et collections, export chiffré, import, TOTP, API locale bw serve).
tags: [aide-mémoire, vaultwarden, bitwarden, bw, docker, sauvegarde, fail2ban, gestionnaire de mots de passe]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Vaultwarden]] et [[02-organisations-securite-exploitation|organisations, sécurité et exploitation]]. Exemples : URL `https://coffre.exemple.fr`, données dans `/srv/vaultwarden`, conteneur `vaultwarden`.

## Installation

```bash
docker run -d --name vaultwarden --restart unless-stopped \
  -e DOMAIN="https://coffre.exemple.fr" -e SIGNUPS_ALLOWED=false \
  -e ADMIN_TOKEN='$argon2id$v=19$m=65540,t=3,p=4$exempleSel$exempleEmpreinte' \
  -v /srv/vaultwarden:/data -p 127.0.0.1:8080:80 vaultwarden/server:latest
docker logs -f vaultwarden
docker exec vaultwarden /vaultwarden --version

# Sans conteneur
sudo pacman -S vaultwarden vaultwarden-web          # Arch (configuration dans /etc/vaultwarden.env)
sudo pkg install vaultwarden && sudo sysrc vaultwarden_enable=YES   # FreeBSD
```

```yaml compose.yaml
services:
  vaultwarden:
    image: vaultwarden/server:latest
    container_name: vaultwarden
    restart: unless-stopped
    env_file: .env
    environment:
      DOMAIN: "https://coffre.exemple.fr"
      SIGNUPS_ALLOWED: "false"
      INVITATIONS_ALLOWED: "true"
      SHOW_PASSWORD_HINT: "false"
      SMTP_HOST: "smtp.exemple.fr"
      SMTP_FROM: "coffre@exemple.fr"
      SMTP_PORT: "587"
      SMTP_SECURITY: "starttls"
      SMTP_USERNAME: "coffre"
      LOG_FILE: "/data/vaultwarden.log"
      IP_HEADER: "X-Real-IP"
    volumes:
      - /srv/vaultwarden:/data
    ports:
      - "127.0.0.1:8080:80"
```

```text .env
ADMIN_TOKEN=$$argon2id$$v=19$$m=65540,t=3,p=4$$exempleSel$$exempleEmpreinte
SMTP_PASSWORD=MotDePasseSmtp
```

Dans un fichier `.env` lu par Docker Compose, chaque `$` de l'empreinte est doublé (`$$`).

### Variables essentielles

| Variable | Rôle |
| --- | --- |
| `DOMAIN` | URL publique exacte (liens des courriels, WebAuthn, pièces jointes) |
| `SIGNUPS_ALLOWED` / `SIGNUPS_DOMAINS_WHITELIST` | Inscription libre (à `false`), ou réservée à des domaines (`exemple.fr`) |
| `SIGNUPS_VERIFY` | Vérification de l'adresse avant la première connexion |
| `INVITATIONS_ALLOWED` | Invitations par les administrateurs d'organisation |
| `ADMIN_TOKEN` | Empreinte argon2 du jeton de la page `/admin` ; absente = page désactivée |
| `DATABASE_URL` | `postgresql://vaultwarden:MotDePasse@srv-db.exemple.fr/vaultwarden` ou `mysql://…` (SQLite par défaut) |
| `LOGIN_RATELIMIT_SECONDS`, `LOGIN_RATELIMIT_MAX_BURST` | Limitation des tentatives de connexion |
| `ADMIN_RATELIMIT_SECONDS`, `ADMIN_RATELIMIT_MAX_BURST` | Idem pour `/admin` |
| `EMERGENCY_ACCESS_ALLOWED`, `SENDS_ALLOWED`, `ORG_CREATION_USERS` | Accès d'urgence, envois, qui peut créer des organisations |
| `LOG_FILE`, `LOG_LEVEL`, `IP_HEADER` | Journal fichier (pour fail2ban), niveau, en-tête de l'adresse client derrière le mandataire |
| `PUSH_ENABLED`, `PUSH_INSTALLATION_ID`, `PUSH_INSTALLATION_KEY` | Notifications vers les applications mobiles (clés obtenues sur bitwarden.com/host) |

Les réglages modifiés dans la page `/admin` sont enregistrés dans `/data/config.json` et **priment** sur les variables d'environnement.

## Jeton d'administration

```bash
# Empreinte argon2 (saisie du jeton, deux fois) ; préréglage OWASP
docker run --rm -it vaultwarden/server /vaultwarden hash --preset owasp
docker exec -it vaultwarden /vaultwarden hash
# Jeton aléatoire à saisir dans la commande ci-dessus
openssl rand -base64 48
```

Page d'administration : `https://coffre.exemple.fr/admin` — à restreindre par adresse IP au niveau du mandataire, ou à désactiver en retirant `ADMIN_TOKEN` une fois la configuration terminée.

## Mandataire HTTPS

```text /etc/caddy/Caddyfile
coffre.exemple.fr {
    @admin path /admin*
    handle @admin {
        @interdit not remote_ip 10.0.99.0/24
        respond @interdit 403
        reverse_proxy 127.0.0.1:8080 {
            header_up X-Real-IP {remote_host}
        }
    }
    reverse_proxy 127.0.0.1:8080 {
        header_up X-Real-IP {remote_host}
    }
}
```

Depuis la version 1.29, les notifications temps réel (WebSocket) passent par le même port que l'interface : plus de port 3012 à relayer.

## fail2ban

```text /etc/fail2ban/filter.d/vaultwarden.local
[INCLUDES]
before = common.conf

[Definition]
failregex = ^.*Username or password is incorrect\. Try again\. IP: <ADDR>\. Username:.*$
ignoreregex =
```

```text /etc/fail2ban/filter.d/vaultwarden-admin.local
[INCLUDES]
before = common.conf

[Definition]
failregex = ^.*Invalid admin token\. IP: <ADDR>.*$
ignoreregex =
```

```text /etc/fail2ban/jail.d/vaultwarden.local
[vaultwarden]
enabled = true
port = 80,443
filter = vaultwarden
backend = auto
logpath = /srv/vaultwarden/vaultwarden.log
maxretry = 5
bantime = 4h
findtime = 15m
chain = DOCKER-USER

[vaultwarden-admin]
enabled = true
port = 80,443
filter = vaultwarden-admin
backend = auto
logpath = /srv/vaultwarden/vaultwarden.log
maxretry = 3
bantime = 12h
findtime = 15m
chain = DOCKER-USER
```

```bash
sudo fail2ban-client reload
sudo fail2ban-client status vaultwarden
sudo fail2ban-regex /srv/vaultwarden/vaultwarden.log /etc/fail2ban/filter.d/vaultwarden.local
sudo fail2ban-client set vaultwarden unbanip 203.0.113.25
```

`chain = DOCKER-USER` est nécessaire quand le port est publié par Docker (les règles de la chaîne INPUT ne s'appliquent pas au trafic redirigé vers un conteneur). Derrière un mandataire inverse sur le même hôte, bannissez plutôt sur le mandataire.

## Sauvegarde et restauration

```bash
# Copie cohérente de la base SQLite, à chaud
sqlite3 /srv/vaultwarden/db.sqlite3 ".backup '/srv/sauvegardes/vw-$(date +%F).sqlite3'"
sqlite3 /srv/sauvegardes/vw-$(date +%F).sqlite3 "PRAGMA integrity_check;"     # « ok » attendu
# Base PostgreSQL
pg_dump -h srv-db.exemple.fr -U vaultwarden -Fc vaultwarden > /srv/sauvegardes/vw-$(date +%F).dump

# Fichiers indispensables : clés RSA (jetons), pièces jointes, envois, configuration
tar czf /srv/sauvegardes/vw-fichiers-$(date +%F).tar.gz -C /srv/vaultwarden rsa_key.pem attachments sends config.json
# Chiffrer l'archive avant de l'envoyer hors site (age)
age -r age1exempleclepubliqueduserveurdesauvegarde -o /srv/sauvegardes/vw-fichiers-$(date +%F).tar.gz.age /srv/sauvegardes/vw-fichiers-$(date +%F).tar.gz

# Restauration : arrêter, remettre la base et les fichiers, redémarrer
docker stop vaultwarden
cp /srv/sauvegardes/vw-2026-11-15.sqlite3 /srv/vaultwarden/db.sqlite3
tar xzf /srv/sauvegardes/vw-fichiers-2026-11-15.tar.gz -C /srv/vaultwarden
rm -f /srv/vaultwarden/db.sqlite3-wal /srv/vaultwarden/db.sqlite3-shm
docker start vaultwarden
```

Sans `rsa_key.pem`, toutes les sessions sont invalidées (reconnexion obligatoire) ; les coffres restent lisibles car ils sont chiffrés côté client.

## Mise à jour, santé, journaux

```bash
docker compose pull && docker compose up -d && docker image prune -f
curl -s https://coffre.exemple.fr/alive                              # horodatage si le service répond
docker inspect --format '{{.State.Health.Status}}' vaultwarden
docker logs --since 1h vaultwarden 2>&1 | grep -E "ERROR|WARN|incorrect"
tail -f /srv/vaultwarden/vaultwarden.log
docker exec vaultwarden ls -l /data
```

## Client en ligne de commande Bitwarden (bw)

```bash
# Installation
npm install -g @bitwarden/cli
sudo snap install bw
winget install Bitwarden.CLI

# Connexion au serveur Vaultwarden
bw config server https://coffre.exemple.fr
bw login alice.martin@exemple.fr                                    # interactif (mot de passe, 2FA)
export BW_CLIENTID="user.exemple-identifiant" BW_CLIENTSECRET="exempleSecret"
bw login --apikey                                                   # scripts : clé d'API personnelle (paramètres du compte)
export BW_SESSION=$(bw unlock --raw)                                # déverrouillage (mot de passe maître)
bw status | jq .
bw sync

# Rechercher, lire
bw list items --search routeur | jq -r '.[].name'
bw get password "Routeur Paris"
bw get username "Routeur Paris"
bw get totp "Routeur Paris"
bw get item "Routeur Paris" | jq '{id, name, user: .login.username}'
bw list organizations | jq -r '.[] | "\(.id) \(.name)"'
bw list collections --organizationid <id-organisation> | jq -r '.[].name'
bw list items --organizationid <id-organisation> --collectionid <id-collection> | jq -r '.[].name'

# Créer un identifiant avec un mot de passe généré
bw get template item | jq --arg n "Routeur Lyon" --arg u "admin" --arg p "$(bw generate -ulns --length 24)" '.name=$n | .login={username:$u, password:$p, uris:[{uri:"ssh://10.20.0.1"}]}' | bw encode | bw create item

# Modifier, supprimer
bw get item "Routeur Lyon" | jq '.notes="Remplacé le 15/11/2026"' | bw encode | bw edit item <id-element>
bw delete item <id-element>

# Générer
bw generate -ulns --length 24
bw generate --passphrase --words 5 --separator - --capitalize

# Export (chiffré de préférence) et import
bw export --format encrypted_json --output /srv/sauvegardes/coffre-alice.json
bw import bitwardenjson /tmp/export.json

# API REST locale (intégrations, n'écoute que sur 127.0.0.1)
bw serve --hostname 127.0.0.1 --port 8087
curl -s http://127.0.0.1:8087/list/object/items?search=routeur | jq '.data.data[].name'

bw lock && bw logout
```
