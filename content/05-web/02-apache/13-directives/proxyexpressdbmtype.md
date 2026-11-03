---
title: "ProxyExpressDBMType"
description: "Directive Apache ProxyExpressDBMType (mod_proxy_express) — Type de fichier DBM. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy_express]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Type de fichier DBM. |
| **Syntaxe** | `ProxyExpressDBMType type` |
| **Valeur par défaut** | `ProxyExpressDBMType default` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy_express\|mod_proxy_express]] |

## Utilisation

La directive `ProxyExpressDBMType` permet de définir le type de fichier DBM requis par le module. La valeur par défaut correspond au type DBM par défaut du fichier créé par l'utilitaire `httxt2dbm`.

Les valeurs possibles sont (mais toutes ne seront pas disponibles à l'exécution) :

| Value | Description |
| --- | --- |
| `db` | Fichiers Berkeley DB |
| `gdbm` | Fichiers GDBM |
| `ndbm` | Fichiers NDBM |
| `sdbm` | Fichiers SDBM (toujours disponible) |
| `default` | type DBM par défaut |

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
