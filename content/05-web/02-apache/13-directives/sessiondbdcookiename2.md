---
title: "SessionDBDCookieName2"
description: "Directive Apache SessionDBDCookieName2 (mod_session_dbd) — Nom et attributs du cookie RFC2965 qui contient l'identifiant de session. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_session_dbd]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nom et attributs du cookie RFC2965 qui contient l'identifiant de session |
| **Syntaxe** | `SessionDBDCookieName2 nom attributs` |
| **Valeur par défaut** | `none` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_session_dbd\|mod_session_dbd]] |

## Utilisation

La directive `SessionDBDCookieName2` permet de spécifier le nom et les attributs optionnels d'un cookie compatible RFC2965 qui contiendra l'identifiant de session. Les cookies RFC2965 sont définis à l'aide de l'en-tête HTTP `Set-Cookie2`.

Une liste optionnelle d'attributs peut être spécifiée pour ce cookie, comme dans l'exemple ci-dessous. Ces attributs sont insérés dans le cookie tel quel, et ne sont pas interprétés par Apache. Assurez-vous que vos attributs sont définis correctement selon la spécification des cookies.

**Cookie2 avec attributs**

```apache
Session On
SessionDBDCookieName2 session path=/private;domain=example.com;httponly;secure;version=1;
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
