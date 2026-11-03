---
title: "MaxThreads"
description: "Directive Apache MaxThreads (mpm_netware) — Définit le nombre maximum de threads esclaves. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mpm_netware]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit le nombre maximum de threads esclaves |
| **Syntaxe** | `MaxThreads nombre` |
| **Valeur par défaut** | `MaxThreads 2048` |
| **Contexte** | configuration du serveur |
| **Statut** | MPM |
| **Module** | [[12-modules/mpm_netware\|mpm_netware]] |

## Utilisation

La directive `MaxThreads` définit le nombre maximum de threads esclaves que l'on désire autoriser. La valeur par défaut correspondant à la valeur codée en dur à la compilation, la valeur de cette directive ne peut donc qu'être diminuée, comme dans l'exemple suivant :

```
MaxThreads 512
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
