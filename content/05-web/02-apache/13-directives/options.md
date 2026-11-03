---
title: "Options"
description: "Directive Apache Options (core) — Définit les fonctionnalités disponibles pour un répertoire particulier. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit les fonctionnalités disponibles pour un répertoire particulier |
| **Syntaxe** | `Options [+\|-]option [[+\|-]option] ...` |
| **Valeur par défaut** | `Options FollowSymlinks` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Options |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | Avec la version 2.3.11, la valeur par défaut passe de All à FollowSymlinks |

## Utilisation

La directive `Options` permet de définir les fonctionnalités de serveur disponibles pour un répertoire particulier.

*option* peut être défini à `None`, auquel cas aucune fonctionnalité spécifique n'est activée, ou comprendre une ou plusieurs des options suivantes :

**`All`**

Toutes les options excepté `MultiViews`.

**`ExecCGI`**

L'exécution de scripts CGI à l'aide du module [[12-modules/mod_cgi|mod_cgi]] est permise.

**`FollowSymLinks`**

Le serveur va suivre les liens symboliques dans le répertoire concerné. Il s'agit de la valeur par défaut.

> [!NOTE]
> Quand le serveur suit les liens symboliques, il ne modifie *pas* le nom de chemin concerné défini par la section [[13-directives/directory|<Directory>]].
>
> Désactiver cette option empêche aussi [[12-modules/mod_rewrite|mod_rewrite]] d’agir dans un contexte de répertoire (fichiers `.htaccess` et sections [[13-directives/directory|<Directory>]].
>
> Les options `FollowSymLinks` et `SymLinksIfOwnerMatch` ne fonctionnent que dans les sections [[13-directives/directory|<Directory>]] ou les fichiers `.htaccess`.
>
> Le fait d'omettre cette option ne doit pas être considéré comme une mesure de sécurité efficace, car il existe toujours une situation de compétition (race condition) entre l'instant où l'on vérifie qu'un chemin n'est pas un lien symbolique, et l'instant où l'on utilise effectivement ce chemin.

**`Includes`**

Les inclusions côté serveur (SSI) à l'aide du module [[12-modules/mod_include|mod_include]] sont autorisées.

**`IncludesNOEXEC`**

Les inclusions côté serveur (SSI) sont permises, mais `#exec cmd` et `#exec cgi` sont désactivés. L'utilisation de `#include virtual` pour les scripts CGI est cependant toujours possible depuis des répertoires définis par [[13-directives/scriptalias|ScriptAlias]].

**`Indexes`**

Si une URL requise correspond au répertoire concerné, et si aucun [[13-directives/directoryindex|DirectoryIndex]] (*par exemple* `index.html`) n'est défini pour ce répertoire, le module [[12-modules/mod_autoindex|mod_autoindex]] va renvoyer un listing formaté du répertoire.

**`MultiViews`**

Les vues multiples ("multiviews") à [[11-guides/01-generalites/negociation-de-contenu|contenu négocié]] à l'aide du module [[12-modules/mod_negotiation|mod_negotiation]] sont autorisées.

> [!NOTE]
> **Note**
>
> Cette option est ignorée si elle est définie en tout autre endroit qu'une section [[13-directives/directory|<Directory>]], car [[12-modules/mod_negotiation|mod_negotiation]] a besoin de ressources réelles pour effectuer ses comparaisons et ses évaluations.

**`SymLinksIfOwnerMatch`**

Le serveur ne suivra que les liens symboliques qui renvoient vers un fichier ou un répertoire dont le propriétaire est le même que celui du lien.

> [!NOTE]
> **Note**
>
> Les options `FollowSymLinks` et `SymLinksIfOwnerMatch` ne fonctionnent que dans les sections [[13-directives/directory|<Directory>]] ou les fichiers `.htaccess`.
>
> Le fait d'omettre cette option ne doit pas être considéré comme une mesure de sécurité efficace, car il existe toujours une situation de compétition (race condition) entre l'instant où l'on vérifie qu'un chemin n'est pas un lien symbolique, et l'instant où l'on utilise effectivement ce chemin.

Normalement, si plusieurs directives `Options` peuvent s'appliquer à un répertoire, c'est la plus spécifique qui est utilisée et les autres sont ignorées ; les options ne sont pas fusionnées (voir [[11-guides/01-generalites/sections-de-configuration|comment les sections sont fusionnées]]). Elles le sont cependant si *toutes* les options de la directive `Options` sont précédées d'un symbole `+` ou `-`. Toute option précédée d'un `+` est ajoutée à la liste des options courantes de manière forcée et toute option précédée d'un `-` est supprimée de la liste des options courantes de la même manière.

> [!NOTE]
> **Note**
>
> Mélanger des `Options` avec `+` ou `-` avec des `Options` sans `+` ou `-` constitue une erreur de syntaxe, et la vérification de la syntaxe au cours du démarrage du serveur fera échouer ce dernier.

Par exemple, sans aucun symbole `+` et `-` :

```apache
<Directory "/web/docs">
  Options Indexes FollowSymLinks
</Directory>

<Directory "/web/docs/spec">
  Options Includes
</Directory>
```

ici, seule l'option `Includes` sera prise en compte pour le répertoire `/web/docs/spec`. Par contre, si la seconde directive `Options` utilise les symboles `+` et `-` :

```apache
<Directory "/web/docs">
  Options Indexes FollowSymLinks
</Directory>

<Directory "/web/docs/spec">
  Options +Includes -Indexes
</Directory>
```

alors, les options `FollowSymLinks` et `Includes` seront prises en compte pour le répertoire `/web/docs/spec`.

> [!NOTE]
> **Note**
>
> L'utilisation de `-IncludesNOEXEC` ou `-Includes` désactive complètement les inclusions côté serveur sans tenir compte des définitions précédentes.

En l'absence de toute définition d'options, la valeur par défaut est `FollowSymlinks`.

Les options `All` et `None` doivent être spécifiées en première position. Les modificateurs + et - ne peuvent pas être utilisés avec les options `All` et `None`.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
