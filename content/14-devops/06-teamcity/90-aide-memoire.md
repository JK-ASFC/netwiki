---
title: TeamCity — aide-mémoire des commandes
description: Commandes TeamCity avec exemples — serveur (Docker, scripts runAll/teamcity-server, jeton super-utilisateur), agents (Docker, buildAgent.properties, autorisation), API REST (projets, configurations, déclenchement de builds, file d'attente, statut, agents), Kotlin DSL (paramètres versionnés), sauvegarde (maintainDB) et restauration, journaux.
tags: [aide-mémoire, teamcity, jetbrains, ci, api, kotlin dsl]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|TeamCity]].

## Serveur et agents

```bash
docker run -d --name teamcity -p 8111:8111 -v /srv/teamcity/data:/data/teamcity_server/datadir -v /srv/teamcity/logs:/opt/teamcity/logs jetbrains/teamcity-server
docker run -d --name agent01 -e SERVER_URL=https://teamcity.exemple.fr -v /srv/teamcity/agent01:/data/teamcity_agent/conf jetbrains/teamcity-agent
grep -i "super user authentication token" /srv/teamcity/logs/teamcity-server.log | tail -1     # accès de secours
/opt/TeamCity/bin/runAll.sh start            # installation archive (Linux)
/opt/TeamCity/bin/runAll.sh stop
```

```properties
# buildAgent.properties
serverUrl=https://teamcity.exemple.fr
name=agent-linux-01
workDir=../work
env.ZONE=paris
```

Après son premier contact, l'agent doit être **autorisé** dans *Agents → Unauthorized*.

## API REST

```bash
T=https://teamcity.exemple.fr/app/rest
H=(-s -H "Authorization: Bearer $JETON" -H "Accept: application/json")
curl "${H[@]}" "$T/projects" | jq '.project[] | {id, name}'
curl "${H[@]}" "$T/buildTypes?locator=affectedProject:(id:Reseau)" | jq '.buildType[] | {id, name}'
curl "${H[@]}" -X POST "$T/buildQueue" -H "Content-Type: application/json" -d '{"buildType":{"id":"Reseau_Deploiement"},"properties":{"property":[{"name":"env.CIBLE","value":"prod"}]}}'
curl "${H[@]}" "$T/builds?locator=buildType:Reseau_Deploiement,count:5" | jq '.build[] | {number, status, state}'
curl "${H[@]}" "$T/buildQueue" | jq '.count'
curl "${H[@]}" "$T/agents?locator=connected:true,authorized:true" | jq '.agent[].name'
```

## Kotlin DSL

```kotlin
// .teamcity/settings.kts (extrait)
object Deploiement : BuildType({
    name = "Déploiement des configurations"
    params { param("env.CIBLE", "preprod") }
    steps {
        script { scriptContent = "ansible-playbook -i inventaire/%env.CIBLE% playbooks/configs.yml" }
    }
    triggers { vcs { branchFilter = "+:main" } }
})
```

## Sauvegarde et restauration

```bash
/opt/TeamCity/bin/maintainDB.sh backup -C -D -L -P -F sauvegarde-$(date +%F)
/opt/TeamCity/bin/maintainDB.sh restore -F /srv/teamcity/data/backup/sauvegarde-2026-10-30.zip -A /srv/teamcity/data
tail -f /opt/TeamCity/logs/teamcity-server.log
```
