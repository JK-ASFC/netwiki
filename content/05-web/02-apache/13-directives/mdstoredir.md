---
title: "MDStoreDir"
description: "Directive Apache MDStoreDir (mod_md) — Chemin dans le système de fichiers local du répertoire où seront stockées les données à propos des domaines gérés. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Chemin dans le système de fichiers local du répertoire où seront stockées les données à propos des domaines gérés. |
| **Syntaxe** | `MDStoreDir path` |
| **Valeur par défaut** | `MDStoreDir md` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |

## Utilisation

Cette directive permet de définir le répertoire dans le système de fichiers local où seront stockées les données à propos des domaines gérés. Il s'agit d'un chemin absolu ou relatif à la racine du serveur. Par défaut, le répertoire "md" sera créé à la racine de votre serveur.

Si vous souhaitez changer de répertoire et si ce dernier contient déjà des données, copiez tout d'abord les données vers le nouveau répertoire, puis modifier la configuration et redémarrez le serveur. Si vous commencez par modifier la configuration et redémarrer le serveur sans copier les données, ce dernier croira que les certificats sont absents et il tentera d'en obtenir de nouveaux.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
