---
title: "ProtocolEcho"
description: "Directive Apache ProtocolEcho (mod_echo) — Active ou désactive le serveur d'écho. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_echo]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active ou désactive le serveur d'écho |
| **Syntaxe** | `ProtocolEcho On\|Off` |
| **Valeur par défaut** | `ProtocolEcho Off` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_echo\|mod_echo]] |

## Utilisation

La directive `ProtocolEcho` permet d'activer ou de désactiver le serveur d'écho.

**Exemple**

```apache
ProtocolEcho On
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
