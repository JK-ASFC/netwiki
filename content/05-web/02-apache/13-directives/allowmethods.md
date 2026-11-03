---
title: "AllowMethods"
description: "Directive Apache AllowMethods (mod_allowmethods) — Restreint l'accès aux méthodes HTTP spécifiées. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_allowmethods]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Restreint l'accès aux méthodes HTTP spécifiées |
| **Syntaxe** | `AllowMethods reset\|HTTP-method [HTTP-method]...` |
| **Valeur par défaut** | `AllowMethods reset` |
| **Contexte** | répertoire |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_allowmethods\|mod_allowmethods]] |

## Utilisation

Les noms des méthodes HTTP sont sensibles à la casse, et sont en général définis en majuscules, comme dans les RFCs. Les méthodes GET et HEAD sont considérées comme équivalentes. Le mot-clé `reset` permet de désactiver [[12-modules/mod_allowmethods|mod_allowmethods]] dans les niveaux inférieurs d'imbrication :

```apache
<Location "/svn">
   AllowMethods reset
</Location>
```

> [!NOTE]
> **Avertissement**
>
> La méthode TRACE ne peut pas être rejetée par ce module ; pour ce faire, vous devez utiliser la directive [[13-directives/traceenable|TraceEnable]].

Le module [[12-modules/mod_allowmethods|mod_allowmethods]] a été écrit pour remplacer l'implémentation "bricolée" des directives [[13-directives/limit|<Limit>]] et [[13-directives/limitexcept|<LimitExcept>]].

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
