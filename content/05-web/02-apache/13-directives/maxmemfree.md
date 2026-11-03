---
title: "MaxMemFree"
description: "Directive Apache MaxMemFree (mpm_common) — Quantité maximale de mémoire que l'allocateur principal est autorisé à conserver sans appeler free(). Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mpm_common]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Quantité maximale de mémoire que l'allocateur principal est autorisé à conserver sans appeler `free()` |
| **Syntaxe** | `MaxMemFree KOctets` |
| **Valeur par défaut** | `MaxMemFree 2048` |
| **Contexte** | configuration du serveur |
| **Statut** | MPM |
| **Module** | [[12-modules/mpm_common\|mpm_common]] |

## Utilisation

La directive `MaxMemFree` permet de définir le nombre maximum de KOctets libres que tout allocateur est autorisé à conserver sans appeler `free()`. Dans les MPMs threadés, chaque thread possède son propre allocateur. Si elle est définie à 0, la quantité de mémoire libre que peut conserver un allocateur est illimitée.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
