---
title: Eclipse IDE
description: Eclipse IDE (Eclipse Foundation) — paquets (Java, Enterprise Java et Web, C/C++), installation (installateur, archives, Java embarqué), espaces de travail, greffons et sites de mise à jour (Marketplace, sites internes pour les réseaux isolés), configuration eclipse.ini (mémoire, JVM), usages en infrastructure (outils Java, produits basés sur Eclipse RCP comme Apache Directory Studio, Eclipse MAT, DBeaver), mises à jour et sécurité.
tags: [eclipse, ide, java, greffons, rcp, eclipse mat, installation]
icon: code
---

**Eclipse IDE** (EPL) est un IDE historique, surtout pour **Java**, extensible par **greffons**. Beaucoup d'outils d'administration sont construits sur sa plateforme **RCP** : **Apache Directory Studio** (navigateur LDAP), **Eclipse MAT** (analyse de vidages mémoire Java), [[07-dbeaver|DBeaver]], consoles de produits d'éditeurs. Le connaître aide donc aussi à configurer ces outils.

## Paquets et installation

| Paquet | Contenu |
| --- | --- |
| Eclipse IDE for Java Developers | Java, Maven, Gradle, Git |
| Eclipse IDE for **Enterprise Java and Web** | + Jakarta EE, serveurs (Tomcat, WildFly), JavaScript |
| Eclipse IDE for C/C++ | CDT |
| Autres | PHP, modélisation, RCP/RAP |

```powershell
winget install EclipseFoundation.EclipseIDEforJavaDevelopers
```

```bash
# Linux / macOS : archive ou installateur (Eclipse Installer) depuis eclipse.org ; macOS :
brew install --cask eclipse-java
```

Les paquets récents embarquent un **JRE** (Temurin) : aucune installation de Java n'est nécessaire pour lancer l'IDE, mais les projets peuvent cibler d'autres JDK (*Preferences → Java → Installed JREs*).

## Espaces de travail et réglages

- **Workspace** : dossier contenant les projets et les métadonnées (`.metadata`) ; un workspace par contexte (client, produit).
- `eclipse.ini` : mémoire et JVM de l'IDE.

```ini eclipse.ini (extraits)
-vm
C:/Program Files/Eclipse Adoptium/jdk-21/bin/javaw.exe
-vmargs
-Xms512m
-Xmx4g
-Dfile.encoding=UTF-8
```

`-vm` doit précéder `-vmargs` ; encodage UTF-8 imposé pour éviter les problèmes d'accents dans les sources.

## Greffons

| Source | Usage |
| --- | --- |
| **Eclipse Marketplace** (*Help → Eclipse Marketplace*) | Catalogue officiel |
| Sites de mise à jour (*Help → Install New Software*) | URL p2 fournies par les éditeurs |
| Site **interne** (miroir p2) | Réseaux isolés : miroir des sites nécessaires (`p2.mirror` en mode headless) |

Greffons utiles : outils Docker, YAML/Ansible (via LSP), SonarLint (analyse de qualité, voir [[07-sonarqube/01-presentation-installation|SonarQube]]), EGit.

## Eclipse MAT pour l'administrateur

Analyse d'un vidage de tas Java (`.hprof`) d'une application qui fuit ou consomme trop de mémoire (Tomcat, Jenkins, Elasticsearch) :

1. Obtenir le vidage (`jcmd <pid> GC.heap_dump`, voir [[09-openjdk/01-installation-exploitation|OpenJDK]]).
2. Ouvrir dans MAT (prévoir une mémoire `-Xmx` supérieure à la taille du vidage), rapport *Leak Suspects*.
3. *Dominator Tree* : objets qui retiennent le plus de mémoire, et leur chemin vers les racines.

## Mises à jour et sécurité

- Versions **trimestrielles** (`2025-09`, `2025-12`…) : *Help → Check for Updates*, ou nouvelle installation puis réimport du workspace.
- Greffons de sources fiables ; les greffons ont les mêmes droits que l'IDE.
- Ne pas importer de projets non fiables sans examen (scripts de construction Maven/Gradle exécutés).
