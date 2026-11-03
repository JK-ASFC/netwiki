---
title: "SessionCryptoCipher"
description: "Directive Apache SessionCryptoCipher (mod_session_crypto) — L'algorithme à utiliser pour le chiffrement de la session. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_session_crypto]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | L'algorithme à utiliser pour le chiffrement de la session |
| **Syntaxe** | `SessionCryptoCipher algorithme` |
| **Valeur par défaut** | `SessionCryptoCipher aes256` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_session_crypto\|mod_session_crypto]] |
| **Compatibilité** | Disponible depuis la version 2.3.0 du serveur HTTP Apache |

## Utilisation

La directive `SessionCryptoCipher` permet de spécifier l'algorithme à utiliser pour le chiffrement. En l'absence de spécification, l'algorithme par défaut est `aes256`.

L'algorithme peut être choisi, en fonction du moteur de chiffrement utilisé, parmi les valeurs suivantes :

- 3des192
- aes128
- aes192
- aes256

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
