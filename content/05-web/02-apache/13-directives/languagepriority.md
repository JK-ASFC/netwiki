---
title: "LanguagePriority"
description: "Directive Apache LanguagePriority (mod_negotiation) — L'ordre de priorité des variantes de langages pour les cas où le client n'a pas formulé de préférences. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_negotiation]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | L'ordre de priorité des variantes de langages pour les cas où le client n'a pas formulé de préférences |
| **Syntaxe** | `LanguagePriority langage-MIME [langage-MIME] ...` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Base |
| **Module** | [[12-modules/mod_negotiation\|mod_negotiation]] |

## Utilisation

La directive `LanguagePriority` permet de définir, au cours du traitement d'une requête Multivues, l'ordre de priorité des variantes de langages pour les cas où le client n'a pas formulé de préférences. La liste énumère les *langages-MIME* dans un ordre de préférences décroissantes.

```apache
LanguagePriority en fr de
```

Dans le cas d'une requête pour `foo.html`, si `foo.html.fr` et `foo.html.de` existent, et si le client n'a pas formulé de préférences, c'est le fichier `foo.html.fr` qui sera renvoyé.

Notez que cette directive n'a d'effet que si le 'meilleur' langage n'a pas pu être déterminé d'une autre manière ou si la valeur de la directive [[13-directives/forcelanguagepriority|ForceLanguagePriority]] est différente de `None`. En général, c'est le client qui détermine le langage préféré, non le serveur.

## Voir aussi

- [[13-directives/addlanguage|AddLanguage]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
