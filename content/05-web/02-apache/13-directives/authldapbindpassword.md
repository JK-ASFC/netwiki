---
title: "AuthLDAPBindPassword"
description: "Directive Apache AuthLDAPBindPassword (mod_authnz_ldap) — Mot de passe à utiliser en conjonction avec le DN de connexion. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authnz_ldap]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Mot de passe à utiliser en conjonction avec le DN de connexion |
| **Syntaxe** | `AuthLDAPBindPassword mot-de-passe` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_authnz_ldap\|mod_authnz_ldap]] |
| **Compatibilité** | `exec:` est disponible depuis la version 2.4.5 du serveur HTTP Apache. |

## Utilisation

Cette directive permet de spécifier un mot de passe à utiliser en conjonction avec le DN de connexion. Notez que ce mot de passe constitue en général une donnée sensible, et doit donc être protégé de manière appropriée. Vous ne devez utiliser les directives [[13-directives/authldapbinddn|AuthLDAPBindDN]] et `AuthLDAPBindPassword` que si vous en avez vraiment besoin pour effectuer une recherche dans l'annuaire.

Si la valeur spécifiée débute par "exec:", la commande qui suit sera exécutée, et la première ligne renvoyée par la commande sur la sortie standard sera utilisée comme mot de passe.

```apache
# Mot de passe spécifié directement
AuthLDAPBindPassword secret

# Exécution de /path/to/program pour obtenir le mot de passe
AuthLDAPBindPassword exec:/path/to/program

# Exécution de /path/to/otherProgram avec un argument pour obtenir le mot de passe
AuthLDAPBindPassword "exec:/path/to/otherProgram argument1"
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
