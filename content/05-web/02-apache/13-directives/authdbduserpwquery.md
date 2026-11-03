---
title: "AuthDBDUserPWQuery"
description: "Directive Apache AuthDBDUserPWQuery (mod_authn_dbd) — Requête SQL servant à vérifier le mot de passe d'un utilisateur. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authn_dbd]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Requête SQL servant à vérifier le mot de passe d'un utilisateur |
| **Syntaxe** | `AuthDBDUserPWQuery requête` |
| **Contexte** | répertoire |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_authn_dbd\|mod_authn_dbd]] |

## Utilisation

La directive `AuthDBDUserPWQuery` permet de spécifier une requête servant à vérifier le mot de passe d'un utilisateur donné. L'identifiant utilisateur sera transmis comme paramètre sous forme d'une seule chaîne de caractères lorsque la requête sera exécutée. Cet identifiant est référencé dans la requête en utilisant le spécificateur de format `%s`.

```apache
AuthDBDUserPWQuery "SELECT password FROM authn WHERE user = %s"
```

La première colonne du premier enregistrement renvoyé par la requête se présentera sous la forme d'une chaîne de caractères contenant le mot de passe chiffré. Les enregistrements suivants sont ignorés. Si aucun enregistrement n'est renvoyé, l'utilisateur ne sera pas authentifié par [[12-modules/mod_authn_dbd|mod_authn_dbd]].

Toute valeur de colonne supplémentaire du premier enregistrement renvoyé par la requête sera stockée dans une variable d'environnement dont le nom aura la forme `AUTHENTICATE_valeur-colonne`.

Le format du mot de passe chiffré dépend du frontal d'authentification utilisé (par exemple [[12-modules/mod_auth_basic|mod_auth_basic]] ou [[12-modules/mod_auth_digest|mod_auth_digest]]). Voir la documentation sur les [[11-guides/06-divers/formats-de-mots-de-passe|Formats de mots de passe]] pour plus de détails.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
