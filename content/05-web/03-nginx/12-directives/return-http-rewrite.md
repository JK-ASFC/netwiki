---
title: "return (ngx_http_rewrite_module)"
description: "Directive nginx return (ngx_http_rewrite_module) — Arrête le traitement et renvoie au client le code (code) indiqué. Le code non standard 444 ferme la connexion sans envoyer d'en-tête de réponse. Depuis la version 0.8.42, on peut indiquer soit une…"
tags: [nginx, directive, ngx_http_rewrite_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `return code [text];` ou `return code URL;` ou `return URL;` |
| **Valeur par défaut** | — |
| **Contexte** | `server`, `location`, `if` |
| **Module** | [[11-modules/02-http/ngx_http_rewrite_module\|ngx_http_rewrite_module]] |

## Utilisation

Arrête le traitement et renvoie au client le code (*code*) indiqué. Le code non standard 444 ferme la connexion sans envoyer d'en-tête de réponse.

Depuis la version 0.8.42, on peut indiquer soit une URL de redirection (pour les codes 301, 302, 303, 307 et 308), soit le texte (*text*) du corps de la réponse (pour les autres codes). Le texte du corps et l'URL de redirection peuvent contenir des variables. Cas particulier : l'URL de redirection peut être un URI local à ce serveur ; l'URL complète est alors formée d'après le schéma de la requête (`$scheme`) et les directives [[12-directives/server-name-in-redirect|server_name_in_redirect]] et [[12-directives/port-in-redirect|port_in_redirect]].

En outre, une *URL* de redirection temporaire avec le code 302 peut être indiquée comme seul paramètre. Elle doit commencer par « `http://` », « `https://` » ou « `$scheme` ». L'*URL* peut contenir des variables.

> [!NOTE]
> Avant la version 0.7.51, seuls les codes suivants pouvaient être renvoyés : 204, 400, 402 à 406, 408, 410, 411, 413, 416 et 500 à 504.

> [!NOTE]
> Le code 307 n'était pas traité comme une redirection avant les versions 1.1.16 et 1.0.13.

> [!NOTE]
> Le code 308 n'était pas traité comme une redirection avant la version 1.13.0.

Voir aussi la directive [[12-directives/error-page|error_page]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
