---
title: "H2MaxWorkers"
description: "Directive Apache H2MaxWorkers (mod_http2) — Nombre maximal de threads à utiliser pour chaque processus enfant. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_http2]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nombre maximal de threads à utiliser pour chaque processus enfant. |
| **Syntaxe** | `H2MaxWorkers n` |
| **Contexte** | configuration du serveur |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_http2\|mod_http2]] |

## Utilisation

Cette directive permet de définir le nombre maximal de threads à lancer pour le traitement HTTP/2 de chaque processus enfant. Si cette directive n'est pas définie, [[12-modules/mod_http2|mod_http2]] choisira une valeur appropriée en fonction du module `mpm` utilisé. This directive sets the maximum number of worker threads to spawn per child process for HTTP/2 processing. If this directive is not used, `mod_http2` will chose a value suitable for the `mpm` module loaded.

**Exemple**

```apache
H2MaxWorkers 20
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
