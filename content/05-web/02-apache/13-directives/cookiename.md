---
title: "CookieName"
description: "Directive Apache CookieName (mod_usertrack) — Nom du cookie traceur. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_usertrack]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nom du cookie traceur |
| **Syntaxe** | `CookieName symbole` |
| **Valeur par défaut** | `CookieName Apache` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_usertrack\|mod_usertrack]] |

## Utilisation

Cette directive vous permet de modifier le nom du cookie que ce module utilise pour sa journalisation. Le nom par défaut du cookie est "`Apache`".

Vous devez spécifier un nom de cookie valide ; les résultats sont imprévisibles si vous utilisez un nom contenant des caractères inhabituels. Les caractères valides font partie des intervales A-Z, a-z, 0-9, "\_", et "-".

```apache
CookieName clicktrack
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
