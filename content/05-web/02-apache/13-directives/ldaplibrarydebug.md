---
title: "LDAPLibraryDebug"
description: "Directive Apache LDAPLibraryDebug (mod_ldap) — Active le débogage dans le SDK LDAP. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ldap]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active le débogage dans le SDK LDAP |
| **Syntaxe** | `LDAPLibraryDebug 7` |
| **Valeur par défaut** | `disabled` |
| **Contexte** | configuration du serveur |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ldap\|mod_ldap]] |

## Utilisation

Active les options de débogage LDAP spécifiques au SDK, qui entraînent en général une journalisation d'informations verbeuses du SDK LDAP dans le journal principal des erreurs d'Apache. Les messages de traces en provenance du SDK LDAP fournissent des informations très détaillées qui peuvent s'avérer utiles lors du débogage des problèmes de connexion avec des serveurs LDAP d'arrière-plan.

Cette option n'est configurable que lorsque le serveur HTTP Apache est lié avec un SDK LDAP qui implémente `LDAP_OPT_DEBUG` ou `LDAP_OPT_DEBUG_LEVEL`, comme OpenLDAP (une valeur de 7 est verbeuse) ou Tivoli Directory Server (une valeur de 65535 est verbeuse).

> [!WARNING]
> Les informations journalisées peuvent contenir des données d'authentification en clair utilisées ou validées lors de l'authentification LDAP ; vous devez donc prendre soin de protéger et de purger le journal des erreurs lorsque cette directive est utilisée.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
