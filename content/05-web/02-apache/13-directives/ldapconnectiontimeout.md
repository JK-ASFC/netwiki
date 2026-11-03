---
title: "LDAPConnectionTimeout"
description: "Directive Apache LDAPConnectionTimeout (mod_ldap) — Spécifie le délai d'attente en secondes de la socket de connexion. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ldap]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Spécifie le délai d'attente en secondes de la socket de connexion |
| **Syntaxe** | `LDAPConnectionTimeout secondes` |
| **Contexte** | configuration du serveur |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ldap\|mod_ldap]] |

## Utilisation

Cette directive configure l'option LDAP\_OPT\_NETWORK\_TIMEOUT (ou LDAP\_OPT\_CONNECT\_TIMEOUT) dans la bibliothèque client LDAP sous-jacente, si elle est disponible. Cette valeur représente la durée pendant laquelle la bibliothèque client LDAP va attendre que le processus de connexion TCP au serveur LDAP soit achevé.

Si la connexion n'a pas réussi avant ce délai, une erreur sera renvoyée, ou la bibliothèque client LDAP tentera de se connecter à un second serveur LDAP, s'il en a été défini un (via une liste de noms d'hôtes séparés par des espaces dans la directive [[13-directives/authldapurl|AuthLDAPURL]]).

La valeur par défaut est 10 secondes, si la bibliothèque client LDAP liée avec le serveur supporte l'option LDAP\_OPT\_NETWORK\_TIMEOUT.

> [!NOTE]
> LDAPConnectionTimeout n'est disponible que si la bibliothèque client LDAP liée avec le serveur supporte l'option LDAP\_OPT\_NETWORK\_TIMEOUT (ou LDAP\_OPT\_CONNECT\_TIMEOUT), et le comportement final est entièrement dicté par la bibliothèque client LDAP.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
