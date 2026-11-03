---
title: "ProxyPassInterpolateEnv"
description: "Directive Apache ProxyPassInterpolateEnv (mod_proxy) — Active l'interpolation des variables d'environnement dans les configurations de mandataires inverses. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active l'interpolation des variables d'environnement dans les configurations de mandataires inverses |
| **Syntaxe** | `ProxyPassInterpolateEnv On\|Off` |
| **Valeur par défaut** | `ProxyPassInterpolateEnv Off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy\|mod_proxy]] |
| **Compatibilité** | Disponible depuis la version 2.2.9 d'Apache |

## Utilisation

Cette directive, ainsi que l'argument `interpolate` des directives `ProxyPass`, `ProxyPassReverse`, `ProxyPassReverseCookieDomain` et `ProxyPassReverseCookiePath`, permet de configurer dynamiquement un mandataire inverse à l'aide de variables d'environnement, ces dernières pouvant être définies par un autre module comme [[12-modules/mod_rewrite|mod_rewrite]]. Elle affecte les directives `ProxyPass`, `ProxyPassReverse`, `ProxyPassReverseCookieDomain`, et `ProxyPassReverseCookiePath`, en leur indiquant de remplacer la chaîne `${nom_var}` dans les directives de configuration par la valeur de la variable d'environnement `nom_var` (si l'option `interpolate` est spécifiée).

La partie protocole/hostname/port de `ProxyPass` peut contenir des variables, mais seulement celles qui sont accessibles au moment où la directive est interprétée (similairement à la directive [[13-directives/define|Define]]). Pour tous les autres cas, utilisez plutôt [[12-modules/mod_rewrite|mod_rewrite]].

> [!WARNING]
> **Avertissement concernant les performances**
>
> Laissez cette directive à off, à moins que vous n'en ayez réellemnt besoin ! Par exemple, ajouter des variables à `ProxyPass` peut entraîner l'utilisation des serveurs d'arrière-plan de mod\_proxy configurés par défaut, et ceux-ci ne permettent pas un réglage fin comme la réutilisation des connexions, entre autres...).

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
