---
title: Kanidm — aide-mémoire des commandes
description: Commandes Kanidm avec exemples — serveur (recover-account, database backup/restore, healthcheck), client kanidm (login, person, group, posix, ssh, credential reset, service-account, oauth2, system domain), kanidm-unixd (status, cache), test LDAPS et OIDC.
tags: [aide-mémoire, kanidm, identité, oidc]
icon: terminal
---

Référence rapide ; explications dans [[01-presentation-installation|Kanidm]].

```bash
docker exec -it kanidmd kanidmd recover-account idm_admin
docker exec -it kanidmd kanidmd database backup /data/sauvegarde.json
docker exec -it kanidmd kanidmd healthcheck
kanidm login -D idm_admin ; kanidm logout
kanidm person list -D idm_admin ; kanidm person get alice -D idm_admin
kanidm person create bob "Bob Durand" -D idm_admin
kanidm person update bob --mail bob@corp.exemple.fr -D idm_admin
kanidm person credential create-reset-token bob 86400 -D idm_admin
kanidm person posix set bob --gidnumber 10002 --shell /bin/bash -D idm_admin
kanidm person ssh list-publickeys bob -D idm_admin
kanidm group list -D idm_admin ; kanidm group list-members admins-linux -D idm_admin
kanidm service-account create svc-backup "Sauvegarde" idm_admin -D idm_admin
kanidm service-account api-token generate svc-backup "jeton-sauvegarde" -D idm_admin
kanidm system oauth2 list -D idm_admin ; kanidm system oauth2 get grafana -D idm_admin
kanidm system domain show -D admin
kanidm_unixd_status ; kanidm-unix status ; sudo kanidm-unix cache-clear
ldapsearch -H ldaps://idm.corp.exemple.fr -x -b "dc=idm,dc=corp,dc=exemple,dc=fr" "(name=alice)"
curl -s https://idm.corp.exemple.fr/status
```
