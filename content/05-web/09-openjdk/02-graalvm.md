---
title: GraalVM Community Edition
description: GraalVM Community Edition — JDK basé sur OpenJDK avec le compilateur Graal, la compilation anticipée native-image (exécutables natifs à démarrage rapide et faible empreinte) et les langages Truffle (JavaScript, Python, Ruby) : installation (archives GitHub, SDKMAN, Homebrew, Docker, Windows avec les outils MSVC), native-image avec Maven, Gradle, Spring Boot, Quarkus et Micronaut, fichiers de configuration de réflexion, agent de traçage, et limites en production.
tags: [graalvm, native-image, java, jdk, quarkus, spring boot, aot]
icon: info
---

**GraalVM Community Edition** (GPL avec exception Classpath) est un **JDK complet** (à utiliser comme [[01-installation-exploitation|Temurin]]) auquel s'ajoute **`native-image`** : la compilation anticipée transforme une application Java en **exécutable natif** qui démarre en quelques millisecondes et consomme peu de mémoire — idéal pour les conteneurs, les fonctions serverless et les outils en ligne de commande.

## Installation

```bash
# SDKMAN (Linux, macOS, WSL)
curl -s "https://get.sdkman.io" | bash && source ~/.sdkman/bin/sdkman-init.sh
sdk list java | grep graalce ; sdk install java 21-graalce   # identifiant exact selon « sdk list java »
# Archive officielle (GitHub graalvm/graalvm-ce-builds), puis
export JAVA_HOME=/opt/graalvm-community-openjdk-21 && export PATH=$JAVA_HOME/bin:$PATH
java -version ; native-image --version
```

| Système | Méthode |
| --- | --- |
| Linux | Archive `graalvm-community-jdk-…_linux-x64_bin.tar.gz` ou SDKMAN ; prérequis natifs : `gcc`, `zlib1g-dev` (`zlib-devel` sur RHEL) |
| macOS | `brew install --cask graalvm-community-jdk21` (ou archive) + `xcode-select --install` |
| Windows | Archive ZIP + **Visual Studio Build Tools** (C++) ; lancer `native-image` depuis l'invite « x64 Native Tools » |
| Docker | `ghcr.io/graalvm/native-image-community:21` (construction), exécution sur image minimale |

## Construire un exécutable natif

```bash
native-image -jar outil.jar outil                     # JAR exécutable → binaire ./outil
./mvnw -Pnative native:compile                        # Spring Boot 3 (plugin native-maven-plugin)
./mvnw package -Dnative                               # Quarkus
./gradlew nativeCompile                               # Gradle (plugin org.graalvm.buildtools.native)
```

La réflexion, les ressources et les proxys dynamiques doivent être déclarés : lancer l'application sur la JVM avec l'agent de traçage pour générer la configuration.

```bash
java -agentlib:native-image-agent=config-output-dir=src/main/resources/META-INF/native-image -jar outil.jar
```

> [!NOTE]
> La compilation native est lente et gourmande (plusieurs Go de RAM) : faites-la en CI. En contrepartie, le débit maximal d'une application de longue durée peut être inférieur à celui de la JVM avec JIT ; mesurez avant de généraliser.

Commandes Java communes : [[90-aide-memoire|aide-mémoire]].
