---
title: Cozy Cloud
description: Cozy Cloud — cloud personnel libre (AGPL, Cozy/Linagora) : fichiers, photos, contacts, mots de passe (Cozy Pass), notes, connecteurs vers des services en ligne ; architecture (cozy-stack en Go, CouchDB, sous-domaines par instance et par application), installation auto-hébergée sur Debian/Ubuntu (dépôt, cozy-stack, CouchDB, NGINX, certificats génériques), création d'instances (cozy-stack instances add), applications, client de synchronisation et limites.
tags: [cozy cloud, cloud personnel, couchdb, auto-hébergement, linagora]
icon: info
---

**Cozy** fournit à chaque utilisateur (ou famille) son **cloud personnel** : fichiers, photos, contacts, agenda, notes, gestionnaire de mots de passe et applications de récupération automatique de documents (factures, relevés). Le service est proposé en ligne ; l'auto-hébergement est possible mais demande un peu de préparation DNS.

## Architecture

- **cozy-stack** (Go) : API, authentification, applications.
- [[07-couchdb/01-presentation-installation|CouchDB]] : données.
- **Un sous-domaine par instance et par application** (`jk.cozy.corp.exemple.fr`, `jk-drive.cozy.corp.exemple.fr`) : prévoir un enregistrement DNS générique et un **certificat générique** (`*.cozy.corp.exemple.fr`).

## Installation (Debian/Ubuntu)

```bash
# Dépôt apt.cozy.io (clé et sources selon la documentation), puis
sudo apt install cozy-stack couchdb nginx
sudo cozy-stack instances add jk.cozy.corp.exemple.fr --apps home,drive,photos,settings,contacts,notes,passwords \
  --email jk@corp.exemple.fr --locale fr --passphrase "$MDP"
sudo cozy-stack instances ls
```

Docker : image `cozy/cozy-stack` pour le développement. Clients : Cozy Drive (Windows, macOS, Linux), applications Android et iOS.

Suite : [[03-projectsend-pingvin|ProjectSend et Pingvin Share]] · [[90-aide-memoire|aide-mémoire]].
