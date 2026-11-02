---
title: Wagtail et Mezzanine
description: CMS Django — Wagtail (BSD : édition par blocs StreamField, arborescence de pages, images et documents, recherche, multisite ; pip install wagtail, wagtail start, migrate, createsuperuser, production Gunicorn et NGINX, PostgreSQL, Docker) et Mezzanine (BSD, peu maintenu : pip install mezzanine, mezzanine-project, migration vers Wagtail), sécurité, sauvegarde et mise à jour.
tags: [wagtail, mezzanine, django, python, cms, gunicorn]
icon: feather
---

## Wagtail

**Wagtail** (BSD) est le CMS de référence de l'écosystème **Django** : modèles de pages en Python, édition par blocs (**StreamField**), arborescence, bibliothèque d'images avec recadrage, documents, recherche (base ou Elasticsearch/OpenSearch), **multisite**, flux de validation, API headless. Utilisé par de grands sites publics (dont des services de l'État britannique).

```bash
python3 -m venv /opt/wagtail/venv && . /opt/wagtail/venv/bin/activate
pip install wagtail
mkdir -p /opt/wagtail/site && wagtail start site_corp /opt/wagtail/site && cd /opt/wagtail/site
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 0.0.0.0:8000          # essai : http://srv-web-01:8000/admin
```

Production : base **PostgreSQL** (`DATABASES` dans `settings/production.py`, paquet `psycopg`), `DEBUG = False`, `ALLOWED_HOSTS = ['site.corp.exemple.fr']`, `CSRF_TRUSTED_ORIGINS`, fichiers statiques collectés (`python manage.py collectstatic`), **Gunicorn** derrière [[03-nginx/05-reverse-proxy-repartition|NGINX]] (`gunicorn site_corp.wsgi:application --bind 127.0.0.1:8001 --workers 3`, unité systemd). Le projet généré contient un `Dockerfile`. Fonctionne sous Windows et macOS (Python 3).

<!-- CAPTURE: Éditeur de page Wagtail avec StreamField | _assets/wagtail-streamfield.png -->

Exploitation :

```bash
python manage.py update_index                    # index de recherche
python manage.py fixtree                         # vérification de l'arborescence des pages
python manage.py publish_scheduled               # publications programmées (cron toutes les minutes)
pip install -U wagtail && python manage.py migrate
pg_dump -Fc wagtail > /srv/sauvegardes/wagtail-$(date +%F).dump          # + dossier media/
```

## Mezzanine

**Mezzanine** (BSD) est un CMS Django plus ancien (pages, blog, galerie). Son développement est très ralenti : pour un nouveau projet, choisir Wagtail. Installation d'un projet existant : `pip install mezzanine`, `mezzanine-project site_mezz`, `python manage.py createdb`. Pour migrer, exporter le contenu (fixtures Django ou export des pages) et le reprendre dans des modèles Wagtail.

Commandes : [[90-aide-memoire|aide-mémoire]].
