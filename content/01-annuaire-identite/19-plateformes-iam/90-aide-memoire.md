---
title: Plateformes IAM — aide-mémoire des commandes
description: Commandes des plateformes d'identité Zitadel, Casdoor, Logto, Ory (Kratos, Hydra), Janssen/Gluu et OpenAM avec exemples — tests OIDC communs (découverte, clés, jeton client, introspection, décodage JWT), Zitadel (démarrage avec clé maîtresse, santé, API de gestion avec jeton personnel, sauvegarde PostgreSQL), Casdoor (conteneur, API), Logto (conteneur, initialisation et migrations de base), Ory Kratos (migrations, identités : liste, import, suppression, lien de récupération) et Hydra (migrations, clients OAuth2, test de flux, introspection, révocation), Janssen (services, interface texte, journaux) et OpenAM (ssoadm, santé).
tags: [aide-mémoire, iam, oidc, zitadel, casdoor, logto, ory, kratos, hydra, janssen, openam]
icon: terminal
---

Références : [[01-comparatif|comparatif]], [[02-zitadel|Zitadel]], [[03-casdoor|Casdoor]], [[04-logto|Logto]], [[05-ory|Ory]], [[06-gluu-flex-openam|Gluu et OpenAM]]. Exemples : fournisseur `https://id.corp.exemple.fr`.

## Commun : tests OpenID Connect

```bash
ISS=https://id.corp.exemple.fr
curl -s $ISS/.well-known/openid-configuration | jq '{issuer, authorization_endpoint, token_endpoint, userinfo_endpoint, jwks_uri, introspection_endpoint}'
JWKS=$(curl -s $ISS/.well-known/openid-configuration | jq -r .jwks_uri); curl -s "$JWKS" | jq '.keys[] | {kid, kty, alg}'
TOKEN_URL=$(curl -s $ISS/.well-known/openid-configuration | jq -r .token_endpoint)
# Jeton machine-à-machine
curl -s -u "$CLIENT_ID:$CLIENT_SECRET" -d grant_type=client_credentials -d scope=openid "$TOKEN_URL" | jq .
# Introspection (validité d'un jeton)
INTRO=$(curl -s $ISS/.well-known/openid-configuration | jq -r .introspection_endpoint)
curl -s -u "$CLIENT_ID:$CLIENT_SECRET" -d token="$JETON" "$INTRO" | jq '.active, .sub, .exp'
# Décoder la charge utile d'un JWT (sans vérifier la signature)
P=$(printf '%s' "$JETON" | cut -d. -f2 | tr '_-' '/+'); while [ $(( ${#P} % 4 )) -ne 0 ]; do P="$P="; done; printf '%s' "$P" | base64 -d | jq .
```

## Zitadel

```bash
# Binaire : première initialisation (clé maîtresse de 32 caractères, à conserver hors du serveur)
export ZITADEL_MASTERKEY="$(tr -dc A-Za-z0-9 </dev/urandom | head -c 32)"
zitadel start-from-init --masterkeyFromEnv --tlsMode external --config /etc/zitadel/config.yaml --steps /etc/zitadel/init-steps.yaml
zitadel start --masterkeyFromEnv --tlsMode external --config /etc/zitadel/config.yaml      # démarrages suivants
# Conteneur
docker compose up -d && docker compose logs -f zitadel
curl -s https://id.corp.exemple.fr/debug/healthz
curl -s https://id.corp.exemple.fr/debug/ready
# API de gestion avec un jeton d'accès personnel (compte de service « machine »)
curl -s -X POST -H "Authorization: Bearer $PAT" -H "Content-Type: application/json" -d '{"query":{"limit":20}}' https://id.corp.exemple.fr/management/v1/users/_search | jq '.result[] | {id, userName, state}'
curl -s -H "Authorization: Bearer $PAT" https://id.corp.exemple.fr/management/v1/orgs/me | jq '.org.name'
# Sauvegarde (la base contient tout ; la clé maîtresse déchiffre les secrets)
docker compose exec -T db pg_dump -U postgres -Fc zitadel > /srv/sauvegardes/zitadel-$(date +%F).dump
```

## Casdoor

```bash
docker run -d --name casdoor -p 8000:8000 casbin/casdoor-all-in-one
docker logs -f casdoor
# API (identifiants d'une application Casdoor)
curl -s "https://id.corp.exemple.fr/api/get-users?owner=built-in&clientId=$CLIENT_ID&clientSecret=$CLIENT_SECRET" | jq '.data[] | {name, displayName, email}'
curl -s "https://id.corp.exemple.fr/api/get-applications?owner=admin&clientId=$CLIENT_ID&clientSecret=$CLIENT_SECRET" | jq '.data[].name'
```

## Logto

```bash
docker run -d --name logto -p 3001:3001 -p 3002:3002 -e TRUST_PROXY_HEADER=1 -e DB_URL="postgres://logto:MotDePasse@srv-db.corp.exemple.fr:5432/logto" -e ENDPOINT=https://id.corp.exemple.fr -e ADMIN_ENDPOINT=https://id-admin.corp.exemple.fr svhd/logto:latest
docker exec logto npm run cli db seed -- --swe          # initialiser la base (une fois)
docker exec logto npm run cli db alteration deploy       # migrations après une mise à jour
docker logs -f logto
```

Ports : 3001 pour les utilisateurs et les applications, 3002 pour la console d'administration (à ne pas exposer publiquement).

## Ory Kratos (identités)

```bash
kratos migrate sql -e --yes -c /etc/kratos/kratos.yml
kratos serve -c /etc/kratos/kratos.yml
kratos list identities --endpoint http://127.0.0.1:4434 --format json | jq '.[] | {id, traits}'
kratos get identity <id-identite> --endpoint http://127.0.0.1:4434
kratos import identities /srv/import/identites.json --endpoint http://127.0.0.1:4434
kratos delete identity <id-identite> --endpoint http://127.0.0.1:4434
# API d'administration (port 4434, jamais exposé)
curl -s http://127.0.0.1:4434/admin/identities | jq 'length'
curl -s -X POST -H "Content-Type: application/json" -d '{"identity_id":"<id-identite>","expires_in":"1h"}' http://127.0.0.1:4434/admin/recovery/link | jq -r .recovery_link
curl -s http://127.0.0.1:4433/health/ready
```

## Ory Hydra (OAuth2 / OIDC)

```bash
hydra migrate sql -e --yes -c /etc/hydra/hydra.yml
hydra serve all -c /etc/hydra/hydra.yml
hydra create oauth2-client --endpoint http://127.0.0.1:4445 --name intranet --grant-type authorization_code,refresh_token --response-type code --scope openid,offline --redirect-uri https://intranet.corp.exemple.fr/callback
hydra create oauth2-client --endpoint http://127.0.0.1:4445 --name automate --grant-type client_credentials --format json | jq '{client_id, client_secret}'
hydra list oauth2-clients --endpoint http://127.0.0.1:4445
hydra get oauth2-client <client-id> --endpoint http://127.0.0.1:4445
hydra delete oauth2-client <client-id> --endpoint http://127.0.0.1:4445
hydra perform client-credentials --endpoint http://127.0.0.1:4444 --client-id <client-id> --client-secret <secret>
hydra introspect token --endpoint http://127.0.0.1:4445 <jeton>
hydra revoke token --endpoint http://127.0.0.1:4444 --client-id <client-id> --client-secret <secret> <jeton>
```

## Janssen (Gluu Flex)

```bash
sudo systemctl status jans-auth jans-config-api jans-fido2 jans-scim
sudo systemctl restart jans-auth
sudo /opt/jans/bin/jans_cli_tui.py                       # interface texte d'administration
sudo tail -f /opt/jans/jetty/jans-auth/logs/jans-auth.log
curl -s https://id.corp.exemple.fr/jans-auth/sys/health-check
```

## OpenAM (Open Identity Platform)

```bash
docker logs -f openam
curl -s http://openam.corp.exemple.fr:8080/openam/isAlive.jsp
# ssoadm : mot de passe d'amadmin dans un fichier lisible par root seul
printf '%s' "$MDP_AMADMIN" > /root/.amadmin && chmod 400 /root/.amadmin
ssoadm list-realms -u amadmin -f /root/.amadmin -e /
ssoadm list-identities -u amadmin -f /root/.amadmin -e / -t User -x "*"
ssoadm list-agents -u amadmin -f /root/.amadmin -e /
```
