---
title: Payara Community et GlassFish
description: Payara Server Community et Eclipse GlassFish — serveurs Jakarta EE complets (EJB, CDI, JPA, JMS, JAX-RS) : versions (GlassFish 7 et 8, Payara 6 et 7), installation (archive ZIP, Docker), domaines, asadmin (start-domain, change-admin-password, enable-secure-admin, deploy, create-jdbc-connection-pool, create-jdbc-resource, set-log-levels, list-applications), console d'administration (port 4848), ports par défaut, Payara Micro, service système et différences entre les deux produits.
tags: [payara, glassfish, jakarta ee, java, asadmin, serveur d'applications]
icon: info
---

**GlassFish** (Eclipse, implémentation de référence de Jakarta EE) et son dérivé **Payara Server** (Payara Services) sont des serveurs d'applications **Jakarta EE complets**. Payara Community ajoute des fonctions de production (supervision, cache Hazelcast, *Payara Micro* pour conteneurs) ; Payara Enterprise (payant) fournit le support à long terme.

| | GlassFish | Payara Community |
| --- | --- | --- |
| Rôle | Référence Jakarta EE (8.x pour EE 11) | Production, dérivé de GlassFish |
| Administration | `asadmin`, console 4848 | Idem + supervision, Payara Micro |
| Mises à jour | Communauté Eclipse | Mensuelles (Community) |

## Installation

```bash
sudo apt install openjdk-21-jdk-headless unzip
unzip payara-6.*.zip -d /opt && sudo ln -sfn /opt/payara6 /opt/payara       # ou glassfish-7.*.zip → /opt/glassfish7
export PATH=/opt/payara/bin:$PATH
asadmin start-domain domain1
asadmin change-admin-password --user admin          # mot de passe vide par défaut
asadmin enable-secure-admin && asadmin restart-domain domain1
```

Windows : même archive (`asadmin.bat`), service via `asadmin create-service`. Docker : `payara/server-full`, `payara/micro`, image `ghcr.io/eclipse-ee4j/glassfish`.

| Port | Usage |
| --- | --- |
| **4848** | Console et API d'administration (HTTPS après `enable-secure-admin`) |
| 8080 / 8181 | HTTP / HTTPS des applications |
| 3700, 7676, 8686 | IIOP, JMS, JMX |

## Déploiement et ressources

```bash
asadmin deploy --contextroot /inventaire --name inventaire inventaire.war
asadmin list-applications ; asadmin undeploy inventaire
asadmin create-jdbc-connection-pool --datasourceclassname org.postgresql.ds.PGSimpleDataSource --restype javax.sql.DataSource \
  --property serverName=srv-db-01:portNumber=5432:databaseName=inventaire:user=inventaire:password=MdpBase2026 pool-inventaire
asadmin ping-connection-pool pool-inventaire
asadmin create-jdbc-resource --connectionpoolid pool-inventaire jdbc/inventaire
asadmin create-jvm-options '-Xmx2g' ; asadmin delete-jvm-options '-Xmx512m'
asadmin create-service                               # service systemd ou Windows pour domain1
```

Pilote JDBC : copier le JAR dans `domains/domain1/lib/` puis redémarrer. **Payara Micro** : `java -jar payara-micro.jar --deploy inventaire.war --port 8080` (un conteneur = une application).

Interface : [[04-interface-graphique|console d'administration]] · commandes : [[90-aide-memoire|aide-mémoire]].
