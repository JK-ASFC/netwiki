---
title: "RedirectMatch"
description: "Directive Apache RedirectMatch (mod_alias) — Envoie une redirection externe faisant appel aux expressions rationnelles pour la mise en correspondance de l'URL courante. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_alias]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Envoie une redirection externe faisant appel aux expressions rationnelles pour la mise en correspondance de l'URL courante |
| **Syntaxe** | `RedirectMatch [état] regex URL` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Base |
| **Module** | [[12-modules/mod_alias\|mod_alias]] |

## Utilisation

Cette directive est identique à la directive [[13-directives/redirect|Redirect]], mais fait appel aux expressions rationnelles, à la place d'une simple mise en correspondance de préfixe. L'expression rationnelle fournie est mise en correspondance avec le chemin URL, et si elle correspond, le serveur va substituer toute partie de chemin correspondante entre parenthèses dans la chaîne spécifiée et l'utiliser comme nom de fichier. Par exemple, pour rediriger tous les fichiers GIF vers les fichiers JPEG de même nom sur un autre serveur, on peut utiliser :

```apache
RedirectMatch "(.*)\.gif$" "http://autre.example.com$1.jpg"
```

Les remarques à propos de la différence entre [[13-directives/alias|Alias]] et [[13-directives/aliasmatch|AliasMatch]] s'appliquent aussi à la différence entre les directives [[13-directives/redirect|Redirect]] et [[13-directives/redirectmatch|RedirectMatch]]. Voir la directive [[13-directives/aliasmatch|AliasMatch]] pour plus de détails.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
