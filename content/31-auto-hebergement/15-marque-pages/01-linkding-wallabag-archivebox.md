---
title: Linkding, Shiori, Linkwarden, Hoarder, Wallabag, Readeck, ArchiveBox et Changedetection.io
description: Enregistrer, lire et archiver le web — marque-pages (Linkding léger, Shiori en un binaire Go, Linkwarden avec archivage intégré, Hoarder/Karakeep avec IA et recherche plein texte), lecture différée (Wallabag, Readeck : article propre sans publicité, hors ligne), archivage de pages (ArchiveBox : capture HTML/PDF/WARC/capture d'écran) et surveillance de changements (Changedetection.io) ; usages en veille et sécurité.
tags: [marque-pages, linkding, shiori, linkwarden, hoarder, karakeep, wallabag, readeck, archivebox, changedetection]
icon: bookmark
---

Reprendre le contrôle de ses **liens** et de sa **veille**, sans dépendre de Pocket, Instapaper ou des favoris d'un navigateur : ces outils enregistrent, lisent, archivent et surveillent des pages web, en auto-hébergement.

## Marque-pages

| Outil | Caractéristique |
| --- | --- |
| **Linkding** | Léger et rapide (Python), étiquettes, extension de navigateur, API, import/export Netscape |
| **Shiori** | Un seul binaire Go + SQLite, archive une copie de la page, interface et CLI |
| **Linkwarden** | Marque-pages **avec archivage intégré** (capture, PDF, lecture), collections, partage, organisation |
| **Hoarder / Karakeep** | Marque-pages, notes et images, **recherche plein texte**, étiquetage **assisté par IA** (modèle local possible) |

```bash
# Linkding
docker run -d --name linkding -p 127.0.0.1:9090:9090 \
  -e LD_SUPERUSER_NAME=admin -e LD_SUPERUSER_PASSWORD='…' \
  -v /srv/linkding:/etc/linkding/data sissbruecker/linkding:latest

# Shiori
docker run -d --name shiori -p 127.0.0.1:8080:8080 -v /srv/shiori:/shiori ghcr.io/go-shiori/shiori
```

> **Karakeep** est le nouveau nom de **Hoarder** : le projet a été renommé, en chercher la documentation sous les deux noms.

## Lecture différée

**Wallabag** et **Readeck** enregistrent un article en version **nettoyée** (sans publicité ni fioritures), lisible plus tard, y compris **hors ligne**, avec étiquettes et export (EPUB, PDF).

```bash
# Wallabag (PHP) — base MySQL/PostgreSQL/SQLite
docker run -d --name wallabag -p 127.0.0.1:8080:80 \
  -e SYMFONY__ENV__DATABASE_DRIVER=pdo_sqlite \
  -v /srv/wallabag:/var/www/wallabag/data wallabag/wallabag
# Readeck (Go), plus récent et léger
docker run -d --name readeck -p 127.0.0.1:8000:8000 -v /srv/readeck:/readeck codeberg.org/readeck/readeck:latest
```

Applications mobiles et extensions permettent d'y envoyer des pages en un clic ; Wallabag remplace avantageusement Pocket.

## Archivage de pages

**ArchiveBox** capture des pages de façon **durable** dans plusieurs formats à la fois : **HTML**, **PDF**, **capture d'écran**, **WARC**, texte, et récupère même des vidéos (yt-dlp). Utile pour conserver une preuve ou une référence qui pourrait disparaître.

```bash
mkdir -p /srv/archivebox && cd /srv/archivebox
docker run -v "$PWD":/data -it archivebox/archivebox init
docker run -d --name archivebox -p 127.0.0.1:8000:8000 -v /srv/archivebox:/data archivebox/archivebox
docker exec -it archivebox archivebox add 'https://exemple.fr/page-importante'
```

## Surveillance de changements

**Changedetection.io** surveille des pages web et **alerte** quand elles changent (prix, disponibilité, mise à jour d'une politique, d'une page de version…), avec filtres (sélecteur CSS/XPath, zones ignorées) et notifications. Rendu des pages dynamiques via un navigateur (Playwright) optionnel.

```bash
docker run -d --name changedetection -p 127.0.0.1:5000:5000 \
  -v /srv/changedetection:/datastore changedetection/changedetection.io
```

## Usages en veille

- **Veille technique et sécurité** : surveiller des pages de version, des avis de sécurité, des changelogs (Changedetection) ; archiver les articles de référence (ArchiveBox) ; collecter et étiqueter (Linkwarden, Karakeep).
- **Documentation** : conserver une copie d'une page externe citée dans une procédure, pour qu'elle reste disponible même si l'original disparaît.

## Sécurité

- Ces outils **vont chercher des pages** sur Internet depuis le serveur : les isoler, se méfier des requêtes vers le réseau interne (SSRF) déclenchées par des URL saisies.
- Authentification sur l'interface, HTTPS, **sauvegarde** de la base et des archives (les captures peuvent représenter beaucoup de données).
- Respecter le **droit d'auteur** et les conditions des sites pour l'archivage, et la vie privée pour ce qui est collecté.

## Choisir

| Besoin | Outil |
| --- | --- |
| Marque-pages simples et rapides | Linkding, Shiori |
| Marque-pages + archivage + lecture | Linkwarden |
| Marque-pages avec recherche et IA | Hoarder/Karakeep |
| Lire les articles plus tard, hors ligne | Wallabag, Readeck |
| Archiver durablement des pages | ArchiveBox |
| Être alerté quand une page change | Changedetection.io |

Commandes : [[90-aide-memoire|aide-mémoire]].
