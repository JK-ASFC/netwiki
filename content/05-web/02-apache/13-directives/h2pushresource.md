---
title: "H2PushResource"
description: "Directive Apache H2PushResource (mod_http2) — Déclare des ressources à proposer (\"pusher\") au client. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_http2]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Déclare des ressources à proposer ("pusher") au client |
| **Syntaxe** | `H2PushResource [add] path [critical]` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_http2\|mod_http2]] |
| **Compatibilité** | Disponible à partir de la version 2.4.24 du serveur HTTP Apache. |

## Utilisation

Lorsqu'il sont activés pour un répertoire, les PUSHes HTTP/2 seront tentés pour tous les chemins ajoutés via cette directive. Cette dernière peut être utilisée plusieurs fois pour le même répertoire.

Cette directive propose des ressources beaucoup plus tôt que les en-têtes `Link` de [[12-modules/mod_headers|mod_headers]]. [[12-modules/mod_http2|mod_http2]] présente ces ressources au client via une réponse intermédiaire `103 Early Hints`. Ceci implique que les clients qui ne supportent pas PUSH recevront quand-même rapidement des propositions de préchargement.

A la différence de la définition d'en-têtes de réponse `Link` via [[12-modules/mod_headers|mod_headers]], cette directive n'aura d'effet que pour les connexions HTTP/2.

En ajoutant l'option `critical` à une telle ressource, le serveur la traitera prioritairement, et une fois les données disponibles, ces dernières seront envoyées avant les données de la requête principale.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
