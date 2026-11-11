---
title: Apache NetBeans, Qt Creator et Code::Blocks
description: Trois IDE libres — Apache NetBeans (Java, Maven, Gradle, PHP, HTML et JavaScript ; JDK requis), Qt Creator (C++ et QML, CMake, débogueur, analyse, kits de compilation ; licences GPL et commerciale) et Code::Blocks (C, C++ et Fortran, léger, compilateurs MinGW ou GCC, projets et débogage) ; installation, premiers pas, usage par un administrateur et comparaison avec VS Code, JetBrains et Eclipse.
tags: [netbeans, qt creator, code blocks, ide, java, c++, cmake, qml]
icon: code
---

Ces IDE servent surtout aux **développeurs** ; l'administrateur les rencontre pour compiler un outil interne, maintenir une application Java métier ou une petite interface Qt, ou les déployer sur des postes de développeurs.

| | Apache NetBeans | Qt Creator | Code::Blocks |
| --- | --- | --- | --- |
| Langages | **Java** (Maven, Gradle, Ant), PHP, HTML/JavaScript, C/C++ (greffon) | **C++, QML**, C, Python (Qt for Python) | **C, C++**, Fortran |
| Licence | Apache 2.0 | GPL 3 (et licence commerciale de Qt Group) | GPL 3 |
| Plates-formes | Windows, macOS, Linux | Windows, macOS, Linux | Windows, macOS, Linux |
| Construction | Maven, Gradle, Ant | **CMake**, qmake, Meson | Projets Code::Blocks, makefiles |
| Débogage | JDK (JDWP), Xdebug pour PHP | GDB, LLDB, CDB | GDB |
| Poids | Moyen (Java) | Moyen | Léger |

## Apache NetBeans

NetBeans a besoin d'un **JDK** (Java Development Kit) récent installé à part (Temurin, OpenJDK).

```powershell
winget install EclipseAdoptium.Temurin.21.JDK
winget install Apache.NetBeans
```

```bash
sudo apt install openjdk-21-jdk
sudo snap install netbeans --classic          # ou l'installateur et l'archive ZIP d'Apache
brew install --cask netbeans
```

- **Ouvrir un projet Maven ou Gradle** existant : *Fichier → Ouvrir un projet*, NetBeans lit directement le `pom.xml` ou `build.gradle`.
- **PHP** : activer le module PHP, configurer l'interpréteur et Xdebug pour déboguer une application web.
- Le JDK utilisé se règle dans `netbeans.conf` (`netbeans_jdkhome`) si plusieurs sont installés.

## Qt Creator

Windows et macOS : **Qt Online Installer** (site de Qt), qui installe Qt Creator, les versions de Qt et les compilateurs (MinGW ou MSVC).

```bash
sudo apt install qtcreator qt6-base-dev qt6-declarative-dev cmake build-essential
sudo dnf install qt-creator qt6-qtbase-devel cmake gcc-c++
```

- Un **kit** associe un compilateur, une version de Qt, un débogueur et CMake : *Édition → Préférences → Kits*.
- Projets **CMake** de préférence (qmake est l'ancien système de Qt).
- Outils intégrés : concepteur d'interfaces (Qt Widgets Designer), profileur QML, analyse avec clang-tidy et Clazy, intégration Git.
- **Licences** : Qt est disponible sous **LGPL/GPL** (obligations à respecter : liens dynamiques, publication des modifications de Qt…) ou sous licence commerciale ; à vérifier avant de distribuer une application.

## Code::Blocks

Windows : installateur du site Code::Blocks, de préférence la version **fournie avec MinGW** si aucun compilateur n'est présent.

```bash
sudo apt install codeblocks build-essential gdb
sudo dnf install codeblocks gcc-c++ gdb
```

- À la première ouverture, Code::Blocks détecte les compilateurs installés (GCC, MinGW, Clang).
- *Fichier → Nouveau → Projet → Console application* puis `F9` pour compiler et exécuter.
- Apprécié pour l'**enseignement du C et du C++** et sur des postes modestes.

## Quel IDE pour quel besoin ?

| Besoin | Choix courant |
| --- | --- |
| Scripts, configurations, Ansible, Terraform | [[01-vscode\|VS Code]] ou [[11-vscodium\|VSCodium]] |
| Java d'entreprise | IntelliJ IDEA ([[02-jetbrains-intellij-pycharm\|JetBrains]]), Eclipse, NetBeans |
| C++ avec interface Qt | Qt Creator |
| Apprentissage du C/C++, poste léger | Code::Blocks, Geany |
| .NET, C# | [[03-visual-studio\|Visual Studio]], JetBrains Rider |

Commandes : [[90-aide-memoire|aide-mémoire]].
