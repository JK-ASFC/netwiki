---
title: OliveTin et Ansible Semaphore — aide-mémoire
description: Déploiement et configuration d'OliveTin (config.yaml, actions, arguments validés) et d'Ansible Semaphore (variables admin, base, modèles de tâches).
tags: [aide-mémoire, olivetin, semaphore, ansible, automatisation]
icon: terminal
---

Explications : [[01-olivetin-semaphore|OliveTin et Ansible Semaphore]].

| Outil | Port |
| --- | --- |
| OliveTin | 1337 |
| Semaphore | 3000 |

```bash
# OliveTin
docker run -d -p 1337:1337 -v /srv/olivetin/config.yaml:/config/config.yaml \
  -v /var/run/docker.sock:/var/run/docker.sock jamesread/olivetin
# config : actions[].shell, arguments[].type (ascii_identifier…), choices, popupOnStart

# Semaphore
docker run -d -p 3000:3000 -e SEMAPHORE_DB_DIALECT=bolt \
  -e SEMAPHORE_ADMIN=admin -e SEMAPHORE_ADMIN_PASSWORD='…' \
  -e SEMAPHORE_ADMIN_NAME="Admin" -e SEMAPHORE_ADMIN_EMAIL=admin@exemple.fr \
  -v /srv/semaphore:/etc/semaphore semaphoreui/semaphore:latest
# puis : Projet → Dépôt (Git) → Inventaire → Clés → Modèle de tâche → Lancer
```

> Accès restreint (auth forte, HTTPS, réseau d'admin), commandes/arguments contraints, compte d'exécution à privilèges minimaux.
