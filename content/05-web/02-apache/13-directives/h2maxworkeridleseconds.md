---
title: "H2MaxWorkerIdleSeconds"
description: "Directive Apache H2MaxWorkerIdleSeconds (mod_http2) — Nombre maximal de secondes pendant lequel une unité de traitement h2 pourra rester inactive sans être arrêtée. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_http2]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nombre maximal de secondes pendant lequel une unité de traitement h2 pourra rester inactive sans être arrêtée. |
| **Syntaxe** | `H2MaxWorkerIdleSeconds n` |
| **Valeur par défaut** | `H2MaxWorkerIdleSeconds 600` |
| **Contexte** | configuration du serveur |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_http2\|mod_http2]] |

## Utilisation

Cette directive permet de définir le nombre maximal de secondes pendant lequel une unité de traitement h2 pourra rester inactive avant de s'arrêter elle-même. Cet arrêt ne peut cependant se produire que si le nombre d'unités de traitement h2 dépasse [[13-directives/h2minworkers|H2MinWorkers]].

**Exemple**

```apache
H2MaxWorkerIdleSeconds 20
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
