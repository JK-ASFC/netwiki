---
title: "mod_imagemap"
description: "Module Apache mod_imagemap — Traitement des cartes des zones interactives d'une image (imagemaps) au niveau du serveur. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_imagemap]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Traitement des cartes des zones interactives d'une image (imagemaps) au niveau du serveur |
| **Statut** | Deprecated |
| **Identificateur** | `imagemap_module` |
| **Fichier source** | `mod_imagemap.c` |

## Sommaire

Ce module traite les fichiers `.map`, et remplace ainsi la fonctionnalité du programme CGI `imagemap`. Tout répertoire ou type de document configuré pour utiliser le gestionnaire `imap-file` (à l'aide des directives [[13-directives/addhandler|AddHandler]] ou [[13-directives/sethandler|SetHandler]]), sera traité par ce module.

La directive suivante confère aux fichiers possèdant l'extension `.map` le statut de fichiers imagemap :

```apache
AddHandler imap-file map
```

Notez que la syntaxe suivante reste encore supportée :

```apache
AddType application/x-httpd-imap map
```

Cependant, nous essayons d'abandonner progressivement les "types MIME magiques", et cette syntaxe est sur le point de devenir obsolète.

## Nouvelles fonctionnalités

Le module imagemap propose quelques nouvelles fonctionnalités qui n'étaient pas disponibles avec les programmes imagemap précédemment distribués.

- Références d'URLs relatives à l'information contenue dans l'en-tête Referer: .
- Assignement `<base>` par défaut via la nouvelle directive `base`.
- Fichier `imagemap.conf` non requis.
- Références à des points.
- Génération configurable de menus d'images interactives.

## Fichier imagemap

Les lignes d'un fichier imagemap peuvent se présenter sous plusieurs formats :

```
directive valeur [x,y ...]
directive valeur "Texte de menu" [x,y
...]
directive valeur x,y ... "Texte de menu"
```

Les directives sont `base`, `default`, `poly`, `circle`, `rect`, ou `point`. valeur est une URL absolue ou relative, ou une des valeurs spéciales énumérées ci-dessous. Les coordonnées sont des paires `x,y` séparées par des espaces. Le texte entre guillemets est le texte du lien si un menu imagemap est généré. Les lignes commençant par '#' sont des commentaires.

### Directives d'un fichier imagemap

Les directives autorisées dans un fichier imagemap sont au nombre de six. Elles peuvent se trouver à n'importe quelle position dans le fichier, mais sont traitées dans l'ordre selon lequel elles sont enregistrées dans le fichier imagemap.

**Directive `base`**

Elle a le même effet que `<base href="valeur">`. Les URLs non absolues du fichier imagemap sont considérées comme relatives à cette valeur. La directive `base` l'emporte sur une directive [[13-directives/imapbase|ImapBase]] définie dans un fichier `.htaccess` ou dans le fichier de configuration du serveur. En l'absence de directive de configuration `ImapBase`, la valeur par défaut de `base` est `http://nom_serveur/`.

`base_uri` est un synonyme de `base`. Notez que la présence ou l'absence d'un slash de fin dans l'URL est importante.

**Directive `default`**

La décision à prendre si les coordonnées fournies ne correspondent à aucune des directives `poly`, `circle`, ou `rect`, et si aucune directive `point` n'est présente. En l'absence de définition d'une directive de configuration [[13-directives/imapdefault|ImapDefault]], la valeur par défaut est `nocontent` et provoque l'envoi d'un code de statut `204 No Content`. Le client verra toujours la même page s'afficher.

**Directive `poly`**

Accepte comme arguments trois à cent points, et est actionnée si les coordonnées sélectionnées par l'utilisateur tombent dans le polygone défini par ces points.

**Directive `circle`**

Accepte comme arguments les coordonnées du centre d'un cercle et celles d'un point de ce cercle. Elle est actionnée si les coordonnées sélectionnées par l'utilisateur tombent dans ce cercle.

**Directive `rect`**

Accepte comme arguments les coordonnées des sommets de deux angles opposés d'un rectangle. Elle est actionnée si les coordonnées sélectionnées par l'utilisateur tombent dans ce rectangle.

**Directive `point`**

Elle n'accepte qu'un seul point comme argument. Si aucune autre directive ne correspond, c'est la directive dont le point spécifié est le plus près du point sélectionné par l'utilisateur qui est actionnée. Notez que la directive `default` ne sera pas suivie si une directive `point` est présente et si des coordonnées valides sont fournies.

### Valeurs

Les valeurs passées aux directives peuvent contenir :

**une URL**

L'URL peut être absolue ou relative. Les URLs relatives peuvent contenir '..' et seront considérées comme relatives à la valeur de `base`.

`base` en lui-même, ne sera pas résolu en fonction de la valeur courante. Cependant, une directive `base mailto:` fonctionnera correctement.

**`map`**

Équivalent à l'URL du fichier imagemap lui-même. Aucune coordonnée n'est spécifiée, et un menu sera donc généré, à moins qu'une directive [[13-directives/imapmenu|ImapMenu]] n'ait été définie à `none`.

**`menu`**

Équivalent à `map`.

**`referer`**

Équivalent à l'URL du document référant. La valeur par défaut est `http://nom_serveur/` si aucun en-tête `Referer:` n'est présent.

**`nocontent`**

Envoie un code de statut `204 No Content`, indiquant au client qu'il doit continuer à afficher la même page. Valide pour toutes les directives, sauf `base`.

**`error`**

Envoie un code de statut d'échec `500 Server Error`. Valide pour toutes les directives, sauf `base`, mais n'a de sens qu'avec la directive `default`.

### Coordonnées

**`0,0 200,200`**

Une coordonnée se compose de deux valeurs, *x* et *y*, séparées par une virgule. Les coordonnées sont séparées entre elles par des espaces. Pour s'adapter à la manière dont Lynx traite les images interactives, la sélection par un utilisateur de la coordonnée `0,0` a le même effet que si aucune coordonnée n'a été sélectionnée.

### Texte entre guillemets

**`"Texte du menu"`**

Après la valeur ou les coordonnées, la ligne peut éventuellement contenir un texte entre guillemets. Cette chaîne constitue le texte du lien si un menu est généré :

```
    <a href="http://example.com/">Texte de
menu</a>
```

Si aucun texte entre guillemets n'est présent, le texte sera constitué du nom du lien :

```
<a href="http://example.com/">http://example.com</a>
```

Si vous voulez insérer des guillemets dans le texte, vous devez les inscrire sous la forme `&quot;`.

## Exemple de fichier imagemap

```
#Les commentaires sont affichés dans un menu 'formaté' ou
#'semi-formaté'.
#Et peuvent contenir des balises html. <hr>
base referer
poly map "Puis-je avoir un menu, s'il vous plait ?" 0,0 0,10 10,10 10,0
rect .. 0,0 77,27 "le répertoire du référant"
circle http://www.inetnebr.example.com/lincoln/feedback/ 195,0 305,27
rect autre_fichier "dans le même répertoire que le référant" 306,0 419,27
point http://www.zyzzyva.example.com/ 100,100
point http://www.tripod.example.com/ 200,200
rect mailto:nate@tripod.example.com 100,150 200,0 "Bogues?"
```

## Référencement de votre fichier imagemap

**Exemple HTML**

```
<a href="/maps/imagemap1.map">

  <img ismap src="/images/imagemap1.gif">

</a>
```

**Exemple XHTML**

```
<a href="/maps/imagemap1.map">

  <img ismap="ismap" src="/images/imagemap1.gif" />

</a>
```

## Directives

- [[13-directives/imapmenu|ImapMenu]]
- [[13-directives/imapdefault|ImapDefault]]
- [[13-directives/imapbase|ImapBase]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
