---
title: Nexus Repository, Artifactory et Verdaccio
description: Dépôts d'artefacts — Sonatype Nexus Repository (Community Edition gratuite avec limites d'usage : Maven, npm, PyPI, NuGet, Docker, apt, yum, raw ; Docker sonatype/nexus3, port 8081, admin.password, dépôts proxy, hébergés et groupes, tâches de nettoyage, sauvegarde), JFrog Artifactory (édition OSS historique, JFrog Container Registry gratuit, offres commerciales) et Verdaccio (MIT : registre npm privé et cache du registre public ; npm install -g verdaccio, port 4873, config.yaml, Docker verdaccio/verdaccio), configuration des clients Maven, npm, pip, NuGet et Docker.
tags: [nexus, artifactory, verdaccio, artefacts, maven, npm, pypi, proxy]
icon: boxes
---

Un **dépôt d'artefacts** met en cache les dépendances publiques (Maven Central, npm, PyPI, NuGet, Docker Hub) et héberge les paquets internes : builds reproductibles, indépendance vis-à-vis d'Internet, contrôle des licences et des vulnérabilités.

| | **Nexus Repository** | **Artifactory** | **Verdaccio** |
| --- | --- | --- | --- |
| Formats | Maven, npm, PyPI, NuGet, Docker, Helm, apt, yum, Go, raw… | Très nombreux | **npm** uniquement |
| Édition gratuite | Community Edition, avec limites d'usage (composants, requêtes) | OSS historique, JFrog Container Registry | Entièrement libre (MIT) |
| Socle | Java, base H2 ou PostgreSQL | Java, PostgreSQL | Node.js |

## Nexus Repository

```bash
docker volume create nexus-data
docker run -d --name nexus -p 127.0.0.1:8081:8081 -v nexus-data:/nexus-data sonatype/nexus3
docker exec nexus cat /nexus-data/admin.password        # mot de passe initial du compte admin
```

Archive pour Linux, Windows et macOS (Java fourni) : extraire, puis `bin/nexus run` (ou installation comme service). Première connexion sur `https://nexus.corp.exemple.fr` : changement du mot de passe `admin`, choix de l'accès anonyme. Les conditions de l'édition Community (plafonds de composants et de requêtes) s'affichent dans l'interface : les vérifier pour un usage important.

Organisation conseillée : un dépôt **proxy** par source publique (`maven-central`, `npm-proxy`, `pypi-proxy`, `docker-hub`), un dépôt **hébergé** par usage interne (`maven-releases`, `npm-interne`), et un **groupe** qui les réunit sous une seule adresse. Tâches planifiées (*Administration → Tasks*) : nettoyage (*Cleanup policies*), compactage du stockage (*Compact blob store*), sauvegarde de la base.

<!-- CAPTURE: Liste des dépôts Nexus (proxy, hébergés, groupes) | _assets/nexus-depots.png -->

Configuration des clients :

```bash
npm config set registry https://nexus.corp.exemple.fr/repository/npm-groupe/
pip config set global.index-url https://nexus.corp.exemple.fr/repository/pypi-groupe/simple
docker login nexus.corp.exemple.fr:8443          # connecteur HTTPS d'un dépôt Docker
```

```xml
<!-- ~/.m2/settings.xml -->
<mirrors><mirror><id>nexus</id><mirrorOf>*</mirrorOf><url>https://nexus.corp.exemple.fr/repository/maven-groupe/</url></mirror></mirrors>
```

Sauvegarde : tâche *Admin - Export databases for backup* puis copie du *blob store* (`/nexus-data/blobs`) au même moment.

## Artifactory

**JFrog Artifactory** gère quasiment tous les formats de paquets, avec réplication et intégration à la chaîne JFrog (Xray pour la sécurité). L'ancienne édition **OSS** (Maven, Gradle, Ivy, générique) n'évolue plus guère ; JFrog propose gratuitement **JFrog Container Registry** (images et charts Helm) et des offres commerciales (Pro, Enterprise) pour le reste. Installation : archive, paquets ou Docker (`releases-docker.jfrog.io/jfrog/artifactory-oss` ou `…/artifactory-jcr`), base PostgreSQL, port 8082. Pour un usage libre multi-formats, Nexus Community Edition est l'alternative la plus courante.

## Verdaccio

```bash
npm install -g verdaccio
verdaccio                                    # http://localhost:4873, configuration ~/.config/verdaccio/config.yaml
docker run -d --name verdaccio -p 127.0.0.1:4873:4873 -v /srv/verdaccio/conf:/verdaccio/conf -v /srv/verdaccio/storage:/verdaccio/storage verdaccio/verdaccio:7
```

Extrait de `config.yaml` : paquets `@corp/*` publiés en interne, le reste relayé et mis en cache depuis npmjs :

```yaml
storage: /verdaccio/storage
auth:
  htpasswd:
    file: /verdaccio/storage/htpasswd
    max_users: -1          # inscription désactivée (comptes créés par l'administrateur)
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
packages:
  '@corp/*':
    access: $authenticated
    publish: $authenticated
  '**':
    access: $all
    proxy: npmjs
```

```bash
npm set registry https://npm.corp.exemple.fr/
npm adduser --registry https://npm.corp.exemple.fr/
npm publish --registry https://npm.corp.exemple.fr/
```

Commandes : [[90-aide-memoire|aide-mémoire]].
