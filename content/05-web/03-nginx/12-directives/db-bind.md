---
title: "db_bind"
description: "Directive nginx db_bind (ngx_http_db_module) — Fait partir les connexions sortantes vers un serveur de base de données de l'adresse IP locale indiquée, avec un port facultatif. La valeur du paramètre peut contenir des variables. La valeur…"
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_bind address [transparent] \| off;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Fait partir les connexions sortantes vers un serveur de base de données de l'adresse IP locale indiquée, avec un port facultatif. La valeur du paramètre peut contenir des variables. La valeur spéciale `off` annule l'effet de la directive `db_bind` héritée du niveau de configuration précédent, ce qui laisse le système choisir l'adresse IP et le port locaux. Exemple :

```nginx
db_bind $server_addr;
```

Le paramètre `transparent` permet aux connexions sortantes vers un serveur de base de données de partir d'une adresse IP non locale, par exemple de l'adresse IP réelle du client :

```nginx
db_bind $remote_addr transparent;
```

Pour que ce paramètre fonctionne, il faut généralement exécuter les processus de travail de nginx avec les privilèges du [[12-directives/user|superutilisateur]]. Sous Linux, ce n'est pas nécessaire : avec le paramètre `transparent`, les processus de travail héritent de la capacité `CAP_NET_RAW` du processus maître. Il faut aussi configurer la table de routage du noyau pour intercepter le trafic réseau provenant du serveur de base de données.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
