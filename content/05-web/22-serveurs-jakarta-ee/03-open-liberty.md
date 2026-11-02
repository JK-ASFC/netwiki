---
title: Open Liberty
description: Open Liberty — serveur Java modulaire d'IBM (base de WebSphere Liberty) pour Jakarta EE et MicroProfile : installation (archive, Docker icr.io/appcafe/open-liberty, plugins Maven et Gradle), commande server (create, start, run, stop, status, package), server.xml et fonctionnalités (features), déploiement par dossier dropins ou application déclarée, TLS et keystore, variables, mode développement liberty:dev, Admin Center, mises à jour et images conteneur.
tags: [open liberty, websphere liberty, jakarta ee, microprofile, java]
icon: info
---

**Open Liberty** (EPL) ne charge que les **fonctionnalités** déclarées dans `server.xml` : démarrage en quelques secondes, faible empreinte, parfait en conteneur. C'est la base libre de **WebSphere Liberty** (IBM), avec lequel il est compatible.

## Installation

```bash
unzip openliberty-*.zip -d /opt && export PATH=/opt/wlp/bin:$PATH
server create inventaire                      # /opt/wlp/usr/servers/inventaire/server.xml
cp inventaire.war /opt/wlp/usr/servers/inventaire/dropins/
server start inventaire ; server status inventaire
tail -f /opt/wlp/usr/servers/inventaire/logs/messages.log
```

Windows : `server.bat`, service via `server registerWinService` (selon version) ou WinSW. Docker : `icr.io/appcafe/open-liberty:full-java21-openj9-ubi-minimal` (ou `kernel-slim` + `features.sh` pour n'installer que le nécessaire).

## server.xml

```xml
<server description="Inventaire">
  <featureManager>
    <feature>jakartaee-10.0</feature>
    <feature>mpHealth-4.0</feature>
    <feature>mpMetrics-5.1</feature>
    <feature>adminCenter-1.0</feature>
  </featureManager>
  <variable name="http.port" defaultValue="9080"/>
  <httpEndpoint id="defaultHttpEndpoint" host="*" httpPort="${http.port}" httpsPort="9443"/>
  <keyStore id="defaultKeyStore" password="{xor}…"/>          <!-- securityUtility encode -->
  <quickStartSecurity userName="admin" userPassword="{xor}…"/>
  <dataSource id="ds" jndiName="jdbc/inventaire">
    <jdbcDriver libraryRef="pg"/>
    <properties.postgresql serverName="srv-db-01" portNumber="5432" databaseName="inventaire" user="inventaire" password="{aes}…"/>
  </dataSource>
  <library id="pg"><fileset dir="${shared.resource.dir}/jdbc" includes="postgresql-*.jar"/></library>
  <webApplication location="inventaire.war" contextRoot="/inventaire"/>
</server>
```

```bash
/opt/wlp/bin/securityUtility encode --encoding=aes 'MdpBase2026'
server package inventaire --include=minify     # archive autonome pour déploiement
```

Développement : `mvn liberty:dev` (rechargement à chaud). Santé MicroProfile : `/health/ready`, métriques : `/metrics` (format Prometheus).

Interface : [[04-interface-graphique|Admin Center]] · commandes : [[90-aide-memoire|aide-mémoire]].
