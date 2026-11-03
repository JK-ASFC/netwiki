---
title: "LDAPTrustedClientCert"
description: "Directive Apache LDAPTrustedClientCert (mod_ldap) — Définit le nom de fichier contenant un certificat client ou un alias renvoyant vers un certificat client spécifique à une connexion. Tous les SDK LDAP ne supportent pas les certificats clients par connexion. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ldap]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit le nom de fichier contenant un certificat client ou un alias renvoyant vers un certificat client spécifique à une connexion. Tous les SDK LDAP ne supportent pas les certificats clients par connexion. |
| **Syntaxe** | `LDAPTrustedClientCert type chemin/nom-fichier/alias [mot de passe]` |
| **Contexte** | répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ldap\|mod_ldap]] |

## Utilisation

Cette directive permet de spécifier le chemin et le nom de fichier ou l'alias d'un certificat client par connexion utilisé lors de l'établissement d'une connexion SSL ou TLS avec un serveur LDAP. Les sections directory ou location peuvent posséder leurs propres configurations de certificats clients. Certains SDK LDAP (en particulier Novell) ne supportent pas les certificats clients par connexion, et renvoient une erreur lors de la connexion au serveur LDAP si vous tenter d'utiliser cette directive (Utilisez à la place la directive [[13-directives/ldaptrustedglobalcert|LDAPTrustedGlobalCert]] pour les certificats clients sous Novell - Voir plus haut le guide des certificats SSL/TLS pour plus de détails). Le paramètre type spécifie le type du certificat en cours de définition, en fonction du SDK LDAP utilisé. Les types supportés sont :

- CA\_DER - certificat de CA codé en binaire DER
- CA\_BASE64 - certificat de CA codé en PEM
- CERT\_DER - certificat client codé en binaire DER
- CERT\_BASE64 - certificat client codé en PEM
- CERT\_NICKNAME - certificat client "nickname" (SDK Netscape)
- KEY\_DER - clé privée codée en binaire DER
- KEY\_BASE64 - clé privée codée en PEM

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
