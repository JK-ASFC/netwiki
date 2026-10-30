---
title: Forgejo — aide-mémoire des commandes
description: Commandes Forgejo avec exemples — commande forgejo admin (utilisateurs, authentification, régénération), forgejo doctor, sauvegarde (forgejo dump), Docker, Forgejo Actions (forgejo-runner register et daemon), API compatible Gitea, migration depuis Gitea, mises à jour.
tags: [aide-mémoire, forgejo, forge, git, forgejo-runner, actions]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Forgejo]]. Forgejo est issu de Gitea : la plupart des commandes de [[03-gitea/90-aide-memoire|Gitea]] s'appliquent en remplaçant `gitea` par `forgejo`.

```bash
F="sudo -u git forgejo --config /etc/forgejo/app.ini"
```

## Administration

```bash
$F admin user create --username amartin --email alice.martin@exemple.fr --random-password --must-change-password
$F admin user list --admin
$F admin user change-password --username amartin --password 'NouveauMotDePasse2026'
$F admin auth list
$F admin regenerate hooks
$F doctor check --all
$F dump -f /srv/sauvegardes/forgejo-$(date +%F).zip
forgejo --version
```

## Docker

```bash
docker exec -it -u git forgejo forgejo admin user list
docker compose pull && docker compose up -d          # mise à jour (lire les notes de version)
```

## Forgejo Actions

```bash
forgejo-runner register --no-interactive --instance https://forge.exemple.fr --token "$JETON_RUNNER" --name runner-paris --labels docker:docker://node:20-bookworm
forgejo-runner generate-config > config.yml
forgejo-runner daemon --config config.yml
```

## API

```bash
curl -s -H "Authorization: token $JETON" https://forge.exemple.fr/api/v1/version
curl -s -H "Authorization: token $JETON" "https://forge.exemple.fr/api/v1/orgs/reseau/repos" | jq '.[].name'
```

## Migration depuis Gitea

Remplacement du binaire (ou de l'image) en conservant `app.ini`, les données et la base, dans les limites de versions compatibles documentées par Forgejo ; sauvegarde complète (`gitea dump`) au préalable.
