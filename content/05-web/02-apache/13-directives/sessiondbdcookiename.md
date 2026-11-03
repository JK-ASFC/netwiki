---
title: "SessionDBDCookieName"
description: "Directive Apache SessionDBDCookieName (mod_session_dbd) — Nom et attributs du cookie RFC2109 qui contient l'identifiant de session. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_session_dbd]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nom et attributs du cookie RFC2109 qui contient l'identifiant de session |
| **Syntaxe** | `SessionDBDCookieName nom attributs` |
| **Valeur par défaut** | `none` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_session_dbd\|mod_session_dbd]] |

## Utilisation

La directive `SessionDBDCookieName` permet de spécifier le nom et les attributs optionnels d'un cookie compatible RFC2109 qui contiendra l'identifiant de session. Les cookies RFC2109 sont définis à l'aide de l'en-tête HTTP `Set-Cookie`.

Une liste optionnelle d'attributs peut être spécifiée pour ce cookie, comme dans l'exemple ci-dessous. Ces attributs sont insérés dans le cookie tels quels, et ne sont pas interprétés par Apache. Assurez-vous que vos attributs sont définis correctement selon la spécification des cookies.

**Cookie avec attributs**

```apache
Session On
SessionDBDCookieName session path=/private;domain=example.com;httponly;secure;version=1;
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
