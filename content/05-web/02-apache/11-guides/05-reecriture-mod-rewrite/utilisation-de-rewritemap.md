---
title: "Utilisation de RewriteMap"
description: "Apache HTTP Server — Utilisation de RewriteMap. Ce document est un complément à la documentation de référence du module mod_rewrite. Il décrit l'utilisation de la directive RewriteMap, et fournit des exemples pour chacun des différents types de RewriteMap."
tags: [apache, guide]
icon: book-open
---

Ce document est un complément à la [[12-modules/mod_rewrite|documentation de référence]] du module [[12-modules/mod_rewrite|mod_rewrite]]. Il décrit l'utilisation de la directive [[13-directives/rewritemap|RewriteMap]], et fournit des exemples pour chacun des différents types de [[13-directives/rewritemap|RewriteMap]].

## Introduction

La directive [[13-directives/rewritemap|RewriteMap]] définit une fonction externe qui peut être appelée depuis une directive [[13-directives/rewriterule|RewriteRule]] ou [[13-directives/rewritecond|RewriteCond]] pour accomplir une réécriture trop compliquée, ou trop spécialisée pour être effectuée à partir d'expressions rationnelles. Vous trouverez ci-dessous les différents types disponibles pour la source de données, ceux-ci étant par ailleurs énumérés dans la documentation de référence de [[13-directives/rewritemap|RewriteMap]].

La syntaxe de la directive [[13-directives/rewritemap|RewriteMap]] est la suivante :

```apache
RewriteMap MapName MapType:MapSource
```

L'argument *MapName* est un nom arbitraire que vous associez à la table de correspondances, et que vous pourrez utilisez par la suite dans les directives de réécriture. Les recherches dans la table de correspondance s'effectuent en respectant cette syntaxe :

**`${` *nom-map* `:` *clé-recherche* `}`
`${` *nom-map* `:` *clé-recherche* `|` *DefaultValue* `}`**

Lorsque cette syntaxe est employée, la table de correspondances *nom-map* est consultée et la clé *clé-recherche* recherchée. Si la clé est trouvée, la fonction de recherche dans la table de correspondance est remplacée par *SubstValue*, ou par *DefaultValue* dans le cas contraire, ou par la chaîne vide si aucune *DefaultValue* n'a été spécifiée.

Par exemple, vous pouvez définir une directive [[13-directives/rewritemap|RewriteMap]] comme suit :

```apache
RewriteMap examplemap "txt:/path/to/file/map.txt"
```

Vous pourrez par la suite utiliser cette table de correspondances dans une directive [[13-directives/rewriterule|RewriteRule]] comme suit :

```apache
RewriteRule "^/ex/(.*)" "${examplemap:$1}"
```

Il est possible de spécifier une valeur par défaut qui sera utilisée si la recherche dans la table de correspondances est infructueuse :

```apache
RewriteRule "^/ex/(.*)" "${examplemap:$1|/not_found.html}"
```

> [!NOTE]
> **Contexte de répertoire et fichiers.htaccess**
>
> Vous ne pouvez utilisez la directive [[13-directives/rewritemap|RewriteMap]] ni dans les sections [[13-directives/directory|<Directory>]], ni dans les fichiers `.htaccess`. Vous devez déclarer la table de correspondances au niveau du serveur principal ou dans un contexte de serveur virtuel. Par contre, si vous ne pouvez pas déclarer la table dans une section \<Directory\> ou dans un fichier `.htaccess`, vous pourrez y faire référence dans ces contextes, une fois cette table créée.

Les sections suivantes décrivent les différents types de tables de correspondances *type-map* disponibles, et fournissent des exemples pour chacun d'entre eux.

## int: fonction interne

Quand le type de table `int` est spécifié, la correspondance s'effectue via une des fonctions internes [[13-directives/rewritemap|RewriteMap]] disponibles. Les développeurs de modules peuvent fournir des fonctions internes supplémentaires en les enregistrant via l'API `ap_register_rewrite_mapfunc`. Les fonctions fournies par défaut sont :

- **toupper**:
  Met la clé en majuscules.
- **tolower**:
  Met la clé en minuscules.
- **escape**:
  Remplace les caractères spéciaux de la clé en codes hexadécimaux.
- **unescape**:
  Reconvertit les codes hexadécimaux de la clé en caractères spéciaux.

Pour utiliser une de ces fonctions, créez une [[13-directives/rewritemap|RewriteMap]] qui référence la fonction interne, et insérez-la dans votre [[13-directives/rewriterule|RewriteRule]] :

**Redirection d'un chemin d’URL vers une version en minuscules d'elle-même**

```apache
RewriteMap lc int:tolower
RewriteRule "(.*)" "${lc:$1}" [R]
```

> [!NOTE]
> Notez que cet exemple n'est présenté ici qu'à titre d'illustration et ne constitue pas une recommandation. Si vous voulez rendre les URLs insensibles à la casse, utiliser plutôt le module [[12-modules/mod_speling|mod_speling]].

## txt: tables de correspondances au format texte

Lorsqu'un type-map `txt` est utilisé, la source-map est un chemin du système de fichiers vers un fichier de correspondances au format texte, contenant sur chaque ligne une paire clé/valeur séparées par un espace. Il est possible d'insérer des commentaires sous la forme de chaînes commençant par le caractère '#'.

Un fichier de correspondances au format texte valide possèdera la syntaxe suivante :

```
# Ligne de commentaires
clé valeur-substitution
clé valeur-substitution # commentaire
```

Lorsque la table de correspondance fait l'objet d'une recherche, la valeur spécifiée est recherchée dans le premier champ, et si elle est trouvée, la valeur de substitution est renvoyée.

Par exemple, nous pourrions utiliser un fichier de correspondances pour traduire des noms de produits en identifiants produits pour obtenir des URLs plus simples à mémoriser, en utilisant la recette suivante :

**Product to ID configuration**

```apache
RewriteMap product2id "txt:/etc/apache2/productmap.txt"
RewriteRule "^/product/(.*)" "/prods.php?id=${product2id:$1|NOTFOUND}" [PT]
```

Nous supposons ici que le script `prods.php` sait quoi faire lorsqu'il reçoit un argument `id=NON-TROUVE`, dans le cas où le produit ne se trouve pas dans la table de correspondances.

Le fichier `/etc/apache2/map-produit.txt` contient ce qui suit :

**Fichier de correspondances Produit - Identifiant**

```
##
##  map-produit.txt - Fichier de correspondances Produit - Identifiant
##

TELEVISION 993
STEREO     198
CANNE-A-PECHE 043
BALLON-BASKET 418
TELEPHONE  328
```

Ainsi, lorsqu'une requête pour `http://example.com/produit/TELEVISION` arrive, la directive [[13-directives/rewriterule|RewriteRule]] s'applique, et la requête est transformée en interne en `/prods.php?id=993`.

> [!NOTE]
> **Note: fichiers .htaccess**
>
> L'exemple donné est conçu pour être utilisé dans un contexte de serveur principal ou de serveur virtuel. Si vous voulez l'utiliser dans un fichier `.htaccess`, vous devrez supprimer le slash de début dans le modèle de réécriture afin que ce dernier puisse correspondre à toute URL :
>
> ```apache
> RewriteRule "^product/(.*)" "/prods.php?id=${product2id:$1|NOTFOUND}" [PT]
> ```

> [!NOTE]
> **Recherches mises en cache**
>
> Les clés de recherche sont mises en cache par httpd jusqu'à ce que le `mtime` (date de modification) du fichier de correspondances soit modifié, ou que le serveur httpd soit redémarré, ce qui améliore les performances pour les tables de correspondances consultées par de nombreuses requêtes.

## rnd: Fichier texte à valeurs de substitution multiples choisies de manière aléatoire

Lorsque le type-map spécifié est `rnd`, la source est un chemin du système de fichiers vers un fichier de correspondances au format texte dont chaque ligne contient une clé, et une ou plusieurs valeurs séparées par le caractère `|`. Si une clé convient, une des valeurs correspondantes sera choisie de manière aléatoire.

Par exemple, vous pouvez utiliser le fichier de correspondances et les directives suivants pour implémenter une répartition de charge aléatoire entre plusieurs serveurs d'arrière-plan, par l'intermédiaire d'un mandataire inverse. Les images sont envoyées vers un des serveurs de l'ensemble 'statique', tandis que tout le reste est envoyé vers un des serveurs de l'ensemble 'dynamique'.

**Fichier de correspondances**

```
##
##  map.txt -- table de réécriture
##

statique   www1|www2|www3|www4
dynamique  www5|www6
```

**Configuration directives**

```apache
RewriteMap servers "rnd:/path/to/file/map.txt"

RewriteRule "^/(.*\.(png|gif|jpg))" "http://${servers:static}/$1" [NC,P,L]
RewriteRule "^/(.*)" "http://${servers:dynamic}/$1" [P,L]
```

Ainsi, lorsqu'une image est demandée et que la première règle convient, [[13-directives/rewritemap|RewriteMap]] recherche la chaîne `statique` dans le fichier de correspondances qui renvoie un des noms de serveurs spécifiés de manière aléatoire, ce dernier étant utilisé dans la cible de la règle [[13-directives/rewriterule|RewriteRule]].

Si vous voulez qu'un des serveurs soit plus souvent sollicité que les autres (par exemple s'il possède plus de mémoire, et peut donc traiter d'avantage de requêtes), spécifiez-le plusieurs fois dans la liste des serveurs.

```
statique   www1|www1|www2|www3|www4
```

## dbm: Fichier condensé DBM

Lorsque le type-map `dbm` est utilisé, la source est un chemin du système de fichiers vers un fichier de données DBM contenant des paires clé/valeur permettant d'effectuer la correspondance. Le fonctionnement est identique à celui du type-map `txt`, mais beaucoup plus rapide car un fichier DBM est indexé, alors qu'un fichier texte ne l'est pas. L'accès à la clé recherchée est donc plus rapide.

Vous pouvez éventuellement spécifier un type dbm particulier :

```apache
RewriteMap examplemap "dbm=sdbm:/etc/apache/mapfile.dbm"
```

Ce type peut être choisi parmi `sdbm`, `gdbm`, `ndbm` ou `db`. Il est cependant recommandé d'utiliser l'utilitaire [[10-commandes/httxt2dbm|httxt2dbm]] fourni avec le serveur HTTP Apache, car il utilise la bibliothèque DBM appropriée, à savoir celle qui a été utilisée lors de la compilation de httpd.

Pour créer un fichier dbm, créez tout d'abord un fichier de correspondances au format texte comme décrit dans la section txt. Traitez ensuite ce fichier avec `httxt2dbm` :

```
$ httxt2dbm -i fichier-map.txt -o fichier-map.map
```

Vous pouvez alors faire référence au fichier obtenu dans votre directive [[13-directives/rewritemap|RewriteMap]] :

```apache
RewriteMap mapname "dbm:/etc/apache/mapfile.map"
```

> [!NOTE]
> Notez qu'avec certains types dbm, plusieurs fichiers possédant le même nom de base sont créés. Par exemple, vous pouvez obtenir deux fichiers nommés `fichier-map.map.dir` et `fichier-map.map.pag`. Ceci est tout à fait normal, et vous ne devez utiliser que le nom de base `fichier-map.map` dans votre directive [[13-directives/rewritemap|RewriteMap]].

> [!NOTE]
> **Mise en cache des recherches**
>
> Les clés de recherche sont mises en cache par httpd jusqu'à ce que le `mtime` (date de modification) du fichier de correspondances soit modifié, ou que le serveur httpd soit redémarré, ce qui améliore les performances pour les tables de correspondances consultées par de nombreuses requêtes.

## prg: Programme de réécriture externe

Lorque le type-map `prg` est spécifié, la source est un chemin du système de fichiers vers un programme exécutable destiné à effectuer la mise en correspondance. Il peut s'agir d'un fichier binaire compilé, ou d'un programme en langage interprété comme Python ou Perl.

Ce programme est lancé une fois au démarrage du serveur HTTP Apache, puis communique avec le moteur de réécriture via `STDIN` et `STDOUT`. Pour chaque recherche d'une fonction de correspondance, la clé est écrite sur l'entrée standard du programme, suivie d'un caractère nouvelle ligne. Le programme doit lire une ligne sur son entrée standard (jusqu'au caractère nouvelle ligne) et écrire sa réponse sous la forme d'une seule ligne terminée par un caractère nouvelle ligne sur sa sortie standard. Les clés ne doivent pas contenir de caractère nouvelle ligne ; dans le cas contraire, la recherche échouera.

S'il n'y a pas de valeur de recherche correspondante, le programme de correspondance renvoie la chaîne de quatre caractères "`NULL`". Notez que cette comparaison est insensible à la casse et que "null", "Null", etc. seront aussi interprétés comme des recherches ayant échoué. En conséquence, une programme de correspondance ne peut pas renvoyer la chaîne littérale "NULL" comme valeur correspondante.

La sortie d'erreur standard du programme est héritée du processus httpd parent ; tout ce que le programme écrit sur la sortie d'erreur standard arrivera donc au même endroit que la sortie d'erreur de httpd (en général le journal indiqué par la directive [[13-directives/errorlog|ErrorLog]]).

Les programmes de réécriture externes ne sont pas lancés s'il n'ont pas été définis dans un contexte où la directive [[13-directives/rewriteengine|RewriteEngine]] est définie à `on`.

Par défaut, les programmes de réécriture externes s'exécutent sous l'utilisateur/groupe qui a démarré httpd. Pour en changer, il est possible sur les systèmes de style Unix de spécifier un autre couple utilisateur/groupe via le troisième argument de la directive [[13-directives/rewritemap|RewriteMap]], et ceci au format `utilisateur:groupe`.

Cette fonctionnalité utilise le mutex `rewrite-map` nécessaire à la fiabilité des communications avec le programme. Le mécanisme de mutex et le fichier verrou peuvent être définis via la directive [[13-directives/mutex|Mutex]].

Voici un exemple simple qui remplace tous les tirets par des caractères de soulignement dans le chemin d’URL de la requête.

**Configuration de la réécriture**

```apache
RewriteMap d2u "prg:/www/bin/dash2under.py" apache:apache
RewriteRule "-" "${d2u:%{REQUEST_URI}}"
```

**dash2under.py**

```python
#!/usr/bin/env python3
import sys

for line in sys.stdin:
    print(line.strip().replace('-', '_'), flush=True)
```

Un exemple plus complet montre un motif typique pour qu’un programme de correspondance prg: lise une ligne, recherche le résultat et l’affiche. La sortie de diagnostic est écrite sur `STDERR` et termine sa course dans le journal des erreurs de httpd.

**Configuration de la réécriture**

```apache
RewriteMap vhost2docroot "prg:/www/bin/vhost_lookup.py"
RewriteRule "^/(.*)$" "${vhost2docroot:%{HTTP_HOST}}/$1"
```

**vhost\_lookup.py**

```python
#!/usr/bin/env python3
"""Associer un nom d’hôte au répertoire racine de ses documents."""
import sys

VHOSTS = {
    "example.com": "/srv/www/example",
    "blog.example.com": "/srv/www/blog",
}

for line in sys.stdin:
    host = line.strip().lower()
    docroot = VHOSTS.get(host)
    if docroot:
        print(docroot, flush=True)
    else:
        # "NULL" indique à mod_rewrite que la recherche a échoué
        print("NULL", flush=True)
        print(f"vhost_lookup: no match for {host!r}", file=sys.stderr)
```

> [!NOTE]
> **Mises en garde !**
>
> - Votre programme doit être le plus simple possible. Si le programme se bloque, httpd va attendre indéfiniment une réponse de sa part, et par conséquent ne répondra plus aux requêtes.
> - Assurez-vous de bien désactiver la mise en tampon dans votre programme. Dans l'exemple en Python ci-avant, cette opération s'effectue en passant `flush=True` à `print()`. Si les entrées/sorties sont mises en tampon, httpd va attendre une sortie, et va par conséquent se bloquer. Il s’agit de la cause la plus courante pour laquelle le mappage prg: semble ne rien faire — le programme a la réponse mais httpd ne la verra jamais, car elle est prisonnière d’un tampon.
> - Rappelez-vous qu'il n'existe qu'une copie du programme lancé au démarrage du serveur, et que toutes les requêtes vont devoir passer par ce goulot d'étranglement. Ceci peut provoquer des ralentissements significatifs si de nombreuses requêtes doivent être traitées, ou si le script lui-même est très lent.
> - Si le programme de correspondance se termine, il ne sera pas redémarré automatiquement. Les recherches subséquentes échoueront jusqu'au prochain redémarrage du serveur.
> - Le programme de correspondance est toujours tué et redémarré à chaque redémarrage du serveur (graceful ou autre), que les directives de configuration concernées aient changé ou non. Lors d'un arrêt, le signal `SIGTERM` est envoyé au programme ; s'il ne s'arrête pas dans les 3 secondes, le signal `SIGKILL` lui est envoyé.

## dbd ou fastdbd: requête SQL

Lorsque le type-map `dbd` ou `fastdbd` est spécifié, la source est une requête SQL SELECT qui reçoit un argument et renvoie une seule valeur.

Pour que cette requête puisse être exécutée, [[12-modules/mod_dbd|mod_dbd]] doit être configuré pour attaquer la base de données concernée.

Ce type-map existe sous deux formes. Avec le type-map `dbd`, la requête est exécutée à chaque demande, tandis qu'avec le type-map `fastdbd`, les recherches dans la base de données sont mises en cache en interne. `fastdbd` est donc plus efficace et donc plus rapide ; par contre, il ne tiendra pas compte des modifications apportées à la base de données jusqu'à ce que le serveur soit redémarré.

Si une requête renvoie plusieurs enregistrements, un de ceux-ci sera sélectionné aléatoirement.

**Exemple**

```apache
RewriteMap ma-requete "fastdbd:SELECT destination FROM rewrite WHERE source = %s"
```

> [!NOTE]
> **Note**
>
> Le nom de la requête est transmis au pilote de base de données en tant que label pour une requête SQL préparée, et doit donc respecter toutes les règles imposées par votre base de données (comme la sensibilité à la casse).

## Distribution de la charge (sharding) basée sur l'URL entre plusieurs serveurs dorsaux

**Description :**

Le « sharding » est une technique courante de distribution de la charge de travail ou de l’espace de stockage. Lorsqu’on utilise cette méthode, un serveur frontal va utiliser l’URL pour distribuer les utilisateurs ou objets à des serveurs dorsaux de manière cohérente.

**Solution :**

Un mappage entre les utilisateurs et les serveurs cible est entretenu dans des fichiers de mappage. Ces derniers sont sous la forme :

```
utilisateur1  serveur_physique_de_utilisateur1
utilisateur2  serveur_physique_de_utilisateur2
# ... et ainsi de suite
```

Nous inscrivons ceci dans un fichier `mappage.utilisateur-vers-serveur`. Le but est d’associer

```
/u/utilisateur1/chemin
```

à

```
http://serveur_physique_de_utilisateur1/u/utilisateur/chemin
```

de sorte que tous les chemins d’URL n’ont pas besoin d’être valables sur chaque serveur dorsal physique. Le jeu de règles suivant fait cela pour nous avec l’aide des fichiers de mappage, en supposant que server0 est un serveur par défaut qui sera utilisé si un utilisateur n’a pas d’entrée dans le mappage :

```apache
RewriteEngine on
RewriteMap    users-to-hosts      "txt:/path/to/map.users-to-hosts"
RewriteRule   "^/u/([^/]+)/?(.*)" "http://${users-to-hosts:$1|server0}/u/$1/$2"
```

**Discussion :**

Pour distribuer les requêtes aux différents serveurs dorsaux, [[12-modules/mod_proxy_balancer|mod_proxy_balancer]] constitue une approche plus robuste et configurable, avec la prise en charge d’un bilan de santé, d’une pondération des charges et de la persistance des sessions. L’approche basée sur un mappage txt: présentée ici est plus simple mais ne prend pas en charge ces fonctionnalités.

Voir la documentation de [[13-directives/rewritemap|RewriteMap]] pour une description plus complète de la syntaxe de cette directive.

## Résumé

La directive [[13-directives/rewritemap|RewriteMap]] peut apparaître plusieurs fois. Utilisez une directive [[13-directives/rewritemap|RewriteMap]] pour chaque fonction de mise en correspondance pour déclarer son fichier de correspondances.

Bien que l'on ne puisse pas **déclarer** de fonction de mise en correspondance dans un contexte de répertoire (fichier `.htaccess` ou section [[13-directives/directory|<Directory>]]), il est possible d'utiliser cette fonction dans un tel contexte.

## Voir aussi

- [[12-modules/mod_rewrite|Documentation du module mod_rewrite]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
