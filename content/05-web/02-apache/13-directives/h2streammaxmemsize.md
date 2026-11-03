---
title: "H2StreamMaxMemSize"
description: "Directive Apache H2StreamMaxMemSize (mod_http2) — Quantité maximale de données en sortie mises en tampon par flux. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_http2]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Quantité maximale de données en sortie mises en tampon par flux. |
| **Syntaxe** | `H2StreamMaxMemSize bytes` |
| **Valeur par défaut** | `H2StreamMaxMemSize 65536` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_http2\|mod_http2]] |

## Utilisation

Cette directive permet de définir la quantité maximale de données en sortie mises en tampon mémoire pour un flux actif. Ce tampon mémoire n'est pas alloué pour chaque flux en tant que tel. Les quantités de mémoire sont définies en fonction de cette limite lorsqu'elles sont sur le point d'être allouées. Le flux s'arrête lorsque la limite a été atteinte, et ne reprendra que lorsque les données du tampon auront été transmises au client.

**Exemple**

```apache
H2StreamMaxMemSize 128000
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
