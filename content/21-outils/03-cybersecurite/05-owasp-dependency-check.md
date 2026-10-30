---
title: OWASP Dependency-Check et analyse des composants
description: Analyse de composition logicielle (SCA) avec OWASP Dependency-Check — principe (identification des bibliothèques, CPE, base NVD), installation (CLI, Docker, extensions Maven, Gradle, Jenkins), clé d'API NVD et cache, analyse d'un projet ou d'un serveur (JAR, npm, Python, .NET), rapports et seuil CVSS, suppression des faux positifs, intégration CI, alternatives (Trivy, Grype, OSV-Scanner, Dependency-Track, SBOM CycloneDX).
tags: [owasp, dependency-check, sca, vulnérabilités, nvd, sbom, trivy, ci]
icon: package-search
---

La majorité du code d'une application vient de **bibliothèques tierces**. Quand l'une d'elles est vulnérable (Log4Shell dans Log4j, Spring4Shell, failles de bibliothèques npm), toutes les applications qui l'embarquent le sont. L'**analyse de composition logicielle** (SCA) inventorie ces composants et les confronte aux bases de vulnérabilités.

**OWASP Dependency-Check** (Apache 2.0) analyse un projet ou un répertoire (applications livrées par un éditeur, serveurs Java, dossiers `node_modules`) et produit un rapport des dépendances associées à des **CVE**.

## Installation

```bash
# Ligne de commande (Java requis)
VERSION=12.1.0    # vérifier la dernière version
wget https://github.com/dependency-check/DependencyCheck/releases/download/v${VERSION}/dependency-check-${VERSION}-release.zip
unzip dependency-check-${VERSION}-release.zip -d /opt
/opt/dependency-check/bin/dependency-check.sh --version
```

Windows : `dependency-check.bat` ; macOS : `brew install dependency-check` ; Docker : image `owasp/dependency-check` ; extensions **Maven**, **Gradle**, Ant, Jenkins, GitHub Actions, Azure DevOps.

La base est alimentée par l'**API de la NVD** : demandez une **clé d'API NVD** (gratuite), sinon la première synchronisation est extrêmement lente. Partagez le répertoire de données (cache) entre exécutions, ou utilisez une base centrale.

## Analyser

```bash
# Application livrée (WAR, JAR, dossier d'installation)
/opt/dependency-check/bin/dependency-check.sh --nvdApiKey "$NVD_API_KEY" \
  --project "Appli RH 4.2" --scan /opt/tomcat/latest/webapps/appli-rh.war \
  --format HTML --format JSON --out /srv/rapports/appli-rh --failOnCVSS 7

# Projet Node.js / Python (analyseurs du fichier de verrouillage)
/opt/dependency-check/bin/dependency-check.sh --scan ./ --enableExperimental --format HTML --out ./rapport-sca
```

```xml pom.xml (extension Maven, extrait)
<plugin>
  <groupId>org.owasp</groupId>
  <artifactId>dependency-check-maven</artifactId>
  <version>12.1.0</version>
  <configuration>
    <failBuildOnCVSS>7</failBuildOnCVSS>
    <suppressionFiles><suppressionFile>dependency-check-suppressions.xml</suppressionFile></suppressionFiles>
  </configuration>
  <executions><execution><goals><goal>check</goal></goals></execution></executions>
</plugin>
```

## Faux positifs

L'identification repose sur des heuristiques (nom de fichier, métadonnées → **CPE**) : des faux positifs surviennent (bibliothèque confondue avec un produit homonyme). Après vérification, les écarter dans un **fichier de suppression** versionné, avec justification et date d'expiration :

```xml dependency-check-suppressions.xml
<suppressions xmlns="https://jeremylong.github.io/DependencyCheck/dependency-suppression.1.3.xsd">
  <suppress until="2027-01-01Z">
    <notes>Faux positif : bibliothèque client, CVE concernant le serveur homonyme (vérifié le 2026-10-29)</notes>
    <packageUrl regex="true">^pkg:maven/com\.exemple/client\-lib@.*$</packageUrl>
    <cve>CVE-2025-12345</cve>
  </suppress>
</suppressions>
```

## Intégration continue

- Exécuter à chaque construction : le pipeline **échoue** au-delà d'un seuil CVSS (`--failOnCVSS 7`), après une période d'observation.
- Publier le rapport HTML comme artefact ; suivre les dépendances à mettre à jour (Dependabot, Renovate).
- Analyser aussi régulièrement les **applications tierces** installées sur vos serveurs (nouvelles CVE sur d'anciennes versions).

## Alternatives et compléments

| Outil | Points forts |
| --- | --- |
| **Trivy** (Aqua) | Images de conteneurs, systèmes de fichiers, dépôts, IaC, SBOM ; très rapide |
| Grype + Syft (Anchore) | Analyse de vulnérabilités + génération de **SBOM** |
| **OSV-Scanner** (Google) | Base OSV (écosystèmes open source), fichiers de verrouillage |
| **Dependency-Track** (OWASP) | Plateforme : centralise les **SBOM CycloneDX** de toutes les applications et alerte quand une nouvelle CVE touche un composant déjà déployé |
| `npm audit`, `pip-audit`, `bundler-audit` | Outils propres à un écosystème |

```bash
trivy fs --severity HIGH,CRITICAL /opt/appli
trivy image registre.corp.exemple.fr/appli:2.4.0
syft /opt/appli -o cyclonedx-json > sbom.json      # inventaire des composants (SBOM)
```

Une **SBOM** (*Software Bill of Materials*) demandée aux éditeurs permet de répondre en quelques minutes à la question « sommes-nous touchés ? » lors de la prochaine faille majeure.
