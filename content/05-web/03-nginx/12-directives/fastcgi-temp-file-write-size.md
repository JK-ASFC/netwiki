---
title: "fastcgi_temp_file_write_size"
description: "Directive nginx fastcgi_temp_file_write_size (ngx_http_fastcgi_module) — Limite la taille (size) des données écrites en une fois dans un fichier temporaire, lorsque la mise en tampon des réponses du serveur FastCGI dans des fichiers temporaires est activée. Par défaut,…"
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_temp_file_write_size size;` |
| **Valeur par défaut** | `fastcgi_temp_file_write_size 8k\|16k;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

Limite la taille (*size*) des données écrites en une fois dans un fichier temporaire, lorsque la mise en tampon des réponses du serveur FastCGI dans des fichiers temporaires est activée. Par défaut, *size* est limitée à deux tampons définis par les directives [[12-directives/fastcgi-buffer-size|fastcgi_buffer_size]] et [[12-directives/fastcgi-buffers|fastcgi_buffers]]. La taille maximale d'un fichier temporaire est définie par la directive [[12-directives/fastcgi-max-temp-file-size|fastcgi_max_temp_file_size]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
