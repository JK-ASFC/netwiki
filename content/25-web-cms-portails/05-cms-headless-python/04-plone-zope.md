---
title: Plone et Zope
description: Plone 6 (GPL v2, Python) — CMS d'entreprise réputé pour sa sécurité : interface Volto (React) et API REST, flux de validation, droits fins, multilingue ; Docker (plone/plone-backend et plone/plone-frontend), création du site, installation par pip ou cookieplone, sauvegarde du ZODB ; Zope (ZPL, serveur d'applications à base d'objets sous Plone) : pip install Zope, mkwsgiinstance, runwsgi, ZMI, sauvegarde.
tags: [plone, zope, zodb, volto, python, cms, entreprise]
icon: landmark
---

## Plone 6

**Plone** (GPL v2) est un CMS d'entreprise en Python, historiquement très sûr (peu de failles connues), utilisé par des administrations, universités et ONG : **flux de validation** (*workflows*), droits fins et partage par dossier, versions, multilingue, recherche, **API REST**. Plone 6 propose deux interfaces : **Volto** (React, par défaut) et Classic UI. Il repose sur le serveur d'applications **Zope** et la base objet **ZODB**.

Docker (le plus simple ; Linux, Windows et macOS) :

```yaml
services:
  backend:
    image: plone/plone-backend:6.1
    environment:
      SITE: Plone
    volumes: ["plone-data:/data"]
    ports: ["127.0.0.1:8080:8080"]
  frontend:
    image: plone/plone-frontend:latest
    environment:
      RAZZLE_INTERNAL_API_PATH: http://backend:8080/Plone
    ports: ["127.0.0.1:3000:3000"]
    depends_on: [backend]
volumes: { plone-data: {} }
```

Le reverse proxy publie le frontend (`https://portail.corp.exemple.fr` → 3000) et l'API (`/++api++` → backend). Sans `SITE`, ouvrir `http://srv-web-01:8080` pour créer le site (compte `admin`, mot de passe défini à la création ou par la variable de l'image). Installation sans Docker : modèles de projet **cookieplone** (`uvx cookieplone`) qui génèrent backend et frontend, ou `pip install Plone` dans un environnement Python dédié.

<!-- CAPTURE: Interface Volto de Plone 6, édition d'une page | _assets/plone-volto.png -->

Exploitation : données dans le volume `/data` (fichier `Data.fs` et blobs) ; sauvegarde à chaud avec `repozo` (outil de sauvegarde de la ZODB), ou arrêt bref puis copie du dossier. *Site Setup* : utilisateurs et groupes, LDAP/AD (extension `pas.plugins.ldap`), modules complémentaires, règles de contenu, sécurité.

## Zope

**Zope** (ZPL) est le serveur d'applications web à objets sur lequel repose Plone ; il s'utilise aussi seul pour des applications historiques. Interface d'administration web : **ZMI** (*Zope Management Interface*).

```bash
python3 -m venv /opt/zope && cd /opt/zope
bin/pip install Zope
bin/mkwsgiinstance -d /opt/zope/instance        # demande le compte administrateur initial
bin/runwsgi -v /opt/zope/instance/etc/zope.ini  # http://srv-zope-01:8080/manage
```

Configuration : `instance/etc/zope.conf` (stockage ZODB) et `zope.ini` (serveur WSGI). Sauvegarde : `instance/var/Data.fs` (serveur arrêté ou copie par outil de sauvegarde ZODB). Mettre à jour Zope et ses dépendances par `pip` dans l'environnement virtuel, après lecture des notes de version.

Commandes : [[90-aide-memoire|aide-mémoire]].
