---
title: "CacheLockPath"
description: "Directive Apache CacheLockPath (mod_cache) — Définit le répertoire des verrous. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cache]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit le répertoire des verrous. |
| **Syntaxe** | `CacheLockPath répertoire` |
| **Valeur par défaut** | `CacheLockPath /tmp/mod_cache-lock` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_cache\|mod_cache]] |

## Utilisation

La directive `CacheLockPath` permet de spécifier le répertoire dans lequel les verrous sont créés. Par défaut, c'est le répertoire temporaire du système qui est utilisé. Les verrous sont des fichiers vides qui n'existent que pour les URLs périmées en cours de mise à jour, et consomment donc bien moins de ressources que le traditionnel cache sur disque.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
