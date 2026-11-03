---
title: "AuthFormDisableNoStore"
description: "Directive Apache AuthFormDisableNoStore (mod_auth_form) — Désactive l'en-tête CacheControl no-store sur la page de connexion. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_auth_form]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Désactive l'en-tête CacheControl no-store sur la page de connexion |
| **Syntaxe** | `AuthFormDisableNoStore On\|Off` |
| **Valeur par défaut** | `AuthFormDisableNoStore Off` |
| **Contexte** | répertoire |
| **Statut** | Base |
| **Module** | [[12-modules/mod_auth_form\|mod_auth_form]] |
| **Compatibilité** | Disponible depuis la version 2.3.0 du serveur HTTP Apache |

## Utilisation

Le drapeau [[13-directives/authformdisablenostore|AuthFormDisableNoStore]] supprime l'envoi d'un en-tête `Cache-Control no-store` lorsqu'une page avec code d'erreur 401 est renvoyée, si l'utilisateur n'est pas encore connecté. Avec cette en-tête, il est plus difficile pour une application `ecmascript` de resoumettre un formulaire de connexion, et ainsi révéler le nom d'utilisateur et le mot de passe à l'application sous-jacente. Vous devez être conscient des risques encourus si vous le désactivez.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
