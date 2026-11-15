---
title: Serveurs Java — aide-mémoire des commandes
description: Commandes Jetty (start.jar --add-modules, --list-modules, --list-config, --dry-run), Payara et GlassFish (asadmin start-domain, stop-domain, restart-domain, list-domains, deploy, redeploy, undeploy, list-applications, create-jdbc-connection-pool, ping-connection-pool, create-jvm-options, set-log-levels, generate-jvm-report, create-service) et Open Liberty (server create, start, run, stop, status, dump, package, securityUtility, featureUtility).
tags: [aide-mémoire, jetty, payara, glassfish, open liberty, asadmin]
icon: terminal
---

Explications : [[01-jetty|Jetty]] · [[02-payara-glassfish|Payara et GlassFish]] · [[03-open-liberty|Open Liberty]].

## Jetty

```bash
java -jar $JETTY_HOME/start.jar --add-modules=http,ee10-deploy ; java -jar $JETTY_HOME/start.jar --list-modules
java -jar $JETTY_HOME/start.jar --list-config ; java -jar $JETTY_HOME/start.jar --dry-run
```

## Payara / GlassFish

```bash
asadmin list-domains ; asadmin start-domain ; asadmin stop-domain ; asadmin restart-domain
asadmin deploy --force=true app.war ; asadmin redeploy --name app app.war ; asadmin undeploy app ; asadmin list-applications
asadmin list-jdbc-connection-pools ; asadmin ping-connection-pool pool-inventaire
asadmin list-jvm-options ; asadmin create-jvm-options '-Xmx2g'
asadmin set-log-levels jakarta.enterprise.web=FINE ; asadmin rotate-log
asadmin generate-jvm-report --type summary ; asadmin version
```

## Open Liberty

```bash
server list ; server create app ; server start app ; server run app ; server stop app ; server status app
server dump app --include=thread,heap ; server package app --include=usr
featureUtility installServerFeatures app ; securityUtility encode --encoding=aes 'secret'
```

## Jetty : base d'instance

```bash
# JETTY_HOME = distribution (lecture seule) ; JETTY_BASE = configuration de l'instance
sudo mkdir -p /opt/jetty-base && cd /opt/jetty-base
java -jar $JETTY_HOME/start.jar --add-modules=server,http,ee10-deploy
java -jar $JETTY_HOME/start.jar --add-modules=ssl,https          # puis keystore dans /opt/jetty-base/etc
cp app.war /opt/jetty-base/webapps/
java -jar $JETTY_HOME/start.jar                                   # démarrer (depuis JETTY_BASE)
```

## Payara / GlassFish : sécurisation et pool de connexions

```bash
asadmin change-admin-password
asadmin enable-secure-admin && asadmin restart-domain              # console d'administration en HTTPS, accès distant
asadmin create-jdbc-connection-pool --datasourceclassname org.postgresql.ds.PGSimpleDataSource --restype javax.sql.DataSource --property user=app:password=MotDePasse:serverName=srv-db.corp.exemple.fr:portNumber=5432:databaseName=inventaire pool-inventaire
asadmin create-jdbc-resource --connectionpoolid pool-inventaire jdbc/inventaire
asadmin ping-connection-pool pool-inventaire
```

## Open Liberty : fonctionnalités

```bash
featureUtility installFeature restfulWS-3.1
featureUtility find jdbc
server javadump app                                              # vidage des threads
```
