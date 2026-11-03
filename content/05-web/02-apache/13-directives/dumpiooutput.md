---
title: "DumpIOOutput"
description: "Directive Apache DumpIOOutput (mod_dumpio) — Enregistre toutes les sorties dans le journal des erreurs. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_dumpio]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Enregistre toutes les sorties dans le journal des erreurs |
| **Syntaxe** | `DumpIOOutput On\|Off` |
| **Valeur par défaut** | `DumpIOOutput Off` |
| **Contexte** | configuration du serveur |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_dumpio\|mod_dumpio]] |
| **Compatibilité** | DumpIOOutput est disponible depuis la version 2.1.3 d'Apache. |

## Utilisation

Active la journalisation de toutes les sorties.

**Exemple**

```apache
DumpIOOutput On
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
