---
title: "LDAPTrustedGlobalCert"
description: "Directive Apache LDAPTrustedGlobalCert (mod_ldap) — Définit le nom de fichier ou la base de données contenant les Autorités de Certification de confiance globales ou les certificats clients globaux. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ldap]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit le nom de fichier ou la base de données contenant les Autorités de Certification de confiance globales ou les certificats clients globaux |
| **Syntaxe** | `LDAPTrustedGlobalCert type chemin/nom-fichier [mot de passe]` |
| **Contexte** | configuration du serveur |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ldap\|mod_ldap]] |

## Utilisation

Cette directive permet de spécifier le chemin et le nom du fichier contenant les certificats des CA de confiance et/ou les certificats clients du système global que [[12-modules/mod_ldap|mod_ldap]] utilisera pour établir une connexion SSL ou TLS avec un serveur LDAP. Notez que toute information relative aux certificats spécifiée en utilisant cette directive s'applique globalement à l'ensemble de l'installation du serveur. Certains SDK LDAP (en particulier Novell) nécessitent la définition globale de tous les certificats clients en utilisant cette directive. La plupart des autres SDK nécessitent la définition des certificats clients dans une section Directory ou Location en utilisant la directive [[13-directives/ldaptrustedclientcert|LDAPTrustedClientCert]]. Si vous ne définissez pas ces directives correctement, une erreur sera générée lors des tentatives de contact avec un serveur LDAP, ou la connexion échouera silencieusement (Voir plus haut le guide des certificats SSL/TLS pour plus de détails). Le paramètre type spécifie le type de certificat en cours de définition, en fonction du SDK LDAP utilisé. Les types supportés sont :

- CA\_DER - certificat de CA codé en binaire DER
- CA\_BASE64 - certificat de CA codé en PEM
- CA\_CERT7\_DB - fichier de base de données des certificats de CA de Netscape cert7.db
- CA\_SECMOD - fichier de base de données secmod de Netscape
- CERT\_DER - certificat client codé en binaire DER
- CERT\_BASE64 - certificat client codé en PEM
- CERT\_KEY3\_DB - fichier de base de données des certificats clients de Netscape key3.db
- CERT\_NICKNAME - certificat client "nickname" (SDK Netscape)
- CERT\_PFX - certificat client codé en PKCS#12
- KEY\_DER - clé privée codée en binaire DER
- KEY\_BASE64 - clé privée codée en PEM
- KEY\_PFX - clé privée codée en PKCS#12

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
