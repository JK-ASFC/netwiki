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
