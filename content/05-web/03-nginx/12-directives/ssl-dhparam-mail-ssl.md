---
title: "ssl_dhparam (ngx_mail_ssl_module)"
description: "Directive nginx ssl_dhparam (ngx_mail_ssl_module) — Indique le fichier (file) contenant les paramètres DH pour les suites de chiffrement DHE. Par défaut, aucun paramètre n'est défini ; les suites DHE ne sont donc pas utilisées. NOTE Avant la version…"
tags: [nginx, directive, ngx_mail_ssl_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_dhparam file;` |
| **Valeur par défaut** | — |
| **Contexte** | `mail`, `server` |
| **Apparue dans la version** | 0.7.2 |
| **Module** | [[11-modules/04-mail/ngx_mail_ssl_module\|ngx_mail_ssl_module]] |

## Utilisation

Indique le fichier (*file*) contenant les paramètres DH pour les suites de chiffrement DHE.

Par défaut, aucun paramètre n'est défini ; les suites DHE ne sont donc pas utilisées.

> [!NOTE]
> Avant la version 1.11.0, des paramètres intégrés étaient utilisés par défaut.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
