---
title: "ProxyRequests"
description: "Directive Apache ProxyRequests (mod_proxy) — Active la fonctionnalité (standard) de mandataire direct. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active la fonctionnalité (standard) de mandataire direct |
| **Syntaxe** | `ProxyRequests On\|Off` |
| **Valeur par défaut** | `ProxyRequests Off` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy\|mod_proxy]] |

## Utilisation

Cette directive permet d'activer/désactiver la fonctionnalité de serveur mandataire direct d'Apache httpd. Définir ProxyRequests à `Off` n'interdit pas l'utilisation de la directive [[13-directives/proxypass|ProxyPass]].

Pour une configuration typique de mandataire inverse ou passerelle, cette directive doit être définie à `Off`.

Afin d'activer la fonctionnalité de mandataire pour des sites HTTP et/ou FTP, les modules [[12-modules/mod_proxy_http|mod_proxy_http]] et/ou [[12-modules/mod_proxy_ftp|mod_proxy_ftp]] doivent également être chargés dans le serveur.

Pour activer la fonctionnalité de mandataire sur les sites chiffrés en HTTPS, le module [[12-modules/mod_proxy_connect|mod_proxy_connect]] doit également être chargé dans le serveur.

> [!WARNING]
> **Avertissement**
>
> N'activez pas la fonctionnalité de mandataire avec la directive [[13-directives/proxyrequests|ProxyRequests]] avant d'avoir sécurisé votre serveur. Les serveurs mandataires ouverts sont dangereux non seulement pour votre réseau, mais aussi pour l'Internet au sens large.

## Voir aussi

- Mandataires/Passerelles directs et inverses

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
