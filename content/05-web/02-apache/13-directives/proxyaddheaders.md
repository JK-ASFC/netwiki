---
title: "ProxyAddHeaders"
description: "Directive Apache ProxyAddHeaders (mod_proxy) — Ajoute des informations à propos du mandataire aux en-têtes X-Forwarded-*. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Ajoute des informations à propos du mandataire aux en-têtes X-Forwarded-\* |
| **Syntaxe** | `ProxyAddHeaders Off\|On` |
| **Valeur par défaut** | `ProxyAddHeaders On` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy\|mod_proxy]] |
| **Compatibilité** | Disponible depuis la version 2.3.10 |

## Utilisation

Cette directive permet de passer au serveur d'arrière-plan des informations à propos du mandataire via les en-têtes HTTP X-Forwarded-For, X-Forwarded-Host et X-Forwarded-Server.

> [!NOTE]
> **Utilité**
>
> Cette option n'est utile que dans le cas du mandat HTTP traité par [[12-modules/mod_proxy_http|mod_proxy_http]].

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
