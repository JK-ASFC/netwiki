---
title: "LDAPTimeout"
description: "Directive Apache LDAPTimeout (mod_ldap) — Spécifie le délai d'attente pour les opérations de recherche et d'identification LDAP en secondes. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ldap]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Spécifie le délai d'attente pour les opérations de recherche et d'identification LDAP en secondes |
| **Syntaxe** | `LDAPTimeout secondes` |
| **Valeur par défaut** | `LDAPTimeout 60` |
| **Contexte** | configuration du serveur |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ldap\|mod_ldap]] |
| **Compatibilité** | Disponible à partir de la version 2.3.5 du serveur HTTP Apache |

## Utilisation

Cette directive permet de spécifier le délai d'attente pour les opérations de recherche et d'identification, ainsi que l'option LDAP\_OPT\_TIMEOUT dans la bibliothèque LDAP client sous-jacente, lorsqu'elle est disponible.

Lorsque le délai est atteint, httpd va refaire un essai dans le cas où une connexion existante a été silencieusement fermée par un pare-feu. Les performances seront cependant bien meilleures si le pare-feu est configuré pour envoyer des paquets TCP RST au lieu de rejeter silencieusement les paquets.

> [!NOTE]
> Les délais pour les opérations de comparaison LDAP nécessitent un SDK avec LDAP\_OPT\_TIMEOUT, comme OpenLDAP \>= 2.4.4.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
