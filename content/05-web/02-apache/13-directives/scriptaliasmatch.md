---
title: "ScriptAliasMatch"
description: "Directive Apache ScriptAliasMatch (mod_alias) — Fait correspondre une URL à une zone du système de fichiers en faisant appel aux expressions rationnelles et en désignant la cible comme un script CGI. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_alias]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Fait correspondre une URL à une zone du système de fichiers en faisant appel aux expressions rationnelles et en désignant la cible comme un script CGI |
| **Syntaxe** | `ScriptAliasMatch regex chemin fichier\|chemin répertoire` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Base |
| **Module** | [[12-modules/mod_alias\|mod_alias]] |

## Utilisation

Cette directive est équivalente à la directive [[13-directives/scriptalias|ScriptAlias]], mais fait appel aux expressions rationnelles, à la place d'une simple mise en correspondance de préfixe. L'expression rationnelle fournie est mise en correspondance avec le chemin URL, et si elle correspond, le serveur va substituer toute partie de chemin entre parenthèses dans la chaîne spécifiée et l'utiliser comme nom de fichier. Par exemple, pour activer le répertoire standard `/cgi-bin`, on peut utiliser :

```apache
ScriptAliasMatch "^/cgi-bin(.*)" "/usr/local/apache/cgi-bin$1"
```

Comme dans le cas d'AliasMatch, toute la puissance des expressions rationnelles peut être mise à contribution. Par exemple, il est possible de construire un alias avec une comparaison du modèle du chemin URL insensible à la casse :

```apache
ScriptAliasMatch "(?i)^/cgi-bin(.*)" "/usr/local/apache/cgi-bin$1"
```

Les remarques à propos de la différence entre [[13-directives/alias|Alias]] et [[13-directives/aliasmatch|AliasMatch]] s'appliquent aussi à la différence entre les directives [[13-directives/scriptalias|ScriptAlias]] et [[13-directives/scriptaliasmatch|ScriptAliasMatch]]. Voir la directive [[13-directives/aliasmatch|AliasMatch]] pour plus de détails.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
