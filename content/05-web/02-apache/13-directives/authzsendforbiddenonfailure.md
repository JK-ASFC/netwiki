---
title: "AuthzSendForbiddenOnFailure"
description: "Directive Apache AuthzSendForbiddenOnFailure (mod_authz_core) — Envoie '403 FORBIDDEN' au lieu de '401 UNAUTHORIZED' si l'authentification réussit et si l'autorisation a été refusée. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authz_core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Envoie '403 FORBIDDEN' au lieu de '401 UNAUTHORIZED' si l'authentification réussit et si l'autorisation a été refusée. |
| **Syntaxe** | `AuthzSendForbiddenOnFailure On\|Off` |
| **Valeur par défaut** | `AuthzSendForbiddenOnFailure Off` |
| **Contexte** | répertoire, .htaccess |
| **Statut** | Base |
| **Module** | [[12-modules/mod_authz_core\|mod_authz_core]] |
| **Compatibilité** | Disponible depuis la version 2.3.11 d'Apache HTTPD |

## Utilisation

Par défaut, si l'authentification réussit, alors que l'autorisation est refusée, Apache HTTPD renvoie un code de réponse HTTP '401 UNAUTHORIZED'. En général, les navigateurs proposent alors une nouvelle fois à l'utilisateur la boîte de dialogue de saisie du mot de passe, ce qui n'est pas toujours souhaitable. La directive `AuthzSendForbiddenOnFailure` permet de changer le code de réponse en '403 FORBIDDEN'.

> [!WARNING]
> **Avertissement de sécurité**
>
> La modification de la réponse en cas de refus d'autorisation diminue la sécurité du mot de passe, car elle indique à un éventuel attaquant que le mot de passe qu'il a saisi était correct.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
