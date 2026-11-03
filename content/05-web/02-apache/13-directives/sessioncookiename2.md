---
title: "SessionCookieName2"
description: "Directive Apache SessionCookieName2 (mod_session_cookie) — Nom et attributs pour le cookie RFC2965 dans lequel est stockée la session. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_session_cookie]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nom et attributs pour le cookie RFC2965 dans lequel est stockée la session |
| **Syntaxe** | `SessionCookieName2 nom attributs` |
| **Valeur par défaut** | `none` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_session_cookie\|mod_session_cookie]] |

## Utilisation

La directive `SessionCookieName2` permet de spécifier le nom et les attributs optionnels d'un cookie compatible RFC2965 dans lequel la session sera stockée. Les cookies RFC2965 sont définis en utilisant l'en-tête HTTP `Set-Cookie2`.

Une liste optionnelle d'attributs peut être spécifiée, comme dans l'exemple suivant. Ces attributs sont insérés tels quels dans le cookie, et ne sont pas interprétés par Apache. Assurez-vous que vos attributs soient définis correctement selon la spécification des cookies.

**Cookie2 avec attributs**

```apache
Session On
SessionCookieName2 session path=/private;domain=example.com;httponly;secure;version=1;
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
