---
title: Homepage, Homarr, Dashy et Heimdall
description: Tableaux de bord de démarrage pour services auto-hébergés — Homepage (configuration YAML, widgets de services et de supervision, découverte Docker par étiquettes, variables d'environnement), Homarr (configuration par glisser-déposer, intégrations, authentification), Dashy (YAML, vérification d'état, thèmes, mode édition) et Heimdall (simple, catégories et « applications améliorées ») ; rôle d'un dashboard, sécurité des clés d'API et choix.
tags: [dashboard, homepage, homarr, dashy, heimdall, page d'accueil, auto-hébergement, widgets]
icon: layout-dashboard
---

Quand on auto-héberge beaucoup de services, un **tableau de bord de démarrage** sert de page d'accueil : il regroupe les liens, affiche l'**état** des services, des **widgets** (météo, système, flux) et parfois des données tirées des applications (nombre de téléchargements, tickets, etc.).

## Homepage

**Homepage** (gethomepage) est très prisé : configuration en **YAML** (versionnable), nombreux **widgets de services** (il interroge l'API de l'application pour afficher des infos), widgets d'**infrastructure** (CPU, RAM, Glances), et **découverte automatique** des conteneurs Docker par étiquettes.

```yaml config/services.yaml
- Infrastructure:
    - Proxmox:
        href: https://proxmox.exemple.fr:8006
        icon: proxmox.png
        widget: { type: proxmox, url: https://proxmox.exemple.fr:8006, username: api@pam!home, password: "{{HOMEPAGE_VAR_PROXMOX}}" }
    - Nextcloud:
        href: https://cloud.exemple.fr
        icon: nextcloud.png
```

```bash
docker run -d --name homepage -p 127.0.0.1:3000:3000 \
  -v /srv/homepage/config:/app/config -v /var/run/docker.sock:/var/run/docker.sock:ro \
  -e HOMEPAGE_VAR_PROXMOX="…" -e HOMEPAGE_ALLOWED_HOSTS=home.exemple.fr \
  ghcr.io/gethomepage/homepage:latest
```

Les secrets des widgets se passent par **variables d'environnement** (`HOMEPAGE_VAR_*` ou `HOMEPAGE_FILE_*`), pas en clair dans le YAML.

## Homarr

**Homarr** se configure **au clavier et à la souris** (glisser-déposer des tuiles), ce qui plaît à ceux qui ne veulent pas éditer de YAML. Intégrations avec de nombreux services, recherche, **authentification** intégrée et gestion d'utilisateurs.

```bash
docker run -d --name homarr -p 127.0.0.1:7575:7575 \
  -v /srv/homarr/data:/appdata ghcr.io/homarr-labs/homarr:latest
```

## Dashy

**Dashy** est configurable en **YAML** avec de nombreuses options : **vérification d'état** des services, thèmes, icônes, widgets, mode édition dans l'interface, authentification.

```yaml conf.yml (extrait)
sections:
  - name: Supervision
    items:
      - { title: Grafana, url: https://grafana.exemple.fr, icon: hl-grafana, statusCheck: true }
      - { title: Uptime Kuma, url: https://uptime.exemple.fr, icon: hl-uptime-kuma }
```

```bash
docker run -d --name dashy -p 127.0.0.1:8080:8080 -v /srv/dashy/conf.yml:/app/user-data/conf.yml lissy93/dashy:latest
```

## Heimdall

**Heimdall** est le plus **simple** : une grille d'icônes par catégories, avec des « applications améliorées » (*enhanced apps*) qui affichent une info (espace disque, nombre d'éléments) pour certains services. Pas de widgets système ni de découverte Docker.

```bash
docker run -d --name heimdall -p 127.0.0.1:8081:80 -v /srv/heimdall:/config lscr.io/linuxserver/heimdall:latest
```

## Sécurité

Un dashboard qui affiche des widgets détient des **clés d'API** vers les services : les stocker en variables (jamais dans un YAML versionné en clair), monter le socket Docker en **lecture seule**, protéger l'accès (authentification intégrée, ou proxy authentifié/SSO), et restreindre les hôtes autorisés (`HOMEPAGE_ALLOWED_HOSTS`).

## Choisir

| Besoin | Outil |
| --- | --- |
| Riche en widgets, découverte Docker, YAML | Homepage |
| Configuration visuelle, comptes | Homarr |
| YAML complet, état des services, thèmes | Dashy |
| Grille d'icônes très simple | Heimdall |

Voir aussi : [[02-flame-glance-homer|Flame, Glance, Homer et autres]]. Commandes : [[90-aide-memoire|aide-mémoire]].
