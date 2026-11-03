---
title: "mod_vhost_alias"
description: "Module Apache mod_vhost_alias — Permet de configurer dynamiquement l'hébergement virtuel de masse. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_vhost_alias]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Permet de configurer dynamiquement l'hébergement virtuel de masse |
| **Statut** | Extension |
| **Identificateur** | `vhost_alias_module` |
| **Fichier source** | `mod_vhost_alias.c` |

## Sommaire

Ce module permet de créer des serveurs virtuels configurés dynamiquement, en autorisant l'utilisation de l'adresse IP et/ou de l'en-tête `Host:` de la requête HTTP comme partie du nom de chemin afin de déterminer les fichiers à servir. Ceci facilite la gestion d'un grand nombre de serveurs virtuels possèdant des configurations similaires.

> [!NOTE]
> **Note**
>
> Si les modules [[12-modules/mod_alias|mod_alias]] ou [[12-modules/mod_userdir|mod_userdir]] sont utilisés pour traduire les URIs en noms de fichiers, ils l'emportent sur les directives du module [[12-modules/mod_vhost_alias|mod_vhost_alias]] décrites ci-dessous. Par exemple, la configuration suivante fera correspondre `/cgi-bin/script.pl` à `/usr/local/apache2/cgi-bin/script.pl` dans tous les cas :
>
> ```apache
> ScriptAlias "/cgi-bin/" "/usr/local/apache2/cgi-bin/"
> VirtualScriptAlias "/never/found/%0/cgi-bin/"
> ```

## Interpolation du nom de répertoire

Toutes les directives de ce module insèrent une chaîne dans un nom de chemin. La chaîne insérée (que nous appellerons maintenant le "nom") peut être soit le nom du serveur (voir la directive [[13-directives/usecanonicalname|UseCanonicalName]] pour les détails sur la manière dont il est déterminé), soit l'adresse IP du serveur virtuel hébergé par le serveur sous la forme d'un quadruplet d'octets séparés par des points. L'insertion est contrôlée par des spécificateurs inspirés de `printf` et possèdant de nombreux formats :

> [!NOTE]
> **Note**
>
> Le répertoire interpolé doit être un chemin absolu. La valeur spéciale `none` désactive cette directive.

|   |   |
| --- | --- |
| `%%` | insère un `%` |
| `%p` | insère le numéro de port du serveur virtuel |
| `%N.M` | insère le nom (en partie) |

`N` et `M` permettent de spécifier des sous-chaînes du nom. `N` sélectionne un des composants du nom séparés par des points, et `M` sélectionne des caractères à l'intérieur de ce que `N` a sélectionné. `M` est optionnel et sa valeur par défaut est 0 s'il n'est pas spécifié ; le point doit être présent si et seulement si `M` l'est aussi. Les modes d'insertion sont les suivants :

|   |   |
| --- | --- |
| `0` | le nom en entier |
| `1` | la première partie |
| `2` | la seconde partie |
| `-1` | la dernière partie |
| `-2` | l'avant-dernière partie |
| `2+` | toutes les parties à partir de la seconde |
| `-2+` | toutes les parties jusqu'à l'avant-dernière |
| `1+` et `-1+` | identique à `0` |

Si `N` ou `M` est plus grand que le nombre de parties disponibles, seul un caractère de soulignement est inséré.

## Exemples

Pour des serveurs virtuels simples à base de nom, utilisez les directives suivantes dans le fichier de configuration de votre serveur :

```apache
UseCanonicalName    Off
VirtualDocumentRoot "/usr/local/apache/vhosts/%0"
```

Une requête pour `http://www.example.com/repertoire/fichier.html` concernera alors la ressource `/usr/local/apache/vhosts/www.example.com/repertoire/fichier.html`.

Pour un très grand nombre de serveurs virtuels, il est avantageux d'organiser les fichiers de façon à réduire la taille du répertoire `vhosts`. Pour ce faire, insérez les lignes suivantes dans votre fichier de configuration :

```apache
UseCanonicalName    Off
VirtualDocumentRoot "/usr/local/apache/vhosts/%3+/%2.1/%2.2/%2.3/%2"
```

Une requête pour `http://www.domaine.example.com/repertoire/fichier.html` concernera alors la ressource `/usr/local/apache/vhosts/example.com/d/o/m/domaine/repertoire/fichier.html`.

Une répartition plus régulière des fichiers peut être obtenue en partant de la fin d'un composant du nom, comme dans l'exemple suivant :

```apache
VirtualDocumentRoot "/usr/local/apache/vhosts/%3+/%2.-1/%2.-2/%2.-3/%2"
```

La requête précédente concernerait alors `/usr/local/apache/vhosts/example.com/e/n/i/domaine/repertoire/fichier.html`.

Vous pouvez également utiliser :

```apache
VirtualDocumentRoot "/usr/local/apache/vhosts/%3+/%2.1/%2.2/%2.3/%2.4+"
```

La requête précédente concernerait alors `/usr/local/apache/vhosts/example.com/d/o/m/aine/repertoire/fichier.html`.

Une demande très courante des utilisateurs concerne la possibilité de faire correspondre plusieurs racines de documents à plusieurs domaines, sans avoir à se préoccuper de la longueur ou du nombre de parties du nom d'hôte faisant partie de la requête. Si le nom d'hôte de la requête est `sub.www.domain.example.com` au lieu de simplement `www.domain.example.com`, alors en utilisant %3+, la racine des documents sera `/usr/local/apache/vhosts/domain.example.com/...` au lieu du répertoire `example.com` attendu. Dans ce genre de situation, il peut s'avérer préférable d'utiliser la combinaison `%-2.0.%-1.0` qui fournira toujours le nom de domaine et le tld, par exemple `example.com` sans tenir compte du nombre de sous-domaines ajoutés au nom d'hôte. Dans ces conditions, il est possible d'élaborer une configuration qui associera les sous-domaines de premier, second et troisième niveau au même répertoire :

```apache
VirtualDocumentRoot "/usr/local/apache/vhosts/%-2.0.%-1.0"
```

Dans l'exemple ci-dessus, `www.example.com`, `www.sub.example.com` ou `example.com` correspondront tous au répertoire `/usr/local/apache/vhosts/example.com`.

Pour l'hébergement virtuel à base d'adresse IP, vous pouvez insérer les lignes suivantes dans votre fichier de configuration :

```apache
UseCanonicalName DNS
VirtualDocumentRootIP "/usr/local/apache/vhosts/%1/%2/%3/%4/docs"
VirtualScriptAliasIP  "/usr/local/apache/vhosts/%1/%2/%3/%4/cgi-bin"
```

Si l'adresse IP de `www.domaine.example.com` est 10.20.30.40, une requête pour `http://www.domaine.example.com/repertoire/fichier.html` concernera la ressource `/usr/local/apache/vhosts/10/20/30/40/docs/repertoire/fichier.html`. Une requête pour `http://www.domaine.example.com/cgi-bin/script.pl` concernera la ressource `/usr/local/apache/vhosts/10/20/30/40/cgi-bin/script.pl`.

Si vous voulez insérer le caractère `.` dans une directive `VirtualDocumentRoot`, et si cela crée un conflit avec un spécificateur `%`, vous pouvez contourner le problème de la manière suivante :

```apache
VirtualDocumentRoot "/usr/local/apache/vhosts/%2.0.%3.0"
```

Une requête pour `http://www.domaine.example.com/repertoire/fichier.html` concernera alors la ressource `/usr/local/apache/vhosts/domaine.exemple/repertoire/fichier.html`.

Les spécificateurs de format `%V` et `%A` de la directive [[13-directives/logformat|LogFormat]] s'avèrent très utiles lorsqu'ils sont utilisés en conjonction avec ce module.

## Directives

- [[13-directives/virtualdocumentroot|VirtualDocumentRoot]]
- [[13-directives/virtualdocumentrootip|VirtualDocumentRootIP]]
- [[13-directives/virtualscriptalias|VirtualScriptAlias]]
- [[13-directives/virtualscriptaliasip|VirtualScriptAliasIP]]

## Voir aussi

- [[13-directives/usecanonicalname|UseCanonicalName]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
