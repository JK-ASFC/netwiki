---
title: OpenRewrite
description: Refactorisation et migration automatisées du code source avec OpenRewrite (Apache 2.0, Moderne) — recettes déclaratives sur l'arbre syntaxique (Java, Kotlin, Groovy, YAML, XML, Maven, Gradle, propriétés), montée de version Java 8 → 17 → 21, Spring Boot 2 → 3, JUnit 4 → 5, javax → jakarta, correctifs de sécurité ; plugin Maven (rewrite:run, rewrite:dryRun, rewrite:discover), plugin Gradle, recettes YAML personnalisées et licences des recettes.
tags: [openrewrite, refactorisation, migration, java, maven, gradle, spring boot]
icon: wand-sparkles
---

**OpenRewrite** transforme le code source par **recettes** : chaque recette parcourt l'arbre syntaxique sans perte (mise en forme et commentaires conservés) et produit un changement relisible. Là où [[01-renovate-dependabot|Renovate]] change un numéro de version, OpenRewrite adapte **le code** à la nouvelle version (API renommées, annotations, paquets `javax` → `jakarta`).

Recettes courantes (les identifiants complets se trouvent dans le catalogue des recettes) :

| Objectif | Recette | Artefact |
| --- | --- | --- |
| Java 21 | `org.openrewrite.java.migrate.UpgradeToJava21` | `org.openrewrite.recipe:rewrite-migrate-java` |
| Java 17 | `org.openrewrite.java.migrate.UpgradeToJava17` | `rewrite-migrate-java` |
| JUnit 4 → 5 | `org.openrewrite.java.testing.junit5.JUnit4to5Migration` | `rewrite-testing-frameworks` |
| javax → jakarta | `org.openrewrite.java.migrate.jakarta.JavaxMigrationToJakarta` | `rewrite-migrate-java` |
| Imports inutiles, mise en forme | `org.openrewrite.java.RemoveUnusedImports`, `org.openrewrite.java.format.AutoFormat` | intégrées |

Le moteur et les recettes de base sont sous **Apache 2.0** ; certaines recettes avancées (Spring Boot notamment) sont publiées par Moderne sous une licence *source available* : vérifier la licence de l'artefact avant usage commercial.

## Maven (sans modifier le pom)

```bash
mvn -U org.openrewrite.maven:rewrite-maven-plugin:run \
  -Drewrite.recipeArtifactCoordinates=org.openrewrite.recipe:rewrite-migrate-java:RELEASE \
  -Drewrite.activeRecipes=org.openrewrite.java.migrate.UpgradeToJava21
# aperçu sans modifier : remplacer « run » par « dryRun » → target/rewrite/rewrite.patch
# lister les recettes disponibles : …:rewrite-maven-plugin:discover
```

## Gradle

```kotlin
// build.gradle.kts
plugins { id("org.openrewrite.rewrite") version "7.+" }       // fixer la version en production
rewrite { activeRecipe("org.openrewrite.java.migrate.UpgradeToJava21") }
dependencies { rewrite("org.openrewrite.recipe:rewrite-migrate-java:latest.release") }
```

```bash
./gradlew rewriteDryRun        # build/reports/rewrite/rewrite.patch
./gradlew rewriteRun
```

## Recette personnalisée (rewrite.yml à la racine)

```yaml
type: specs.openrewrite.org/v1beta/recipe
name: fr.corp.MigrationInterne
displayName: Migration des bibliothèques internes
recipeList:
  - org.openrewrite.java.ChangePackage:
      oldPackageName: fr.corp.ancien.util
      newPackageName: fr.corp.commun.util
  - org.openrewrite.maven.UpgradeDependencyVersion:
      groupId: fr.corp
      artifactId: commun-util
      newVersion: 3.x
```

Puis `-Drewrite.activeRecipes=fr.corp.MigrationInterne`. Toujours partir d'une branche propre, examiner le correctif (`dryRun`), compiler et lancer les tests avant de fusionner.

Commandes : [[90-aide-memoire|aide-mémoire]].
