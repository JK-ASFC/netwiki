---
title: SonarQube — aide-mémoire des commandes
description: Commandes SonarQube avec exemples — prérequis système (vm.max_map_count), Docker et service, analyses (sonar-scanner, Maven, Gradle, .NET dotnet-sonarscanner, CLI Docker), jetons, porte qualité dans la CI, API Web (état du système, projets, problèmes, statut de la porte qualité, utilisateurs), réinitialisation du mot de passe admin, sauvegarde de la base, journaux.
tags: [aide-mémoire, sonarqube, sonar-scanner, qualité de code, api, ci]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|SonarQube]].

## Prérequis et démarrage

```bash
sudo sysctl -w vm.max_map_count=524288 && echo "vm.max_map_count=524288" | sudo tee /etc/sysctl.d/99-sonarqube.conf
docker run -d --name sonarqube -p 9000:9000 -e SONAR_JDBC_URL=jdbc:postgresql://db.exemple.fr/sonarqube \
  -e SONAR_JDBC_USERNAME=sonar -e SONAR_JDBC_PASSWORD="$MDP_BASE" -v sonar-data:/opt/sonarqube/data -v sonar-ext:/opt/sonarqube/extensions sonarqube:lts-community
curl -s http://127.0.0.1:9000/api/system/status | jq .
docker logs -f sonarqube
```

## Analyses

```bash
sonar-scanner -Dsonar.projectKey=outil-reseau -Dsonar.sources=. -Dsonar.host.url=https://sonar.exemple.fr -Dsonar.token="$SONAR_TOKEN"
docker run --rm -e SONAR_HOST_URL=https://sonar.exemple.fr -e SONAR_TOKEN="$SONAR_TOKEN" -v "$PWD:/usr/src" sonarsource/sonar-scanner-cli -Dsonar.projectKey=outil-reseau
mvn clean verify sonar:sonar -Dsonar.projectKey=app-java -Dsonar.token="$SONAR_TOKEN"
./gradlew sonar -Dsonar.token="$SONAR_TOKEN"
dotnet tool install --global dotnet-sonarscanner
dotnet sonarscanner begin /k:"app-dotnet" /d:sonar.host.url="https://sonar.exemple.fr" /d:sonar.token="$SONAR_TOKEN"
dotnet build && dotnet sonarscanner end /d:sonar.token="$SONAR_TOKEN"
# Faire échouer la CI si la porte qualité n'est pas franchie
sonar-scanner -Dsonar.qualitygate.wait=true -Dsonar.qualitygate.timeout=300 ...
```

```properties
# sonar-project.properties
sonar.projectKey=outil-reseau
sonar.projectName=Outil réseau
sonar.sources=src
sonar.exclusions=**/tests/**,**/*.min.js
sonar.python.coverage.reportPaths=coverage.xml
```

## API Web

```bash
S=https://sonar.exemple.fr/api; A=(-s -u "$SONAR_TOKEN:")
curl "${A[@]}" "$S/system/health" | jq .
curl "${A[@]}" "$S/projects/search?ps=50" | jq '.components[].key'
curl "${A[@]}" "$S/qualitygates/project_status?projectKey=outil-reseau" | jq .projectStatus.status
curl "${A[@]}" "$S/issues/search?componentKeys=outil-reseau&types=VULNERABILITY&resolved=false" | jq '.total'
curl "${A[@]}" "$S/measures/component?component=outil-reseau&metricKeys=coverage,bugs,vulnerabilities,code_smells" | jq '.component.measures'
curl "${A[@]}" -X POST "$S/user_tokens/generate?name=ci-gitlab" | jq -r .token
curl "${A[@]}" -X POST "$S/users/change_password?login=admin&previousPassword=$ANCIEN&password=$NOUVEAU"
```

## Sauvegarde et journaux

```bash
pg_dump -Fc -h db.exemple.fr -U sonar sonarqube > /srv/sauvegardes/sonarqube-$(date +%F).dump
docker exec sonarqube ls /opt/sonarqube/logs        # sonar.log, web.log, ce.log, es.log
```
