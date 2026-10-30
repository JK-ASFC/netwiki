---
title: Jenkins — aide-mémoire des commandes
description: Commandes Jenkins avec exemples — service, mot de passe initial, CLI jenkins-cli.jar (jobs, builds, plugins, redémarrage sécurisé, groovy), API REST (crumb, déclenchement avec paramètres, état, file d'attente), gestionnaire de plugins (jenkins-plugin-cli), Configuration as Code (JCasC), agents (inbound, SSH), console de scripts Groovy, sauvegarde de JENKINS_HOME, Jenkinsfile type.
tags: [aide-mémoire, jenkins, jenkins-cli, pipeline, jcasc, api]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Jenkins]].

## Service

```bash
sudo systemctl status jenkins
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
sudo systemctl edit jenkins          # Environment="JAVA_OPTS=-Xmx2g" / port, etc.
sudo journalctl -u jenkins -f
```

## jenkins-cli

```bash
J="java -jar jenkins-cli.jar -s https://jenkins.exemple.fr/ -auth amartin:$JETON_API"
wget https://jenkins.exemple.fr/jnlpJars/jenkins-cli.jar
$J who-am-i
$J list-jobs
$J build sauvegarde-configs -s -v -p ENV=prod        # attendre la fin et afficher la sortie
$J console sauvegarde-configs 42
$J get-job sauvegarde-configs > job.xml
$J create-job nouveau-job < job.xml
$J disable-job ancien-job
$J list-plugins | grep -i git
$J install-plugin configuration-as-code -restart
$J safe-restart                                      # après la fin des builds en cours
$J quiet-down && $J cancel-quiet-down
$J groovy = < script.groovy
```

## API REST

```bash
U="https://jenkins.exemple.fr"; A="amartin:$JETON_API"
curl -s -u "$A" "$U/api/json?tree=jobs[name,color]" | jq '.jobs[] | {name, color}'
curl -s -u "$A" "$U/job/sauvegarde-configs/lastBuild/api/json" | jq '{number, result, duration}'
curl -s -u "$A" -X POST "$U/job/sauvegarde-configs/buildWithParameters?ENV=prod"
curl -s -u "$A" "$U/job/sauvegarde-configs/lastBuild/consoleText" | tail -20
curl -s -u "$A" "$U/queue/api/json" | jq '.items[] | {id, why}'
```

(Avec un jeton d'API, le *crumb* CSRF n'est pas nécessaire.)

## Plugins et configuration en code

```bash
jenkins-plugin-cli --plugins git workflow-aggregator configuration-as-code credentials-binding
```

```yaml
# jenkins.yaml (JCasC)
jenkins:
  systemMessage: "Jenkins NetWiki — usage interne"
  numExecutors: 0
  securityRealm:
    ldap:
      configurations:
        - server: "ldaps://dc01.corp.exemple.fr"
          rootDN: "DC=corp,DC=exemple,DC=fr"
unclassified:
  location:
    url: "https://jenkins.exemple.fr/"
```

## Agents

```bash
java -jar agent.jar -url https://jenkins.exemple.fr/ -secret "$SECRET_AGENT" -name agent-linux-01 -workDir /opt/jenkins-agent
```

## Jenkinsfile type

```groovy
pipeline {
  agent { label 'linux' }
  options { timeout(time: 30, unit: 'MINUTES'); buildDiscarder(logRotator(numToKeepStr: '30')) }
  stages {
    stage('Lint') { steps { sh 'ansible-lint playbooks/' } }
    stage('Déploiement') {
      when { branch 'main' }
      steps {
        withCredentials([sshUserPrivateKey(credentialsId: 'ssh-reseau', keyFileVariable: 'CLE')]) {
          sh 'ansible-playbook -i inventaire/prod playbooks/configs.yml --private-key "$CLE"'
        }
      }
    }
  }
  post { failure { mail to: 'reseau@exemple.fr', subject: "Échec ${env.JOB_NAME}", body: "${env.BUILD_URL}" } }
}
```

## Sauvegarde

```bash
sudo tar czf /srv/sauvegardes/jenkins-$(date +%F).tar.gz -C /var/lib/jenkins --exclude='workspace' --exclude='caches' .
```
