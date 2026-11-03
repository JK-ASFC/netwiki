---
title: "<LimitExcept>"
description: "Directive Apache <LimitExcept> (core) — Applique les contrôles d'accès à toutes les méthodes HTTP, sauf celles qui sont spécifiées. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Applique les contrôles d'accès à toutes les méthodes HTTP, sauf celles qui sont spécifiées |
| **Syntaxe** | `<LimitExcept méthode [méthode] ... > ... </LimitExcept>` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig, Limit |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

`<LimitExcept>` et `</LimitExcept>` permettent de regrouper des directives de contrôle d'accès qui s'appliqueront à toutes les méthodes d'accès HTTP qui ne font **pas** partie de la liste des arguments ; en d'autres termes, elles ont un comportement opposé à celui de la section [[13-directives/limit|<Limit>]], et on peut les utiliser pour contrôler aussi bien les méthodes standards que les méthodes non standards ou non reconnues. Voir la documentation de la section [[13-directives/limit|<Limit>]] pour plus de détails.

Par exemple :

```apache
<LimitExcept POST GET>
  Require valid-user
</LimitExcept>
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
