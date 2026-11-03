---
title: "mod_session_crypto"
description: "Module Apache mod_session_crypto — Support du chiffrement des sessions. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_session_crypto]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Support du chiffrement des sessions |
| **Statut** | Expérimental |
| **Identificateur** | `session_crypto_module` |
| **Fichier source** | `mod_session_crypto.c` |
| **Compatibilité** | Disponible depuis la version 2.3 d'Apache |

## Sommaire

> [!WARNING]
> **Avertissement**
>
> Les modules de session font usage des cookies HTTP, et peuvent à ce titre être victimes d'attaques de type Cross Site Scripting, ou divulguer des informations à caractère privé aux clients. Veuillez vous assurer que les risques ainsi encourus ont été pris en compte avant d'activer le support des sessions sur votre serveur.

Ce sous-module du module [[12-modules/mod_session|mod_session]] fournit le support du chiffrement des sessions utilisateur avant de les enregistrer dans une base de données locale, ou dans un cookie HTTP au niveau du navigateur distant.

Il peut contribuer à préserver la confidentialité des sessions lorsque leur contenu doit rester privé pour l'utilisateur, ou lorsqu'une protection contre les attaques de type cross site scripting est nécessaire.

Pour plus de détails à propos de l'interface des sessions, voir la documentation du module [[12-modules/mod_session|mod_session]].

## Utilisation de base

Pour créer une session chiffrée et la stocker dans un cookie nommé *session*, configurez la comme suit :

**Session chiffrée stockée au niveau du serveur**

```apache
Session On
SessionCookieName session path=/
SessionCryptoPassphrase secret
```

La session sera chiffrée avec la clé spécifiée. Il est possible de configurer plusieurs serveurs pour qu'ils puissent partager des sessions, en s'assurant que la même clé de chiffrement est utilisée sur chaque serveur.

Si la clé de chiffrement est modifiée, les sessions seront automatiquement invalidées.

Pour des détails sur la manière dont une session peut être utilisée pour stocker des informations de type nom d'utilisateur/mot de passe, voir la documentation du module [[12-modules/mod_auth_form|mod_auth_form]].

## Directives

- [[13-directives/sessioncryptodriver|SessionCryptoDriver]]
- [[13-directives/sessioncryptopassphrase|SessionCryptoPassphrase]]
- [[13-directives/sessioncryptopassphrasefile|SessionCryptoPassphraseFile]]
- [[13-directives/sessioncryptocipher|SessionCryptoCipher]]

## Voir aussi

- [[12-modules/mod_session|mod_session]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
