---
title: "DumpIOInput"
description: "Directive Apache DumpIOInput (mod_dumpio) — Enregistre toutes les entrées dans le journal des erreurs. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_dumpio]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Enregistre toutes les entrées dans le journal des erreurs |
| **Syntaxe** | `DumpIOInput On\|Off` |
| **Valeur par défaut** | `DumpIOInput Off` |
| **Contexte** | configuration du serveur |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_dumpio\|mod_dumpio]] |
| **Compatibilité** | DumpIOInput est disponible depuis la version 2.1.3 d'Apache. |

## Utilisation

Active la journalisation de toutes les entrées.

**Exemple**

```apache
DumpIOInput On
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
