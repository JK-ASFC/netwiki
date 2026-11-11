---
title: Paperless-ngx, Mayan EDMS, Teedy et Docspell — aide-mémoire
description: Ports, volumes et commandes de Paperless-ngx (createsuperuser, document_exporter, importer, retagger, sanity_checker), Mayan EDMS (Docker Compose), Teedy (Docker) et Docspell (Docker Compose, dsc watch).
tags: [aide-mémoire, paperless-ngx, mayan edms, teedy, docspell, ged]
icon: terminal
---

Explications : [[01-paperless-ngx|Paperless-ngx]] · [[02-mayan-teedy-docspell|Mayan EDMS, Teedy et Docspell]].

| GED | Port | Données à sauvegarder |
| --- | --- | --- |
| Paperless-ngx | 8000 | `media/`, `data/`, base PostgreSQL, export |
| Mayan EDMS | 80 (selon `.env`) | Volume `app`, PostgreSQL |
| Teedy | 8080 | `/data` (fichiers chiffrés, base H2 ou PostgreSQL) |
| Docspell | 7880 | PostgreSQL, index Solr |

```bash
# Paperless-ngx
docker compose exec webserver createsuperuser
docker compose exec webserver document_exporter ../export
docker compose exec webserver document_importer ../export
docker compose exec webserver document_retagger -c -T -t
docker compose exec webserver document_sanity_checker
docker compose exec webserver document_index reindex
curl -H "Authorization: Token <jeton>" -F document=@facture.pdf https://ged.exemple.fr/api/documents/post_document/

# Mayan EDMS
docker compose up -d ; docker compose logs -f app

# Teedy
docker run -d -p 127.0.0.1:8080:8080 -v /srv/teedy:/data sismics/docs:latest
htpasswd -bnBC 10 "" 'MotDePasse' | tr -d ':\n'      # hachage bcrypt pour DOCS_ADMIN_PASSWORD_INIT

# Docspell
docker compose up -d
dsc watch --delete -r /srv/scans --integration --header 'Docspell-Integration:collectif:<secret>'

# OCR : langues Tesseract disponibles
tesseract --list-langs
```
