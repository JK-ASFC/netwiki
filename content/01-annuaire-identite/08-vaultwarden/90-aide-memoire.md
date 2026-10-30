---
title: Vaultwarden — aide-mémoire des commandes
description: Commandes Vaultwarden avec exemples — conteneur Docker et Compose, variables essentielles (DOMAIN, ADMIN_TOKEN haché, SIGNUPS_ALLOWED, SMTP), génération du jeton d'administration argon2, page /admin, sauvegarde et restauration (SQLite, pièces jointes, clés), mise à jour, santé et journaux, client en ligne de commande Bitwarden (bw) pour l'automatisation.
tags: [aide-mémoire, vaultwarden, bitwarden, docker, sauvegarde, bw]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Vaultwarden]].

## Conteneur

```bash
docker run -d --name vaultwarden --restart unless-stopped \
  -e DOMAIN="https://coffre.exemple.fr" -e SIGNUPS_ALLOWED=false \
  -e ADMIN_TOKEN='$argon2id$v=19$m=65540,t=3,p=4$...' \
  -v /srv/vaultwarden:/data -p 127.0.0.1:8080:80 vaultwarden/server:latest
docker logs -f vaultwarden
docker exec -it vaultwarden /vaultwarden --version
```

```yaml
# compose.yaml
services:
  vaultwarden:
    image: vaultwarden/server:latest
    restart: unless-stopped
    environment:
      DOMAIN: "https://coffre.exemple.fr"
      SIGNUPS_ALLOWED: "false"
      INVITATIONS_ALLOWED: "true"
      SMTP_HOST: "smtp.exemple.fr"
      SMTP_FROM: "coffre@exemple.fr"
      SMTP_PORT: "587"
      SMTP_SECURITY: "starttls"
      ADMIN_TOKEN: "${ADMIN_TOKEN}"
    volumes:
      - /srv/vaultwarden:/data
    ports:
      - "127.0.0.1:8080:80"
```

## Jeton d'administration

```bash
# Générer une empreinte argon2 (à placer dans ADMIN_TOKEN ; dans un .env, doubler les $ en $$)
docker run --rm -it vaultwarden/server /vaultwarden hash --preset owasp
# Page d'administration : https://coffre.exemple.fr/admin (à restreindre par IP au niveau du proxy)
```

## Sauvegarde et restauration

```bash
# Copie cohérente de la base SQLite
sqlite3 /srv/vaultwarden/db.sqlite3 ".backup '/srv/sauvegardes/vw-$(date +%F).sqlite3'"
# Fichiers indispensables : base, clés RSA, pièces jointes, envois, config.json
tar czf /srv/sauvegardes/vw-fichiers-$(date +%F).tar.gz -C /srv/vaultwarden rsa_key.pem attachments sends config.json
# Restauration : arrêter le conteneur, remettre db.sqlite3 et les fichiers, redémarrer
docker stop vaultwarden && cp /srv/sauvegardes/vw-2026-10-29.sqlite3 /srv/vaultwarden/db.sqlite3 && docker start vaultwarden
```

## Mise à jour et santé

```bash
docker pull vaultwarden/server:latest && docker compose up -d
curl -s https://coffre.exemple.fr/alive
docker exec vaultwarden ls -l /data
```

## Client CLI Bitwarden (bw)

```bash
npm install -g @bitwarden/cli            # ou binaire officiel
bw config server https://coffre.exemple.fr
bw login alice.martin@exemple.fr
export BW_SESSION=$(bw unlock --raw)
bw sync
bw list items --search routeur | jq '.[].name'
bw get password "Routeur Paris"
bw get item "Routeur Paris" | jq '.login.username'
bw generate -ulns --length 24
bw lock && bw logout
```
