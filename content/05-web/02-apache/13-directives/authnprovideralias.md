---
title: "<AuthnProviderAlias>"
description: "Directive Apache <AuthnProviderAlias> (mod_authn_core) — Regroupe un ensemble de directives qui constituent une extension d'un fournisseur d'authentification de base et lui attribue l'alias spécifié. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authn_core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Regroupe un ensemble de directives qui constituent une extension d'un fournisseur d'authentification de base et lui attribue l'alias spécifié |
| **Syntaxe** | `<AuthnProviderAlias alias-fournisseur> ... </AuthnProviderAlias>` |
| **Contexte** | configuration du serveur |
| **Statut** | Base |
| **Module** | [[12-modules/mod_authn_core\|mod_authn_core]] |

## Utilisation

Les balises `<AuthnProviderAlias>` et `</AuthnProviderAlias>` permettent de regrouper un ensemble de directives d'authentification qui seront référencées par l'alias spécifié à l'aide des directives [[13-directives/authbasicprovider|AuthBasicProvider]] ou [[13-directives/authdigestprovider|AuthDigestProvider]].

> [!NOTE]
> Cette directive n'a aucune influence sur le processus d'autorisation, même pour les modules qui fournissent à la fois l'authentification et l'autorisation.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
