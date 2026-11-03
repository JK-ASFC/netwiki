---
title: "DefaultLanguage"
description: "Directive Apache DefaultLanguage (mod_mime) — Défini un symbole de langage par défaut à affecter au champ d'en-tête Content-Language pour toutes les ressources dans le contexte courant auxquelles aucun symbole de langage n'a été associé. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_mime]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Défini un symbole de langage par défaut à affecter au champ d'en-tête Content-Language pour toutes les ressources dans le contexte courant auxquelles aucun symbole de langage n'a été associé. |
| **Syntaxe** | `DefaultLanguage symbole-langage` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Base |
| **Module** | [[12-modules/mod_mime\|mod_mime]] |

## Utilisation

La directive `DefaultLanguage` permet d'indiquer à Apache que toutes les ressources du contexte courant (par exemple, toutes les ressources concernées par le conteneur [[13-directives/directory|<Directory>]] courant) qui ne possèdent pas d'extension de langage explicite (comme `.fr` ou `.de` tel que défini par la directive [[13-directives/addlanguage|AddLanguage]]), verront leur en-tête HTTP Content-Language affecté du langage *symbole-langage*. Ceci permet de marquer des arborescences de répertoires entières comme contenant des documents en français, par exemple, sans avoir à renommer chaque fichier. Notez qu'à la différence de l'utilisation des extensions pour spécifier des langages, `DefaultLanguage` ne permet de spécifier qu'un seul langage.

Si aucune directive `DefaultLanguage` n'est en vigueur, et si un fichier ne possède pas d'extension configurée par la directive [[13-directives/addlanguage|AddLanguage]], aucun champ d'en-tête Content-Language ne sera généré.

**Exemple**

```apache
DefaultLanguage en
```

## Voir aussi

- [[12-modules/mod_negotiation|mod_negotiation]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
