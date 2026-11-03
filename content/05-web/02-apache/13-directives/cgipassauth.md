---
title: "CGIPassAuth"
description: "Directive Apache CGIPassAuth (core) — Active la transmission d'en-têtes d'autorisation HTTP aux scripts en tant que variables CGI. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active la transmission d'en-têtes d'autorisation HTTP aux scripts en tant que variables CGI |
| **Syntaxe** | `CGIPassAuth On\|Off` |
| **Valeur par défaut** | `CGIPassAuth Off` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | Disponible à partir de la version 2.4.13 du serveur HTTP Apache |

## Utilisation

La directive `CGIPassAuth` permet aux scripts d'accéder aux en-têtes d'autorisation HTTP tels que `Authorization`, en-tête nécessaire aux scripts qui implémente une authentification HTTP de base. Normalement, ces en-têtes HTTP sont invisibles pour les scripts car ils leurs permettraient de voir les identifiants et mots de passe utilisés pour accéder au serveur lorsque l'authentification HTTP de base est activée au niveau du serveur web. Cette directive doit être définie à "On" lorsque des scripts sont autorisés à implémenter une authentification HTTP de base.

Cette directive constitue une alternative à l'option de compilation `SECURITY_HOLE_PASS_AUTHORIZATION` qui était déjà disponible dans les versions précédentes du serveur HTTP Apache.

Cette option est prise en compte par tout module qui utilise `ap_add_common_vars()`, comme [[12-modules/mod_cgi|mod_cgi]], [[12-modules/mod_cgid|mod_cgid]], [[12-modules/mod_proxy_fcgi|mod_proxy_fcgi]], [[12-modules/mod_proxy_scgi|mod_proxy_scgi]], etc... En particulier, elle affecte les modules qui ne traitent pas à proprement parler les requêtes, mais utilisent quand-même cette API, comme [[12-modules/mod_include|mod_include]] ou [[12-modules/mod_ext_filter|mod_ext_filter]]. Les modules tiers qui n'utilisent pas `ap_add_common_vars()` peuvent aussi choisir de prendre en compte cette option.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
