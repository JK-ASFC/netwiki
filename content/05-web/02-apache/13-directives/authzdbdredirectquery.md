---
title: "AuthzDBDRedirectQuery"
description: "Directive Apache AuthzDBDRedirectQuery (mod_authz_dbd) — Définit une requête pour rechercher une page vers laquelle rediriger l'utilisateur après une connexion réussie. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authz_dbd]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit une requête pour rechercher une page vers laquelle rediriger l'utilisateur après une connexion réussie |
| **Syntaxe** | `AuthzDBDRedirectQuery requête` |
| **Contexte** | répertoire |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_authz_dbd\|mod_authz_dbd]] |

## Utilisation

Spécifie une requête SQL optionnelle à utiliser après une connexion (ou une déconnexion) réussie pour rediriger l'utilisateur vers une URL, qui peut être spécifique à l'utilisateur. L'identifiant utilisateur sera transmis comme paramètre sous la forme d'une simple chaîne lorsque la requête SQL sera exécutée. Il y sera fait référence dans la requête en utilisant le spécificateur de format `%s`.

```apache
AuthzDBDRedirectQuery "SELECT userpage FROM userpages WHERE user = %s"
```

La première colonne du premier enregistrement renvoyé par la requête doit contenir une chaîne de caractères correspondant à une URL vers laquelle rediriger le client. Les enregistrements suivants sont ignorés. Si aucun enregistrement n'est renvoyé, le client ne sera pas redirigé.

Notez que `AuthzDBDLoginToReferer` l'emporte sur cette directive si les deux sont définies.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
