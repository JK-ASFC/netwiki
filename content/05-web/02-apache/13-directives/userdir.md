---
title: "UserDir"
description: "Directive Apache UserDir (mod_userdir) — Chemin des répertoires propres à un utilisateur. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_userdir]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Chemin des répertoires propres à un utilisateur |
| **Syntaxe** | `UserDir nom-répertoire [nom-répertoire] ...` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Base |
| **Module** | [[12-modules/mod_userdir\|mod_userdir]] |

## Utilisation

La directive `UserDir` permet de définir le répertoire réel du répertoire home d'un utilisateur à utiliser à la réception d'une requête pour un document de cet utilisateur. *nom-répertoire* peut se présenter sous la forme suivante :

- Le nom d'un répertoire ou un modèle tel que ceux présentés ci-dessous.
- Le mot-clé `disabled`. *Toutes* les traductions nom d'utilisateur vers répertoire sont alors désactivées, à l'exception de celles comportant le mot-clé `enabled` (voir ci-dessous).
- Le mot-clé `disabled` suivi d'une liste de noms d'utilisateurs séparés par des espaces. Les noms d'utilisateurs apparaissant dans une telle liste ne feront *jamais* l'objet d'une traduction vers un répertoire, même dans le cas où ils apparaîtront dans une clause `enabled`.
- Le mot-clé `enabled` suivi d'une liste de noms d'utilisateurs séparés par des espaces. Les noms d'utilisateurs apparaissant dans une telle liste seront traduits en répertoires même dans le cas où une clause disable globale est active, mais pas s'ils apparaissent aussi dans une clause `disabled`.

Si aucun mot-clé `enabled` ou `disabled` n'apparait dans la directive `Userdir`, l'argument est traité en tant que modèle de fichier, et utilisé pour traduire le nom d'utilisateur en une spécification de répertoire. Une requête pour `http://www.example.com/~bob/un/deux.html` sera traduite en :

| Directive Userdir utilisée | Chemin traduit |
| --- | --- |
| UserDir public\_html | ~bob/public\_html/un/deux.html |
| UserDir /usr/web | /usr/web/bob/un/deux.html |
| UserDir /home/\*/www | /home/bob/www/un/deux.html |

Les directives suivantes vont envoyer des redirections au client :

| Directive Userdir utilisée | Chemin traduit |
| --- | --- |
| UserDir http://www.example.com/utilisateurs | http://www.example.com/utilisateurs/bob/un/deux.html |
| UserDir http://www.example.com/\*/usr | http://www.example.com/bob/usr/un/deux.html |
| UserDir http://www.example.com/~\*/ | http://www.example.com/~bob/un/deux.html |

> [!NOTE]
> **Soyez prudent avec cette directive ; par exemple, `"UserDir ./"` ferait correspondre `"/~root"` à `"/"` - ce qui n'est probablement pas souhaité. Il est fortement recommandé d'inclure une déclaration "`UserDir disabled root`" dans votre configuration. Voir aussi la directive [[13-directives/directory|<Directory>]] et la page [[11-guides/06-divers/conseils-sur-la-securite|Conseils en matière de sécurité]] pour plus d'informations.**

Exemples supplémentaires :

Pour permettre à quelques utilisateurs et seulement à ceux-ci de posséder des répertoires `UserDir`, utilisez la configuration suivante :

```apache
UserDir disabled
UserDir enabled user1 user2 user3
```

Pour permettre à la plupart des utilisateurs de posséder des répertoires `UserDir`, mais l'interdire à quelques uns, utilisez la configuration suivante :

```apache
UserDir disabled utilisateur4 utilisateur5 utilisateur6
```

Il est aussi possible de spécifier des répertoires utilisateurs alternatifs. Si vous utilisez une commande comme :

```apache
UserDir "public_html" "/usr/web" "http://www.example.com/"
```

Avec une requête pour `http://www.example.com/~bob/un/deux.html`, le serveur tentera tout d'abord de trouver la page à `~bob/public_html/un/deux.html`, puis à `/usr/web/bob/un/deux.html`, et enfin il enverra une redirection vers `http://www.example.com/bob/un/deux.html`.

Si vous spécifiez une redirection, elle doit être la dernière alternative de la liste. Apache httpd ne pouvant pas déterminer si la redirection a réussi, si cette dernière ne se trouve pas en fin de liste, c'est cette alternative qui sera toujours utilisée.

La substitution de répertoire utilisateur n'est pas activée par défaut depuis la version 2.1.4. Dans les versions précédentes, `UserDir public_html` était sous-entendu si aucune directive `UserDir` n'était présente.

> [!NOTE]
> **Détails à propos de la fusion**
>
> Lorsqu'on passe du contexte global au contexte de serveur virtuel, les listes d'utilisateurs spécifiques activés ou désactivés sont remplacées par les listes du contexte, et non fusionnées.

## Voir aussi

- [[11-guides/02-guides-pratiques/repertoires-web-utilisateurs|Tutoriel sur les répertoires web utilisateur]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
