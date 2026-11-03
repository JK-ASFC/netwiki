---
title: "DavLockDiscovery"
description: "Directive Apache DavLockDiscovery (mod_dav_fs) — Active la découverte des verrous. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_dav_fs]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active la découverte des verrous |
| **Syntaxe** | `DavLockDiscovery on\|off` |
| **Valeur par défaut** | `DavLockDiscovery on` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_dav_fs\|mod_dav_fs]] |
| **Compatibilité** | Disponible à partir de la version 2.4.55 du serveur HTTP Apache. |

## Utilisation

`DavLockDiscovery` contrôle la découverte des verrous par la méthode `PROPFIND`. Lorsqu'elle est désactivée, `PROPFIND` renvoie toujours une section `lockdiscovery` vide. Ce réglage améliore les performances dans le cas où des clients utilisent beaucoup `PROPFIND`.

**Example**

```apache
DavLockDiscovery off
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
