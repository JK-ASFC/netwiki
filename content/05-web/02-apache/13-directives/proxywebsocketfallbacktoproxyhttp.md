---
title: "ProxyWebsocketFallbackToProxyHttp"
description: "Directive Apache ProxyWebsocketFallbackToProxyHttp (mod_proxy_wstunnel) — Demande à ce module de laisser mod_proxy_http gérer la requête. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy_wstunnel]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Demande à ce module de laisser [[12-modules/mod_proxy_http\|mod_proxy_http]] gérer la requête |
| **Syntaxe** | `ProxyWebsocketFallbackToProxyHttp On\|Off` |
| **Valeur par défaut** | `ProxyWebsocketFallbackToProxyHttp On` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Deprecated |
| **Module** | [[12-modules/mod_proxy_wstunnel\|mod_proxy_wstunnel]] |
| **Compatibilité** | Disponible à partir de la version 2.4.48 du serveur HTTP Apache |

## Utilisation

Depuis la version 2.4.47 de httpd, [[12-modules/mod_proxy_http|mod_proxy_http]] peut gérer le tunneling et la mise à jour via les WebSockets en accord avec la RFC 7230 ; cette directive permet de définir si, pour ces actions, [[12-modules/mod_proxy_wstunnel|mod_proxy_wstunnel]] doit passer la main à [[12-modules/mod_proxy_http|mod_proxy_http]], ce qui est le cas par défaut.

Définir cette directive à *Off* revient à laisser [[12-modules/mod_proxy_wstunnel|mod_proxy_wstunnel]] gérer les requêtes WebSocket, comme avec les versions 2.4.46 et antérieures de httpd.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
