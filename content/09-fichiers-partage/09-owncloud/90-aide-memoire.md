---
title: ownCloud — aide-mémoire des commandes
description: Commandes ownCloud avec exemples — ownCloud Classic (occ : état, maintenance, mise à jour, applications, utilisateurs, groupes, fichiers, configuration, tâches de fond) et ownCloud Infinite Scale (oCIS : init, server, variables d'environnement, conteneur, utilisateurs via l'API Graph, sauvegarde), journaux.
tags: [aide-mémoire, owncloud, occ, ocis, infinite scale, cloud]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|ownCloud]].

## ownCloud Classic (PHP) : occ

```bash
cd /var/www/owncloud
alias occ='sudo -u www-data php /var/www/owncloud/occ'
occ status
occ maintenance:mode --on
occ upgrade
occ maintenance:mode --off
occ app:list
occ market:install calendar          # marketplace
occ user:add --display-name="Alice Martin" --group="reseau" --email=alice.martin@exemple.fr amartin
occ user:list
occ user:resetpassword amartin
occ user:disable bpetit
occ group:add-member --member amartin reseau
occ files:scan --all
occ files:transfer-ownership bpetit amartin
occ config:system:set trusted_domains 1 --value=owncloud.exemple.fr
occ background:cron
occ log:owncloud --level=2
```

## ownCloud Infinite Scale (oCIS, Go)

```bash
ocis init --insecure false                       # génère /etc/ocis/ocis.yaml (mot de passe admin affiché)
OCIS_URL=https://cloud.exemple.fr PROXY_TLS=false ocis server
ocis version
ocis list                                         # services en cours dans le processus unique
```

```bash
docker run -d --name ocis -p 9200:9200 \
  -e OCIS_URL=https://cloud.exemple.fr -e OCIS_INSECURE=false -e PROXY_TLS=false \
  -v /srv/ocis/config:/etc/ocis -v /srv/ocis/data:/var/lib/ocis owncloud/ocis:latest
docker exec -it ocis ocis init
```

### Utilisateurs (API Graph)

```bash
curl -s -u admin:"$MDP" https://cloud.exemple.fr/graph/v1.0/users | jq '.value[].onPremisesSamAccountName'
curl -s -u admin:"$MDP" -X POST https://cloud.exemple.fr/graph/v1.0/users -H "Content-Type: application/json" \
  -d '{"onPremisesSamAccountName":"amartin","displayName":"Alice Martin","mail":"alice.martin@exemple.fr","passwordProfile":{"password":"MotDePasseInitial2026"}}'
```

(En production, oCIS s'appuie de préférence sur un fournisseur d'identité externe OpenID Connect, par exemple [[05-keycloak/01-presentation-installation|Keycloak]].)

### Sauvegarde

```bash
docker stop ocis
tar czf /srv/sauvegardes/ocis-$(date +%F).tar.gz -C /srv/ocis config data
docker start ocis
```
