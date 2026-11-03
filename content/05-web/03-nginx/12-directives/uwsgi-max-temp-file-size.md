---
title: "uwsgi_max_temp_file_size"
description: "Directive nginx uwsgi_max_temp_file_size (ngx_http_uwsgi_module) — Lorsque la mise en tampon des réponses du serveur uwsgi est activée et que toute la réponse ne tient pas dans les tampons définis par les directives uwsgi_buffer_size et uwsgi_buffers, une partie de…"
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_max_temp_file_size size;` |
| **Valeur par défaut** | `uwsgi_max_temp_file_size 1024m;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Lorsque la [[12-directives/uwsgi-buffering|mise en tampon]] des réponses du serveur uwsgi est activée et que toute la réponse ne tient pas dans les tampons définis par les directives [[12-directives/uwsgi-buffer-size|uwsgi_buffer_size]] et [[12-directives/uwsgi-buffers|uwsgi_buffers]], une partie de la réponse peut être enregistrée dans un fichier temporaire. Cette directive définit la taille (*size*) maximale de ce fichier. La quantité de données écrite en une fois dans le fichier temporaire est définie par la directive [[12-directives/uwsgi-temp-file-write-size|uwsgi_temp_file_write_size]].

La valeur zéro désactive la mise en tampon des réponses dans des fichiers temporaires.

> [!NOTE]
> Cette restriction ne s'applique pas aux réponses qui seront [[12-directives/uwsgi-cache|mises en cache]] ou [[12-directives/uwsgi-store|enregistrées]] sur le disque.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
