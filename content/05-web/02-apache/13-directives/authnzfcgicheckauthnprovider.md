---
title: "AuthnzFcgiCheckAuthnProvider"
description: "Directive Apache AuthnzFcgiCheckAuthnProvider (mod_authnz_fcgi) — Permet à une application FastCGI de gérer l'accroche d'authentification check_authn. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authnz_fcgi]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Permet à une application FastCGI de gérer l'accroche d'authentification check\_authn. |
| **Syntaxe** | `AuthnzFcgiCheckAuthnProvider provider-name\|None option ...` |
| **Valeur par défaut** | `none` |
| **Contexte** | répertoire |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_authnz_fcgi\|mod_authnz_fcgi]] |

## Utilisation

Cette directive permet de confier à une application FastCGI la gestion d'une phase spécifique du processus d'authentification ou d'autorisation.

Certaines fonctionnalités des fournisseurs d'autorisation FastCGI nécessitent cette directive en lieu et place de `AuthBasicProvider` pour pouvoir être activées :

- L'authentification de type autre que basique ; en général, détermination de l'identifiant utilisateur et renvoi de sa valeur depuis le fournisseur d'autorisation ; voir l'option `UserExpr` ci-dessous
- Sélection d'un code de réponse personnalisé ; en cas de code de réponse autre que 200 en provenance du fournisseur d'autorisation, c'est ce code qui sera utilisé comme code d'état de la réponse
- Définition du corps d'une réponse autre que 200 ; si le fournisseur d'autorisation renvoie un corps de réponse avec un code autre que 200, c'est ce corps de réponse qui sera renvoyé au client ; la longueur du texte est limitée à 8192 octets

***provider-name***

C'est le nom du fournisseur défini au préalable via la directive `AuthnzFcgiDefineProvider`.

**`None`**

Spécifiez `None` pour désactiver un fournisseur activé avec cette même directive dans une autre portée, par exemple dans un répertoire parent.

***option***

Les options suivantes sont supportées :

**Authoritative On|Off (par défaut On)**

Cette option permet de définir si l'appel à d'autres modules est autorisé lorsqu'un fournisseur d'autorisation FastCGI a été configuré et si la requête échoue.

**DefaultUser *id utilisateur***

Lorsque le fournisseur d'autorisation donne son accord, et si `UserExpr` est défini et correspond à une chaîne vide, (par exemple, si le fournisseur d'autorisation ne renvoie aucune variable), c'est cette valeur qui sera utilisée comme id utilisateur par défaut. Cela se produit souvent lorsqu'on se trouve dans un contexte d'invité, ou d'utilisateur non authentifié ; les utilisateurs et invités se voient alors attribué un id utilisateur spécifique qui permettra de se connecter et d'accéder à certaines ressources.

**RequireBasicAuth On|Off (par défaut Off)**

Cette option permet de définir si l'authentification basique est requise avant de transmettre la requête au fournisseur d'autorisation. Dans l'affirmative, le fournisseur d'autorisation ne sera invoqué qu'en présence d'un id utilisateur et d'un mot de passe ; si ces deux éléments ne sont pas présents, un code d'erreur 401 sera renvoyé

**UserExpr *expr* (pas de valeur par défaut)**

Lorsque le client ne fournit pas l'authentification basique et si le fournisseur d'autorisation détermine l'id utilisateur, cette expression, évaluée après l'appel au fournisseur d'autorisation, permet de déterminer l'id utilisateur. Cette expression se conforme à la [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|syntaxe ap_expr]] et doit correspondre à une chaîne de caractères. Une utilisation courante consiste à référencer la définition d'une `Variable-XXX` renvoyée par le fournisseur d'autorisation via une option du style `UserExpr "%{reqenv:XXX}"`. Si cette option est spécifiée, et si l'id utilisateur ne peut pas être définie via l'expression après une authentification réussie, la requête sera rejetée avec un code d'erreur 500.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
