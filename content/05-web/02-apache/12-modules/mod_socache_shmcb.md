---
title: "mod_socache_shmcb"
description: "Module Apache mod_socache_shmcb — Fournisseur de cache d'objets partagés basé sur shmcb. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_socache_shmcb]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Fournisseur de cache d'objets partagés basé sur shmcb. |
| **Statut** | Extension |
| **Identificateur** | `socache_shmcb_module` |
| **Fichier source** | `mod_socache_shmcb.c` |

## Sommaire

Le module `mod_socache_shmcb` est un fournisseur de cache d'objets partagés qui permet la création et l'accès à un cache maintenu par un tampon cyclique à hautes performances au sein d'un segment de mémoire partagée.

```
shmcb:/chemin/vers/datafile(512000)
```

Vous trouverez des détails à propos des autres fournisseurs de cache d'objets partagés [[11-guides/01-generalites/le-cache-des-objets-partages-du-serveur-http-apache|ici]].

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
