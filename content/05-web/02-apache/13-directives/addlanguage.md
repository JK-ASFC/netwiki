---
title: "AddLanguage"
description: "Directive Apache AddLanguage (mod_mime) — Associe l'extension de nom de fichier donnée au langage spécifié. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_mime]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Associe l'extension de nom de fichier donnée au langage spécifié |
| **Syntaxe** | `AddLanguage symbole-langage extension [extension] ...` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Base |
| **Module** | [[12-modules/mod_mime\|mod_mime]] |

## Utilisation

La directive `AddLanguage` permet d'associer l'extension de nom de fichier donnée au langage spécifié. Les fichiers dont l'extension correspond à la valeur de l'argument *extension* se voient attribuer la valeur de l'argument *symbole-langage* comme en-tête HTTP Content-Language en accord avec les identifiants de langages définis par la RFC 3066. Cette directive l'emporte sur toute association préexistante pour la même *extension*.

**Exemple**

```apache
AddEncoding x-compress .Z
AddLanguage en .en
AddLanguage fr .fr
```

Avec cet exemple, le document `xxxx.en.Z` sera traité en tant que document compressé de langue anglaise (idem pour le document `xxxx.Z.en`). Bien que le langage soit fourni au client, le navigateur n'utilise habituellement pas cette information. La directive `AddLanguage` est principalement utilisée au cours de la [[11-guides/01-generalites/negociation-de-contenu|négociation de contenu]], où le serveur choisit d'envoyer un document parmi plusieurs documents possibles en fonction de la préférence du client en matière de langage.

Si une extension fait l'objet de plusieurs associations de langages, c'est la dernière qui sera utilisée. Ainsi, dans le cas suivant,

```apache
AddLanguage en .en
AddLanguage en-gb .en
AddLanguage en-us .en
```

les documents possédant l'extension `.en` seront traités en tant que documents de langage `en-us`.

L'argument *extension* est insensible à la casse et peut être spécifié avec ou sans le point initial. Les noms de fichiers peuvent posséder plusieurs extensions, et l'argument *extension* sera comparé à chacune d'entre elles.

## Voir aussi

- [[12-modules/mod_negotiation|mod_negotiation]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
