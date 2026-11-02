---
title: Interfaces graphiques
description: Consoles d'administration web des serveurs Java — Payara et GlassFish (port 4848 : applications, ressources JDBC, configurations, journaux, supervision) et Open Liberty Admin Center (port 9443 : Explore, Server Config) ; Jetty n'a pas de console. Emplacements de captures d'écran.
tags: [payara, glassfish, open liberty, admin center, interface graphique, captures]
icon: monitor
---

## Payara et GlassFish (`https://<hôte>:4848`)

| Menu | Contenu |
| --- | --- |
| **Applications** | Déployer, redéployer, activer, voir les modules et points d'accès |
| **Resources → JDBC** | Pools de connexions (bouton *Ping*), ressources JDBC |
| **Configurations → server-config** | Options JVM, écouteurs HTTP, journalisation, sécurité (realms) |
| Server (Admin Server) | Journaux, redémarrage, propriétés |
| Monitoring Data (Payara) | Supervision, Health Check, notifications |

<!-- CAPTURE: Payara — console d'administration, liste des applications | _assets/payara-applications.png -->
<!-- CAPTURE: Payara — pool JDBC et test de connexion (Ping) | _assets/payara-jdbc.png -->

## Open Liberty Admin Center (`https://<hôte>:9443/adminCenter`)

Nécessite la fonctionnalité `adminCenter-1.0` et un utilisateur administrateur (`quickStartSecurity` ou registre). Outils : **Explore** (applications, état, démarrage/arrêt, statistiques), **Server Config** (édition guidée de `server.xml`).

<!-- CAPTURE: Open Liberty — Admin Center, outil Explore | _assets/liberty-admin-center.png -->

## Jetty

Pas de console d'administration : supervision par JMX (module `jmx`) avec VisualVM ou JDK Mission Control, et par les journaux de requêtes.
