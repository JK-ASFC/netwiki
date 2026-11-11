---
title: Coolify, Dokku et CapRover
description: Plates-formes en tant que service (PaaS) auto-hébergées — rôle d'un PaaS (déployer applis et bases sans gérer l'infrastructure manuellement), Coolify (interface moderne, déploiement depuis Git, bases et services en un clic, certificats automatiques, multi-serveurs, webhooks), Dokku (mini-Heroku en ligne de commande, git push, buildpacks et Dockerfile, plugins), CapRover (interface web, applications en un clic, Docker Swarm, Captain) ; prérequis, sécurité et choix pour remplacer Heroku en interne.
tags: [paas, coolify, dokku, caprover, déploiement, git push, docker, heroku, auto-hébergement]
icon: rocket
---

Un **PaaS** (*Platform as a Service*) auto-hébergé automatise le déploiement d'applications et de bases de données : on pousse son code ou on choisit une image, la plate-forme construit, lance, expose en HTTPS et surveille. C'est l'équivalent interne d'Heroku ou de Vercel, sur ses propres serveurs.

## Coolify

**Coolify** est le PaaS auto-hébergé le plus en vue : interface web soignée, déploiement depuis **GitHub/GitLab** (webhooks), catalogue de **bases et services** à lancer en un clic, **certificats Let's Encrypt** automatiques, gestion de **plusieurs serveurs** et environnements.

```bash
# Installation sur un serveur dédié (Docker installé automatiquement)
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash
# Interface : http://IP:8000 (créer le compte administrateur immédiatement)
```

- Applications (Dockerfile, buildpacks Nixpacks, Docker Compose), bases (PostgreSQL, MySQL, MongoDB, Redis…), services prédéfinis.
- Déploiement **sur pré-production puis production**, variables d'environnement, sauvegardes de bases, journaux.
- Peut piloter des **serveurs distants** par SSH depuis une instance centrale.

> [!WARNING]
> Le script d'installation s'exécute en root et ouvre une interface qui **contrôle tout le serveur** : l'installer sur une machine dédiée, créer le compte admin **tout de suite**, placer l'interface derrière HTTPS et restreindre son accès (pas d'exposition publique du port d'administration).

## Dokku

**Dokku** est un **mini-Heroku** piloté en ligne de commande : on déploie par `git push`, avec les **buildpacks** Heroku ou un **Dockerfile**. Léger (un seul serveur), extensible par plugins (bases, Let's Encrypt).

```bash
# Installation (Debian/Ubuntu)
wget -NP . https://dokku.com/install/v0.x.x/bootstrap.sh
sudo DOKKU_TAG=v0.x.x bash bootstrap.sh
# Sur le serveur :
dokku apps:create monappli
dokku postgres:create madb && dokku postgres:link madb monappli    # plugin postgres
dokku domains:set monappli app.exemple.fr
dokku letsencrypt:enable monappli
# Sur le poste : ajouter le remote et pousser
git remote add dokku dokku@serveur:monappli && git push dokku main
```

Idéal pour un développeur ou une petite équipe qui veut la simplicité du `git push` sans interface web.

## CapRover

**CapRover** combine une **interface web** et une **ligne de commande**, sur **Docker Swarm** (possibilité de cluster). Catalogue d'**applications en un clic** (bases, outils), déploiement par Dockerfile, image ou CLI, certificats automatiques.

```bash
docker run -d -p 80:80 -p 443:443 -p 3000:3000 \
  -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain \
  --name captain caprover/caprover
npm install -g caprover && caprover serversetup      # configuration guidée (domaine, mot de passe)
caprover deploy                                       # depuis le dossier de l'application
```

## Prérequis et sécurité

- Un **serveur dédié** (VM ou machine), un **nom de domaine** avec un enregistrement générique (`*.apps.exemple.fr`) pour les sous-domaines automatiques, les ports 80/443 ouverts.
- Changer tous les **mots de passe par défaut**, protéger l'interface d'administration (réseau, SSO, pas d'exposition publique inutile).
- **Sauvegarder** : la configuration de la plate-forme **et** les volumes des bases ; tester une restauration.
- Tenir la plate-forme et les images à jour.

## Choisir

| Besoin | Outil |
| --- | --- |
| Interface moderne, multi-serveurs, catalogue riche | Coolify |
| Simplicité du `git push`, un serveur, en ligne de commande | Dokku |
| Interface + CLI, applications en un clic, Swarm | CapRover |
| Déjà sur Kubernetes | Voir les PaaS Kubernetes (chapitre conteneurs) |

Voir aussi : [[03-suites-homelab/01-homelabos-sandstorm|suites d'auto-hébergement]] · [[01-plateformes-auto-hebergement/01-presentation-comparatif|panorama de l'auto-hébergement]]. Commandes : [[90-aide-memoire|aide-mémoire]].
