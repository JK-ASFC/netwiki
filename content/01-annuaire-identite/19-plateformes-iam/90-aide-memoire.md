---
title: Plateformes IAM — aide-mémoire des commandes
description: Commandes avec exemples pour Zitadel, Casdoor, Logto, Ory Kratos et Hydra, Janssen et OpenAM — démarrage en conteneur, découverte OIDC, test d'un client (client_credentials), API d'administration, CLI hydra et kratos, sauvegarde PostgreSQL, décodage d'un jeton.
tags: [aide-mémoire, zitadel, casdoor, logto, ory, hydra, kratos, janssen, openam]
icon: terminal
---

Références : [[01-comparatif|comparatif]], [[02-zitadel|Zitadel]], [[03-casdoor|Casdoor]], [[04-logto|Logto]], [[05-ory|Ory]], [[06-gluu-flex-openam|Gluu et OpenAM]].

## Commun (OIDC)

```bash
curl -s https://id.corp.exemple.fr/.well-known/openid-configuration | jq '{issuer, token_endpoint, jwks_uri}'
curl -s -u "$CLIENT_ID:$CLIENT_SECRET" -d grant_type=client_credentials -d scope=openid https://id.corp.exemple.fr/oauth/v2/token | jq .
echo "$JETON" | cut -d. -f2 | base64 -d 2>/dev/null | jq .
```

## Zitadel, Casdoor, Logto

```bash
docker compose up -d ; docker compose logs -f zitadel
curl -s https://id.corp.exemple.fr/debug/healthz                       # Zitadel
docker logs -f casdoor
docker compose exec db pg_dump -U postgres zitadel > zitadel.sql
docker compose exec logto npm run cli db seed -- --swe                 # Logto : initialiser la base
```

## Ory

```bash
kratos migrate sql -e --yes -c kratos.yml ; kratos serve -c kratos.yml
curl -s http://localhost:4434/admin/identities | jq length
curl -s -X DELETE http://localhost:4434/admin/identities/<id>
hydra create oauth2-client --endpoint http://localhost:4445 --name app --grant-type client_credentials
hydra list oauth2-clients --endpoint http://localhost:4445
hydra perform client-credentials --endpoint http://localhost:4444 --client-id <id> --client-secret <secret>
hydra introspect token --endpoint http://localhost:4445 <jeton>
```

## Janssen et OpenAM

```bash
sudo systemctl status jans-auth jans-config-api ; sudo /opt/jans/bin/jans_cli_tui.py
tail -f /opt/jans/jetty/jans-auth/logs/jans-auth.log
docker logs -f openam ; curl -s http://openam.corp.exemple.fr:8080/openam/isAlive.jsp
```
