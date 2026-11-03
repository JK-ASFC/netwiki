---
title: "CookieStyle"
description: "Directive Apache CookieStyle (mod_usertrack) — Format du champ d'en-tête cookie. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_usertrack]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Format du champ d'en-tête cookie |
| **Syntaxe** | `CookieStyle Netscape\|Cookie\|Cookie2\|RFC2109\|RFC2965` |
| **Valeur par défaut** | `CookieStyle Netscape` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_usertrack\|mod_usertrack]] |

## Utilisation

Cette directive permet de contrôler le format du champ d'en-tête cookie. Les trois formats autorisés sont :

- **Netscape** : il s'agit du format original, mais est désormais obsolète. C'est le format par défaut et il correspond à la syntaxe historique utilisée par Apache.
- **Cookie** ou **RFC2109** : c'est la syntaxe qui remplace la syntaxe Netscape.
- **Cookie2** ou **RFC2965** : c'est la syntaxe de cookie la plus actuelle.

Tous les clients ne supportent pas l'ensemble de ces formats, mais il est conseillé d'utiliser le plus récent qui sera en général supporté par le navigateur utilisé par vos utilisateurs. A l'heure où ce document est écrit, la plupart des navigateurs supportent ces trois formats, `Cookie2` étant le format recommandé.

```apache
CookieStyle Cookie2
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
