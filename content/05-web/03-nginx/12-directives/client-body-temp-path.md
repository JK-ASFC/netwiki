---
title: "client_body_temp_path"
description: "Directive nginx client_body_temp_path (ngx_http_core_module) — Définit le répertoire des fichiers temporaires contenant le corps des requêtes des clients. Jusqu'à trois niveaux de sous-répertoires peuvent être utilisés sous ce répertoire. Par exemple, avec la…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `client_body_temp_path path [level1 [level2 [level3]]];` |
| **Valeur par défaut** | `client_body_temp_path client_body_temp;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Définit le répertoire des fichiers temporaires contenant le corps des requêtes des clients. Jusqu'à trois niveaux de sous-répertoires peuvent être utilisés sous ce répertoire. Par exemple, avec la configuration suivante

```nginx
client_body_temp_path /spool/nginx/client_temp 1 2;
```

le chemin d'un fichier temporaire peut ressembler à ceci :

```nginx
/spool/nginx/client_temp/7/45/00000123457
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
