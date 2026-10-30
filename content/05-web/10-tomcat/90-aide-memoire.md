---
title: Apache Tomcat — aide-mémoire des commandes
description: Commandes Tomcat avec exemples — service et scripts (catalina.sh, startup, shutdown, version, configtest), variables (CATALINA_HOME, CATALINA_BASE, setenv.sh), déploiement (webapps, Manager texte avec curl), connecteurs HTTP/HTTPS et AJP, utilisateurs du Manager, durcissement, journaux, diagnostic (jcmd, vidage de threads), service Windows (tomcat10.exe, tomcat10w.exe).
tags: [aide-mémoire, tomcat, java, catalina, manager, servlet]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Tomcat]]. Installation d'exemple dans `/opt/tomcat` (Tomcat 10.1).

## Service et scripts

```bash
sudo systemctl status tomcat
/opt/tomcat/bin/version.sh
/opt/tomcat/bin/configtest.sh
/opt/tomcat/bin/catalina.sh run              # premier plan
/opt/tomcat/bin/startup.sh && /opt/tomcat/bin/shutdown.sh
sudo -u tomcat /opt/tomcat/bin/catalina.sh stop 30 -force
```

```bash
# /opt/tomcat/bin/setenv.sh — options de la JVM (créé par l'administrateur)
CATALINA_OPTS="-Xms1g -Xmx2g -XX:+UseG1GC -Djava.security.egd=file:/dev/./urandom"
CATALINA_PID="/opt/tomcat/temp/tomcat.pid"
```

## Déploiement

```bash
sudo cp app.war /opt/tomcat/webapps/                     # déploiement automatique (autoDeploy)
sudo rm -rf /opt/tomcat/webapps/app /opt/tomcat/webapps/app.war   # retrait
# Manager en mode texte (rôle manager-script)
curl -u deploy:"$MDP" "http://127.0.0.1:8080/manager/text/list"
curl -u deploy:"$MDP" -T app.war "http://127.0.0.1:8080/manager/text/deploy?path=/app&update=true"
curl -u deploy:"$MDP" "http://127.0.0.1:8080/manager/text/reload?path=/app"
curl -u deploy:"$MDP" "http://127.0.0.1:8080/manager/text/undeploy?path=/app"
curl -u deploy:"$MDP" "http://127.0.0.1:8080/manager/text/serverinfo"
curl -u deploy:"$MDP" "http://127.0.0.1:8080/manager/text/sessions?path=/app"
```

```xml
<!-- conf/tomcat-users.xml -->
<tomcat-users>
  <role rolename="manager-script"/>
  <user username="deploy" password="{empreinte}" roles="manager-script"/>
</tomcat-users>
```

```bash
/opt/tomcat/bin/digest.sh -a sha-256 -h org.apache.catalina.realm.MessageDigestCredentialHandler 'MotDePasse'
```

## Connecteurs

```xml
<!-- conf/server.xml -->
<Connector port="8080" protocol="HTTP/1.1" address="127.0.0.1" connectionTimeout="20000" redirectPort="8443" maxThreads="200" />
<Connector port="8443" protocol="org.apache.coyote.http11.Http11NioProtocol" SSLEnabled="true" maxThreads="200">
  <SSLHostConfig protocols="TLSv1.2+TLSv1.3">
    <Certificate certificateKeystoreFile="conf/keystore.p12" certificateKeystorePassword="${keystore.pass}" type="RSA" />
  </SSLHostConfig>
</Connector>
<!-- AJP uniquement si nécessaire, avec secret (Ghostcat) -->
<!-- <Connector protocol="AJP/1.3" address="127.0.0.1" port="8009" secretRequired="true" secret="SecretAJP" /> -->
<Server port="-1" shutdown="SHUTDOWN">   <!-- désactiver le port d'arrêt -->
```

## Durcissement rapide

```bash
sudo rm -rf /opt/tomcat/webapps/{docs,examples,host-manager,ROOT}
sudo chown -R root:tomcat /opt/tomcat/conf && sudo chmod -R g-w /opt/tomcat/conf
sudo chown -R tomcat:tomcat /opt/tomcat/{logs,temp,work,webapps}
```

```xml
<!-- Masquer la version dans les pages d'erreur : conf/server.xml, dans <Host> -->
<Valve className="org.apache.catalina.valves.ErrorReportValve" showReport="false" showServerInfo="false" />
<!-- Restreindre le Manager : webapps/manager/META-INF/context.xml -->
<Valve className="org.apache.catalina.valves.RemoteAddrValve" allow="127\.0\.0\.1|10\.0\.99\.\d+" />
```

## Journaux et diagnostic

```bash
tail -f /opt/tomcat/logs/catalina.out /opt/tomcat/logs/localhost.$(date +%F).log
tail -f /opt/tomcat/logs/localhost_access_log.$(date +%F).txt
jcmd $(cat /opt/tomcat/temp/tomcat.pid) Thread.print > /tmp/threads.txt
sudo ss -ltnp | grep java
```

## Windows

```powershell
cd "C:\Program Files\Apache Software Foundation\Tomcat 10.1\bin"
.\tomcat10.exe //IS//Tomcat10 --DisplayName="Apache Tomcat 10.1"      # installer le service (installeur : déjà fait)
.\tomcat10w.exe //ES//Tomcat10                                          # interface de configuration du service
Restart-Service Tomcat10
```
