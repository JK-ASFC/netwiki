---
title: "auth_basic"
description: "Directive nginx auth_basic (ngx_http_auth_basic_module) — Active la vérification du nom d'utilisateur et du mot de passe selon le protocole « HTTP Basic Authentication ». Le paramètre indiqué sert de domaine d'authentification (realm). Sa valeur peut…"
tags: [nginx, directive, ngx_http_auth_basic_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `auth_basic string \| off;` |
| **Valeur par défaut** | `auth_basic off;` |
| **Contexte** | `http`, `server`, `location`, `limit_except` |
| **Module** | [[11-modules/02-http/ngx_http_auth_basic_module\|ngx_http_auth_basic_module]] |

## Utilisation

Active la vérification du nom d'utilisateur et du mot de passe selon le protocole « HTTP Basic Authentication ». Le paramètre indiqué sert de domaine d'authentification (*realm*). Sa valeur peut contenir des variables (1.3.10, 1.2.7). La valeur spéciale `off` annule l'effet de la directive `auth_basic` héritée du niveau de configuration précédent.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
