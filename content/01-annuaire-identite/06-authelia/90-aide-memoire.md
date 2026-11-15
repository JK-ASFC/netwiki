---
title: Authelia — aide-mémoire des commandes
description: Référence complète des commandes Authelia 4.39 avec exemples — installation (dépôt Debian, binaire, conteneur et Docker Compose avec Redis), service systemd, validation de la configuration, secrets par fichiers et variables _FILE, génération de secrets, de paires de clés et de certificats, empreintes argon2id (utilisateurs) et pbkdf2 (secrets de clients OIDC), base d'utilisateurs fichier, stockage (migrations, schéma, chiffrement, changement de clé), 2FA (TOTP : génération, export, import ; WebAuthn), régulation des échecs, règles d'accès, points de vérification des mandataires (auth-request, forward-auth, ext-authz) et tests curl, fournisseur OpenID Connect (clients, découverte), métriques, journaux et sauvegarde.
tags: [aide-mémoire, authelia, sso, 2fa, totp, webauthn, argon2, oidc, reverse proxy, forward auth]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-configuration|Authelia]] et [[02-proxy-oidc-exploitation|mandataires, OIDC et exploitation]]. Exemples : portail `https://auth.exemple.fr`, configuration `/etc/authelia/configuration.yml`, conteneur `authelia`.

> [!TIP]
> Dans un conteneur, préfixez les commandes : `docker exec -it authelia authelia …` (configuration dans `/config`). Toutes les sous-commandes `storage` lisent la configuration pour joindre la base : ajoutez `--config /etc/authelia/configuration.yml` (ou `-c`).

## Installation

```bash
# Debian / Ubuntu : dépôt officiel
sudo apt install ca-certificates curl gnupg
sudo curl -fsSL https://www.authelia.com/keys/authelia-security.gpg -o /usr/share/keyrings/authelia-security.gpg
echo "deb [signed-by=/usr/share/keyrings/authelia-security.gpg] https://apt.authelia.com/stable/debian/debian/ all main" | sudo tee /etc/apt/sources.list.d/authelia-stable-debian.list
sudo apt update && sudo apt install authelia

# Conteneur
docker run -d --name authelia -p 127.0.0.1:9091:9091 -v /srv/authelia:/config authelia/authelia:4.39

# Service et version
sudo systemctl enable --now authelia
sudo systemctl status authelia
authelia --version
authelia build-info
```

```yaml compose.yaml
services:
  authelia:
    image: authelia/authelia:4.39
    restart: unless-stopped
    volumes:
      - ./config:/config
      - ./secrets:/secrets:ro
    environment:
      AUTHELIA_IDENTITY_VALIDATION_RESET_PASSWORD_JWT_SECRET_FILE: /secrets/jwt
      AUTHELIA_SESSION_SECRET_FILE: /secrets/session
      AUTHELIA_STORAGE_ENCRYPTION_KEY_FILE: /secrets/storage
      AUTHELIA_SESSION_REDIS_PASSWORD_FILE: /secrets/redis
    ports:
      - "127.0.0.1:9091:9091"
    depends_on:
      - redis
  redis:
    image: redis:7
    command: sh -c 'redis-server --requirepass "$$(cat /secrets/redis)"'
    volumes:
      - ./secrets:/secrets:ro
```

> [!NOTE]
> Les variables `AUTHELIA_…_FILE` lisent un secret dans un fichier : aucun secret n'apparaît dans `configuration.yml` ni dans `docker inspect`. Le nom correspond au chemin de l'option en majuscules (`session.secret` → `AUTHELIA_SESSION_SECRET_FILE`).

## Configuration et secrets

```bash
authelia validate-config --config /etc/authelia/configuration.yml
docker exec authelia authelia validate-config --config /config/configuration.yml

# Secrets aléatoires (un par fichier, lisibles par le seul compte authelia)
sudo install -d -m 700 -o authelia -g authelia /etc/authelia/secrets
for s in jwt session storage; do authelia crypto rand --length 64 --charset alphanumeric | sudo tee /etc/authelia/secrets/$s > /dev/null; done
sudo chown authelia:authelia /etc/authelia/secrets/* && sudo chmod 600 /etc/authelia/secrets/*

# Clés et certificats
authelia crypto pair rsa generate --bits 4096 --directory /etc/authelia/keys          # signature des jetons OIDC
authelia crypto pair ecdsa generate --curve P256 --directory /etc/authelia/keys
authelia crypto certificate rsa generate --common-name auth.exemple.fr --sans auth.exemple.fr --directory /etc/authelia/tls   # autosigné, tests
```

## Utilisateurs (base de fichiers)

```bash
# Empreinte argon2id d'un mot de passe choisi, ou mot de passe aléatoire + empreinte
authelia crypto hash generate argon2 --password 'MotDePasseLongEtUnique'
authelia crypto hash generate argon2 --random --random.length 24
docker run --rm authelia/authelia:4.39 authelia crypto hash generate argon2 --password 'MotDePasseLongEtUnique'
# Vérifier qu'un mot de passe correspond à une empreinte
authelia crypto hash validate --password 'MotDePasseLongEtUnique' -- '$argon2id$v=19$m=65536,t=3,p=4$exempleSel$exempleEmpreinte'
```

```yaml /etc/authelia/users_database.yml
users:
  amartin:
    disabled: false
    displayname: "Alice Martin"
    password: "$argon2id$v=19$m=65536,t=3,p=4$exempleSel$exempleEmpreinte"
    email: alice.martin@exemple.fr
    groups:
      - admins
      - reseau
```

```yaml configuration.yml (extrait)
authentication_backend:
  file:
    path: /etc/authelia/users_database.yml
    watch: true            # recharge le fichier à chaque modification
  password_reset:
    disable: false
```

## Stockage

```bash
authelia storage schema-info --config /etc/authelia/configuration.yml
authelia storage migrate list-up --config /etc/authelia/configuration.yml
authelia storage migrate up --config /etc/authelia/configuration.yml
authelia storage migrate history --config /etc/authelia/configuration.yml
# Chiffrement des données sensibles (secrets TOTP, WebAuthn)
authelia storage encryption check --config /etc/authelia/configuration.yml
authelia storage encryption check --verbose --config /etc/authelia/configuration.yml
authelia storage encryption change-key --new-encryption-key "$(cat /etc/authelia/secrets/storage-nouvelle)" --config /etc/authelia/configuration.yml
```

> [!WARNING]
> Sans la **clé de chiffrement du stockage**, les secrets TOTP et WebAuthn de la base sont illisibles : sauvegardez-la avec la base, séparément.

## Double authentification

```bash
# TOTP : créer pour un utilisateur (affiche l'URI otpauth://), exporter, importer, supprimer
authelia storage user totp generate amartin --config /etc/authelia/configuration.yml
authelia storage user totp generate amartin --path /tmp/amartin-totp.png --config /etc/authelia/configuration.yml   # QR code
authelia storage user totp export --file /root/totp-export.yaml --config /etc/authelia/configuration.yml
authelia storage user totp import /root/totp-export.yaml --config /etc/authelia/configuration.yml
authelia storage user totp delete amartin --config /etc/authelia/configuration.yml

# WebAuthn (clés de sécurité, passkeys)
authelia storage user webauthn list amartin --config /etc/authelia/configuration.yml
authelia storage user webauthn delete amartin --description "YubiKey bureau" --config /etc/authelia/configuration.yml
authelia storage user webauthn delete amartin --all --config /etc/authelia/configuration.yml
```

## Régulation, règles d'accès

```yaml configuration.yml (extrait)
regulation:
  max_retries: 3
  find_time: 2m
  ban_time: 10m

access_control:
  default_policy: deny
  rules:
    - domain: "public.exemple.fr"
      policy: bypass
    - domain: "wiki.exemple.fr"
      networks: ["10.0.0.0/8", "192.168.0.0/16"]
      policy: one_factor
    - domain: "grafana.exemple.fr"
      subject: ["group:reseau", "group:admins"]
      policy: two_factor
    - domain: "api.exemple.fr"
      resources: ["^/api/public/.*$"]
      methods: ["GET"]
      policy: bypass
    - domain: "*.exemple.fr"
      subject: "group:admins"
      policy: two_factor
```

Les règles sont évaluées **dans l'ordre** : la première qui correspond (domaine, sujet, réseau, ressource, méthode) s'applique, puis `default_policy`.

## Mandataires inverses : vérifications

| Mandataire | Point de vérification |
| --- | --- |
| Nginx (`auth_request`) | `/api/authz/auth-request` |
| Traefik, Caddy (*forward auth*) | `/api/authz/forward-auth` |
| HAProxy, Envoy (*ext authz*) | `/api/authz/ext-authz` |

```bash
curl -s https://auth.exemple.fr/api/health                       # OK si le service répond
curl -s http://127.0.0.1:9091/api/health
# Simuler l'appel de Nginx sans cookie : 401 attendu (Nginx redirige alors vers le portail)
curl -s -o /dev/null -w "%{http_code}\n" -H "X-Original-Method: GET" -H "X-Original-URL: https://wiki.exemple.fr/" http://127.0.0.1:9091/api/authz/auth-request
# Simuler Traefik : 302 vers le portail attendu
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" -H "X-Forwarded-Method: GET" -H "X-Forwarded-Proto: https" -H "X-Forwarded-Host: wiki.exemple.fr" -H "X-Forwarded-Uri: /" http://127.0.0.1:9091/api/authz/forward-auth
# En-têtes transmis à l'application après authentification : Remote-User, Remote-Groups, Remote-Name, Remote-Email
```

## Fournisseur OpenID Connect

```bash
# Secret d'un client : valeur en clair à donner à l'application, empreinte pbkdf2 dans configuration.yml
authelia crypto hash generate pbkdf2 --variant sha512 --random --random.length 72 --random.charset rfc3986
# Découverte et clés publiques
curl -s https://auth.exemple.fr/.well-known/openid-configuration | jq '.issuer, .authorization_endpoint, .token_endpoint, .jwks_uri'
curl -s https://auth.exemple.fr/jwks.json | jq '.keys[] | {kid, alg}'
```

```yaml configuration.yml (extrait)
identity_providers:
  oidc:
    hmac_secret: "remplacer par un secret aléatoire de 64 caractères (ou AUTHELIA_IDENTITY_PROVIDERS_OIDC_HMAC_SECRET_FILE)"
    jwks:
      - key_id: "principale"
        algorithm: RS256
        use: sig
        key: {{ secret "/etc/authelia/keys/private.pem" | mindent 10 "|" | msquote }}
    clients:
      - client_id: grafana
        client_name: Grafana
        client_secret: "$pbkdf2-sha512$310000$exempleSel$exempleEmpreinte"
        authorization_policy: two_factor
        redirect_uris:
          - https://grafana.exemple.fr/login/generic_oauth
        scopes: [openid, profile, email, groups]
```

La syntaxe `{{ secret … }}` demande l'activation des modèles : variable d'environnement `X_AUTHELIA_CONFIG_FILTERS=template`.

## Supervision, journaux, sauvegarde

```yaml configuration.yml (extrait)
log:
  level: info              # debug pour diagnostiquer une règle
telemetry:
  metrics:
    enabled: true
    address: tcp://0.0.0.0:9959/metrics
```

```bash
curl -s http://127.0.0.1:9959/metrics | grep -E "^authelia_" | head
sudo journalctl -u authelia -f
docker logs -f --since 10m authelia
docker logs authelia 2>&1 | grep -E "level=error|Unsuccessful|banned"

# Sauvegarde : configuration, base d'utilisateurs, base de stockage et clé de chiffrement
sudo tar -czf /srv/sauvegardes/authelia-$(date +%F).tar.gz /etc/authelia /var/lib/authelia
pg_dump -h srv-db.exemple.fr -U authelia -Fc authelia > /srv/sauvegardes/authelia-$(date +%F).dump   # stockage PostgreSQL
```
