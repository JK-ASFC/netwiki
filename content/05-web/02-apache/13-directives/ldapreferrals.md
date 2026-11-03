---
title: "LDAPReferrals"
description: "Directive Apache LDAPReferrals (mod_ldap) — Active la redirection vers des serveurs alternatifs au cours des requêtes vers le serveur LDAP. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ldap]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active la redirection vers des serveurs alternatifs au cours des requêtes vers le serveur LDAP. |
| **Syntaxe** | `LDAPReferrals On\|Off\|default` |
| **Valeur par défaut** | `LDAPReferrals On` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ldap\|mod_ldap]] |
| **Compatibilité** | Le paramètre *default* est disponible depuis la version 2.4.7 du serveur HTTP Apache. |

## Utilisation

Certains serveurs LDAP partagent leur annuaire en plusieurs domaines et utilisent le système des redirections (referrals) pour aiguiller un client lorsque les limites d'un domaine doivent être franchies. Ce processus est similaire à une redirection HTTP. Les bibliothèques client LDAP ne respectent pas forcément ces redirections par défaut. Cette directive permet de configurer explicitement les redirections LDAP dans le SDK sous-jacent.

La directive `LDAPReferrals` accepte les valeurs suivantes :

**"on"**

Avec la valeur "on", la prise en compte des redirections LDAP par le SDK sous-jacent est activée, la directive [[13-directives/ldapreferralhoplimit|LDAPReferralHopLimit]] permet de surcharger la "hop limit" du SDK, et un "LDAP rebind callback" est enregistré.

**"off"**

Avec la valeur "off", la prise en compte des redirections LDAP par le SDK sous-jacent est complètement désactivée.

**"default"**

Avec la valeur "default", la prise en compte des redirections LDAP par le SDK sous-jacent n'est pas modifiée, la directive [[13-directives/ldapreferralhoplimit|LDAPReferralHopLimit]] ne permet pas de surcharger la "hop limit" du SDK, et aucun "LDAP rebind callback" n'est enregistré.

La directive [[13-directives/ldapreferralhoplimit|LDAPReferralHopLimit]] travaille en conjonction avec cette directive pour limiter le nombre de redirections à suivre pour achever le traitement de la requête LDAP. Lorsque le processus de redirection est activé par la valeur "On", les données d'authentification du client sont transmises via un "rebind callback" à tout serveur LDAP qui en fait la demande.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
