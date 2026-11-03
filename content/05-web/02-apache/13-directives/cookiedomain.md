---
title: "CookieDomain"
description: "Directive Apache CookieDomain (mod_usertrack) — Le domaine auquel le cookie traceur s'applique. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_usertrack]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Le domaine auquel le cookie traceur s'applique |
| **Syntaxe** | `CookieDomain domaine` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_usertrack\|mod_usertrack]] |

## Utilisation

Cette directive permet de définir le domaine auquel le cookie traceur s'applique. Si elle n'est pas présente, aucun domaine n'est inclus dans le champ d'en-tête cookie.

La chaîne dommaine **doit** commencer par un point, et **doit** comporter au moins un point entouré d'autres caractères. Par exemple, `.example.com` est une chaîne valide, mais `www.example.com` et `.com` ne le sont pas.

> [!NOTE]
> La plupart des navigateurs utilisés actuellement n'autorisent pas la définition de cookies pour un domaine racine de deux niveaux, tel que `.co.uk`, bien qu'un tel domaine remplisse les conditions de validité décrites ci-dessus.
> Ces domaines sont équivalents à des domaines racines comme `.com`, et autoriser de tels cookies peut constituer un risque en matière de sécurité. Ainsi, si vous vous situez sous un domaine racine de deux niveaux, vous devez encore utiliser votre domaine véritable, comme vous le feriez avec tout autre domaine racine (par exemple `.example.co.uk`).

```apache
CookieDomain .example.com
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
