---
title: "LimitXMLRequestBody"
description: "Directive Apache LimitXMLRequestBody (core) — Définit la taille maximale du corps d'une requête au format XML. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit la taille maximale du corps d'une requête au format XML |
| **Syntaxe** | `LimitXMLRequestBody octets` |
| **Valeur par défaut** | `LimitXMLRequestBody 1000000` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | All |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

Taille maximale (en octets) du corps d'une requête au format XML. Une valeur de `0` appliquera une limite physique (différente selon que le système est sur 32 ou 64 bits) permettant à XML de s'étaler jusqu'aux limites de la mémoire adressable du système, mais elle n'existe qu'à des fins de compatibilité et il est déconseillé de l'utiliser car elle ne tient pas compte de la mémoire consommée ailleurs et des requêtes simultanées, ce qui pourrait provoquer un dépassement de mémoire global du système.

Exemple :

```apache
# Limitation à 1 Mo
LimitXMLRequestBody 1048576
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
