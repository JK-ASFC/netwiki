---
title: "uwsgi_temp_file_write_size"
description: "Directive nginx uwsgi_temp_file_write_size (ngx_http_uwsgi_module) — Limite la taille (size) des données écrites en une fois dans un fichier temporaire, lorsque la mise en tampon des réponses du serveur uwsgi dans des fichiers temporaires est activée. Par défaut, size…"
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_temp_file_write_size size;` |
| **Valeur par défaut** | `uwsgi_temp_file_write_size 8k\|16k;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Limite la taille (*size*) des données écrites en une fois dans un fichier temporaire, lorsque la mise en tampon des réponses du serveur uwsgi dans des fichiers temporaires est activée. Par défaut, *size* est limitée à deux tampons définis par les directives [[12-directives/uwsgi-buffer-size|uwsgi_buffer_size]] et [[12-directives/uwsgi-buffers|uwsgi_buffers]]. La taille maximale d'un fichier temporaire est définie par la directive [[12-directives/uwsgi-max-temp-file-size|uwsgi_max_temp_file_size]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
