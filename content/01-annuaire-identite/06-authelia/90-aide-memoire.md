---
title: Authelia — aide-mémoire des commandes
description: Commandes Authelia avec exemples — exécution (binaire, service, conteneur), validation de la configuration, génération de secrets et de clés, empreintes de mots de passe argon2 pour la base de fichiers, gestion des appareils et de la 2FA (TOTP, WebAuthn), stockage (migrations, chiffrement), règles d'accès, intégration Nginx/Traefik, vérifications HTTP et journaux.
tags: [aide-mémoire, authelia, sso, 2fa, argon2, reverse proxy]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-configuration|Authelia]].

## Exécution

```bash
authelia --config /etc/authelia/configuration.yml
sudo systemctl status authelia
docker run -d --name authelia -v /srv/authelia/config:/config -p 9091:9091 authelia/authelia:latest
docker logs -f authelia
authelia --version
```

## Configuration et secrets

```bash
authelia validate-config --config /etc/authelia/configuration.yml
# Secrets aléatoires (session, stockage, JWT de réinitialisation)
authelia crypto rand --length 64 --charset alphanumeric
# Paire de clés pour l'émetteur OpenID Connect
authelia crypto pair rsa generate --bits 4096 --directory /etc/authelia/keys
# Certificat autosigné (tests)
authelia crypto certificate rsa generate --common-name auth.exemple.fr --directory /etc/authelia/tls
```

## Utilisateurs (base de fichiers)

```bash
# Empreinte argon2id d'un mot de passe pour users_database.yml
authelia crypto hash generate argon2 --password 'MotDePasseLongEtUnique'
docker run --rm authelia/authelia:latest authelia crypto hash generate argon2 --password 'MotDePasseLongEtUnique'
```

```yaml
# /etc/authelia/users_database.yml
users:
  amartin:
    disabled: false
    displayname: "Alice Martin"
    password: "$argon2id$v=19$m=65536,t=3,p=4$..."
    email: alice.martin@exemple.fr
    groups:
      - admins
      - reseau
```

## Stockage et 2FA

```bash
authelia storage migrate list-up --config /etc/authelia/configuration.yml
authelia storage migrate up --config /etc/authelia/configuration.yml
authelia storage user totp generate amartin --config /etc/authelia/configuration.yml     # QR/URI TOTP
authelia storage user totp delete amartin --config /etc/authelia/configuration.yml
authelia storage user webauthn list amartin --config /etc/authelia/configuration.yml
authelia storage user webauthn delete amartin --all --config /etc/authelia/configuration.yml
authelia storage encryption check --config /etc/authelia/configuration.yml
authelia storage encryption change-key --new-encryption-key "$NOUVELLE_CLE" --config /etc/authelia/configuration.yml
```

## Règles d'accès (extrait)

```yaml
access_control:
  default_policy: deny
  rules:
    - domain: "public.exemple.fr"
      policy: bypass
    - domain: "*.exemple.fr"
      subject: "group:admins"
      policy: two_factor
    - domain: "wiki.exemple.fr"
      networks: ["10.0.0.0/8"]
      policy: one_factor
```

## Vérifications

```bash
curl -s https://auth.exemple.fr/api/health
curl -s https://auth.exemple.fr/api/state
# Simuler l'appel du reverse proxy (attend 401/302 sans cookie)
curl -I -H "X-Original-URL: https://wiki.exemple.fr/" http://127.0.0.1:9091/api/authz/auth-request
```

Intégration avec les proxys : voir [[02-proxy-oidc-exploitation|proxy, OIDC et exploitation]].
