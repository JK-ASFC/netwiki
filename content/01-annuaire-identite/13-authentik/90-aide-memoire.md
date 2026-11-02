---
title: Authentik — aide-mémoire des commandes
description: Commandes Authentik avec exemples — Docker Compose (démarrage, mise à jour, journaux), commandes ak (create_recovery_key, changepassword, healthcheck, blueprints), sauvegarde et restauration PostgreSQL, API REST avec jeton (curl), découverte OIDC, test LDAP de l'avant-poste.
tags: [aide-mémoire, authentik, sso, oidc]
icon: terminal
---

Référence rapide ; explications dans [[01-presentation-installation|Authentik]].

```bash
cd /opt/authentik
docker compose up -d ; docker compose ps ; docker compose logs -f server worker
docker compose pull && docker compose up -d                    # après changement de version
docker compose exec worker ak create_recovery_key 10 akadmin    # lien de récupération valable 10 ans → URL à ouvrir
docker compose exec worker ak changepassword akadmin
docker compose exec server ak healthcheck
docker compose exec postgresql pg_dump -U authentik -d authentik -Fc > authentik-$(date +%F).dump
cat authentik-2026-11-02.dump | docker compose exec -T postgresql pg_restore -U authentik -d authentik --clean
curl -s -H "Authorization: Bearer $AK_TOKEN" https://sso.corp.exemple.fr/api/v3/core/users/?search=alice | jq '.results[].username'
curl -s https://sso.corp.exemple.fr/application/o/grafana/.well-known/openid-configuration | jq .issuer
ldapsearch -x -H ldap://authentik-ldap.corp.exemple.fr:3389 -D "cn=svc-ldap,ou=users,dc=ldap,dc=goauthentik,dc=io" -W -b "dc=ldap,dc=goauthentik,dc=io" "(cn=alice)"
```
