---
title: "xml2EncAlias"
description: "Directive Apache xml2EncAlias (mod_xml2enc) — Définit des alias pour les valeurs d'encodage. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_xml2enc]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit des alias pour les valeurs d'encodage |
| **Syntaxe** | `xml2EncAlias jeu-de-caractères alias [alias ...]` |
| **Contexte** | configuration du serveur |
| **Statut** | Base |
| **Module** | [[12-modules/mod_xml2enc\|mod_xml2enc]] |

## Utilisation

Cette directive de niveau serveur permet de définir un ou plusieurs alias pour un encodage. Elle permet au support d'encodage de libxml2 de traiter en interne des encodages non reconnus par libxml2 en utilisant la table de conversion pour un encodage reconnu. Elle permet d'atteindre deux objectifs : supporter des jeux (ou noms) de caractères non reconnus par libxml2 ou iconv, et éviter une conversion pour un encodage lorsque cela n'est pas nécessaire.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
