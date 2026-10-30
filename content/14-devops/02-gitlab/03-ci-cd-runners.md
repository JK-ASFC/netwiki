---
title: CI/CD et GitLab Runner
description: Écrire des pipelines GitLab CI (.gitlab-ci.yml — étapes, règles, artefacts, cache, environnements, variables protégées et masquées), construire des images sans Docker-in-Docker privilégié, installer et enregistrer des runners (Linux, Windows, Docker, Kubernetes) avec les jetons d'authentification, choisir l'exécuteur, et exemple de pipeline d'infrastructure réseau.
tags: [gitlab, ci/cd, gitlab-ci.yml, runner, docker, kubernetes, pipeline, variables]
icon: workflow
---

## Pipeline : .gitlab-ci.yml

```yaml .gitlab-ci.yml (dépôt de configurations réseau)
stages: [ verifier, generer, deployer ]

default:
  image: registre.corp.exemple.fr/outils/ansible:10
  tags: [ linux, docker ]

variables:
  ANSIBLE_FORCE_COLOR: "true"

lint:
  stage: verifier
  script:
    - yamllint .
    - ansible-lint playbooks/
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH

generer-configs:
  stage: generer
  script:
    - ansible-playbook playbooks/generer.yml
    - git diff --no-index --stat configs-actuelles/ configs-generees/ || true
  artifacts:
    paths: [ configs-generees/ ]
    expire_in: 7 days

deployer-production:
  stage: deployer
  script:
    - ansible-playbook -i inventaires/production playbooks/deployer.yml --diff
  environment:
    name: production
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
      when: manual            # validation humaine avant déploiement
  resource_group: production  # un seul déploiement à la fois
```

| Mot-clé | Rôle |
| --- | --- |
| `stages` | Ordre des étapes (les jobs d'une même étape s'exécutent en parallèle) |
| `rules` | Conditions d'exécution (branche, demande de fusion, fichiers modifiés `changes:`) |
| `needs` | Dépendances directes entre jobs (graphe sans attendre la fin d'une étape) |
| `artifacts` | Fichiers conservés et transmis aux jobs suivants |
| `cache` | Dépendances réutilisées entre pipelines |
| `environment` | Suivi des déploiements, historique, retour arrière |
| `include` | Modèles partagés (`include: project: outils/modeles-ci`) |
| `tags` | Choix des runners |

## Variables et secrets

*Settings → CI/CD → Variables* :

| Option | Effet |
| --- | --- |
| **Protégée** | Disponible seulement sur les branches/étiquettes protégées |
| **Masquée** | Cachée dans les journaux des jobs |
| Type « fichier » | Écrite dans un fichier temporaire (clé SSH, kubeconfig) |
| Portée d'environnement | Valeur différente par environnement |

Pour des secrets dynamiques : intégration **Vault** (jetons JWT/OIDC des jobs) ou fournisseurs cloud.

## Construire des images

```yaml
construire-image:
  stage: generer
  image:
    name: gcr.io/kaniko-project/executor:v1.23.2-debug
    entrypoint: [""]
  script:
    - /kaniko/executor --context "$CI_PROJECT_DIR" --dockerfile Dockerfile
        --destination "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA"
```

Kaniko ou Buildah construisent sans démon Docker privilégié ; *Docker-in-Docker* exige un runner en mode `privileged` (risque d'évasion du conteneur).

## Runners

### Installation

```bash
# Linux
curl -L "https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh" | sudo bash
sudo apt install gitlab-runner
```

```powershell
# Windows
New-Item -ItemType Directory C:\GitLab-Runner
Invoke-WebRequest -Uri https://gitlab-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-runner-windows-amd64.exe -OutFile C:\GitLab-Runner\gitlab-runner.exe
cd C:\GitLab-Runner ; .\gitlab-runner.exe install ; .\gitlab-runner.exe start
```

Kubernetes : chart Helm `gitlab/gitlab-runner`. macOS : `brew install gitlab-runner`.

### Enregistrement

Créez le runner dans l'interface (*Admin → CI/CD → Runners* ou au niveau d'un groupe/projet) : GitLab fournit un **jeton d'authentification** (`glrt-…`). Les anciens jetons d'enregistrement sont dépréciés.

```bash
sudo gitlab-runner register --non-interactive \
  --url "https://gitlab.corp.exemple.fr" \
  --token "glrt-XXXXXXXXXXXXXXXX" \
  --executor docker \
  --docker-image "alpine:3.20" \
  --description "runner-docker-01"
sudo gitlab-runner list
sudo gitlab-runner verify
```

```ini /etc/gitlab-runner/config.toml (extrait)
concurrent = 8

[[runners]]
  name = "runner-docker-01"
  url = "https://gitlab.corp.exemple.fr"
  executor = "docker"
  [runners.docker]
    image = "alpine:3.20"
    privileged = false
    volumes = ["/cache"]
    pull_policy = ["if-not-present"]
    allowed_images = ["registre.corp.exemple.fr/*", "alpine:*"]
```

| Exécuteur | Usage |
| --- | --- |
| **docker** | Cas général : chaque job dans un conteneur propre |
| **kubernetes** | Jobs en pods, mise à l'échelle |
| shell | Commandes directement sur la machine du runner (outils installés localement ; moins isolé) |
| docker-autoscaler / instance | Machines créées à la demande (cloud, vSphere via greffons) |

> [!WARNING]
> Un runner **partagé** exécute le code de tous les projets : ne lui donnez pas d'accès réseau ou d'identifiants privilégiés. Les déploiements en production passent par des runners **dédiés**, à étiquette spécifique, réservés aux branches protégées.

## Supervision des pipelines

*CI/CD → Pipelines*, *Analytics → CI/CD*, métriques Prometheus du runner (`listen_address = ":9252"` dans `config.toml`).
