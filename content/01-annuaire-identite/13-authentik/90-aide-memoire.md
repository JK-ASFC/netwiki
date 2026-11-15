---
title: authentik — aide-mémoire des commandes
description: Référence complète des commandes authentik avec exemples — installation Docker Compose (fichier officiel, secrets PG_PASS et AUTHENTIK_SECRET_KEY, configuration .env, messagerie, ports), Kubernetes (Helm), assistant de première configuration, commandes ak (lien de récupération, changement de mot de passe, test de messagerie, blueprints, santé), API REST v3 avec jeton (utilisateurs, mot de passe, groupes et appartenance, applications, fournisseurs, avant-postes, informations système), avant-postes LDAP et proxy hors du serveur, points de terminaison OIDC et SAML, sauvegarde et restauration PostgreSQL et médias, mise à jour et journaux.
tags: [aide-mémoire, authentik, sso, idp, oidc, saml, ldap, docker compose, api]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|authentik]] et [[03-interface-graphique|interface graphique]]. Exemples : installation dans `/opt/authentik`, URL `https://sso.corp.exemple.fr`, application `grafana`.

## Installation (Docker Compose)

```bash
sudo mkdir -p /opt/authentik && cd /opt/authentik
sudo wget -O docker-compose.yml https://goauthentik.io/docker-compose.yml
echo "PG_PASS=$(openssl rand -base64 36 | tr -d '\n')" | sudo tee .env
echo "AUTHENTIK_SECRET_KEY=$(openssl rand -base64 60 | tr -d '\n')" | sudo tee -a .env
sudo chmod 600 .env
```

```text /opt/authentik/.env (suite)
AUTHENTIK_ERROR_REPORTING__ENABLED=false
COMPOSE_PORT_HTTP=9000
COMPOSE_PORT_HTTPS=9443
AUTHENTIK_EMAIL__HOST=smtp.corp.exemple.fr
AUTHENTIK_EMAIL__PORT=587
AUTHENTIK_EMAIL__USE_TLS=true
AUTHENTIK_EMAIL__USERNAME=authentik
AUTHENTIK_EMAIL__PASSWORD=MotDePasseSmtp
AUTHENTIK_EMAIL__FROM=authentik@corp.exemple.fr
```

```bash
sudo docker compose pull
sudo docker compose up -d
sudo docker compose ps
sudo docker compose logs -f server worker
# Premier accès : créer le compte akadmin
#   https://sso.corp.exemple.fr/if/flow/initial-setup/
```

Les variables `AUTHENTIK_…` suivent la structure de la configuration : un double tiret bas sépare les niveaux (`email.host` → `AUTHENTIK_EMAIL__HOST`).

### Kubernetes (Helm)

```bash
helm repo add authentik https://charts.goauthentik.io
helm repo update
helm upgrade --install authentik authentik/authentik --namespace authentik --create-namespace -f valeurs-authentik.yaml
kubectl -n authentik get pods
kubectl -n authentik logs deploy/authentik-worker -f
```

## Commandes ak (dans le conteneur worker)

```bash
cd /opt/authentik
sudo docker compose exec worker ak create_recovery_key 10 akadmin         # lien de récupération (10 ans) : URL à ouvrir dans le navigateur
sudo docker compose exec worker ak changepassword akadmin
sudo docker compose exec worker ak test_email alice.martin@exemple.fr     # vérifier la messagerie
sudo docker compose exec worker ak apply_blueprint /blueprints/entreprise/applications.yaml
sudo docker compose exec server ak healthcheck
sudo docker compose exec worker ak dump_config                            # configuration effective
```

## API REST v3

Créer un jeton : *Interface d'administration → Répertoire → Jetons et mots de passe d'application* (type *API*), puis `export AK_TOKEN=…`.

```bash
API=https://sso.corp.exemple.fr/api/v3
H="Authorization: Bearer $AK_TOKEN"

# Utilisateurs
curl -s -H "$H" "$API/core/users/?search=martin" | jq '.results[] | {pk, username, email, is_active}'
curl -s -H "$H" -H "Content-Type: application/json" -X POST "$API/core/users/" -d '{"username":"amartin","name":"Alice Martin","email":"alice.martin@exemple.fr","is_active":true,"path":"users"}' | jq .pk
curl -s -H "$H" -H "Content-Type: application/json" -X POST "$API/core/users/42/set_password/" -d '{"password":"Provisoire-2026-Long"}'
curl -s -H "$H" -H "Content-Type: application/json" -X PATCH "$API/core/users/42/" -d '{"is_active":false}'

# Groupes et appartenance
curl -s -H "$H" "$API/core/groups/?search=reseau" | jq '.results[] | {pk, name}'
curl -s -H "$H" -H "Content-Type: application/json" -X POST "$API/core/groups/" -d '{"name":"reseau"}' | jq .pk
curl -s -H "$H" -H "Content-Type: application/json" -X POST "$API/core/groups/<uuid-groupe>/add_user/" -d '{"pk":42}'
curl -s -H "$H" -H "Content-Type: application/json" -X POST "$API/core/groups/<uuid-groupe>/remove_user/" -d '{"pk":42}'

# Applications, fournisseurs, avant-postes, état du système
curl -s -H "$H" "$API/core/applications/" | jq '.results[] | {name, slug, provider}'
curl -s -H "$H" "$API/providers/oauth2/" | jq '.results[] | {pk, name, client_id}'
curl -s -H "$H" "$API/outposts/instances/" | jq '.results[] | {name, type}'
curl -s -H "$H" "$API/admin/system/" | jq '{runtime, server_time}'
curl -s -H "$H" "$API/admin/version/" | jq .
```

Le schéma complet de l'API est consultable sur `https://sso.corp.exemple.fr/api/v3/` (interface interactive).

## Avant-postes LDAP et proxy (hors du serveur)

Créer l'avant-poste dans *Applications → Avant-postes* (type *LDAP* ou *Proxy*, intégration *manuelle*), copier son jeton, puis le lancer sur l'hôte voulu :

```yaml compose.yaml (avant-poste LDAP)
services:
  authentik-ldap:
    image: ghcr.io/goauthentik/ldap
    restart: unless-stopped
    ports:
      - "389:3389"
      - "636:6636"
    environment:
      AUTHENTIK_HOST: https://sso.corp.exemple.fr
      AUTHENTIK_INSECURE: "false"
      AUTHENTIK_TOKEN: "jeton-de-l-avant-poste"
```

```bash
ldapsearch -x -H ldap://authentik-ldap.corp.exemple.fr:389 -D "cn=svc-ldap,ou=users,dc=ldap,dc=goauthentik,dc=io" -W -b "dc=ldap,dc=goauthentik,dc=io" "(cn=amartin)"
ldapsearch -x -H ldap://authentik-ldap.corp.exemple.fr:389 -D "cn=svc-ldap,ou=users,dc=ldap,dc=goauthentik,dc=io" -W -b "ou=groups,dc=ldap,dc=goauthentik,dc=io" "(objectClass=group)" cn member
```

L'avant-poste *Proxy* utilise l'image `ghcr.io/goauthentik/proxy` (ports 9000 et 9443) avec les mêmes variables.

## Points de terminaison OIDC et SAML

```bash
curl -s https://sso.corp.exemple.fr/application/o/grafana/.well-known/openid-configuration | jq '.issuer, .authorization_endpoint, .token_endpoint, .jwks_uri'
curl -s https://sso.corp.exemple.fr/application/o/grafana/jwks/ | jq '.keys[] | {kid, alg}'
# Jeton machine-à-machine (client confidentiel, compte de service)
curl -s -d grant_type=client_credentials -d client_id="$CLIENT_ID" -d client_secret="$CLIENT_SECRET" -d scope=openid https://sso.corp.exemple.fr/application/o/token/ | jq .
# Métadonnées d'un fournisseur SAML
curl -s "https://sso.corp.exemple.fr/api/v3/providers/saml/<pk>/metadata/?download" -H "$H" -o metadata-idp.xml
```

## Sauvegarde, mise à jour, journaux

```bash
cd /opt/authentik
# Base PostgreSQL et fichiers téléversés (icônes, modèles)
sudo docker compose exec -T postgresql pg_dump -U authentik -d authentik -Fc > /srv/sauvegardes/authentik-$(date +%F).dump
sudo tar czf /srv/sauvegardes/authentik-medias-$(date +%F).tar.gz media custom-templates .env
# Restauration
cat /srv/sauvegardes/authentik-2026-11-15.dump | sudo docker compose exec -T postgresql pg_restore -U authentik -d authentik --clean

# Mise à jour : nouvelle version du fichier Compose (ou AUTHENTIK_TAG dans .env), puis
sudo docker compose pull && sudo docker compose up -d
sudo docker compose logs --since 10m server worker | grep -E "ERROR|WARNING"
sudo docker compose logs -f server | grep -E "event|login_failed"
```
