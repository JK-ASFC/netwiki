---
title: "SSLOpenSSLConfCmd"
description: "Directive Apache SSLOpenSSLConfCmd (mod_ssl) — Configuration des paramètres d'OpenSSL via son API SSL_CONF. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Configuration des paramètres d'OpenSSL via son API *SSL\_CONF* |
| **Syntaxe** | `SSLOpenSSLConfCmd commande valeur` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Disponible depuis la version 2.4.8 du serveur HTTP Apache avec OpenSSL 1.0.2 ou supérieur |

## Utilisation

Cette directive permet à mod\_ssl d'accéder à l'API *SSL\_CONF* d'OpenSSL. Il n'est ainsi plus nécessaire d'implémenter des directives supplémentaires pour [[12-modules/mod_ssl|mod_ssl]] lorsque de nouvelles fonctionnalités sont ajoutées à OpenSSL, ce qui rend la configuration de ce dernier beaucoup plus souple.

Le jeu de commandes disponibles pour la directive `SSLOpenSSLConfCmd` dépend de la version d'OpenSSL utilisée pour [[12-modules/mod_ssl|mod_ssl]] (la version minimale 1.0.2 est un prérequis). Pour obtenir la liste des commandes supportées, voir la section *Supported configuration file commands* de la page de manuel d'OpenSSL [SSL\_CONF\_cmd(3)](https://docs.openssl.org/master/man3/SSL_CONF_cmd/#supported-configuration-file-commands).

Certaines commandes peuvent remplacer des directives existantes (comme [[13-directives/sslciphersuite|SSLCipherSuite]] ou [[13-directives/sslprotocol|SSLProtocol]]) ; notez cependant que la syntaxe et/ou les valeurs possibles peuvent différer.

**Examples**

```apache
SSLOpenSSLConfCmd Options -SessionTicket,ServerPreference
SSLOpenSSLConfCmd ECDHParameters brainpoolP256r1
SSLOpenSSLConfCmd ServerInfoFile
"/usr/local/apache2/conf/server-info.pem"
SSLOpenSSLConfCmd Protocol "-ALL, TLSv1.2"
SSLOpenSSLConfCmd SignatureAlgorithms RSA+SHA384:ECDSA+SHA256
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
