---
title: "H2MinWorkers"
description: "Directive Apache H2MinWorkers (mod_http2) — Nombre minimal de threads à utiliser pour chaque processus enfant. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_http2]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nombre minimal de threads à utiliser pour chaque processus enfant. |
| **Syntaxe** | `H2MinWorkers n` |
| **Contexte** | configuration du serveur |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_http2\|mod_http2]] |

## Utilisation

Cette directive permet de définir le nombre minimal de threads à lancer pour le traitement HTTP/2 de chaque processus enfant. Si cette directive n'est pas définie, [[12-modules/mod_http2|mod_http2]] choisira une valeur appropriée en fonction du module `mpm` utilisé.

**Exemple**

```apache
H2MinWorkers 10
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
