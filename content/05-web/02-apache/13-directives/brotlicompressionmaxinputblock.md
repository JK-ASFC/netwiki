---
title: "BrotliCompressionMaxInputBlock"
description: "Directive Apache BrotliCompressionMaxInputBlock (mod_brotli) — Taille maximale du bloc de données en entrée. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_brotli]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Taille maximale du bloc de données en entrée |
| **Syntaxe** | `BrotliCompressionMaxInputBlock value` |
| **Valeur par défaut** | `(automatic)` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_brotli\|mod_brotli]] |

## Utilisation

La directive `BrotliCompressionMaxInputBlock` permet de spécifier la taille maximale du bloc de données en entrée sous la forme de 2 élevé à une puissance égale à *value*. Cette dernière doit être comprise entre 16 et 24, ce qui représente des blocs de 64 Ko à 16 Mo. Des blocs de taille plus grande peuvent améliorer la compression, mais nécessitent davantage de mémoire. Lorsque cette directive n’est pas définie, la taille de bloc est automatiquement calculée en fonction de la valeur de qualité définie.

**Blocs en entrée de taille définie à 1 Mo**

```apache
# 2^20 = blocs de 1 Mo
BrotliCompressionMaxInputBlock 20
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
