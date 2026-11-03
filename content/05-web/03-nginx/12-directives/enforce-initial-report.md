---
title: "enforce_initial_report"
description: "Directive nginx enforce_initial_report (ngx_mgmt_module) — Active ou désactive le délai de grâce de 180 jours pour l'envoi du rapport d'utilisation initial. Le rapport d'utilisation initial est envoyé dès le premier démarrage de nginx après l'installation.…"
tags: [nginx, directive, ngx_mgmt_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `enforce_initial_report on \| off;` |
| **Valeur par défaut** | `enforce_initial_report on;` |
| **Contexte** | `mgmt` |
| **Apparue dans la version** | 1.27.2 |
| **Module** | [[11-modules/05-autres/ngx_mgmt_module\|ngx_mgmt_module]] |

## Utilisation

Active ou désactive le délai de grâce de 180 jours pour l'envoi du rapport d'utilisation initial.

Le rapport d'utilisation initial est envoyé dès le premier démarrage de nginx après l'installation. Par défaut, s'il n'est pas reçu par le point de terminaison de licences de F5, nginx cesse de traiter le trafic jusqu'à ce que le rapport soit livré. La valeur `off` active un délai de grâce de 180 jours pendant lequel le rapport initial doit être reçu.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
