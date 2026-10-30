---
title: Pipelines, agents et identifiants
description: Écrire des pipelines Jenkins déclaratifs (Jenkinsfile — agents, étapes, environnement, identifiants, conditions, parallélisme, post-actions), pipelines multibranches et webhooks, bibliothèques partagées, agents (SSH, entrants WebSocket, Windows, Docker et Kubernetes éphémères) et gestion des identifiants.
tags: [jenkins, jenkinsfile, pipeline, agents, credentials, multibranch, docker, kubernetes]
icon: workflow
---

## Jenkinsfile déclaratif

```jenkinsfile Jenkinsfile (sauvegarde et contrôle des configurations réseau)
pipeline {
  agent { label 'linux && docker' }

  options {
    timeout(time: 30, unit: 'MINUTES')
    buildDiscarder(logRotator(numToKeepStr: '30'))
    disableConcurrentBuilds()
    timestamps()
  }

  triggers { cron('H 2 * * *') }          // chaque nuit (H = répartition pseudo-aléatoire)

  environment {
    INVENTAIRE = 'inventaires/production'
  }

  stages {
    stage('Vérifier') {
      agent { docker { image 'registre.corp.exemple.fr/outils/ansible:10' } }
      steps {
        sh 'yamllint . && ansible-lint playbooks/'
      }
    }
    stage('Sauvegarder les configurations') {
      steps {
        withCredentials([sshUserPrivateKey(credentialsId: 'ansible-reseau', keyFileVariable: 'CLE_SSH', usernameVariable: 'UTILISATEUR')]) {
          sh 'ansible-playbook -i "$INVENTAIRE" playbooks/sauvegarde.yml --private-key "$CLE_SSH" -u "$UTILISATEUR"'
        }
      }
    }
    stage('Déployer') {
      when { branch 'main' }
      input { message 'Déployer en production ?'; ok 'Déployer' }
      steps {
        sh 'ansible-playbook -i "$INVENTAIRE" playbooks/deployer.yml --diff'
      }
    }
  }

  post {
    always   { archiveArtifacts artifacts: 'sauvegardes/**', allowEmptyArchive: true }
    failure  { mail to: 'reseau@exemple.fr', subject: "Échec ${env.JOB_NAME} #${env.BUILD_NUMBER}", body: "${env.BUILD_URL}" }
  }
}
```

| Directive | Rôle |
| --- | --- |
| `agent` | Où exécuter (étiquette, conteneur Docker, pod Kubernetes) |
| `stages` / `steps` | Étapes et commandes |
| `when` | Condition (branche, étiquette, changement de fichiers) |
| `parallel` | Étapes en parallèle |
| `input` | Validation humaine |
| `post` | Actions finales (`always`, `success`, `failure`, `cleanup`) |
| `withCredentials` | Injecte un identifiant le temps d'un bloc (masqué dans les journaux) |

## Pipelines multibranches

Un job **Multibranch Pipeline** (ou **Organization Folder**) découvre les branches et demandes de fusion d'un dépôt et crée un pipeline pour chacune à partir de leur `Jenkinsfile`. Configurez un **webhook** dans la forge (GitLab, Gitea, GitHub) vers Jenkins pour déclencher immédiatement les builds.

## Bibliothèques partagées

```groovy vars/notifierEquipe.groovy (dépôt « jenkins-bibliotheque »)
def call(String statut) {
  mail to: 'reseau@exemple.fr', subject: "${env.JOB_NAME} : ${statut}", body: env.BUILD_URL
}
```

```jenkinsfile Utilisation
@Library('jenkins-bibliotheque@main') _
pipeline {
  agent any
  stages { stage('Test') { steps { echo 'ok' } } }
  post { always { notifierEquipe(currentBuild.currentResult) } }
}
```

Déclarée dans *Manage Jenkins → System → Global Pipeline Libraries*.

## Agents

| Type | Configuration |
| --- | --- |
| **SSH** (Linux) | Greffon *SSH Build Agents* : le contrôleur se connecte à l'agent (Java installé sur l'agent) |
| **Entrant** (Windows, réseau isolé) | L'agent se connecte au contrôleur (WebSocket via HTTPS, ou TCP 50000) ; service Windows |
| **Docker** | Greffon *Docker* : conteneurs éphémères comme agents |
| **Kubernetes** | Greffon *Kubernetes* : un pod par build, détruit ensuite |

```bash
# Agent entrant en WebSocket (commande fournie par Jenkins dans la page du nœud)
java -jar agent.jar -url https://jenkins.corp.exemple.fr/ -secret <secret> -name agent-win-01 -webSocket -workDir C:\jenkins
```

```jenkinsfile Pod Kubernetes comme agent
pipeline {
  agent {
    kubernetes {
      yaml '''
        apiVersion: v1
        kind: Pod
        spec:
          containers:
            - name: outils
              image: registre.corp.exemple.fr/outils/ansible:10
              command: ["sleep"]
              args: ["infinity"]
      '''
    }
  }
  stages { stage('Lint') { steps { container('outils') { sh 'ansible-lint' } } } }
}
```

## Identifiants

*Manage Jenkins → Credentials* : nom d'utilisateur/mot de passe, clé SSH, texte secret, fichier secret, certificat. Rangez-les par **dossier** (portée limitée aux jobs du dossier) et non globalement. Pour des secrets centralisés : greffons *HashiCorp Vault*, *Azure Key Vault*, *AWS Secrets Manager*.

> [!WARNING]
> Un pipeline peut afficher un identifiant malgré le masquage (par exemple en l'encodant). Les jobs de branches **non fusionnées** (demandes de fusion de contributeurs) ne doivent pas avoir accès aux identifiants de production.
