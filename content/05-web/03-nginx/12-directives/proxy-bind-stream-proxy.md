---
title: "proxy_bind (ngx_stream_proxy_module)"
description: "Directive nginx proxy_bind (ngx_stream_proxy_module) — Fait partir les connexions sortantes vers un serveur mandaté de l'adresse IP locale indiquée. La valeur peut contenir des variables (1.11.2). La valeur spéciale off annule l'effet de la directive…"
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_bind address [transparent] \| off;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.9.2 |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Fait partir les connexions sortantes vers un serveur mandaté de l'*adresse* IP locale indiquée. La valeur peut contenir des variables (1.11.2). La valeur spéciale `off` annule l'effet de la directive `proxy_bind` héritée du niveau de configuration précédent, ce qui laisse le système attribuer automatiquement l'adresse IP locale.

Le paramètre `transparent` (1.11.0) permet aux connexions sortantes vers un serveur mandaté de partir d'une adresse IP non locale, par exemple de l'adresse IP réelle du client :

```nginx
proxy_bind $remote_addr transparent;
```

Pour que ce paramètre fonctionne, il faut généralement exécuter les processus de travail de nginx avec les privilèges du [[12-directives/user|superutilisateur]]. Sous Linux, ce n'est pas nécessaire (1.13.8) : avec le paramètre `transparent`, les processus de travail héritent de la capacité `CAP_NET_RAW` du processus maître. Il faut aussi configurer la table de routage du noyau pour intercepter le trafic réseau provenant du serveur mandaté.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
