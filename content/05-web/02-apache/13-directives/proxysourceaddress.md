---
title: "ProxySourceAddress"
description: "Directive Apache ProxySourceAddress (mod_proxy) — Définit l'adresse IP locale pour les connexions mandatées sortantes. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit l'adresse IP locale pour les connexions mandatées sortantes |
| **Syntaxe** | `ProxySourceAddress adresse` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy\|mod_proxy]] |
| **Compatibilité** | Disponible depuis la version 2.3.9 |

## Utilisation

Cette directive permet de définir une adresse IP locale spécifique à laquelle faire référence lors d'une connexion à un serveur d'arrière-plan.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
