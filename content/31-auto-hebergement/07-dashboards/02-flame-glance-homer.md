---
title: Flame, Organizr, Glance, Homer, Fenrus, DashMachine et SUI
description: Autres tableaux de bord de démarrage — Flame (dashboard éditable en direct avec gestion d'applets et de signets, PIN), Organizr (portail unifiant plusieurs services avec onglets et SSO d'organisation), Glance (configuration YAML orientée widgets d'information : flux RSS, marchés, météo, Docker), Homer (page statique YAML ultra-légère), Fenrus, DashMachine et SUI (projets plus confidentiels ou en veille) ; critères de choix et légèreté.
tags: [dashboard, flame, organizr, glance, homer, fenrus, dashmachine, sui, auto-hébergement]
icon: layout-dashboard
---

Au-delà des grands tableaux de bord ([[01-homepage-homarr-dashy|Homepage, Homarr, Dashy, Heimdall]]), plusieurs projets couvrent des besoins ou des goûts particuliers : édition en direct, portail multi-services, widgets d'actualité ou extrême légèreté.

## Flame

**Flame** se gère **entièrement depuis l'interface** (pas de YAML) : on ajoute applications et signets à la volée, organisés par catégories, avec recherche et un **code PIN** pour passer en mode édition.

```bash
docker run -d --name flame -p 127.0.0.1:5005:5005 \
  -v /srv/flame:/app/data -e PASSWORD='…' pawelmalak/flame
```

## Organizr

**Organizr** est un **portail** qui regroupe plusieurs services dans des **onglets** au sein d'une seule page, avec gestion d'utilisateurs et **authentification** partagée (utile pour présenter un ensemble de services derrière une porte d'entrée commune). Historiquement lié aux écosystèmes de médias.

```bash
docker run -d --name organizr -p 127.0.0.1:8096:80 -v /srv/organizr:/config organizr/organizr
```

## Glance

**Glance** met l'accent sur les **widgets d'information** : flux RSS, marchés, météo, état des conteneurs Docker, serveurs, le tout dans une page dense configurée en **YAML**. Plus « page d'accueil informative » que simple lanceur de liens.

```yaml glance.yml (extrait)
pages:
  - name: Accueil
    columns:
      - size: small
        widgets:
          - { type: weather, location: Lyon, France }
      - size: full
        widgets:
          - { type: rss, feeds: [ { url: https://blog.exemple.fr/rss } ] }
          - { type: docker-containers }
```

```bash
docker run -d --name glance -p 127.0.0.1:8082:8080 \
  -v /srv/glance/glance.yml:/app/config/glance.yml -v /var/run/docker.sock:/var/run/docker.sock:ro \
  glanceapp/glance
```

## Homer

**Homer** est une **page statique** générée depuis un seul fichier YAML : aucune base, empreinte minime, servie par n'importe quel serveur web. Idéal quand on veut juste une grille de liens rapide et robuste.

```bash
docker run -d --name homer -p 127.0.0.1:8083:8080 -v /srv/homer:/www/assets b4bz/homer:latest
# éditer assets/config.yml
```

## Fenrus, DashMachine et SUI

Projets plus **confidentiels** ou à l'activité variable, cités pour complétude :

- **Fenrus** : dashboard avec widgets « intelligents » et profils par utilisateur.
- **DashMachine** : dashboard à widgets configurés en INI (développement ralenti).
- **SUI** (*Simple UI*) : page d'accueil minimaliste, purement statique.

Avant d'adopter l'un d'eux, **vérifier son activité** récente ; les options maintenues ci-dessus couvrent les mêmes besoins.

## Choisir

| Besoin | Outil |
| --- | --- |
| Tout éditer dans l'interface | Flame |
| Portail multi-services avec onglets et SSO | Organizr |
| Page d'accueil riche en infos (RSS, météo, Docker) | Glance |
| Grille de liens ultra-légère et statique | Homer (ou SUI) |
| Widgets de services, découverte Docker | [[01-homepage-homarr-dashy\|Homepage]] |

Commandes : [[90-aide-memoire|aide-mémoire]].
