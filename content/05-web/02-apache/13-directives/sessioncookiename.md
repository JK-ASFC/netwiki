---
title: "SessionCookieName"
description: "Directive Apache SessionCookieName (mod_session_cookie) — Nom et attributs du cookie RFC2109 dans lequel la session est stockée. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_session_cookie]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nom et attributs du cookie RFC2109 dans lequel la session est stockée |
| **Syntaxe** | `SessionCookieName nom attributs` |
| **Valeur par défaut** | `none` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_session_cookie\|mod_session_cookie]] |

## Utilisation

La directive `SessionCookieName` permet de spécifier le nom et les attributs optionnels d'un cookie compatible RFC2109 dans lequel la session sera stockée. Les cookies RFC2109 sont définis en utilisant l'en-tête HTTP `Set-Cookie`.

Une liste optionnelle d'attributs peut être spécifiée, comme dans l'exemple suivant. Ces attributs sont insérés tels quels dans le cookie, et ne sont pas interprétés par Apache. Assurez-vous que vos attributs soient définis correctement selon la spécification des cookies.

**Cookie avec attributs**

```apache
Session On
SessionCookieName session path=/private;domain=example.com;httponly;secure;version=1;
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
