---
title: "AliasMatch"
description: "Directive Apache AliasMatch (mod_alias) — Met en correspondance des URLs avec le système de fichiers en faisant intervenir les expressions rationnelles. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_alias]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Met en correspondance des URLs avec le système de fichiers en faisant intervenir les expressions rationnelles |
| **Syntaxe** | `AliasMatch regex chemin fichier\|chemin répertoire` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Base |
| **Module** | [[12-modules/mod_alias\|mod_alias]] |

## Utilisation

Cette directive est identique à la directive [[13-directives/alias|Alias]], mais fait appel aux expressions rationnelles, à la place d'une simple mise en correspondance de préfixe. L'expression rationnelle fournie est mise en correspondance avec le chemin URL, et si elle correspond, le serveur va substituer toute partie de chemin correspondant à l'expression entre parenthèses dans la chaîne fournie et l'utiliser comme nom de fichier. Par exemple, pour activer le répertoire `/icons`, on peut utiliser :

```apache
AliasMatch "^/icons(.*)" "/usr/local/apache/icons$1$2"
```

Toute la puissance des expressions rationnelles peut être mise à contribution. Par exemple, il est possible de construire un alias avec un modèle de chemin URL insensible à la casse :

```apache
AliasMatch "(?i)^/image(.*)" "/ftp/pub/image$1"
```

Il existe une différence subtile entre [[13-directives/alias|Alias]] et [[13-directives/aliasmatch|AliasMatch]] : [[13-directives/alias|Alias]] copie automatiquement toute portion supplémentaire de l'URI située après la partie du modèle qui correspond, à la fin du chemin du fichier de la partie droite, alors que [[13-directives/aliasmatch|AliasMatch]] ne le fait pas. Cela signifie qu'il sera préférable dans la plupart des cas de comparer l'expression rationnelle du modèle à la totalité de l'URI de la requête, et d'utiliser les substitutions dans la partie droite.

En d'autres termes, le remplacement d'[[13-directives/alias|Alias]] par [[13-directives/aliasmatch|AliasMatch]] ne produira pas le même résultat. Au minimum, vous devez ajouter `^` au début de l'expression rationnelle, `(.*)$` à sa fin et `$1` à la fin de la chaîne de remplacement.

Par exemple, supposons que nous voulions reformuler cet alias avec AliasMatch :

```apache
Alias "/image/" "/ftp/pub/image/"
```

Le simple remplacement d'Alias par AliasMatch ne produira pas le même résultat. Ainsi, ce qui suit va rediriger toutes les requêtes qui contiennent /image/ vers /ftp/pub/image/ :

```apache
AliasMatch "/image/" "/ftp/pub/image/"
```

Voici la directive AliasMatch qui produira le même résultat que la directive Alias ci-dessus :

```apache
AliasMatch "^/image/(.*)$" "/ftp/pub/image/$1"
```

Bien entendu, il n'y a aucune raison d'utiliser [[13-directives/aliasmatch|AliasMatch]] dans le cas où [[13-directives/alias|Alias]] suffit. [[13-directives/aliasmatch|AliasMatch]] vous permet d'effectuer des choses beaucoup plus sophistiquées. Par exemple, vous pouvez servir différentes sortes de fichiers à partir de répertoires différents :

```apache
AliasMatch "^/image/(.*)\.jpg$" "/fichiers/jpg.images/$1.jpg"
AliasMatch "^/image/(.*)\.gif$" "/fichiers/gif.images/$1.gif"
```

Les éventuels slashes de tête multiples seront supprimés par le serveur avant que les directives de ce module n'effectuent des comparaisons avec le chemin URL de la requête.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
