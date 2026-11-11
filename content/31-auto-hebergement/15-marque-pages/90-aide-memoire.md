---
title: Marque-pages et archivage — aide-mémoire
description: Déploiement Docker et ports de Linkding, Shiori, Linkwarden, Hoarder/Karakeep, Wallabag, Readeck, ArchiveBox et Changedetection.io.
tags: [aide-mémoire, linkding, shiori, linkwarden, karakeep, wallabag, readeck, archivebox, changedetection]
icon: terminal
---

Explications : [[01-linkding-wallabag-archivebox|Linkding, Shiori, Linkwarden, Hoarder, Wallabag, Readeck, ArchiveBox et Changedetection.io]].

| Outil | Port | Rôle |
| --- | --- | --- |
| Linkding | 9090 | marque-pages |
| Shiori | 8080 | marque-pages + copie |
| Linkwarden | 3000 | marque-pages + archivage |
| Hoarder/Karakeep | 3000 | marque-pages + IA |
| Wallabag | 80 (conteneur) | lecture différée |
| Readeck | 8000 | lecture différée |
| ArchiveBox | 8000 | archivage multi-format |
| Changedetection.io | 5000 | surveillance de changements |

```bash
# Linkding
docker run -d -p 9090:9090 -e LD_SUPERUSER_NAME=admin -e LD_SUPERUSER_PASSWORD='…' \
  -v /srv/linkding:/etc/linkding/data sissbruecker/linkding:latest

# Shiori
docker run -d -p 8080:8080 -v /srv/shiori:/shiori ghcr.io/go-shiori/shiori

# Wallabag / Readeck
docker run -d -p 8080:80 -v /srv/wallabag:/var/www/wallabag/data wallabag/wallabag
docker run -d -p 8000:8000 -v /srv/readeck:/readeck codeberg.org/readeck/readeck:latest

# ArchiveBox
docker run -v /srv/archivebox:/data -it archivebox/archivebox init
docker exec -it archivebox archivebox add 'https://exemple.fr/page'

# Changedetection.io
docker run -d -p 5000:5000 -v /srv/changedetection:/datastore changedetection/changedetection.io
```

> Isoler (requêtes sortantes, risque SSRF), authentifier, HTTPS, sauvegarder base + archives.
