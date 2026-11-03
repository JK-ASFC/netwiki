---
title: "ProxyTimeout"
description: "Directive Apache ProxyTimeout (mod_proxy) — Délai d'attente réseau pour les requêtes mandatées. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Délai d'attente réseau pour les requêtes mandatées |
| **Syntaxe** | `ProxyTimeout secondes` |
| **Valeur par défaut** | `Valeur de la directive Timeout` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy\|mod_proxy]] |

## Utilisation

Cette directive permet à l'utilisateur de spécifier un délai pour les requêtes mandatées. Ceci s'avère utile dans le cas d'un serveur d'applications lent et bogué qui a tendance à se bloquer, et si vous préférez simplement renvoyer une erreur timeout et abandonner la connexion en douceur plutôt que d'attendre jusqu'à ce que le serveur veuille bien répondre.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
