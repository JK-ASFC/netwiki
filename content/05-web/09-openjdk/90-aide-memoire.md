---
title: OpenJDK — aide-mémoire des commandes
description: Commandes Java avec exemples — installation et choix de la version (apt, dnf, winget, brew, update-alternatives, JAVA_HOME), exécution (java -jar, options mémoire et GC, propriétés), outils JDK de diagnostic (jcmd, jps, jstack, jmap, jstat, jfr, jconsole), keytool (magasins PKCS12, import d'AC, certificats), jlink et jpackage, variables d'environnement.
tags: [aide-mémoire, java, openjdk, jcmd, keytool, jvm]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-installation-exploitation|OpenJDK]].

## Installation et versions

```bash
sudo apt install openjdk-21-jdk-headless          # Debian/Ubuntu
sudo dnf install java-21-openjdk-devel            # RHEL/Fedora
brew install openjdk@21                           # macOS
java -version && javac -version
sudo update-alternatives --config java            # choisir la version par défaut
readlink -f "$(which java)"
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
```

```powershell
winget install EclipseAdoptium.Temurin.21.JDK
[Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Eclipse Adoptium\jdk-21", "Machine")
java -XshowSettings:properties -version 2>&1 | Select-String "java.home"
```

## Exécution et réglages de la JVM

```bash
java -jar app.jar
java -Xms1g -Xmx4g -XX:+UseG1GC -jar app.jar
java -XX:MaxRAMPercentage=75 -jar app.jar          # conteneurs : mémoire relative à la limite
java -Dspring.profiles.active=prod -Dfile.encoding=UTF-8 -jar app.jar
java -Xlog:gc*:file=/var/log/app/gc.log:time,uptime:filecount=5,filesize=20m -jar app.jar
java -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/var/tmp -jar app.jar
java -XX:+PrintFlagsFinal -version | grep -E "MaxHeapSize|UseG1GC"
JAVA_TOOL_OPTIONS="-Djava.net.preferIPv4Stack=true" java -jar app.jar
```

## Diagnostic

```bash
jps -lv                                     # JVM en cours
jcmd                                        # idem, avec PID
jcmd <pid> VM.version
jcmd <pid> VM.flags
jcmd <pid> VM.system_properties
jcmd <pid> Thread.print > threads.txt       # vidage des threads (blocages)
jcmd <pid> GC.heap_info
jcmd <pid> GC.class_histogram | head -30
jcmd <pid> GC.heap_dump /var/tmp/heap.hprof
jcmd <pid> JFR.start duration=120s filename=/var/tmp/enregistrement.jfr
jfr summary /var/tmp/enregistrement.jfr
jstat -gcutil <pid> 5000                    # GC toutes les 5 s
jstack <pid>
jmap -histo:live <pid> | head
```

Outils graphiques : **JDK Mission Control** (analyse JFR), **VisualVM**, `jconsole` (JMX).

## keytool

```bash
keytool -list -keystore keystore.p12 -storepass "$MDP"
keytool -genkeypair -alias app -keyalg RSA -keysize 3072 -validity 825 -dname "CN=app.exemple.fr,O=Exemple,C=FR" -ext "SAN=dns:app.exemple.fr" -keystore keystore.p12 -storetype PKCS12
keytool -certreq -alias app -file app.csr -keystore keystore.p12
keytool -importcert -alias app -file app.crt -keystore keystore.p12
# Importer une AC interne dans le magasin de confiance du JDK (mot de passe par défaut : changeit)
sudo keytool -importcert -cacerts -alias ac-interne -file ac-interne.crt -noprompt -storepass changeit
keytool -list -cacerts -alias ac-interne -storepass changeit
# Convertir un PEM (clé + certificat) en PKCS12
openssl pkcs12 -export -in app.crt -inkey app.key -certfile chaine.crt -name app -out keystore.p12
keytool -printcert -sslserver app.exemple.fr:443
```

## jlink et jpackage

```bash
jdeps --print-module-deps app.jar
jlink --add-modules java.base,java.logging,java.net.http --strip-debug --no-header-files --no-man-pages --output /opt/runtime-app
jpackage --name MonOutil --input target --main-jar app.jar --type deb       # msi (Windows), dmg (macOS)
```
