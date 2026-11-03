---
title: "BrotliCompressionWindow"
description: "Directive Apache BrotliCompressionWindow (mod_brotli) — Taille de la fenêtre de compression glissante brotli. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_brotli]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Taille de la fenêtre de compression glissante brotli |
| **Syntaxe** | `BrotliCompressionWindow value` |
| **Valeur par défaut** | `BrotliCompressionWindow 18` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_brotli\|mod_brotli]] |

## Utilisation

La directive `BrotliCompressionWindow` permet de spécifier la taille de la fenêtre de compression glissante brotli (une valeur comprise entre 10 et 24, représentant une fenêtre de 2^*value* octets. Par exemple, 18 (la valeur par défaut) donne une fenêtre de 256 Ko, alors que 24 en donne une de 16 Mo. Une taille de fenêtre plus grande peut améliorer la qualité de la compression mais consomme d'avantage de mémoire.

**Fenêtre modérée pour une utilisation raisonnable de mémoire**

```apache
# fenêtre de 1 Mo (2^20 octets)
BrotliCompressionWindow 20
```

**Fenêtre maximale pour la meilleure compression**

```apache
# fenêtre de 16 Mo (2^24 octets) — nécessite une quantité de mémoire
# significative pour chaque connexion
BrotliCompressionWindow 24
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
