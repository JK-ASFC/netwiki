---
title: "<RequireAny>"
description: "Directive Apache <RequireAny> (mod_authz_core) — Regroupe des directives d'autorisation dont au moins une doit retourner un résultat positif pour que la directive globale retourne elle-même un résultat positif. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authz_core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Regroupe des directives d'autorisation dont au moins une doit retourner un résultat positif pour que la directive globale retourne elle-même un résultat positif. |
| **Syntaxe** | `<RequireAny> ... </RequireAny>` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Base |
| **Module** | [[12-modules/mod_authz_core\|mod_authz_core]] |

## Utilisation

Les balises `<RequireAny>` et `</RequireAny>` permettent de regrouper des directives d'autorisation dont au moins une doit retourner un résultat positif pour que la directive `<RequireAny>` retourne elle-même un résultat positif.

Si une ou plusieurs directives contenues dans la directive `<RequireAny>` retournent un résultat positif, alors la directive `<RequireAny>` retourne elle-même un résultat positif. Si aucune ne retourne un résultat positif et aucune n'échoue, la directive globale retourne un résultat neutre. Dans tous les autres cas, elle échoue.

> [!NOTE]
> Comme les directives d'autorisation inversées sont incapables de retourner un résultat positif, elles ne peuvent pas impacter de manière significative le résultat d'une directive `<RequireAny>` (elles pourraient tout au plus faire échouer la directive dans le cas où elles échoueraient elles-mêmes, et où toutes les autres directives retourneraient un résultat neutre). C'est pourquoi il n'est pas permis d'utiliser les directives d'autorisation inversées dans une directive `<RequireAny>`.

## Voir aussi

- Conteneurs d'autorisation

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
