---
title: "Sécurité"
description: "Nginx — Sécurité. Tous les problèmes de sécurité de nginx doivent être signalés par l'un des moyens listés ici."
tags: [nginx, guide]
icon: book-open
---

Tous les problèmes de sécurité de nginx doivent être signalés par l'un des moyens listés [ici](https://github.com/nginx/njs/blob/master/SECURITY.md).

Les correctifs sont signés avec l'une des clés publiques PGP.

## Points particuliers

njs n'évalue jamais de code dynamique, en particulier du code reçu du réseau. Le seul moyen d'évaluer du code avec njs est de configurer la directive [[12-directives/js-import-http-js|js_import]] dans nginx. Le code JavaScript est chargé une seule fois, au démarrage de nginx.

Dans le modèle de menace de nginx/njs, le code JavaScript est considéré comme une source de confiance, au même titre que `nginx.conf` et les certificats des sites. En pratique :

- les fuites de mémoire et autres problèmes de sécurité déclenchés par une modification du code JavaScript ne sont pas considérés comme des vulnérabilités, mais comme des bogues ordinaires
- il faut prendre des mesures pour protéger le code JavaScript utilisé par njs
- si `nginx.conf` ne contient aucune directive [[12-directives/js-import-http-js|js_import]], nginx est à l'abri des vulnérabilités liées à JavaScript

## Avis de sécurité

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
