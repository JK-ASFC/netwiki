---
title: CMS headless et Python — aide-mémoire des commandes
description: Commandes Strapi (create-strapi, develop, build, admin:create-user, export, import), Directus (docker compose, Data Studio), Payload (create-payload-app), KeystoneJS (create-keystone-app), Sanity (create sanity, dev, build, deploy, dataset export), Wagtail (wagtail start, migrate, createsuperuser, collectstatic, update_index, publish_scheduled), Plone et Zope (Docker, mkwsgiinstance, runwsgi).
tags: [aide-mémoire, strapi, directus, payload, keystone, sanity, wagtail, plone, zope]
icon: terminal
---

Explications : [[01-strapi-directus-payload|Strapi, Directus, Payload]] · [[02-keystone-sanity|KeystoneJS, Sanity]] · [[03-wagtail-mezzanine|Wagtail, Mezzanine]] · [[04-plone-zope|Plone, Zope]].

```bash
npx create-strapi@latest site-api && cd site-api && npm run develop
npm run build && NODE_ENV=production npm run start
npx strapi admin:create-user --firstname=JK --lastname=Admin --email=webmaster@corp.exemple.fr --password='MdpAdmin2026!'
npx strapi export --file /srv/sauvegardes/strapi-$(date +%F) ; npx strapi import --file sauvegarde.tar.gz.enc
docker compose up -d directus && docker compose logs -f directus
npx create-payload-app@latest site-payload && cd site-payload && npm run dev
npm create keystone-app@latest app-contenu && cd app-contenu && npm run dev
npm create sanity@latest ; npx sanity dev ; npx sanity build ; npx sanity deploy
npx sanity dataset export production /srv/sauvegardes/sanity-$(date +%F).tar.gz
pip install wagtail && wagtail start site_corp /opt/wagtail/site
python manage.py migrate ; python manage.py createsuperuser ; python manage.py collectstatic --noinput
python manage.py update_index ; python manage.py publish_scheduled
docker compose up -d backend frontend && docker compose logs -f backend          # Plone
bin/mkwsgiinstance -d /opt/zope/instance && bin/runwsgi -v /opt/zope/instance/etc/zope.ini
```
