---
title: "ReceiveBufferSize"
description: "Directive Apache ReceiveBufferSize (mpm_common) — Taille du tampon TCP en entrée. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mpm_common]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Taille du tampon TCP en entrée |
| **Syntaxe** | `ReceiveBufferSize octets` |
| **Valeur par défaut** | `ReceiveBufferSize 0` |
| **Contexte** | configuration du serveur |
| **Statut** | MPM |
| **Module** | [[12-modules/mpm_common\|mpm_common]] |

## Utilisation

Le serveur va fixer la taille du tampon TCP en entrée au nombre d'octets spécifié.

Si la directive est définie à `0`, le serveur va utiliser la valeur par défaut adoptée par le système d'exploitation. Sinon, elle doit être supérieure ou égale à `512`.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
