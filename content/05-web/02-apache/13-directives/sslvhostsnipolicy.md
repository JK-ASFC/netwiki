---
title: "SSLVHostSNIPolicy"
description: "Directive Apache SSLVHostSNIPolicy (mod_ssl) — Définir la politique de compatibilité pour l'accès des clients SNI aux serveurs virtuels. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définir la politique de compatibilité pour l'accès des clients SNI aux serveurs virtuels. |
| **Syntaxe** | `SSLVHostSNIPolicy strict\|secure\|authonly\|insecure` |
| **Valeur par défaut** | `SSLVHostSNIPolicy secure` |
| **Contexte** | configuration du serveur |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Disponible à partir de la version 2.4.66 du serveur HTTP Apache |

## Utilisation

Cette directive permet de définir la politique à appliquer lors de la vérification de la compatibilité du `<serveur virtuel>` identifié par l'en-tête `Host` d'une requête HTTP avec le `<serveur virtuel>` identifié depuis l'extension SNI envoyée au cours de la négociation de la connexion TLS initiale. Si une requête HTTP est associée à un serveur virtuel comportant une configuration SSL/TLS incompatible selon la politique utilisée, un message d'erreur HTTP avec code d'état 421 ("Misdirected Request") sera envoyé.

La politique s'applique aussi aux connexions TLS pour lesquelles une extension SNI n'est pas envoyée lors de la négociation de connexion, et utilisant la première définition de serveur virtuel ou la définition par défaut. Si l'en-tête Host d'une requête HTTP sur une telle connexion identifie un serveur virtuel autre que celui par défaut, la politique de compatibilité sera testée.

La politique `strict` bloque toute requête HTTP associée à un serveur virtuel différent de celui identifié par SNI. La politique `insecure` autorise toute requête, quel que soit le serveur virtuel associé ; une telle configuration pourra être vulnérable à [CVE-2025-23048](https://httpd.apache.org/security/vulnerabilities_24.html).

Les politiques `secure` (politique par défaut) et `authonly` comparent certains aspects spécifiques des deux serveurs virtuels, qui sont regroupés en deux catégories :

- **certificat/clé de serveur ou restrictions de protocole/algorithme de chiffrement** : directives qui déterminent le certificat ou la clé du serveur ([[13-directives/sslcertificatekeyfile|SSLCertificateKeyFile]], etc.), restrictions de protocole ou d'algorithme de chiffrement ([[13-directives/sslprotocol|SSLProtocol]] et [[13-directives/sslciphersuite|SSLCipherSuite]])
- **configuration de la certification et de l'authentification du client** : directives qui affectent l'authentification du client et la vérification de son certificat via TLS, telles que [[13-directives/sslverifyclient|SSLVerifyClient]], `SSLVerifyMode`, [[13-directives/sslcacertificatepath|SSLCACertificatePath]], [[13-directives/sslsrpverifierfile|SSLSRPVerifierFile]]; toute utilisation de [[13-directives/sslopensslconfcmd|SSLOpenSSLConfCmd]]

Le tableau suivant indique quand une requête HTTP sera bloquée ou autorisée lorsque les configurations des serveurs virtuels diffèrent de la manière décrite, et en fonction des différentes politiques utilisées :

| Politique utilisée | Toute incohérence dans les serveurs virtuels | Certificat/clé du serveur, ou restrictions de protocole/algorithme de chiffrement | Certification client/ configuration de l'authentification |
| --- | --- | --- | --- |
| `strict` | bloquée | bloquée | bloquée |
| `secure` | autorisée | bloquée | bloquée |
| `authonly` | autorisée | bloquée | autorisée |
| `insecure` | autorisée | autorisée | autorisée |

**Exemple**

```apache
SSLVHostSNIPolicy authonly
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
