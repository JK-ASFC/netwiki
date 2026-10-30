---
title: Keycloak — aide-mémoire des commandes
description: Commandes Keycloak avec exemples — démarrage (kc.sh start-dev, build, start avec options de production), variables d'environnement, conteneur, administration en CLI (kcadm.sh : config credentials, realms, clients, utilisateurs, groupes, rôles, fournisseurs d'identité), export et import de royaumes, API REST d'administration avec curl et jq, santé et métriques, points de terminaison OpenID Connect utiles.
tags: [aide-mémoire, keycloak, kcadm, oidc, saml, sso]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Keycloak]]. Installation d'exemple dans `/opt/keycloak`.

## Démarrage

```bash
# Développement (HTTP, base H2 intégrée)
/opt/keycloak/bin/kc.sh start-dev --http-port 8080
# Production : construire puis démarrer
/opt/keycloak/bin/kc.sh build --db=postgres --health-enabled=true --metrics-enabled=true
/opt/keycloak/bin/kc.sh start --optimized \
  --hostname=https://sso.exemple.fr --proxy-headers=xforwarded --http-enabled=true \
  --db-url=jdbc:postgresql://db.exemple.fr/keycloak --db-username=keycloak --db-password='MotDePasseBase'
# Premier administrateur (variables lues au premier démarrage)
export KC_BOOTSTRAP_ADMIN_USERNAME=admin KC_BOOTSTRAP_ADMIN_PASSWORD='MotDePasseTemporaire'
# Afficher la configuration effective
/opt/keycloak/bin/kc.sh show-config
# Conteneur
docker run -d --name keycloak -p 8080:8080 -e KC_BOOTSTRAP_ADMIN_USERNAME=admin -e KC_BOOTSTRAP_ADMIN_PASSWORD='MotDePasseTemporaire' quay.io/keycloak/keycloak:26.0 start-dev
```

## kcadm.sh : connexion

```bash
export PATH=$PATH:/opt/keycloak/bin
kcadm.sh config credentials --server https://sso.exemple.fr --realm master --user admin
```

## Royaumes et clients

```bash
kcadm.sh create realms -s realm=entreprise -s enabled=true -s displayName="Entreprise"
kcadm.sh get realms --fields realm,enabled
kcadm.sh update realms/entreprise -s registrationAllowed=false -s bruteForceProtected=true -s 'passwordPolicy="length(12) and notUsername"'
# Client OIDC confidentiel
kcadm.sh create clients -r entreprise -s clientId=intranet -s protocol=openid-connect -s publicClient=false \
  -s 'redirectUris=["https://intranet.exemple.fr/*"]' -s standardFlowEnabled=true
kcadm.sh get clients -r entreprise -q clientId=intranet --fields id,clientId
kcadm.sh get clients/<id-client>/client-secret -r entreprise
```

## Utilisateurs, groupes, rôles

```bash
kcadm.sh create users -r entreprise -s username=amartin -s email=alice.martin@exemple.fr -s firstName=Alice -s lastName=Martin -s enabled=true
kcadm.sh set-password -r entreprise --username amartin --new-password 'Provisoire2026!' --temporary
kcadm.sh get users -r entreprise -q username=amartin
kcadm.sh create groups -r entreprise -s name=reseau
kcadm.sh create roles -r entreprise -s name=admin-reseau
kcadm.sh add-roles -r entreprise --uusername amartin --rolename admin-reseau
kcadm.sh add-roles -r entreprise --uusername amartin --cclientid intranet --rolename lecteur
kcadm.sh get-roles -r entreprise --uusername amartin
# Fermer toutes les sessions d'un utilisateur
kcadm.sh create users/<id-utilisateur>/logout -r entreprise
```

## Fédération et fournisseurs d'identité

```bash
kcadm.sh get components -r entreprise -q type=org.keycloak.storage.UserStorageProvider   # annuaires LDAP/AD
kcadm.sh create user-storage/<id-composant>/sync?action=triggerFullSync -r entreprise     # synchronisation complète
kcadm.sh get identity-provider/instances -r entreprise --fields alias,providerId,enabled
```

## Export / import

```bash
/opt/keycloak/bin/kc.sh export --dir /srv/keycloak-export --realm entreprise --users realm_file
/opt/keycloak/bin/kc.sh import --dir /srv/keycloak-export
# Import automatique au démarrage (fichiers dans data/import)
/opt/keycloak/bin/kc.sh start --import-realm
```

## API REST et OIDC

```bash
TOKEN=$(curl -s -d client_id=admin-cli -d username=admin -d password="$MDP" -d grant_type=password \
  https://sso.exemple.fr/realms/master/protocol/openid-connect/token | jq -r .access_token)
curl -s -H "Authorization: Bearer $TOKEN" https://sso.exemple.fr/admin/realms/entreprise/users?max=10 | jq '.[].username'
# Découverte OIDC (endpoints, clés)
curl -s https://sso.exemple.fr/realms/entreprise/.well-known/openid-configuration | jq '.authorization_endpoint, .token_endpoint, .jwks_uri'
# Jeton client (client credentials)
curl -s -d grant_type=client_credentials -d client_id=intranet -d client_secret="$SECRET" \
  https://sso.exemple.fr/realms/entreprise/protocol/openid-connect/token | jq .
# Métadonnées SAML
curl -s https://sso.exemple.fr/realms/entreprise/protocol/saml/descriptor
```

## Santé et journaux

```bash
curl -s http://localhost:9000/health/ready     # port de gestion (health/metrics)
curl -s http://localhost:9000/metrics | head
/opt/keycloak/bin/kc.sh start --optimized --log-level=INFO,org.keycloak.events:DEBUG
journalctl -u keycloak -f
```
