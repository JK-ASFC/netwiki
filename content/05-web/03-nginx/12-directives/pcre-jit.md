---
title: "pcre_jit"
description: "Directive nginx pcre_jit (ngx_core_module) — Active ou désactive la « compilation à la volée » (PCRE JIT) des expressions régulières connues au moment de l'analyse de la configuration. PCRE JIT peut accélérer nettement le traitement des…"
tags: [nginx, directive, ngx_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `pcre_jit on \| off;` |
| **Valeur par défaut** | `pcre_jit off;` |
| **Contexte** | `main` |
| **Apparue dans la version** | 1.1.12 |
| **Module** | [[11-modules/01-coeur/ngx_core_module\|ngx_core_module]] |

## Utilisation

Active ou désactive la « compilation à la volée » (PCRE JIT) des expressions régulières connues au moment de l'analyse de la configuration.

PCRE JIT peut accélérer nettement le traitement des expressions régulières.

> [!NOTE]
> La compilation JIT est disponible dans les bibliothèques PCRE à partir de la version 8.20 compilées avec le paramètre de configuration `--enable-jit`. Lorsque la bibliothèque PCRE est compilée avec nginx (`--with-pcre=`), la prise en charge de JIT s'active avec le paramètre de configuration `--with-pcre-jit`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
