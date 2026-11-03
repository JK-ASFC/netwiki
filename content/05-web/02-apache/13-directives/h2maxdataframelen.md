---
title: "H2MaxDataFrameLen"
description: "Directive Apache H2MaxDataFrameLen (mod_http2) — Nombre maximal d'octets dans une trame HTTP/2 DATA. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_http2]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nombre maximal d'octets dans une trame HTTP/2 DATA |
| **Syntaxe** | `H2MaxDataFrameLen n` |
| **Valeur par défaut** | `H2MaxDataFrameLen 0` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_http2\|mod_http2]] |
| **Compatibilité** | Disponible à partir de la version 2.4.58 du serveur HTTP Apache. |

## Utilisation

La directive `H2MaxDataFrameLen` permet de définir le nombre maximal d'octets du corps de réponse que l'on peut placer dans une seule trame HTTP/2 DATA. La valeur 0 signifie aucune limite (mais la taille maximale permise par le protocole est respectée).

Par défaut, le module essaie d'utiliser la taille maximale possible qui est d'environ 16 Ko. Il s'agit cependant de la taille maximale, et lorsque la taille des données de la réponse est inférieure, les trames envoyées sont plus courtes.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
