---
title: Eclipse Jetty
description: Eclipse Jetty 12 — serveur HTTP et conteneur de servlets Java léger et embarquable : versions (9 à 12, environnements ee8 à ee11), architecture JETTY_HOME et JETTY_BASE, installation (archive, Docker, paquets), modules (start.jar --add-modules http, https, ssl, deploy, ee10-deploy, requestlog, gzip), déploiement de WAR, configuration TLS, mémoire, service systemd, et usage embarqué dans des applications (Jenkins, Spring Boot, Solr historique).
tags: [jetty, java, servlet, jakarta ee, serveur d'applications]
icon: info
---

**Jetty** (EPL 2.0 / Apache 2.0) est un serveur HTTP et **conteneur de servlets** léger, souvent **embarqué** dans d'autres logiciels ([[05-jenkins/01-presentation-installation|Jenkins]] via Winstone, certaines applications Spring Boot, outils Eclipse). Comme [[10-tomcat/01-presentation-installation|Tomcat]], il exécute des WAR, sans les services Jakarta EE complets (EJB, JMS…).

| Version Jetty | Statut | API |
| --- | --- | --- |
| **12.x** | Courante | Servlet 4 (ee8, `javax`), 5 (ee9), 6 (ee10), 6.1 (ee11) au choix par module |
| 11 / 10 | Fin de support communautaire | Jakarta 9 / Servlet 4 |
| 9.4 | Fin de vie | `javax.servlet` |

## Installation

```bash
sudo apt install openjdk-21-jre-headless
curl -LO https://repo1.maven.org/maven2/org/eclipse/jetty/jetty-home/12.0.16/jetty-home-12.0.16.tar.gz   # version courante sur jetty.org
sudo tar -C /opt -xzf jetty-home-12.0.16.tar.gz && sudo ln -sfn /opt/jetty-home-12.0.16 /opt/jetty-home
sudo useradd -r -d /srv/jetty -s /usr/sbin/nologin jetty && sudo mkdir -p /srv/jetty && cd /srv/jetty
sudo -u jetty java -jar /opt/jetty-home/start.jar --add-modules=server,http,ee10-deploy,requestlog,gzip
sudo cp application.war /srv/jetty/webapps/
sudo -u jetty java -jar /opt/jetty-home/start.jar      # premier plan ; port 8080 par défaut
```

**JETTY_HOME** (binaires, à remplacer lors des mises à jour) et **JETTY_BASE** (votre configuration : `start.d/*.ini`, `webapps/`, `etc/`) sont séparés : une mise à jour consiste à changer le lien `/opt/jetty-home`.

Windows : même archive, `java -jar %JETTY_HOME%\start.jar` depuis le JETTY_BASE, service via WinSW ou NSSM. Docker : image `jetty:12-jre21`.

## Configuration utile

```bash
java -jar /opt/jetty-home/start.jar --add-modules=https,ssl     # crée start.d/ssl.ini
java -jar /opt/jetty-home/start.jar --list-modules
java -jar /opt/jetty-home/start.jar --list-config
```

```ini
# start.d/ssl.ini — extraits
jetty.ssl.port=8443
jetty.sslContext.keyStorePath=etc/keystore.p12
jetty.sslContext.keyStorePassword=MdpKeystore2026
# start.d/server.ini
jetty.httpConfig.sendServerVersion=false
```

```ini
# /etc/systemd/system/jetty.service
[Unit]
Description=Eclipse Jetty
After=network-online.target
[Service]
User=jetty
WorkingDirectory=/srv/jetty
Environment=JAVA_OPTIONS=-Xms512m -Xmx1g
ExecStart=/usr/bin/java $JAVA_OPTIONS -jar /opt/jetty-home/start.jar jetty.base=/srv/jetty
Restart=on-failure
[Install]
WantedBy=multi-user.target
```

Publiez derrière un reverse proxy (module `http-forwarded` pour les en-têtes `X-Forwarded-*`). Suite : [[02-payara-glassfish|Payara et GlassFish]] · [[03-open-liberty|Open Liberty]] · [[90-aide-memoire|aide-mémoire]].
