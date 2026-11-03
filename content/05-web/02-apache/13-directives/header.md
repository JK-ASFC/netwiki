---
title: "Header"
description: "Directive Apache Header (mod_headers) — Configure les en-têtes d'une réponse HTTP. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_headers]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Configure les en-têtes d'une réponse HTTP |
| **Syntaxe** | `Header [condition] add\|append\|echo\|edit\|edit*\|merge\|set\|setifempty\|unset\|note en-tête [[expr=]valeur [remplacement] [early\|env=[!]variable\|expr=expression]]` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_headers\|mod_headers]] |
| **Compatibilité** | SetIfEmpty est disponible depuis la version 2.4.7 du serveur HTTP Apache ; le paramètre expr=valeur a été introduit avec la version 2.4.10 |

## Utilisation

Cette directive permet de remplacer, fusionner, ou supprimer des en-têtes de réponse HTTP. L'en-tête est modifié juste après que le gestionnaire de contenu et les filtres en sortie ne s'exécutent, ce qui permet la modification des en-têtes sortants.

L'argument optionnel *condition* permet de déterminer sur quelle table interne d'en-têtes de réponses cette directive va opérer : `onsuccess` (valeur par défaut, peut être omis) ou `always`. A la différence de ceux de la première table, les en-têtes de la seconde sont ajoutés à la réponse même en cas d'erreur et sont conservés au fil des redirections internes (par exemple les gestionnaires ErrorDocument). Notez aussi que la répétition de cette directive avec les deux conditions peut être pertinente dans certains scénarios, car `always` n'englobe pas `onsuccess` en ce qui concerne les en-têtes existants :

- Vous ajoutez un en-tête à une réponse générée localement et échouée (non-2xx), une redirection par exemple, et dans ce cas, seule la table correspondant à `always` est utilisée dans la réponse définitive.
- Vous modifiez ou supprimez un en-tête généré par un script CGI ou par [[12-modules/mod_proxy_fcgi|mod_proxy_fcgi]], auquel cas, les en-têtes des scripts CGI sont dans la table correspondant à `always` et non dans la table par défaut.
- Vous modifiez ou supprimez un en-tête généré par tel ou tel composant du serveur, mais cet en-tête n'est pas trouvé par la condition par défaut `onsuccess`.

Comme il n'y a pas de liste unique "normalisée" d'en-têtes, la manière dont httpd stocke en interne les en-têtes des réponses HTTP est à l'origine de la fonctionnalité que constitue la différence entre `onsuccess` et `always`. Si vous ne gardez pas à l'esprit le concept ci-après lors de l'écriture de votre configuration, certaines réponses HTTP pourront contenir des en-têtes dupliqués (ce qui pourra dérouter les utilisateurs ou même parfois les clients HTTP). Supposons par exemple que votre configuration comporte un mandataire PHP simple avec [[12-modules/mod_proxy_fcgi|mod_proxy_fcgi]] et que votre script PHP d'arrière-plan ajoute l'en-tête `X-Foo: bar` à chaque réponse HTTP. Comme décrit plus haut, [[12-modules/mod_proxy_fcgi|mod_proxy_fcgi]] utilise la table `always` pour stocker les en-têtes, et une configuration comme la suivante n'aboutira pas au résultat attendu car l'en-tête sera dupliqué avec les deux valeurs :

```apache
# la valeur de X-Foo est définie dans la table d'en-têtes 'onsuccess'
Header set X-Foo: baz
```

Plusieurs modèles de configuration permettent de contourner ce problème, comme celui-ci :

```apache
# 'onsuccess' peut être omis car il s'agit de la valeur par défaut
Header onsuccess unset X-Foo
Header always set X-Foo "baz"
```

Outre le paramètre *condition* décrit ci-dessus, vous pouvez limiter une action en fonction de codes d'état HTTP, par exemple pour les requêtes mandatées ou générées par un programme CGI. Voir l'exemple qui utilise %{REQUEST\_STATUS} dans la section ci-dessus.

L'action que cette directive provoque est déterminée par le premier argument (ou par le second argument si une *condition* est spécifiée). Il peut prendre une des valeurs suivantes :

> [!WARNING]
> **Avertissement**
>
> Vous devez lire la différence, décrite plus haut, entre les listes d'en-têtes `always` et `onsuccess` avant de lire la liste d'actions ci-dessous car cet important concept s'applique encore ici. En fait, chaque action fonctionne telle qu'elle est décrite mais seulement pour la liste d'en-têtes cible.

**`add`**

L'en-tête est ajouté au jeu d'en-têtes préexistant, même s'il existe déjà. Ceci peut conduire à la présence de deux (ou plusieurs) en-têtes possèdant le même nom et donc induire des conséquences imprévues ; en général, il est préférable d'utiliser `set`, `append` ou `merge`.

**`append`**

La valeur d'en-tête est ajoutée à tout en-tête existant de même nom. Lorsqu'une nouvelle valeur est ainsi ajoutée, elle est séparée de celles qui sont déjà présentes par une virgule. Il s'agit de la méthode HTTP standard permettant d'affecter plusieurs valeurs à un en-tête. Notez que l’en-tête `Set-Cookie` est une exception : la [RFC 6265](https://www.rfc-editor.org/rfc/rfc6265) préconise plusieurs en-têtes `Set-Cookie` au lieu de plusieurs valeurs séparées par des virgules. Utilisez `add` au lieu de `append` pour `Set-Cookie`.

**`echo`**

Les en-têtes de la requête possédant le nom spécifié sont recopiés vers les en-têtes de la réponse. *en-tête* peut être une expression rationnelle, et *valeur* ne doit pas être présent.

**`edit`**

**`edit*`**

Si l'en-tête existe, sa valeur est modifiée en fonction d'une expression rationnelle de type recherche/remplacement. L'argument *valeur* est une expression rationnelle, et l'argument *remplacement* une chaîne de caractères de remplacement qui peut contenir des références arrières ou des spécificateurs de format. La forme `edit` n'effectuera une recherche/remplacement qu'une seule fois dans la valeur de l'en-tête, alors que la forme `edit*` en effectuera autant que le nombre d'apparition de la chaîne à remplacer.

**`merge`**

La valeur d'en-tête est ajoutée à tout en-tête de même nom, sauf si elle apparaît déjà dans la liste des valeurs préexistantes de l'en-tête séparées par des virgules. Lorsqu'une nouvelle valeur est ainsi ajoutée, elle est séparée de celles qui sont déjà présentes par une virgule. Il s'agit de la méthode HTTP standard permettant d'affecter plusieurs valeurs à un en-tête. Les valeurs sont comparées en tenant compte de la casse, et après le traitement de tous les spécificateurs de format. Une valeur entourée de guillemets est considérée comme différente de la même valeur mais sans guillemets.

**`set`**

L'en-tête est défini, remplaçant tout en-tête préexistant avec le même nom. L'argument *valeur* peut être une chaîne de formatage.

**`setifempty`**

L'en-tête est défini, mais seulement s'il n'existe aucun en-tête avec le même nom.

> [!NOTE]
> L'en-tête Content-Type est un cas particulier car il est possible que sa valeur ait été déterminée mais que l'en-tête ne soit pas présent dans la réponse lorsque `setifempty` est évalué. Dans ce cas, il est préférable d'utiliser `set` comme dans l'exemple suivant :
>
> ```apache
> Header set Content-Type "text/plain" "expr=-z %{CONTENT_TYPE}"
> ```

**`unset`**

L'en-tête est supprimé s'il existe. Si plusieurs en-têtes possèdent le même nom, ils seront tous supprimés. L'argument *value* ne doit pas apparaître.

**`note`**

La valeur de l'*en-tête* considéré est copiée dans une note interne dont le nom est spécifié via l'argument *valeur*. Ceci permet de journaliser la valeur d'un en-tête envoyé par un programme CGI ou une ressource mandatée, même s'il est prévu de l'effacer.
Disponible à partir de la version 2.4.7 du serveur HTTP Apache.

Cet argument est suivi d'un nom d'*en-tête* qui peut se terminer par un caractère ':', mais ce n'est pas obligatoire. La casse est ignorée avec `set`, `append`, `merge`, `add`, `unset` et `edit`. Le nom d'*en-tête* est sensible à la casse pour `echo` et peut être une expression rationnelle.

Avec `set`, `append`, `merge` et `add`, une *valeur* est spécifiée comme argument suivant. Si *valeur* contient des espaces, elle doit être entourée de guillemets. *valeur* peut être une chaîne de caractères, une chaîne contenant des spécificateurs de format propres à [[12-modules/mod_headers|mod_headers]] (et des caractères littéraux), ou une expression [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|ap_expr]] préfixée par *expr=*.

*valeur* supporte les spécificateurs de format suivants :

| Format | Description |
| --- | --- |
| `%%` | Le caractère pourcentage |
| `%t` | Le moment de réception de la requête en temps universel coordonné depuis le temps epoch (Jan. 1, 1970) et exprimé en microsecondes. La valeur est précédée de `t=`. |
| `%D` | Le temps écoulé entre la réception de la requête et l'envoi des en-têtes sur le réseau. Il s'agit de la durée de traitement de la requête. La valeur est précédée de `D=`. La valeur est exprimée en microsecondes. |
| `%l` | La charge moyenne courante du serveur proprement dit. Ce sont les valeurs obtenues par `getloadavg()` qui représentent la charge moyenne courante, sur 5 minutes et sur 15 minutes. Chaque valeur est précédée de `l=` et séparée de la suivante par un `/`. Disponible depuis la version 2.4.4 du serveur HTTP Apache. |
| `%i` | Le pourcentage courant de httpd au repos (de 0 à 100) en se basant sur le nombre de processus et threads disponibles. La valeur est précédée de `i=`. Disponible depuis la version 2.4.4 du serveur HTTP Apache. |
| `%b` | Le pourcentage courant de httpd utilisé (de 0 à 100) en se basant sur le nombre de processus et threads disponibles. La valeur est précédée de `b=`. Disponible depuis la version 2.4.4 du serveur HTTP Apache. |
| `%{NOM_VARIABLE}e` | Le contenu de la [[11-guides/01-generalites/apache-httpd-et-les-variables-d-environnement\|variable d'environnement]] `NOM_VARIABLE`. |
| `%{NOM_VARIABLE}s` | Le contenu de la [[11-guides/01-generalites/apache-httpd-et-les-variables-d-environnement\|variable d'environnement SSL]] `NOM_VARIABLE`, si [[12-modules/mod_ssl\|mod_ssl]] est activé. |

> [!NOTE]
> **Note**
>
> Le spécificateur de format `%s` est disponible depuis la version 2.1 d'Apache ; il peut être utilisé à la place de `%e` pour éviter de devoir spécifier `SSLOptions +StdEnvVars`. Cependant, si `SSLOptions +StdEnvVars` doit tout de même être spécifié pour une raison quelconque, `%e` sera plus efficace que `%s`.

> [!NOTE]
> **Note à propos des valeurs des expressions**
>
> Lorsque le paramètre valeur utilise l'interpréteur [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|ap_expr]], certaines syntaxes d'expressions seront différentes des exemples qui évaluent des expressions *booléennes* telles que \<If\> :
>
> - Le point de départ de la syntaxe est 'string' au lieu de 'expr'.
> - Les appels de fonction utilisent la syntaxe %{funcname:arg} au lieu de funcname(arg).
> - Les fonctions multi-arguments ne sont pas encore disponibles depuis le point de départ 'string'.
> - Il faut mettre entre guillemets l'ensemble du paramètre, comme dans l'exemple suivant :
>
>   ```apache
>   Header set foo-checksum "expr=%{md5:foo}"
>   ```

`edit`nécessite les deux arguments *valeur*, qui est une expression rationnelle, et une chaîne additionnelle *remplacement*. Depuis la version 2.4.7, la chaîne de remplacement peut aussi contenir des spécificateurs de format.

La directive `Header` peut être suivie d'un argument additionnel qui peut prendre les valeurs suivantes :

**`early`**

Spécifie traitement préalable.

**`env=[!]variable`**

La directive est appliquée si et seulement si la [[11-guides/01-generalites/apache-httpd-et-les-variables-d-environnement|variable d'environnement]] `variable` existe. Un `!` devant `variable` inverse le test, et la directive ne s'appliquera alors que si `variable` n'est pas définie.

**`expr=expression`**

La directive s'applique si et seulement si *expression* est évaluée à true. Vous trouverez plus de détails à propos de la syntaxe et de l'évaluation des expressions dans la documentation [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|ap_expr]].

```apache
    # Cet exemple retarde l'évaluation de la clause de condition par
# rapport à <If>
    Header always set CustomHeader my-value "expr=%{REQUEST_URI} =~ m#^/special_path.php$#"
```

Excepté le cas du mode précoce, les directives `Header` sont traitées juste avant l'envoi de la réponse sur le réseau. Cela signifie qu'il est possible de définir et/ou modifier la plupart des en-têtes, à l'exception de certains en-têtes qui sont ajoutés par le filtre d'en-tête HTTP. Avant la version 2.2.12, il n'était pas possible de modifier l'en-tête Content-Type avec cette directive.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
