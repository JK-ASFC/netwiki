---
title: "DavDepthInfinity"
description: "Directive Apache DavDepthInfinity (mod_dav) — Autorise les requêtes PROPFIND avec en-tête Depth: Infinity. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_dav]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Autorise les requêtes PROPFIND avec en-tête Depth: Infinity |
| **Syntaxe** | `DavDepthInfinity on\|off` |
| **Valeur par défaut** | `DavDepthInfinity off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_dav\|mod_dav]] |

## Utilisation

La directive `DavDepthInfinity` permet d'autoriser le traitement des requêtes `PROPFIND` contenant l'en-tête Depth: Infinity. Par défaut, ce type de requête n'est pas autorisé, car il peut favoriser les attaques de type Déni de service.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
