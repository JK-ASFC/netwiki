---
title: Dépendances et modernisation — aide-mémoire
description: Commandes Renovate (Docker, npx, variables RENOVATE_*, validation de configuration), Dependabot (dependabot.yml, commandes @dependabot), Mend Renovate CE (variables MEND_RNV_*) et OpenRewrite (Maven run, dryRun, discover ; Gradle rewriteRun).
tags: [aide-mémoire, renovate, dependabot, openrewrite]
icon: terminal
---

Explications : [[01-renovate-dependabot|Renovate, Dependabot et Mend Renovate]] · [[02-openrewrite|OpenRewrite]].

```bash
docker run --rm -e RENOVATE_PLATFORM=gitlab -e RENOVATE_ENDPOINT=https://gitlab.corp.exemple.fr/api/v4 -e RENOVATE_TOKEN=… -e RENOVATE_AUTODISCOVER=true renovate/renovate
npx renovate --platform=gitea --endpoint=https://git.corp.exemple.fr/api/v1 --token=… infra/api
LOG_LEVEL=debug npx renovate --dry-run=full infra/api
npx --package renovate renovate-config-validator
# Dependabot : .github/dependabot.yml ; commentaires @dependabot rebase | recreate | ignore this major version
# Mend Renovate CE : ghcr.io/mend/renovate-ce, MEND_RNV_ACCEPT_TOS, MEND_RNV_LICENSE_KEY, MEND_RNV_PLATFORM, MEND_RNV_ENDPOINT, MEND_RNV_GITLAB_PAT, MEND_RNV_WEBHOOK_SECRET
mvn -U org.openrewrite.maven:rewrite-maven-plugin:dryRun -Drewrite.recipeArtifactCoordinates=org.openrewrite.recipe:rewrite-migrate-java:RELEASE -Drewrite.activeRecipes=org.openrewrite.java.migrate.UpgradeToJava21
mvn -U org.openrewrite.maven:rewrite-maven-plugin:run -Drewrite.recipeArtifactCoordinates=… -Drewrite.activeRecipes=…
./gradlew rewriteDryRun ; ./gradlew rewriteRun
```
