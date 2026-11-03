---
title: "mod_reflector"
description: "Module Apache mod_reflector — Renvoie un corps de requête comme réponse via la pile de filtres en sortie. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_reflector]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Renvoie un corps de requête comme réponse via la pile de filtres en sortie. |
| **Statut** | Base |
| **Identificateur** | `reflector_module` |
| **Fichier source** | `mod_reflector.c` |
| **Compatibilité** | Versions 2.3 et ultérieures |

## Sommaire

Ce module permet de renvoyer un corps de requête au client, après l'avoir fait passer par la pile de filtres en sortie. Une chaîne de filtres configurée de manière appropriée peut être utilisée pour transformer la requête en réponse. Ce module peut ainsi être utilisé pour transformer un filtre en sortie en service HTTP.

## Exemples

**Service de compression**

Fait passer le corps de la requête par le filtre DEFLATE pour le compresser. Cette requête nécessite un en-tête Content-Encoding contenant la valeur "gzip" pour que le filtre renvoie les données compressées.

```apache
<Location "/compress">
    SetHandler reflector
    SetOutputFilter DEFLATE
</Location>
```

**Service d'abaissement de l'échantillonnage d'image**

Fait passer le corps de la requête par un filtre d'abaissement de l'échantillonnage d'image, et renvoie le résultat au client.

```apache
<Location "/downsample">
    SetHandler reflector
    SetOutputFilter DOWNSAMPLE
</Location>
```

## Directives

- [[13-directives/reflectorheader|ReflectorHeader]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
