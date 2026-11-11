---
title: Dockge, Yacht et Komodo
description: Interfaces web de gestion de conteneurs Docker — Dockge (gestion de piles Docker Compose : éditeur compose, logs interactifs, conversion de docker run, fichiers sur disque, port 5001), Yacht (déploiement d'applications par modèles, interface simple), Komodo (ex-Monitor : gestion multi-serveurs, construction d'images, déploiements par dépôt Git, alertes) ; complément de Portainer et sécurité de l'accès au socket Docker.
tags: [docker, dockge, yacht, komodo, compose, conteneurs, portainer, auto-hébergement]
icon: container
---

[[08-portainer/01-presentation-installation|Portainer]] est déjà présenté dans le wiki. Voici trois alternatives, chacune avec un angle différent : piles Compose lisibles (Dockge), modèles d'applications (Yacht), gestion multi-serveurs et builds (Komodo).

## Dockge

**Dockge** (même auteur qu'Uptime Kuma) se concentre sur les **piles Docker Compose** : éditeur de `compose.yaml` avec coloration, démarrage/arrêt, **journaux interactifs**, et un outil qui **convertit une commande `docker run`** en Compose. Les piles restent de simples fichiers sur disque, modifiables aussi à la main.

```yaml compose.yaml (Dockge)
services:
  dockge:
    image: louislam/dockge:1
    restart: unless-stopped
    ports: [ "127.0.0.1:5001:5001" ]
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./data:/app/data
      - /opt/stacks:/opt/stacks          # dossier des piles (même chemin dans le conteneur)
    environment:
      - DOCKGE_STACKS_DIR=/opt/stacks
```

Idéal si l'on gère ses services en **Compose** et qu'on veut une interface sans renoncer aux fichiers versionnables.

## Yacht

**Yacht** vise la **simplicité** : déployer des applications à partir de **modèles** (templates) en remplissant un formulaire, plutôt qu'en écrivant du Compose. Interface épurée, pensée pour le homelab.

```bash
docker run -d --name yacht -p 127.0.0.1:8000:8000 \
  -v /var/run/docker.sock:/var/run/docker.sock -v yacht:/config \
  selfhostedpro/yacht
# Compte par défaut admin@yacht.local / pass — à changer immédiatement
```

> [!NOTE]
> Le développement de Yacht est **irrégulier** ; il reste utilisable mais vérifier son activité avant de s'en remettre à lui pour un usage durable.

## Komodo

**Komodo** (anciennement **Monitor**) va plus loin : gestion de **plusieurs serveurs** depuis une interface centrale, **construction d'images**, **déploiements depuis des dépôts Git** (le Compose vit dans Git), procédures, et **alertes**. Un agent (*periphery*) tourne sur chaque serveur géré.

```bash
# Cœur + base (Mongo/FerretDB) via le docker-compose fourni par le projet ; agent periphery sur chaque hôte
# Interface web du cœur ; chaque serveur ajouté exécute l'agent periphery
```

Adapté quand on administre **plusieurs machines** Docker et qu'on veut relier déploiement, build et supervision légère.

## Sécurité : l'accès au socket Docker

> [!WARNING]
> Toutes ces interfaces montent `/var/run/docker.sock` : **qui contrôle le socket Docker contrôle l'hôte** (on peut lancer un conteneur privilégié et prendre la machine). Donc : ne jamais exposer ces interfaces sur Internet, HTTPS + authentification forte, accès via réseau d'administration ou VPN, comptes par défaut changés. Pour limiter les risques, envisager un **proxy du socket** en lecture seule (par exemple un conteneur *docker-socket-proxy*) quand l'outil n'a pas besoin de tous les droits.

## Choisir

| Besoin | Outil |
| --- | --- |
| Interface Docker complète et mûre | [[08-portainer/01-presentation-installation\|Portainer]] |
| Piles Compose lisibles et versionnables | Dockge |
| Déploiement par modèles, très simple | Yacht |
| Multi-serveurs, builds, déploiement Git | Komodo |

Commandes : [[90-aide-memoire|aide-mémoire]].
