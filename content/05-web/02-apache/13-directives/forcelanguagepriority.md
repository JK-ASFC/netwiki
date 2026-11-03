---
title: "ForceLanguagePriority"
description: "Directive Apache ForceLanguagePriority (mod_negotiation) — Action à entreprendre si un document acceptable unique n'est pas trouvé. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_negotiation]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Action à entreprendre si un document acceptable unique n'est pas trouvé |
| **Syntaxe** | `ForceLanguagePriority None\|Prefer\|Fallback [Prefer\|Fallback]` |
| **Valeur par défaut** | `ForceLanguagePriority Prefer` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Base |
| **Module** | [[12-modules/mod_negotiation\|mod_negotiation]] |

## Utilisation

La directive `ForceLanguagePriority` utilise le langage défini par la directive [[13-directives/languagepriority|LanguagePriority]] pour terminer la négociation lorsque le serveur n'est pas en mesure de trouver une solution satisfaisante unique.

`ForceLanguagePriority Prefer` utilise la directive `LanguagePriority` pour servir le résultat d'un choix unique, au lieu de renvoyer un résultat HTTP 300 (MULTIPLE CHOICES), lorsque que plusieurs choix équivalents sont disponibles. Par exemple, avec les deux directives ci-dessous, si l'en-tête `Accept-Language` de l'utilisateur assigne à `en` et `de` une qualité de `.500` (les deux langages sont également acceptables), alors c'est la première variante acceptable de langue `en` qui sera servie.

```apache
LanguagePriority en fr de
ForceLanguagePriority Prefer
```

`ForceLanguagePriority Fallback` utilise la directive [[13-directives/languagepriority|LanguagePriority]] pour servir un résultat valide, au lieu de renvoyer un résultat HTTP 406 (NOT ACCEPTABLE). Avec les deux directives ci-dessous, si l'en-tête `Accept-Language` de l'utilisateur ne mentionne que les réponses de langage `es`, et si aucune variante dans cette langue n'est trouvée, c'est la première variante de la liste définie par la directive [[13-directives/languagepriority|LanguagePriority]] qui sera servie.

```apache
LanguagePriority en fr de
ForceLanguagePriority Fallback
```

Les deux options, `Prefer` et `Fallback`, peuvent être spécifiées, de façon à ce que la variante servie soit la première variante qui convient définie par la directive [[13-directives/languagepriority|LanguagePriority]] si plusieurs variantes sont également acceptables, ou le premier document disponible si aucune variante ne convient à la liste de langages acceptables fournie par le client.

`ForceLanguagePriority None` désactive les deux comportements `Prefer` et `Fallback` ; le serveur renverra alors 300 (MULTIPLE CHOICES) ou 406 (NOT ACCEPTABLE), selon le cas. `None` ne peut pas être combiné avec `Prefer` ou `Fallback`.

## Voir aussi

- [[13-directives/addlanguage|AddLanguage]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
