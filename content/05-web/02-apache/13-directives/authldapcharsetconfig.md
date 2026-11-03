---
title: "AuthLDAPCharsetConfig"
description: "Directive Apache AuthLDAPCharsetConfig (mod_authnz_ldap) — Chemin du fichier de configuration de la correspondance langage/jeu de caractères. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authnz_ldap]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Chemin du fichier de configuration de la correspondance langage/jeu de caractères |
| **Syntaxe** | `AuthLDAPCharsetConfig chemin-fichier` |
| **Contexte** | configuration du serveur |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_authnz_ldap\|mod_authnz_ldap]] |

## Utilisation

La directive `AuthLDAPCharsetConfig` permet de définir le chemin du fichier de configuration de la correspondance langage/jeu de caractères. *chemin-fichier* est un chemin relatif au répertoire défini par la directive [[13-directives/serverroot|ServerRoot]]. Ce fichier contient une liste de correspondances extension de langage/jeu de caractères. La plupart des administrateurs utilisent le fichier `charset.conv` fourni qui associe les extensions de langage courantes à leurs jeux de caractères.

Le fichier contient des lignes au format suivant :

```
extension de langage jeu de caractères
[Nom du langage] ...
```

L'extension est insensible à la casse. Les lignes vides et les lignes commençant par un dièse (`#`) sont ignorées.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
