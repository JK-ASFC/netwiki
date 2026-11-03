---
title: "fastcgi_bind"
description: "Directive nginx fastcgi_bind (ngx_http_fastcgi_module) — Fait partir les connexions sortantes vers un serveur FastCGI de l'adresse IP locale indiquée, avec un port facultatif (1.11.2). La valeur du paramètre peut contenir des variables (1.3.12). La valeur…"
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_bind address [transparent] \| off;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 0.8.22 |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

Fait partir les connexions sortantes vers un serveur FastCGI de l'adresse IP locale indiquée, avec un port facultatif (1.11.2). La valeur du paramètre peut contenir des variables (1.3.12). La valeur spéciale `off` (1.3.12) annule l'effet de la directive `fastcgi_bind` héritée du niveau de configuration précédent, ce qui laisse le système choisir l'adresse IP et le port locaux.

Le paramètre `transparent` (1.11.0) permet aux connexions sortantes vers un serveur FastCGI de partir d'une adresse IP non locale, par exemple de l'adresse IP réelle du client :

```nginx
fastcgi_bind $remote_addr transparent;
```

Pour que ce paramètre fonctionne, il faut généralement exécuter les processus de travail de nginx avec les privilèges du [[12-directives/user|superutilisateur]]. Sous Linux, ce n'est pas nécessaire (1.13.8) : avec le paramètre `transparent`, les processus de travail héritent de la capacité `CAP_NET_RAW` du processus maître. Il faut aussi configurer la table de routage du noyau pour intercepter le trafic réseau provenant du serveur FastCGI.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
