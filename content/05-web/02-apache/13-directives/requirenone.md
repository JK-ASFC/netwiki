---
title: "<RequireNone>"
description: "Directive Apache <RequireNone> (mod_authz_core) — Regroupe des directives d'autorisation dont aucune ne doit retourner un résultat positif pour que la directive globale n'échoue pas. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authz_core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Regroupe des directives d'autorisation dont aucune ne doit retourner un résultat positif pour que la directive globale n'échoue pas. |
| **Syntaxe** | `<RequireNone> ... </RequireNone>` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Base |
| **Module** | [[12-modules/mod_authz_core\|mod_authz_core]] |

## Utilisation

Les balises `<RequireNone>` et `</RequireNone>` permettent de regrouper des directives d'autorisation dont aucune ne doit retourner un résultat positif pour que la directive `<RequireNone>` n'échoue pas.

Si une ou plusieurs directives contenues dans la directive `<RequireNone>` retournent un résultat positif, la directive `<RequireNone>` échouera. Dans tous les autres cas, cette dernière retournera un résultat neutre. Ainsi, comme pour la directive d'autorisation inversée `Require not`, elle ne peut jamais en soi autoriser une requête car elle ne pourra jamais retourner un résultat positif. Par contre, on peut l'utiliser pour restreindre l'ensemble des utilisateurs autorisés à accéder à une ressource.

> [!NOTE]
> Comme les directives d'autorisation inversées sont incapables de retourner un résultat positif, elles ne peuvent pas impacter de manière significative le résultat d'une directive `<RequireNone>`. C'est pourquoi il n'est pas permis d'utiliser les directives d'autorisation inversées dans une directive `<RequireNone>`.

## Voir aussi

- Conteneurs d'autorisation

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
