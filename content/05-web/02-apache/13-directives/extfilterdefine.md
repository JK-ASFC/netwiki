---
title: "ExtFilterDefine"
description: "Directive Apache ExtFilterDefine (mod_ext_filter) — Définit un filtre externe. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ext_filter]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit un filtre externe |
| **Syntaxe** | `ExtFilterDefine nom_filtre paramètres` |
| **Contexte** | configuration du serveur |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ext_filter\|mod_ext_filter]] |

## Utilisation

La directive `ExtFilterDefine` définit les caractéristiques d'un filtre externe, et en particulier le programme à exécuter ainsi que ses arguments.

*nom\_filtre* spécifie le nom du filtre en cours de définition. On peut ensuite utiliser ce nom pour référencer le filtre dans les directives [[13-directives/setoutputfilter|SetOutputFilter]]. Il doit être unique parmi les noms de tous les filtres enregistrés. *Pour le moment, aucune erreur n'est signalée par l'API register-filter, si bien qu'un problème de noms dupliqués ne sera pas porté à la connaissance de l'utilisateur.*

Viennent ensuite un ou plusieurs paramètres dans un ordre indéfini, qui permettent de spécifier la commande externe à exécuter et certaines autres caractéristiques. Le seul paramètre obligatoire est `cmd=`. Voici la liste de ces paramètres :

**`cmd=ligne de commande`**

Le mot-clé `cmd=` spécifie la commande externe à exécuter. Si la ligne de commande comporte des arguments, elle doit être entourée de guillemets (par exemple `cmd="/bin/mypgm arg1 arg2"`). Les guillemets habituels du shell ne sont pas nécessaires car le programme est lancé directement, sans passer par le shell. Les arguments du programme doivent être séparés par des espaces. Si un argument contient des espaces, ces derniers doivent être échappés par un antislash '\\'. Si un argument contient des antislashes '\\', ces derniers doivent être eux-mêmes échappés par un antislash '\\'. Outre les variables d'environnement CGI standards, les variables DOCUMENT\_URI, DOCUMENT\_PATH\_INFO, et QUERY\_STRING\_UNESCAPED seront également définies pour le programme.

**`mode=mode`**

Utilisez `mode=output` (valeur par défaut) pour les filtres qui traitent les réponses. Utilisez `mode=input` pour les filtres qui traitent les requêtes. `mode=input` est disponible depuis la version 2.1 d'Apache.

**`intype=type MIME`**

Ce paramètre spécifie le type de médium Internet (c'est à dire le type MIME) des documents qui doivent être filtrés. Par défaut, tous les documents sont filtrés. Aucun des documents possédant un type MIME autre que celui spécifié par `intype=` ne sera filtré.

**`outtype=type MIME`**

Ce paramètre spécifie le type de médium Internet (c'est à dire le type MIME) des documents filtrés. Il intervient lorsque les opérations de filtrage comprennent une modification du type MIME. Par défaut, le type MIME n'est pas modifié.

**`PreservesContentLength`**

Le mot-clé `PreservesContentLength` indique que le filtre doit conserver la taille du contenu. Ce n'est pas le comportement par défaut, car la plupart des filtres modifient cette taille. Ce mot-clé doit être spécifié si le filtre ne doit pas modifier la taille du contenu.

**`ftype=type de filtre`**

Ce paramètre spécifie une valeur numérique représentant le type de filtre sous lequel le filtre doit être enregistré. La valeur par défaut, AP\_FTYPE\_RESOURCE, convient dans la plupart des situations. Ce paramètre devient nécessaire dès lors que le filtre doit opérer à un autre point de la chaîne de filtrage que les filtres de ressources. Voir les définitions de AP\_FTYPE\_... dans util\_filter.h pour trouver une valeur appropriée.

**`disableenv=env`**

Ce paramètre spécifie le nom d'une variable d'environnement qui, si elle est définie, va désactiver le filtre.

**`enableenv=env`**

Ce paramètre spécifie le nom d'une variable d'environnement qui doit être définie pour que le filtre ne soit pas désactivé.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
