---
title: "SessionCryptoDriver"
description: "Directive Apache SessionCryptoDriver (mod_session_crypto) — Le pilote de chiffrement à utiliser pour chiffrer les sessions. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_session_crypto]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Le pilote de chiffrement à utiliser pour chiffrer les sessions |
| **Syntaxe** | `SessionCryptoDriver nom [param[=valeur]]` |
| **Valeur par défaut** | `aucun` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_session_crypto\|mod_session_crypto]] |
| **Compatibilité** | Disponible depuis la version 2.3.0 d'Apache |

## Utilisation

La directive `SessionCryptoDriver` permet de spécifier le nom du pilote à utiliser pour le chiffrement. Si aucun pilote n'est spécifié, le pilote utilisé par défaut sera le pilote recommandé compilé avec APR-util.

Le pilote de chiffrement *NSS* nécessite certains paramètres de configuration, qui seront spécifiés comme arguments de la directive avec des valeurs optionnelles après le nom du pilote.

**NSS sans base de données de certificats**

```apache
SessionCryptoDriver nss
```

**NSS avec base de données de certificats**

```apache
SessionCryptoDriver nss dir=certs
```

**NSS avec base de données de certificats et paramètres**

```apache
SessionCryptoDriver nss dir=certs clé3=clé3.db cert7=cert7.db secmod=secmod
```

**NSS avec chemins contenant des espaces**

```apache
SessionCryptoDriver nss "dir=My Certs" key3=key3.db cert7=cert7.db secmod=secmod
```

Le pilote de chiffrement *NSS* peut avoir été configuré au préalable dans une autre partie du serveur, par exemple depuis `mod_nss` ou [[12-modules/mod_ldap|mod_ldap]]. Si c'est le cas, un avertissement sera enregistré dans le journal, et la configuration existante s'en trouvera affectée. Pour éviter cet avertissement, utilisez le paramètre `noinit` comme suit :

**NSS avec base de données de certificats**

```apache
SessionCryptoDriver nss noinit
```

Pour éviter la confusion, assurez-vous que tous les modules utilisant NSS soient configurés avec des paramètres identiques.

Le pilote de chiffrement *openssl* accepte un paramètre optionnel permettant de spécifier le moteur de chiffrement à utiliser.

**OpenSSL avec spécification du moteur de chiffrement**

```apache
SessionCryptoDriver openssl engine=nom-moteur
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
