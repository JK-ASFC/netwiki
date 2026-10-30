---
title: IntelliJ IDEA et PyCharm (JetBrains)
description: IDE JetBrains pour Java et Python — offres et licences (versions gratuites et payantes, licences d'entreprise, serveur de licences), installation avec Toolbox App ou paquets, déploiement silencieux, fonctions utiles à l'infrastructure (outils de base de données, client HTTP, Docker, SSH et déploiement, interpréteurs distants et WSL), développement à distance (Gateway), plugins, IA intégrée et confidentialité, réglages et sécurité.
tags: [jetbrains, intellij idea, pycharm, ide, java, python, toolbox]
icon: code
---

**IntelliJ IDEA** (Java, Kotlin, et polyglotte dans l'édition payante) et **PyCharm** (Python) sont les IDE de JetBrains : analyse de code très poussée, refactorisation sûre, débogage, outils intégrés (bases de données, HTTP, Docker, Git). Pour l'infrastructure, ils servent à maintenir des outils internes, des scripts Python volumineux, ou des applications Java (voir [[09-openjdk/01-installation-exploitation|OpenJDK]]).

## Offres

JetBrains propose pour IntelliJ IDEA et PyCharm une version **gratuite** (anciennes éditions *Community*, en cours d'unification en une distribution unique avec fonctions de base gratuites) et une version **payante** (*Ultimate* / Pro : frameworks web, bases de données, développement à distance, outils avancés). Vérifiez les conditions d'usage commercial de chaque offre.

| Licence | Usage |
| --- | --- |
| Individuelle | Un développeur, ses propres machines |
| **Organisation** | Attribuée et retirée par l'administrateur via le compte JetBrains |
| **License Vault / IDE Services** | Serveur de licences sur site ou cloud (flotte, réseaux isolés) |
| Gratuite (étudiants, open source, enseignants) | Sur justification |

## Installation

```powershell
winget install JetBrains.Toolbox          # Toolbox App : installe, met à jour et revient en arrière sur tous les IDE
winget install JetBrains.PyCharm.Community
# Déploiement silencieux (installateur .exe)
pycharm-2025.2.exe /S /CONFIG=silent.config /D=C:\Program Files\JetBrains\PyCharm
```

Linux : Toolbox App, Snap (`sudo snap install pycharm-community --classic`) ou archive ; macOS : `brew install --cask pycharm-ce` / `intellij-idea`.

## Fonctions utiles à l'infrastructure

| Fonction | Usage |
| --- | --- |
| **Outils de base de données** (éditions payantes ; équivalent de [[07-dbeaver\|DBeaver]]) | Requêtes, schémas, export, connexions par tunnel SSH |
| **Client HTTP** (fichiers `.http`) | Tester des API, versionné avec le projet |
| Docker / Kubernetes | Images, conteneurs, Compose, manifestes |
| **Interpréteurs distants** (PyCharm) | Exécuter et déboguer sur un serveur via SSH, dans WSL ou un conteneur |
| Déploiement (SFTP) | Synchroniser un projet vers un serveur de test |
| Git, revues de code | Intégration GitHub/GitLab |
| Terminal intégré, scratch files | Essais rapides |

**Développement à distance** (JetBrains Gateway) : l'IDE s'exécute sur un serveur puissant ou proche des données, le poste n'affiche qu'un client léger.

## IA et confidentialité

L'**assistant d'IA** et l'agent intégrés envoient du code à des services en ligne : activez-les selon la politique de l'organisation (options de modèles locaux ou de fournisseurs choisis selon l'offre), et désactivez-les pour les projets confidentiels.

## Bonnes pratiques

- [ ] Mettre à jour via Toolbox (correctifs de sécurité de l'IDE et de son JDK embarqué)
- [ ] Plugins issus de la Marketplace officielle et limités au nécessaire
- [ ] *Trusted projects* : ne pas ouvrir en mode de confiance un projet téléchargé non vérifié (scripts de construction exécutés à l'import)
- [ ] Paramètres partagés par projet (`.idea/` partiellement versionné : styles de code, configurations d'exécution) ; secrets exclus
- [ ] Mémoire : `Help → Change Memory Settings` pour les gros projets
