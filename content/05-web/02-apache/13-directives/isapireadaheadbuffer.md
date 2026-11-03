---
title: "ISAPIReadAheadBuffer"
description: "Directive Apache ISAPIReadAheadBuffer (mod_isapi) — Taille du tampon de lecture anticipée envoyé aux extensions ISAPI. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_isapi]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Taille du tampon de lecture anticipée envoyé aux extensions ISAPI |
| **Syntaxe** | `ISAPIReadAheadBuffer taille` |
| **Valeur par défaut** | `ISAPIReadAheadBuffer 49152` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Base |
| **Module** | [[12-modules/mod_isapi\|mod_isapi]] |

## Utilisation

Cette directive permet de définir la taille maximale du tampon de lecture anticipée envoyé aux extensions ISAPI lorsqu'elles sont initialement invoquées. Toute donnée restante doit être extraite en faisant appel à `ReadClient` ; certaines extensions ISAPI peuvent ne pas supporter la fonction `ReadClient`. Pour plus de détails, veuillez vous adresser à l'auteur de l'extension ISAPI.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
