---
title: "<RequireAll>"
description: "Directive Apache <RequireAll> (mod_authz_core) — Regroupe plusieurs directives d'autorisation dont aucune ne doit échouer et dont au moins une doit retourner un résultat positif pour que la directive globale retourne elle-même un résultat positif. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authz_core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Regroupe plusieurs directives d'autorisation dont aucune ne doit échouer et dont au moins une doit retourner un résultat positif pour que la directive globale retourne elle-même un résultat positif. |
| **Syntaxe** | `<RequireAll> ... </RequireAll>` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Base |
| **Module** | [[12-modules/mod_authz_core\|mod_authz_core]] |

## Utilisation

Les balises `<RequireAll>` et `</RequireAll>` permettent de regrouper des directives d'autorisation dont aucune ne doit échouer, et dont au moins une doit retourner un résultat positif pour que la directive `<RequireAll>` retourne elle-même un résultat positif.

Si aucune des directives contenues dans la directive `<RequireAll>` n'échoue, et si au moins une retourne un résultat positif, alors la directive `<RequireAll>` retourne elle-même un résultat positif. Si aucune ne retourne un résultat positif, et si aucune n'échoue, la directive globale retourne un résultat neutre. Dans tous les autres cas, elle échoue.

## Voir aussi

- Conteneurs d'autorisation

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
