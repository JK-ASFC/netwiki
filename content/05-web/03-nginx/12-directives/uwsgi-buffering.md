---
title: "uwsgi_buffering"
description: "Directive nginx uwsgi_buffering (ngx_http_uwsgi_module) — Active ou désactive la mise en tampon des réponses du serveur uwsgi. Lorsque la mise en tampon est activée, nginx reçoit la réponse du serveur uwsgi le plus vite possible et la conserve dans les…"
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_buffering on \| off;` |
| **Valeur par défaut** | `uwsgi_buffering on;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Active ou désactive la mise en tampon des réponses du serveur uwsgi.

Lorsque la mise en tampon est activée, nginx reçoit la réponse du serveur uwsgi le plus vite possible et la conserve dans les tampons définis par les directives [[12-directives/uwsgi-buffer-size|uwsgi_buffer_size]] et [[12-directives/uwsgi-buffers|uwsgi_buffers]]. Si toute la réponse ne tient pas en mémoire, une partie peut être enregistrée dans un [[12-directives/uwsgi-temp-path|fichier temporaire]] sur le disque. L'écriture dans les fichiers temporaires est contrôlée par les directives [[12-directives/uwsgi-max-temp-file-size|uwsgi_max_temp_file_size]] et [[12-directives/uwsgi-temp-file-write-size|uwsgi_temp_file_write_size]].

Lorsque la mise en tampon est désactivée, la réponse est transmise au client de façon synchrone, dès sa réception. nginx ne tente pas de lire toute la réponse du serveur uwsgi. La quantité maximale de données que nginx peut recevoir du serveur en une fois est définie par la directive [[12-directives/uwsgi-buffer-size|uwsgi_buffer_size]].

La mise en tampon peut aussi être activée ou désactivée en transmettant « `yes` » ou « `no` » dans le champ d'en-tête de réponse `X-Accel-Buffering`. Cette possibilité peut être désactivée avec la directive [[12-directives/uwsgi-ignore-headers|uwsgi_ignore_headers]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
