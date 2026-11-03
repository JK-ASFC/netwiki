---
title: "ProxyPassInherit"
description: "Directive Apache ProxyPassInherit (mod_proxy) — Héritage des directives ProxyPass définies au niveau du serveur principal. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Héritage des directives ProxyPass définies au niveau du serveur principal |
| **Syntaxe** | `ProxyPassInherit On\|Off` |
| **Valeur par défaut** | `ProxyPassInherit On` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy\|mod_proxy]] |
| **Compatibilité** | Disponible à partir de la version 2.4.5 du serveur HTTP Apache. |

## Utilisation

Cette directive permet à un serveur virtuel d'hériter des directives [[13-directives/proxypass|ProxyPass]] définies au niveau du serveur principal. Si vous utilisez la fonctionnalité de modifications dynamiques du Balancer Manager, cette directive peut causer des problèmes et des comportements inattendus et doit donc être désactivée.

Les valeurs définies au niveau du serveur principal constituent les valeurs par défaut pour tous les serveurs virtuels.

La désactivation de ProxyPassInherit désactive aussi la directive [[13-directives/balancerinherit|BalancerInherit]].

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
