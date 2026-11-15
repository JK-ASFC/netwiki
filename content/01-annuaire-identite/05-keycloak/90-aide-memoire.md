---
title: Keycloak — aide-mémoire des commandes
description: Référence complète des commandes Keycloak avec exemples — installation (archive, Java 21, service systemd, keycloak.conf, TLS, conteneur et Docker Compose avec PostgreSQL), kc.sh (start-dev, build, start --optimized, show-config, export, import, bootstrap-admin), administration en CLI avec kcadm.sh (connexion par mot de passe ou compte de service, royaumes, événements et audit, protection contre la force brute et déverrouillage, politique de mots de passe, OTP, SMTP, clés de signature, utilisateurs, actions requises, attributs, groupes, rôles de royaume et de client, clients OIDC et SAML, mappeurs de groupes, comptes de service, secrets, sessions et révocation, fédération LDAP et fournisseurs d'identité), API REST avec curl et jq (export partiel), points de terminaison OIDC (découverte, jeton, introspection, userinfo, déconnexion, décodage d'un JWT), santé, métriques, journaux, sauvegarde PostgreSQL et mise à jour.
tags: [aide-mémoire, keycloak, kcadm, kc.sh, oidc, saml, sso, iam, jwt]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Keycloak]], [[02-federation-clients-mfa|fédération, clients et MFA]] et [[03-exploitation-depannage|exploitation et dépannage]]. Exemples : installation dans `/opt/keycloak`, URL `https://sso.exemple.fr`, royaume `entreprise`, client `intranet`.

> [!TIP]
> Les commandes `kcadm.sh` qui visent un objet par son identifiant interne (`<id-client>`, `<id-utilisateur>`, `<id-groupe>`) le récupèrent d'abord avec `--fields id --format csv --noquotes`, par exemple : `ID_UTIL=$(kcadm.sh get users -r entreprise -q username=amartin --fields id --format csv --noquotes)`.

## Installation

```bash
# Java 21 et compte de service
sudo apt install openjdk-21-jre-headless          # Debian / Ubuntu
sudo dnf install java-21-openjdk-headless         # RHEL / Rocky
sudo useradd --system --home-dir /opt/keycloak --shell /usr/sbin/nologin keycloak

# Archive (remplacer 26.0.7 par la version voulue)
curl -LO https://github.com/keycloak/keycloak/releases/download/26.0.7/keycloak-26.0.7.tar.gz
sudo tar -xzf keycloak-26.0.7.tar.gz -C /opt && sudo ln -sfn /opt/keycloak-26.0.7 /opt/keycloak
sudo chown -R keycloak:keycloak /opt/keycloak-26.0.7
```

```ini /opt/keycloak/conf/keycloak.conf
db=postgres
db-url=jdbc:postgresql://srv-db.exemple.fr:5432/keycloak
db-username=keycloak
db-password=MotDePasseBase
hostname=https://sso.exemple.fr
proxy-headers=xforwarded
http-enabled=true
http-port=8080
health-enabled=true
metrics-enabled=true
# TLS directement sur Keycloak (sans mandataire) :
# https-certificate-file=/etc/keycloak/tls/sso.crt
# https-certificate-key-file=/etc/keycloak/tls/sso.key
```

```ini /etc/systemd/system/keycloak.service
[Unit]
Description=Keycloak
After=network-online.target
Wants=network-online.target

[Service]
User=keycloak
Group=keycloak
Environment=JAVA_OPTS_KC_HEAP=-XX:MaxRAMPercentage=70
ExecStart=/opt/keycloak/bin/kc.sh start --optimized
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```bash
sudo -u keycloak /opt/keycloak/bin/kc.sh build      # après chaque changement d'option de construction (db, features…)
sudo systemctl daemon-reload && sudo systemctl enable --now keycloak
sudo journalctl -u keycloak -f
```

### Conteneur

```bash
docker run -d --name keycloak -p 8080:8080 -e KC_BOOTSTRAP_ADMIN_USERNAME=admin -e KC_BOOTSTRAP_ADMIN_PASSWORD='MotDePasseTemporaire' quay.io/keycloak/keycloak:26.0 start-dev
```

```yaml compose.yaml
services:
  postgres:
    image: postgres:17
    environment:
      POSTGRES_DB: keycloak
      POSTGRES_USER: keycloak
      POSTGRES_PASSWORD: MotDePasseBase
    volumes:
      - pgdata:/var/lib/postgresql/data
  keycloak:
    image: quay.io/keycloak/keycloak:26.0
    command: start
    environment:
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://postgres:5432/keycloak
      KC_DB_USERNAME: keycloak
      KC_DB_PASSWORD: MotDePasseBase
      KC_HOSTNAME: https://sso.exemple.fr
      KC_PROXY_HEADERS: xforwarded
      KC_HTTP_ENABLED: "true"
      KC_HEALTH_ENABLED: "true"
      KC_BOOTSTRAP_ADMIN_USERNAME: admin
      KC_BOOTSTRAP_ADMIN_PASSWORD: MotDePasseTemporaire
    ports:
      - "8080:8080"
      - "9000:9000"
    depends_on:
      - postgres
volumes:
  pgdata:
```

## kc.sh

```bash
/opt/keycloak/bin/kc.sh --help
/opt/keycloak/bin/kc.sh start --help              # toutes les options de démarrage
/opt/keycloak/bin/kc.sh start-dev --http-port 8080                  # développement (HTTP, base H2)
/opt/keycloak/bin/kc.sh build --db=postgres --health-enabled=true --metrics-enabled=true
/opt/keycloak/bin/kc.sh start --optimized
/opt/keycloak/bin/kc.sh show-config               # configuration effective (sources : conf, variables, options)

# Premier administrateur : variables lues au tout premier démarrage
export KC_BOOTSTRAP_ADMIN_USERNAME=admin KC_BOOTSTRAP_ADMIN_PASSWORD='MotDePasseTemporaire'
# Administrateur temporaire de secours (accès perdu), serveur arrêté
export PASS_SECOURS='MotDePasseDeSecoursLong'
/opt/keycloak/bin/kc.sh bootstrap-admin user --username admin-secours --password:env PASS_SECOURS

# Export et import (de préférence serveur arrêté)
/opt/keycloak/bin/kc.sh export --dir /srv/keycloak-export --realm entreprise --users realm_file
/opt/keycloak/bin/kc.sh export --file /srv/entreprise.json --realm entreprise
/opt/keycloak/bin/kc.sh import --dir /srv/keycloak-export
/opt/keycloak/bin/kc.sh import --file /srv/entreprise.json --override false
/opt/keycloak/bin/kc.sh start --import-realm      # importe les fichiers de data/import au démarrage
```

## kcadm.sh : connexion

```bash
export PATH=$PATH:/opt/keycloak/bin
kcadm.sh config credentials --server https://sso.exemple.fr --realm master --user admin            # mot de passe demandé
kcadm.sh config credentials --server https://sso.exemple.fr --realm master --client automatisation --secret "$SECRET"   # compte de service
kcadm.sh get serverinfo --fields systemInfo
```

## Royaumes, sécurité, événements

```bash
kcadm.sh create realms -s realm=entreprise -s enabled=true -s displayName="Entreprise"
kcadm.sh get realms --fields realm,enabled
kcadm.sh get realms/entreprise --fields id,sslRequired,bruteForceProtected,passwordPolicy

# Politique de mots de passe, inscription libre désactivée, HTTPS exigé
kcadm.sh update realms/entreprise -s registrationAllowed=false -s sslRequired=external -s 'passwordPolicy="length(12) and upperCase(1) and digits(1) and notUsername and passwordHistory(10)"'

# Protection contre la force brute
kcadm.sh update realms/entreprise -s bruteForceProtected=true -s failureFactor=5 -s waitIncrementSeconds=60 -s maxFailureWaitSeconds=900
kcadm.sh get attack-detection/brute-force/users/$ID_UTIL -r entreprise
kcadm.sh delete attack-detection/brute-force/users/$ID_UTIL -r entreprise       # déverrouiller

# Événements de connexion et d'administration (conservés 30 jours)
kcadm.sh update realms/entreprise -s eventsEnabled=true -s eventsExpiration=2592000 -s adminEventsEnabled=true -s adminEventsDetailsEnabled=true -s 'eventsListeners=["jboss-logging"]'
kcadm.sh get events -r entreprise --limit 20
kcadm.sh get events -r entreprise -q type=LOGIN_ERROR --limit 20
kcadm.sh get admin-events -r entreprise --limit 20

# OTP et action requise par défaut
kcadm.sh update realms/entreprise -s otpPolicyType=totp -s otpPolicyDigits=6 -s otpPolicyPeriod=30 -s otpPolicyAlgorithm=HmacSHA1
kcadm.sh update authentication/required-actions/CONFIGURE_TOTP -r entreprise -s defaultAction=true

# Serveur de messagerie (réinitialisation de mot de passe, vérification d'adresse)
kcadm.sh update realms/entreprise -s 'smtpServer.host=smtp.exemple.fr' -s 'smtpServer.port=587' -s 'smtpServer.from=sso@exemple.fr' -s 'smtpServer.starttls=true' -s 'smtpServer.auth=true' -s 'smtpServer.user=sso' -s 'smtpServer.password=MotDePasseSmtp'

# Clés de signature : nouvelle clé RSA prioritaire (l'ancienne reste pour vérifier les jetons en cours)
REALM_ID=$(kcadm.sh get realms/entreprise --fields id --format csv --noquotes)
kcadm.sh create components -r entreprise -s name=rsa-2026 -s providerId=rsa-generated -s providerType=org.keycloak.keys.KeyProvider -s parentId=$REALM_ID -s 'config.priority=["200"]' -s 'config.keySize=["3072"]'
kcadm.sh get keys -r entreprise
```

## Utilisateurs

```bash
kcadm.sh create users -r entreprise -s username=amartin -s email=alice.martin@exemple.fr -s firstName=Alice -s lastName=Martin -s enabled=true -s emailVerified=true
kcadm.sh set-password -r entreprise --username amartin --new-password 'Provisoire2026!' --temporary
kcadm.sh get users -r entreprise -q username=amartin
kcadm.sh get users -r entreprise -q search=martin --fields username,email,enabled
kcadm.sh get users/count -r entreprise
ID_UTIL=$(kcadm.sh get users -r entreprise -q username=amartin --fields id --format csv --noquotes)
kcadm.sh update users/$ID_UTIL -r entreprise -s 'attributes.service=["reseau"]'
kcadm.sh update users/$ID_UTIL -r entreprise -s 'requiredActions=["UPDATE_PASSWORD","CONFIGURE_TOTP"]'
kcadm.sh update users/$ID_UTIL -r entreprise -s enabled=false
kcadm.sh get users/$ID_UTIL/credentials -r entreprise                       # mot de passe, OTP enregistrés
kcadm.sh delete users/$ID_UTIL -r entreprise
```

## Groupes et rôles

```bash
kcadm.sh create groups -r entreprise -s name=reseau
GID=$(kcadm.sh get groups -r entreprise -q search=reseau --fields id --format csv --noquotes)
kcadm.sh create groups/$GID/children -r entreprise -s name=reseau-paris
kcadm.sh update users/$ID_UTIL/groups/$GID -r entreprise -s realm=entreprise -s userId=$ID_UTIL -s groupId=$GID -n    # ajouter au groupe
kcadm.sh delete users/$ID_UTIL/groups/$GID -r entreprise
kcadm.sh get groups/$GID/members -r entreprise --fields username

kcadm.sh create roles -r entreprise -s name=admin-reseau -s 'description=Administrateurs réseau'
kcadm.sh add-roles -r entreprise --uusername amartin --rolename admin-reseau
kcadm.sh add-roles -r entreprise --gname reseau --rolename admin-reseau
kcadm.sh add-roles -r entreprise --uusername amartin --cclientid intranet --rolename lecteur
kcadm.sh remove-roles -r entreprise --uusername amartin --rolename admin-reseau
kcadm.sh get-roles -r entreprise --uusername amartin
kcadm.sh get-roles -r entreprise --uusername amartin --effective
```

## Clients

```bash
# Client OIDC confidentiel (flux code d'autorisation)
kcadm.sh create clients -r entreprise -s clientId=intranet -s protocol=openid-connect -s publicClient=false -s standardFlowEnabled=true -s directAccessGrantsEnabled=false -s 'redirectUris=["https://intranet.exemple.fr/*"]' -s 'webOrigins=["https://intranet.exemple.fr"]'
CID=$(kcadm.sh get clients -r entreprise -q clientId=intranet --fields id --format csv --noquotes)
kcadm.sh get clients/$CID/client-secret -r entreprise
kcadm.sh create clients/$CID/client-secret -r entreprise                # régénérer le secret

# Revendication « groups » dans les jetons
kcadm.sh create clients/$CID/protocol-mappers/models -r entreprise -s name=groupes -s protocol=openid-connect -s protocolMapper=oidc-group-membership-mapper -s 'config."claim.name"=groups' -s 'config."full.path"=false' -s 'config."id.token.claim"=true' -s 'config."access.token.claim"=true' -s 'config."userinfo.token.claim"=true'

# Client machine-à-machine (compte de service) avec droit de lecture des utilisateurs
kcadm.sh create clients -r entreprise -s clientId=automatisation -s publicClient=false -s serviceAccountsEnabled=true -s standardFlowEnabled=false
kcadm.sh add-roles -r entreprise --uusername service-account-automatisation --cclientid realm-management --rolename view-users

# Client SAML : console, Clients → Import client → fichier de métadonnées du fournisseur de service

kcadm.sh get clients -r entreprise --fields clientId,protocol,enabled
kcadm.sh get client-scopes -r entreprise --fields name,protocol
```

## Sessions et révocation

```bash
kcadm.sh get users/$ID_UTIL/sessions -r entreprise
kcadm.sh create users/$ID_UTIL/logout -r entreprise                         # fermer toutes ses sessions
kcadm.sh get clients/$CID/user-sessions -r entreprise --fields username,ipAddress,start
kcadm.sh create logout-all -r entreprise                                # toutes les sessions du royaume
kcadm.sh create push-revocation -r entreprise                           # notifier les clients (not-before)
```

## Fédération LDAP / AD et fournisseurs d'identité

```bash
kcadm.sh get components -r entreprise -q type=org.keycloak.storage.UserStorageProvider --fields id,name
LDAP_ID=$(kcadm.sh get components -r entreprise -q type=org.keycloak.storage.UserStorageProvider --fields id --format csv --noquotes)
kcadm.sh create user-storage/$LDAP_ID/sync?action=triggerFullSync -r entreprise
kcadm.sh create user-storage/$LDAP_ID/sync?action=triggerChangedUsersSync -r entreprise
kcadm.sh get identity-provider/instances -r entreprise --fields alias,providerId,enabled
kcadm.sh get identity-provider/instances/entra-id -r entreprise
```

## API REST (curl et jq)

```bash
TOKEN=$(curl -s -d client_id=admin-cli -d username=admin -d password="$MDP" -d grant_type=password https://sso.exemple.fr/realms/master/protocol/openid-connect/token | jq -r .access_token)
curl -s -H "Authorization: Bearer $TOKEN" "https://sso.exemple.fr/admin/realms/entreprise/users?max=10" | jq '.[].username'
curl -s -H "Authorization: Bearer $TOKEN" "https://sso.exemple.fr/admin/realms/entreprise/users/count"
# Export partiel à chaud (clients, groupes et rôles ; secrets masqués)
curl -s -X POST -H "Authorization: Bearer $TOKEN" "https://sso.exemple.fr/admin/realms/entreprise/partial-export?exportClients=true&exportGroupsAndRoles=true" -o entreprise-partiel.json
```

## Points de terminaison OIDC

```bash
B=https://sso.exemple.fr/realms/entreprise/protocol/openid-connect
curl -s https://sso.exemple.fr/realms/entreprise/.well-known/openid-configuration | jq '.issuer, .authorization_endpoint, .token_endpoint, .jwks_uri'
curl -s $B/certs | jq '.keys[] | {kid, alg, use}'

# Jeton machine-à-machine
curl -s -d grant_type=client_credentials -d client_id=automatisation -d client_secret="$SECRET" $B/token | jq .

# Jeton d'un utilisateur pour un test (le client doit autoriser « Direct access grants »)
ACCESS=$(curl -s -d grant_type=password -d client_id=test-cli -d username=amartin -d password="$MDP_ALICE" -d scope=openid $B/token | jq -r .access_token)
curl -s -H "Authorization: Bearer $ACCESS" $B/userinfo | jq .

# Introspection (validité d'un jeton, par un client confidentiel)
curl -s -u intranet:"$SECRET_INTRANET" -d token="$ACCESS" $B/token/introspect | jq '.active, .exp, .preferred_username'

# Décoder la charge utile d'un JWT (sans vérifier la signature)
P=$(printf '%s' "$ACCESS" | cut -d. -f2 | tr '_-' '/+'); while [ $(( ${#P} % 4 )) -ne 0 ]; do P="$P="; done; printf '%s' "$P" | base64 -d | jq .

# Métadonnées SAML du royaume
curl -s https://sso.exemple.fr/realms/entreprise/protocol/saml/descriptor
```

## Santé, métriques, journaux

```bash
curl -s http://localhost:9000/health/live
curl -s http://localhost:9000/health/ready | jq .
curl -s http://localhost:9000/metrics | grep -E "^keycloak_|^http_server_requests" | head
/opt/keycloak/bin/kc.sh start --optimized --log=console,file --log-file=/var/log/keycloak/keycloak.log --log-level=INFO,org.keycloak.events:DEBUG
sudo journalctl -u keycloak --since "1 hour ago" | grep -E "ERROR|WARN|type=LOGIN_ERROR"
```

## Sauvegarde et mise à jour

```bash
# La base contient toute la configuration : la sauvegarder suffit (plus un export de royaume pour l'archive)
pg_dump -h srv-db.exemple.fr -U keycloak -Fc keycloak > /srv/sauvegardes/keycloak-$(date +%F).dump
pg_restore -h srv-db.exemple.fr -U keycloak -d keycloak --clean /srv/sauvegardes/keycloak-2026-11-15.dump

# Mise à jour : sauvegarde, nouvelle version, reconstruction, démarrage (la base est migrée au démarrage)
sudo systemctl stop keycloak
sudo tar -xzf keycloak-26.1.0.tar.gz -C /opt
sudo cp /opt/keycloak/conf/keycloak.conf /opt/keycloak-26.1.0/conf/
sudo cp -r /opt/keycloak/providers/. /opt/keycloak-26.1.0/providers/
sudo chown -R keycloak:keycloak /opt/keycloak-26.1.0 && sudo ln -sfn /opt/keycloak-26.1.0 /opt/keycloak
sudo -u keycloak /opt/keycloak/bin/kc.sh build && sudo systemctl start keycloak
```
