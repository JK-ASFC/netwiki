---
title: "SessionCryptoPassphrase"
description: "Directive Apache SessionCryptoPassphrase (mod_session_crypto) — La clé utilisée pour chiffrer la session. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_session_crypto]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | La clé utilisée pour chiffrer la session |
| **Syntaxe** | `SessionCryptoPassphrase secret [ secret ... ]` |
| **Valeur par défaut** | `none` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_session_crypto\|mod_session_crypto]] |
| **Compatibilité** | Disponible depuis la version 2.3.0 d'Apache |

## Utilisation

La directive `SessionCryptoPassphrase` permet de spécifier les clés à utiliser pour chiffrer de manière symétrique le contenu de la session avant de l'enregistrer, ou pour déchiffrer le contenu de la session après sa lecture.

L'utilisation de clés longues et composées de caractères vraiment aléatoires est plus performant en matière de sécurité. Modifier une clé sur un serveur a pour effet d'invalider toutes les sessions existantes.

Il est possible de spécifier plusieurs clés afin de mettre en oeuvre la rotation de clés. La première clé spécifiée sera utilisée pour le chiffrement, alors que l'ensemble des clés spécifiées le sera pour le déchiffrement. Pour effectuer une rotation périodique des clés sur plusieurs serveurs, ajoutez une nouvelle clé en fin de liste, puis, une fois la rotation complète effectuée, supprimez la première clé de la liste.

Depuis la version 2.4.7, si la valeur de l'argument commence par *exec:* , la commande spécifiée sera exécutée, et la première ligne que cette dernière renverra sur la sortie standard sera utilisée comme clé.

```apache
# clé spécifiée et utilisée en tant que tel
SessionCryptoPassphrase secret

# exécution de /path/to/program pour générer la clé
SessionCryptoPassphrase exec:/path/to/program

# exécution de /path/to/program avec un argument pour générer la clé
SessionCryptoPassphrase "exec:/path/to/otherProgram argument1"
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
