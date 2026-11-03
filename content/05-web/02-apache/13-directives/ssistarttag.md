---
title: "SSIStartTag"
description: "Directive Apache SSIStartTag (mod_include) — Chaîne qui marque le début d'un élément include. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_include]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Chaîne qui marque le début d'un élément include |
| **Syntaxe** | `SSIStartTag tag` |
| **Valeur par défaut** | `SSIStartTag "<!--#"` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Base |
| **Module** | [[12-modules/mod_include\|mod_include]] |

## Utilisation

Cette directive permet de modifier la chaîne que [[12-modules/mod_include|mod_include]] interprète comme le début d'un élément include.

Cette option peut vous être utile si vous avez deux serveurs qui interprètent un fichier avec des commandes différentes (et éventuellement à des moments différents).

```apache
SSIStartTag "<%"
SSIEndTag   "%>"
```

> [!WARNING]
> La valeur ne doit pas contenir d'espace.

Avec l'exemple ci-dessus, qui définit aussi une directive [[13-directives/ssiendtag|SSIEndTag]], vous pourrez inscrire des directives SSI comme dans l'exemple suivant :

**Directives SSI avec marques de début et de fin personnalisées**

```
<%printenv %>
```

## Voir aussi

- [[13-directives/ssiendtag|SSIEndTag]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
