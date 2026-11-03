---
title: "AuthMerging"
description: "Directive Apache AuthMerging (mod_authz_core) — Définit la manière dont chaque logique d'autorisation des sections de configuration se combine avec celles des sections de configuration précédentes. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authz_core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit la manière dont chaque logique d'autorisation des sections de configuration se combine avec celles des sections de configuration précédentes. |
| **Syntaxe** | `AuthMerging Off \| And \| Or` |
| **Valeur par défaut** | `AuthMerging Off` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Base |
| **Module** | [[12-modules/mod_authz_core\|mod_authz_core]] |

## Utilisation

Lorsque l'autorisation est activée, elle est normalement héritée par chaque [[11-guides/01-generalites/sections-de-configuration|section de configuration]] suivante, à moins qu'un jeu de directives d'autorisations différent ne soit spécifié. Il s'agit du comportement par défaut, qui correspond à la définition explicite `AuthMerging Off`.

Dans certaines situations cependant, il peut être souhaitable de combiner la logique d'autorisation d'une section de configuration avec celle de la section précédente lorsque les sections de configuration se combinent entre elles. Dans ce cas, deux options sont disponibles, `And` et `Or`.

Lorsqu'une section de configuration contient `AuthMerging And` ou `AuthMerging Or`, sa logique d'autorisation se combine avec celle de la section de configuration qui la précède (selon l'ordre général des sections de configuration), et qui contient aussi une logique d'autorisation, comme si les deux sections étaient concaténées, respectivement, dans une directive [[13-directives/requireall|<RequireAll>]] ou [[13-directives/requireany|<RequireAny>]].

> [!NOTE]
> La définition de la directive `AuthMerging` ne concerne que la section de configuration dans laquelle elle apparaît. Dans l'exemple suivant, seuls les utilisateurs appartenant au groupe `alpha` sont autorisés à accéder à `/www/docs`. Les utilisateurs appartenant au groupe `alpha` ou au groupe `beta` sont autorisés à accéder à `/www/docs/ab`. Cependant, la définition implicite à `Off` de la directive `AuthMerging` s'applique à la section de configuration [[13-directives/directory|<Directory>]] concernant le répertoire `/www/docs/ab/gamma`, ce qui implique que les directives d'autorisation de cette section l'emportent sur celles des sections précédentes. Par voie de conséquence, seuls les utilisateurs appartenant au groupe `gamma` sont autorisés à accéder à `/www/docs/ab/gamma`.

```apache
<Directory "/www/docs">
    AuthType Basic
    AuthName Documents
    AuthBasicProvider file
    AuthUserFile "/usr/local/apache/passwd/passwords"
    Require group alpha
</Directory>

<Directory "/www/docs/ab">
    AuthMerging Or
    Require group beta
</Directory>

<Directory "/www/docs/ab/gamma">
    Require group gamma
</Directory>
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
