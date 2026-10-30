---
title: Présentation, installation et configuration
description: WildFly (ex-JBoss AS) et JBoss EAP — serveur d'applications Jakarta EE complet, modes autonome et domaine, profils, sous-systèmes, installation sous Linux (archive, systemd), Windows et macOS, interface d'administration et CLI jboss-cli, interfaces et ports, sources de données et modules JDBC, déploiement d'applications, TLS avec Elytron.
tags: [wildfly, jboss, jakarta ee, jboss-cli, datasource, elytron, installation, java]
icon: info
---

**WildFly** (Red Hat, LGPL) est un serveur d'applications **Jakarta EE** complet : servlets, EJB, JPA (Hibernate), JMS (ActiveMQ Artemis), transactions, CDI, MicroProfile. Sa version commerciale supportée est **JBoss EAP** (Red Hat). Il héberge des applications métier Java et des produits comme Keycloak (historiquement).

| Comparaison | Tomcat | WildFly |
| --- | --- | --- |
| Périmètre | Conteneur web (Servlet, JSP, WebSocket) | Plateforme Jakarta EE complète |
| Configuration | `server.xml` | Modèle de gestion unique (XML piloté par CLI/API) |
| Administration | Manager simple | Console web, **CLI**, API HTTP, mode domaine |

## Modes et profils

| Mode | Usage |
| --- | --- |
| **Autonome** (*standalone*) | Une instance gérée individuellement — cas le plus courant (aussi en conteneur) |
| **Domaine** | Un *Domain Controller* gère des groupes de serveurs sur plusieurs hôtes (*Host Controllers*) : configuration et déploiement centralisés |

Fichiers de configuration autonome : `standalone.xml` (web), `standalone-full.xml` (+ JMS), `standalone-ha.xml` (+ clustering), `standalone-full-ha.xml`.

## Installation

```bash
sudo apt install openjdk-21-jdk-headless          # Java 17 ou 21 selon la version de WildFly
sudo groupadd -r wildfly && sudo useradd -r -g wildfly -d /opt/wildfly -s /usr/sbin/nologin wildfly
VERSION=37.0.1.Final   # à vérifier sur wildfly.org
wget https://github.com/wildfly/wildfly/releases/download/${VERSION}/wildfly-${VERSION}.tar.gz
sudo tar xzf wildfly-${VERSION}.tar.gz -C /opt && sudo ln -sfn /opt/wildfly-${VERSION} /opt/wildfly
sudo chown -RH wildfly:wildfly /opt/wildfly

# Service systemd fourni dans l'archive
sudo mkdir -p /etc/wildfly
sudo cp /opt/wildfly/bin/systemd/wildfly.conf /etc/wildfly/
sudo cp /opt/wildfly/bin/systemd/launch.sh /opt/wildfly/bin/
sudo cp /opt/wildfly/bin/systemd/wildfly.service /etc/systemd/system/
sudo systemctl daemon-reload && sudo systemctl enable --now wildfly
```

```ini /etc/wildfly/wildfly.conf
WILDFLY_CONFIG=standalone.xml
WILDFLY_MODE=standalone
WILDFLY_BIND=127.0.0.1
```

Mémoire : `JAVA_OPTS` dans `bin/standalone.conf` (`-Xms2g -Xmx2g`). **Windows** : `standalone.bat`, service via les scripts `docs/contrib/scripts/service` (Procrun) ou WinSW. **macOS** : archive (développement). Conteneur : image `quay.io/wildfly/wildfly`.

## Administration

```bash
# Utilisateur de gestion (realm ManagementRealm)
/opt/wildfly/bin/add-user.sh -u admin-wildfly -p 'MotDePasseAdminTresLong!' -r ManagementRealm
# CLI
/opt/wildfly/bin/jboss-cli.sh --connect --controller=127.0.0.1:9990
```

| Port | Usage |
| --- | --- |
| 8080 / 8443 | HTTP / HTTPS des applications (sous-système Undertow) |
| **9990** | Console d'administration et API HTTP — **réseau d'administration uniquement** |
| 8009 | AJP (si activé) |

```text Commandes jboss-cli courantes
:read-attribute(name=server-state)
/subsystem=undertow/server=default-server/http-listener=default:read-resource
/interface=public:write-attribute(name=inet-address, value=127.0.0.1)
:reload
deployment-info
```

Toutes les modifications passent par le CLI (scriptables, rejouables) plutôt que par édition directe du XML serveur arrêté.

## Source de données

```text jboss-cli
# 1. Module du pilote JDBC
module add --name=org.postgresql --resources=/tmp/postgresql-42.7.4.jar --dependencies=javax.api,javax.transaction.api
/subsystem=datasources/jdbc-driver=postgresql:add(driver-name=postgresql, driver-module-name=org.postgresql, driver-class-name=org.postgresql.Driver)

# 2. Source de données avec pool et validation
data-source add --name=AppliDS --jndi-name=java:jboss/datasources/AppliDS --driver-name=postgresql \
  --connection-url=jdbc:postgresql://srv-db-01:5432/appli?sslmode=verify-full --user-name=appli --password=MotDePasseBdd \
  --min-pool-size=5 --max-pool-size=50 --validate-on-match=true --check-valid-connection-sql="SELECT 1"
/subsystem=datasources/data-source=AppliDS:test-connection-in-pool
```

Le mot de passe peut être stocké dans un **magasin d'identifiants** Elytron (*credential store*) plutôt qu'en clair.

## Déploiement

```text
deploy /tmp/appli-2.4.0.war --name=appli.war --runtime-name=appli.war
deploy /tmp/appli-2.5.0.war --name=appli.war --runtime-name=appli.war --force     # remplacement
undeploy appli.war
```

En production, désactivez le scanner de déploiement automatique (`/subsystem=deployment-scanner/scanner=default:write-attribute(name=scan-enabled, value=false)`) et déployez par CLI (Ansible, pipeline).

Suite : [[02-securite-cluster-exploitation|sécurité, cluster et exploitation]].
