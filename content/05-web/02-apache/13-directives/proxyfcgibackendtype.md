---
title: "ProxyFCGIBackendType"
description: "Directive Apache ProxyFCGIBackendType (mod_proxy_fcgi) — Spécifie le type de l'application FastCGI d'arrière-plan. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy_fcgi]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Spécifie le type de l'application FastCGI d'arrière-plan |
| **Syntaxe** | `ProxyFCGIBackendType FPM\|GENERIC` |
| **Valeur par défaut** | `ProxyFCGIBackendType FPM` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy_fcgi\|mod_proxy_fcgi]] |
| **Compatibilité** | Disponible à partir de la version 2.4.26 du serveur HTTP Apache |

## Utilisation

Cette directive permet de spécifier le type de l'application FastCGI d'arrière-plan. Certains serveurs FastCGI, comme PHP-FPM, utilisent de manière historique des variables d'environnement exotiques pour identifier le type du serveur mandataire utilisé. Définissez cette directive à "GENERIC" si votre application n'est pas de type PHP-FPM et n'interpréter pas correctement des variables d'environnement comme SCRIPT\_FILENAME ou PATH\_TRANSLATED telles qu'elles sont définies par le serveur.

SCRIPT\_FILENAME est un exemple de valeur modifiée par la définition de cette directive. Historiquement, lorsqu'on utilisait le module [[12-modules/mod_proxy_fcgi|mod_proxy_fcgi]], SCRIPT\_FILENAME était préfixé par la chaîne "proxy:fcgi://". C'est cette variable que lisent certaines applications FastCGI génériques en tant que valeur en entrée pour leur script ; cependant, PHP-FPM peut supprimer le préfixe, puis garder en mémoire qu'il communique avec Apache. Avec les versions 2.4.21 à 2.4.25, ce préfixe était automatiquement supprimé par le serveur, empêchant ainsi PHP-FPM de détecter et interopérer avec Apache dans certains scénarios.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
