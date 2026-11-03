---
title: "DBDPersist"
description: "Directive Apache DBDPersist (mod_dbd) — Utiliser ou non des connexions persistentes. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_dbd]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Utiliser ou non des connexions persistentes |
| **Syntaxe** | `DBDPersist On\|Off` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_dbd\|mod_dbd]] |

## Utilisation

Si cette directive est définie à Off, les connexions persistentes et les connexions groupées sont désactivées. À la demande d'un client, une nouvelle connexion à la base de données est ouverte, et fermée immédiatement à l'issue du traitement. Cette configuration ne doit être utilisée qu'à des fins de débogage, ou sur des serveurs à charge faible.

Par défaut, les groupes de connexions persistentes sont activés (ou une seule connexion persistente du style LAMP pour les serveurs non threadés), et c'est la configuration qui devrait être utilisée dans la plupart des cas sur un serveur en production.

Avant la version 2.2.2, cette directive n'acceptait que les valeurs `0` et `1` au lieu de `Off` et `On`, respectivement.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
