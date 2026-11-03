---
title: "SSLCryptoDevice"
description: "Directive Apache SSLCryptoDevice (mod_ssl) — Active l'utilisation d'un accélérateur matériel de chiffrement. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active l'utilisation d'un accélérateur matériel de chiffrement |
| **Syntaxe** | `SSLCryptoDevice moteur` |
| **Valeur par défaut** | `SSLCryptoDevice builtin` |
| **Contexte** | configuration du serveur |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |

## Utilisation

Cette directive permet d'activer l'utilisation d'une carte accélératrice de chiffrement qui prendra en compte certaines parties du traitement relatif à SSL. Cette directive n'est utilisable que si la boîte à outils SSL à été compilée avec le support "engine" ; les versions 0.9.7 et supérieures d'OpenSSL possèdent par défaut le support "engine", alors qu'avec la version 0.9.6, il faut utiliser les distributions séparées "-engine".

Pour déterminer les moteurs supportés, exécutez la commande "`openssl engine`".

**Exemple**

```apache
# Pour un accélérateur Broadcom :
SSLCryptoDevice ubsec
```

À partir de la version 3.0 d'OpenSSL, si aucun moteur n'est spécifié alors que la clé ou le certificat sont spécifiés à l'aide d'URIs PKCS#11 ([RFC 7512](https://www.rfc-editor.org/rfc/rfc7512)), le chargement de la clé et du certificat est tenté à partir d'un fournisseur OpenSSL. Le fournisseur OpenSSL à utiliser doit être défini et configuré dans le fichier de configuration d'OpenSSL et il doit prendre en charge la [méthode STORE](https://docs.openssl.org/3.0/man7/provider-storemgmt/) pour les URIs PKCS#11 ([RFC 7512](https://www.rfc-editor.org/rfc/rfc7512)).

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
