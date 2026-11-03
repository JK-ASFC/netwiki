---
title: "RequestHeader"
description: "Directive Apache RequestHeader (mod_headers) — Configure les en-têtes d'une requête HTTP. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_headers]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Configure les en-têtes d'une requête HTTP |
| **Syntaxe** | `RequestHeader add\|append\|edit\|edit*\|merge\|set\|setifempty\|unset en-tête [[expr=]valeur [remplacement] [early\|env=[!]variable\|expr=expression]]` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_headers\|mod_headers]] |
| **Compatibilité** | SetIfEmpty est disponible depuis la version 2.4.7 du serveur HTTP Apache ; le paramètre expr=valeur a été introduit avec la version 2.4.10 |

## Utilisation

Cette directive permet de remplacer, fusionner, modifier ou supprimer des en-têtes de requête HTTP. L'en-tête est modifié juste avant que le gestionnaire de contenu ne s'exécute, ce qui permet la modification des en-têtes entrants. L'action effectuée est déterminée par le premier argument. Ce dernier accepte les valeurs suivantes :

**`add`**

L'en-tête est ajouté au jeu d'en-têtes préexistant, même s'il existe déjà. Ceci peut conduire à la présence de deux (ou plusieurs) en-têtes possèdant le même nom et donc induire des conséquences imprévues ; en général, il est préférable d'utiliser `set`, `append` ou `merge`.

**`append`**

La valeur d'en-tête est ajoutée à tout en-tête existant de même nom. Lorsqu'une nouvelle valeur est ainsi ajoutée, elle est séparée de celles qui sont déjà présentes par une virgule. Il s'agit de la méthode HTTP standard permettant d'affecter plusieurs valeurs à un en-tête.

**`edit`**

**`edit*`**

Si l'en-tête existe, sa valeur est modifiée en fonction d'une expression rationnelle de type recherche/remplacement. L'argument *valeur* est une expression rationnelle, et l'argument *remplacement* une chaîne de caractères de remplacement qui peut contenir des références arrières ou des spécificateurs de format. Avec `edit`, la chaîne de l'en-tête correspondant au modèle ne sera recherchée et remplacée qu'une seule fois, alors qu'avec `edit*`, elle le sera pour chacune de ses instances si elle apparaît plusieurs fois.

**`merge`**

La valeur d'en-tête est ajoutée à tout en-tête de même nom, sauf si elle apparaît déjà dans la liste des valeurs préexistantes de l'en-tête séparées par des virgules. Lorsqu'une nouvelle valeur est ainsi ajoutée, elle est séparée de celles qui sont déjà présentes par une virgule. Il s'agit de la méthode HTTP standard permettant d'affecter plusieurs valeurs à un en-tête. Les valeurs sont comparées en tenant compte de la casse, et après le traitement de tous les spécificateurs de format. Une valeur entourée de guillemets est considérée comme différente de la même valeur mais sans guillemets.

**`set`**

L'en-tête est défini, remplaçant tout en-tête préexistant avec le même nom.

**`setifempty`**

L'en-tête est défini, mais seulement s'il n'existe aucun en-tête avec le même nom.
Disponible depuis la version 2.4.7 du serveur HTTP Apache.

**`unset`**

L'en-tête est supprimé s'il existe. Si plusieurs en-têtes possèdent le même nom, ils seront tous supprimés. L'argument *value* ne doit pas apparaître.

Cet argument est suivi d'un nom d'en-tête qui peut se terminer par un caractère ':', mais ce n'est pas obligatoire. La casse est ignorée. Avec `set`, `append`, `merge` et `add`, une *valeur* est fournie en troisième argument. Si une *valeur* contient des espaces, elle doit être entourée de guillemets. Avec `unset`, aucune *valeur* ne doit apparaître. *valeur* peut être une chaîne de caractères, une chaîne contenant des spécificateurs de format, ou une combinaison des deux. Les spécificateurs de format supportés sont les mêmes que ceux de la directive [[13-directives/header|Header]], à laquelle vous pouvez vous reporter pour plus de détails. Avec `edit`, les deux arguments *valeur* et *remplacement* sont obligatoires, et correspondent respectivement à une expression rationnelle et à une chaîne de remplacement.

La directive `RequestHeader` peut être suivie d'un argument supplémentaire, qui pourra prendre les valeurs suivantes :

**`early`**

Spécifie traitement préalable.

**`env=[!]variable`**

La directive est appliquée si et seulement si la [[11-guides/01-generalites/apache-httpd-et-les-variables-d-environnement|variable d'environnement]] `variable` existe. Un `!` devant `variable` inverse le test, et la directive ne s'appliquera alors que si `variable` n'est pas définie.

**`expr=expression`**

La directive s'applique si et seulement si *expression* est évaluée à true. Vous trouverez plus de détails à propos de la syntaxe et de l'évaluation des expressions dans la documentation [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|ap_expr]].

Excepté le cas du mode précoce, la directive `RequestHeader` est traitée juste avant la prise en compte de la requête par son gestionnaire, au cours de la phase de vérification. Ceci permet la modification des en-têtes générés par le navigateur, ou par les filtres en entrée d'Apache.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
