---
title: Cherokee
description: Cherokee — serveur web libre (GPL) historique connu pour son interface d'administration web cherokee-admin : état du projet (plus de version stable depuis 2014, retiré des distributions), architecture (hôtes virtuels, règles, gestionnaires, sources d'informations), installation par compilation ou conteneur pour maintenir l'existant, cherokee-admin (port 9090), et plan de migration vers NGINX, Caddy ou Lighttpd.
tags: [cherokee, serveur web, cherokee-admin, migration, historique]
icon: info
---

**Cherokee** était un serveur web rapide doté d'une **interface d'administration graphique** (`cherokee-admin`), originale à l'époque. Le projet n'a plus publié de version stable depuis **1.2.104 (2014)** et a été retiré de Debian et Ubuntu.

> [!WARNING]
> Sans mises à jour de sécurité régulières, Cherokee ne doit plus être exposé sur Internet. Si vous en héritez, planifiez une migration vers [[03-nginx/01-presentation|NGINX]], [[04-caddy/01-presentation-installation|Caddy]] ou [[01-lighttpd|Lighttpd]].

## Concepts (pour lire une configuration existante)

| Élément | Rôle |
| --- | --- |
| **Virtual Server** | Hôte virtuel (nom, racine, journaux, TLS) |
| **Behavior / Rules** | Règles ordonnées (répertoire, extension, expression régulière, en-tête) |
| **Handler** | Traitement : fichiers statiques, FastCGI, SCGI, uWSGI, reverse proxy HTTP, redirection |
| **Information Sources** | Serveurs amont (interpréteurs, applications) |

Configuration stockée dans `/etc/cherokee/cherokee.conf` (format clé = valeur), générée par l'interface.

## Maintenir un existant

```bash
# Compilation depuis le dépôt GitHub du projet (dernières corrections non publiées)
git clone https://github.com/cherokee/webserver.git && cd webserver
./autogen.sh --prefix=/usr/local && make && sudo make install
sudo cherokee-admin -b 127.0.0.1 -p 9090          # interface d'administration (mot de passe à usage unique affiché)
ssh -L 9090:127.0.0.1:9090 admin@srv-web-ancien   # y accéder via un tunnel SSH
```

## Interface cherokee-admin

Onglets **Status**, **General**, **vServers** (règles et gestionnaires de chaque hôte), **Sources**, **Advanced** ; bouton *Save* avec redémarrage gracieux.

<!-- CAPTURE: cherokee-admin — liste des vServers et règles | _assets/cherokee-admin.png -->

## Migration

1. Exporter la liste des vServers et des règles (`cherokee.conf`).
2. Traduire chaque règle : *FastCGI* → `fastcgi_pass`/`php_fastcgi`, *HTTP reverse proxy* → `proxy_pass`/`reverse_proxy`, *Redirection* → `return 301`/`redir`.
3. Tester en parallèle sur un autre port, puis basculer le DNS ou le répartiteur.
