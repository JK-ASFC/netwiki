---
title: "SessionCryptoPassphraseFile"
description: "Directive Apache SessionCryptoPassphraseFile (mod_session_crypto) — Le fichier contenant les clés utilisées pour chiffrer la session. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_session_crypto]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Le fichier contenant les clés utilisées pour chiffrer la session |
| **Syntaxe** | `SessionCryptoPassphraseFile nom-fichier` |
| **Valeur par défaut** | `none` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_session_crypto\|mod_session_crypto]] |
| **Compatibilité** | Disponible depuis la version 2.3.0 du serveur HTTP Apache |

## Utilisation

La directive `SessionCryptoPassphraseFile` permet de spécifier le nom d'un fichier de configuration contenant les clés à utiliser pour le chiffrement et le déchiffrement de la session (une clé par ligne). Le fichier est lu au démarrage du serveur, et un redémarrage graceful est nécessaire pour prendre en compte un éventuel changement de clés.

À la différence de la directive [[13-directives/sessioncryptopassphrase|SessionCryptoPassphrase]], les clés ne sont pas présentes dans le fichier de configuration de httpd et peuvent être cachées via une protection appropriée du fichier de clés.

Il est possible de spécifier plusieurs clés afin de mettre en oeuvre la rotation de clés. La première clé spécifiée sera utilisée pour le chiffrement, alors que l'ensemble des clés spécifiées le sera pour le déchiffrement. Pour effectuer une rotation périodique des clés sur plusieurs serveurs, ajoutez une nouvelle clé en fin de liste, puis, une fois la rotation complète effectuée, supprimez la première clé de la liste.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
