---
title: Renovate, Dependabot et Mend Renovate
description: Mettre à jour automatiquement les dépendances par demandes de fusion — Renovate (AGPL : auto-hébergé sur GitLab, Gitea, Forgejo, Bitbucket, Azure DevOps ou GitHub ; renovate.json, config:recommended, packageRules, regroupement, automerge, tableau de bord des dépendances, CLI npx renovate et image Docker renovate/renovate), Dependabot (service intégré à GitHub : dependabot.yml, écosystèmes, planification, groupes, alertes de sécurité) et Mend Renovate Community Edition (serveur Renovate avec webhooks et file d'attente : ghcr.io/mend, variables MEND_RNV_*), avec bonnes pratiques de fusion automatique.
tags: [renovate, dependabot, mend, dépendances, mises à jour, gitlab, github, ci]
icon: package-check
---

Une dépendance non mise à jour finit par porter une faille connue. Ces robots lisent les fichiers du projet (`package.json`, `pom.xml`, `requirements.txt`, `Dockerfile`, `.gitlab-ci.yml`, charts Helm, modules Terraform…) et ouvrent une **demande de fusion** par mise à jour, que la CI teste avant fusion.

| Outil | Plates-formes | Hébergement | Licence |
| --- | --- | --- | --- |
| **Renovate** | GitLab, GitHub, Gitea, Forgejo, Bitbucket, Azure DevOps, Gerrit | Auto-hébergé (tâche planifiée) ou application GitHub | AGPL 3.0 |
| **Dependabot** | GitHub (et GitHub Enterprise Server) | Service GitHub | Intégré (cœur open source MIT) |
| **Mend Renovate CE/EE** | GitHub, GitLab, Bitbucket | Serveur Docker permanent avec webhooks | Gratuit (CE) sous conditions Mend, clé de licence |

## Renovate auto-hébergé (GitLab, Gitea, Forgejo)

Créer un compte technique `renovate-bot` avec un jeton (portée `api`, `write_repository` sur GitLab), puis lancer Renovate **périodiquement** (tâche planifiée de la CI, cron, CronJob Kubernetes) :

```bash
docker run --rm \
  -e RENOVATE_PLATFORM=gitlab \
  -e RENOVATE_ENDPOINT=https://gitlab.corp.exemple.fr/api/v4 \
  -e RENOVATE_TOKEN=glpat-xxxxxxxx \
  -e RENOVATE_AUTODISCOVER=true -e RENOVATE_AUTODISCOVER_FILTER='infra/*' \
  -e RENOVATE_GITHUB_COM_TOKEN=ghp_xxxx \
  renovate/renovate
# sans Docker : npx renovate --platform=gitea --endpoint=https://git.corp.exemple.fr/api/v1 infra/api
```

(`RENOVATE_GITHUB_COM_TOKEN`, jeton GitHub en lecture seule, évite les limites de requêtes lors de la lecture des notes de version.) Au premier passage, Renovate ouvre une demande « Configure Renovate » qui ajoute `renovate.json` :

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended", ":dependencyDashboard"],
  "timezone": "Europe/Paris",
  "schedule": ["before 7am on monday"],
  "prConcurrentLimit": 5,
  "packageRules": [
    { "matchUpdateTypes": ["minor", "patch"], "matchCurrentVersion": "!/^0/", "automerge": true },
    { "matchPackageNames": ["/^@angular/"], "groupName": "Angular" },
    { "matchDatasources": ["docker"], "pinDigests": true }
  ]
}
```

Le **tableau de bord des dépendances** (ticket ouvert par Renovate) liste les mises à jour en attente et permet d'en forcer une. Une configuration partagée (`"extends": ["local>infra/renovate-config"]`) applique les mêmes règles à tous les dépôts. Valider un fichier : `npx --package renovate renovate-config-validator`.

## Dependabot (GitHub)

Les **alertes** et **mises à jour de sécurité** s'activent dans *Settings → Advanced Security*. Les mises à jour de **version** se décrivent dans `.github/dependabot.yml` :

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      timezone: "Europe/Paris"
    open-pull-requests-limit: 5
    groups:
      dev-dependencies:
        dependency-type: "development"
  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "weekly"
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "monthly"
```

Commandes en commentaire d'une demande : `@dependabot rebase`, `@dependabot recreate`, `@dependabot ignore this major version`. Les registres privés se déclarent dans la section `registries` (identifiants dans les secrets Dependabot).

## Mend Renovate Community Edition

Version **serveur** de Renovate : elle reçoit les **webhooks** de la forge (réaction immédiate à un push ou à une case cochée dans le tableau de bord) et planifie les dépôts dans une file d'attente. Image publiée dans l'espace GHCR `mend` ; clé de licence gratuite demandée sur le site de Mend.

```yaml
services:
  renovate-ce:
    image: ghcr.io/mend/renovate-ce:latest     # fixer une version en production
    restart: unless-stopped
    ports: ["8080:8080"]
    environment:
      MEND_RNV_ACCEPT_TOS: "Y"
      MEND_RNV_LICENSE_KEY: "${MEND_LICENSE}"
      MEND_RNV_PLATFORM: gitlab
      MEND_RNV_ENDPOINT: https://gitlab.corp.exemple.fr/api/v4/
      MEND_RNV_GITLAB_PAT: "${GITLAB_PAT}"
      MEND_RNV_WEBHOOK_SECRET: "${WEBHOOK_SECRET}"
      MEND_RNV_SERVER_PORT: "8080"
      MEND_RNV_SQLITE_FILE_PATH: /db/renovate-ce.sqlite
    volumes: ["renovate-db:/db"]
volumes:
  renovate-db:
```

Déclarer ensuite dans GitLab un webhook vers `https://renovate.corp.exemple.fr/webhook` avec le même secret. Les dépôts gardent leur `renovate.json` habituel. La **CLI** utilisée dans ces conteneurs est le même programme `renovate` que ci-dessus.

## Bonnes pratiques

- Fusion automatique **seulement** pour les correctifs et versions mineures d'un projet bien couvert par les tests ; les versions majeures restent en revue.
- Regrouper les paquets qui évoluent ensemble (monorepos Angular, Spring, AWS SDK) pour limiter le bruit.
- Épingler les images Docker par empreinte (`pinDigests`) : Renovate met alors à jour l'empreinte.
- Compléter par un scanner de vulnérabilités ([[16-chaine-approvisionnement/01-sbom-signature-attestations|Grype]]) : le robot ne connaît que les versions publiées.

Voir aussi : [[02-openrewrite|OpenRewrite]] pour les montées de version qui exigent de modifier le code. Commandes : [[90-aide-memoire|aide-mémoire]].
