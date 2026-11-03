---
title: "BrotliCompressionQuality"
description: "Directive Apache BrotliCompressionQuality (mod_brotli) — Qualité de la compression. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_brotli]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Qualité de la compression |
| **Syntaxe** | `BrotliCompressionQuality value` |
| **Valeur par défaut** | `BrotliCompressionQuality 5` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_brotli\|mod_brotli]] |

## Utilisation

La directive `BrotliCompressionQuality` permet de spécifier la qualité de la compression (une valeur entre 0 et 11). Les valeurs les plus hautes correspondent à une compression de meilleure qualité mais plus lente. La valeur par défaut 5 est un bon compromis pour du contenu dynamique.

**Compression rapide pour du contenu dynamique**

```apache
# La valeur de qualité 4 est à peu près équivalente à gzip niveau 6
BrotliCompressionQuality 4
```

**Compression maximale pour les ressources statiques**

```apache
# Meilleur taux de compression mais très lent — ne convient qu’à la mise en
# cache
BrotliCompressionQuality 11
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
