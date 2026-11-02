---
title: ProjectSend et Pingvin Share
description: Partage de fichiers avec des tiers — ProjectSend (GPL, PHP/MySQL : dépôt de fichiers par l'équipe pour des clients nommés, groupes, notifications, journaux, installation LAMP ou Docker linuxserver) et Pingvin Share (BSD, alternative auto-hébergée à WeTransfer : partages temporaires avec expiration, mot de passe et limite de visites, dépôts inversés, OIDC/LDAP, stockage local ou S3, ClamAV, Docker) ; sécurité et choix.
tags: [projectsend, pingvin share, partage de fichiers, wetransfer, clients, docker]
icon: info
---

| | **ProjectSend** | **Pingvin Share** |
| --- | --- | --- |
| Principe | Espace **client** permanent : l'équipe dépose, le client se connecte | Lien **temporaire** à la WeTransfer |
| Comptes destinataires | Oui (clients, groupes) | Non (lien), comptes pour les émetteurs |
| Technologie | PHP + MySQL/MariaDB | Node.js + SQLite, image Docker |

## ProjectSend

```bash
docker run -d --name projectsend -p 8080:80 -e PUID=1000 -e PGID=1000 -e TZ=Europe/Paris \
  -v /srv/projectsend/config:/config -v /srv/projectsend/data:/data lscr.io/linuxserver/projectsend
```

Installation classique : archive dans la racine web ([[02-apache/01-presentation|Apache]] ou NGINX + PHP-FPM), base MariaDB, assistant `install/`. Fonctions : clients et groupes, fichiers attribués, dates d'expiration, notifications par e-mail, journal des téléchargements, inscription des clients (à désactiver si non souhaitée).

## Pingvin Share

```yaml
services:
  pingvin-share:
    image: stonith404/pingvin-share
    restart: unless-stopped
    ports: ["3000:3000"]
    environment:
      TRUST_PROXY: "true"
    volumes:
      - ./data:/opt/app/backend/data
      - ./images:/opt/app/frontend/public/img
```

Premier compte créé = administrateur. Réglages : taille maximale, expiration par défaut, inscription fermée, **OIDC** ou LDAP, stockage S3, **ClamAV** pour analyser les fichiers déposés, *reverse shares* (lien de dépôt envoyé à un tiers).

> [!WARNING]
> Une plate-forme de dépôt publique attire les abus (hébergement de logiciels malveillants, hameçonnage) : fermez l'inscription, imposez une authentification aux émetteurs, limitez tailles et durées, et activez l'antivirus ([[04-clamav/01-presentation-installation|ClamAV]]).

Interface : [[04-interface-graphique|interfaces graphiques]] · commandes : [[90-aide-memoire|aide-mémoire]].
