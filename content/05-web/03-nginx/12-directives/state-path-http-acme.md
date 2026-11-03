---
title: "state_path (ngx_http_acme_module)"
description: "Directive nginx state_path (ngx_http_acme_module) — Définit le répertoire de stockage des données du module conservées entre les redémarrages. Cela peut accélérer le démarrage en évitant certaines requêtes et éviter d'atteindre les limites de débit du…"
tags: [nginx, directive, ngx_http_acme_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `state_path path \| off;` |
| **Valeur par défaut** | `state_path acme_<issuer>;` |
| **Contexte** | `acme_issuer` |
| **Module** | [[11-modules/02-http/ngx_http_acme_module\|ngx_http_acme_module]] |

## Utilisation

Définit le répertoire de stockage des données du module conservées entre les redémarrages. Cela peut accélérer le démarrage en évitant certaines requêtes et éviter d'atteindre les limites de débit du serveur ACME.

Ce répertoire contient des données sensibles, comme la clé du compte, les certificats émis et les clés privées.

Le paramètre `off` (0.2.0) désactive l'enregistrement sur disque des informations du compte et des certificats émis.

> [!NOTE]
> Avant la version 0.2.0, le répertoire d'état n'était pas créé par défaut.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
