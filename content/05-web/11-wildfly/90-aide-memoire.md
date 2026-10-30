---
title: WildFly — aide-mémoire des commandes
description: Commandes WildFly avec exemples — démarrage (standalone.sh, profils, -b, -c), utilisateurs de gestion (add-user.sh), CLI jboss-cli (connexion, lecture et écriture d'attributs, déploiements, sources de données, pilotes JDBC, journalisation, reload, batch, scripts), domaine géré, console web, interface HTTP de gestion avec curl, journaux et diagnostic.
tags: [aide-mémoire, wildfly, jboss-cli, jakarta ee, déploiement, datasource]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|WildFly]]. Installation d'exemple dans `/opt/wildfly`.

## Démarrage et utilisateurs

```bash
/opt/wildfly/bin/standalone.sh                                # profil standalone.xml
/opt/wildfly/bin/standalone.sh -c standalone-full-ha.xml -b 0.0.0.0 -bmanagement 127.0.0.1
/opt/wildfly/bin/domain.sh                                    # domaine géré
/opt/wildfly/bin/add-user.sh -u admin -p 'MotDePasseLong' -g admin          # utilisateur de gestion
/opt/wildfly/bin/add-user.sh -a -u appuser -p 'MotDePasse' -g utilisateurs   # utilisateur applicatif
sudo systemctl status wildfly
```

Console web : `http://127.0.0.1:9990/console` (interface de gestion à garder en local).

## jboss-cli

```bash
/opt/wildfly/bin/jboss-cli.sh --connect
/opt/wildfly/bin/jboss-cli.sh --connect --command=":read-attribute(name=server-state)"
/opt/wildfly/bin/jboss-cli.sh --connect --file=config.cli          # script de configuration
```

```text
:read-attribute(name=product-version)
:reload
:shutdown
/subsystem=undertow:read-resource(recursive=true)
/socket-binding-group=standard-sockets/socket-binding=http:read-attribute(name=port)
/socket-binding-group=standard-sockets/socket-binding=http:write-attribute(name=port, value=8081)

deployment-info
deploy /tmp/app.war --force
undeploy app.war
/deployment=app.war:read-attribute(name=status)

module add --name=org.postgresql --resources=/tmp/postgresql-42.7.4.jar --dependencies=javax.api,javax.transaction.api
/subsystem=datasources/jdbc-driver=postgresql:add(driver-name=postgresql, driver-module-name=org.postgresql, driver-class-name=org.postgresql.Driver)
data-source add --name=AppDS --jndi-name=java:jboss/datasources/AppDS --driver-name=postgresql --connection-url=jdbc:postgresql://db.exemple.fr:5432/app --user-name=app --password=MotDePasseBase --min-pool-size=5 --max-pool-size=30
/subsystem=datasources/data-source=AppDS:test-connection-in-pool
/subsystem=datasources/data-source=AppDS/statistics=pool:read-resource(include-runtime=true)

/subsystem=logging/root-logger=ROOT:write-attribute(name=level, value=INFO)
/subsystem=logging/logger=com.exemple:add(level=DEBUG)

batch
/system-property=app.env:add(value=prod)
/subsystem=undertow/server=default-server/http-listener=default:write-attribute(name=max-post-size, value=104857600)
run-batch
```

## API HTTP de gestion

```bash
curl -s --digest -u admin:"$MDP" -H "Content-Type: application/json" \
  -d '{"operation":"read-attribute","name":"server-state","json.pretty":1}' http://127.0.0.1:9990/management
curl -s --digest -u admin:"$MDP" "http://127.0.0.1:9990/management/deployment/app.war?operation=attribute&name=status"
```

## Journaux et diagnostic

```bash
tail -f /opt/wildfly/standalone/log/server.log
ls /opt/wildfly/standalone/deployments/          # marqueurs .deployed, .failed, .dodeploy
touch /opt/wildfly/standalone/deployments/app.war.dodeploy     # redéployer via le scanner
jcmd $(pgrep -f jboss-modules) Thread.print > /tmp/threads.txt
```
