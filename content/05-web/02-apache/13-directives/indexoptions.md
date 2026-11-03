---
title: "IndexOptions"
description: "Directive Apache IndexOptions (mod_autoindex) — Diverses options de configuration pour l'indexation d'un répertoire. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_autoindex]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Diverses options de configuration pour l'indexation d'un répertoire |
| **Syntaxe** | `IndexOptions [+\|-]option [[+\|-]option] ...` |
| **Valeur par défaut** | `Par défaut, aucune option n'est activée.` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Indexes |
| **Statut** | Base |
| **Module** | [[12-modules/mod_autoindex\|mod_autoindex]] |

## Utilisation

La directive `IndexOptions` permet de spécifier les options de configuration de l'indexation du répertoire. *option* peut prendre l'une des valeurs suivantes :

**AddAltClass**

Ajoute une déclaration de classe CSS supplémentaire à chaque enregistrement de la table du listing du répertoire dans le cas où `IndexOptions HTMLTable` est activé et où un `IndexStyleSheet` a été défini. Plutôt que d'appliquer à chaque enregistrement de la table les classes standards `even` et `odd`, c'est ici une classe `even-ALT` ou `odd-ALT` qui sera appliquée, où *ALT* sera soit le texte alternatif standard associé au style du fichier (par exemple *snd*, *txt*, *img*, etc...), soit le texte alternatif défini par une des différentes directives `AddAlt*`.

**Charset=*jeu de caractères***

Le mot-clé `Charset` vous permet de spécifier le jeu de caractères de la page générée. La valeur par défaut est *UTF-8* sous Windows et MAC OS X, et *ISO-8859-1* dans les autres cas (en fait selon que le système de fichiers sous-jacent utilise les noms de fichiers en Unicode ou non).

```apache
IndexOptions Charset=UTF-8
```

**DescriptionWidth=\[*n* | \*\]**

Le mot-clé `DescriptionWidth` vous permet de spécifier la taille en caractères de la colonne description.

**Avec `-DescriptionWidth` (ou si l'option n'est pas définie), [[12-modules/mod_autoindex|mod_autoindex]] calcule la meilleure taille.**

`DescriptionWidth=n` fixe la taille de la colonne à *n* octets.

`DescriptionWidth=*` ajuste la taille de la colonne à la plus longue chaîne de description. **Voir la section concernant [[13-directives/adddescription|AddDescription]] pour les dangers inhérants à la troncature des descriptions.**

**FancyIndexing**

Cette option active l'indexation "améliorée" des répertoires, c'est à dire avec en-têtes de colonnes sous forme d'hyper-liens auto-référants.

**FoldersFirst**

Lorsque cette option est activée, la liste des sous-répertoires apparaîtra *toujours* en premier, suivie de la liste des fichiers normaux du répertoire. Le listing comporte principalement deux parties, les fichiers et les sous-répertoires, chacun d'eux étant trié séparément et les sous-répertoires affichés en premier. Par exemple, si l'ordre de tri est décroissant par nom, et si `FoldersFirst` est activé, le sous-répertoire `Zed` sera affiché avant le sous-répertoire `Beta`, qui sera lui-même affiché avant les fichiers normaux `Gamma` et `Alpha`. **Cette option n'a d'effet que si `FancyIndexing` est aussi activé.**

**HTMLTable**

Cette option pour l'affichage `FancyIndexing` permet de construire une table simple pour l'affichage de l'index du répertoire. Cette option s'avèrera particulièrement nécessaire pour les plates-formes où utf-8 est activé et dans le cas où les noms de fichiers ou les chaînes de description alternent entre les ordres de lecture gauche à droite et droite à gauche.

**IconsAreLinks**

Configure la partie réservée aux icônes de l'ancrage pour le nom de fichier, dans le cas d'un affichage "amélioré".

**IconHeight\[=*pixels*\]**

Si cette option est présente, en combinaison avec `IconWidth`, le serveur va inclure les attributs `height` et `width` dans la balise `img` qui référence le fichier de l'icône. Ceci va permettre au navigateur de prévoir les caractéristiques de la page sans devoir attendre que toutes les images aient été chargées. En l'absence de cette option, c'est la hauteur standard définie par le logiciel Apache httpd qui est choisie comme valeur par défaut. **Cette option n'a d'effet que si `FancyIndexing` est aussi activé.**

**IconWidth\[=*pixels*\]**

Si cette option est présente, en combinaison avec `IconHeight`, le serveur va inclure les attributs `height` et `width` dans la balise `img` qui référence le fichier de l'icône. Ceci va permettre au navigateur de prévoir les caractéristiques de la page sans devoir attendre que toutes les images aient été chargées. En l'absence de cette option, c'est la largeur standard définie par le logiciel Apache httpd qui est choisie comme valeur par défaut.

**IgnoreCase**

Si cette option est activée, les noms sont triés sans tenir compte de la casse. Par exemple, si le tri s'effectue sur les noms dans l'ordre croissant, et si `IgnoreCase` est activé, le fichier Zeta apparaîtra après le fichier alfa (Note : le fichier GAMMA apparaîtra toujours avant le fichier gamma).

**IgnoreClient**

Si cette option est activée, [[12-modules/mod_autoindex|mod_autoindex]] va ignorer toutes les variables de requête fournies par le client, y compris les informations de tri (ce qui implique l'activation de l'option `SuppressColumnSorting`).

**NameWidth=\[*n* | \*\]**

Le mot-clé `NameWidth` vous permet de spécifier la largeur en octets de la colonne correspondant au nom du fichier. La valeur doit être supérieure à 5, ou `*` pour une largeur automatique. S'il n'est pas défini ou préfixé par `-`, la valeur par défaut de 20 octets est utilisée.

S'il n'est pas défini, [[12-modules/mod_autoindex|mod_autoindex]] va calculer la meilleure largeur possible, mais jusqu'à une largeur maximale de 20 octets.

`NameWidth=n` fixe la largeur de la colonne à *n* octets.

`NameWidth=*` définit la largeur de colonne à la valeur nécessaire.

**ScanHTMLTitles**

L'activation de cette option permet d'extraire le titre des documents HTML dans le cas d'un affichage "amélioré". Si le fichier ne possède aucune description définie par la directive [[13-directives/adddescription|AddDescription]], httpd va lire le document pour tenter d'en extraire le `titre`. Ce processus est coûteux en ressources disque et CPU.

**ShowForbidden**

Si cette option est activée, Apache httpd affichera les fichiers normalement cachés suite au retour des valeurs `HTTP_UNAUTHORIZED` ou `HTTP_FORBIDDEN` par la sous-requête.

**SuppressColumnSorting**

Si cette option est activée, Apache httpd supprimera les liens hyper-texte dans les en-têtes de colonnes dans le cas d'un affichage "amélioré". Par défaut, ces en-têtes constituent des liens hyper-texte, et la sélection de l'un d'entre eux va trier l'index du répertoire en fonction des valeurs de la colonne correspondante. Cependant, les arguments de la chaîne de paramètres de la requête ajoutés à l'URL seront toujours ignorés. Ce comportement est contrôlé par l'option `IndexOptions IgnoreClient`.

**SuppressDescription**

L'activation de cette option va supprimer la description des fichiers dans le cas d'un affichage "amélioré". Par défaut aucune description de fichier n'est définie, et par conséquent l'utilisation de cette option va permettre de récupérer un espace à l'écran de 23 caractères pouvant être utilisé pour autre chose. Voir la directive [[13-directives/adddescription|AddDescription]] pour plus d'informations à propos de la définition des descriptions de fichiers. Voir aussi l'option d'index `DescriptionWidth` pour limiter la taille de la colonne description. **Cette option n'a d'effet que si `FancyIndexing` est aussi activé.**

**SuppressHTMLPreamble**

Si le répertoire contient effectivement le fichier spécifié par la directive [[13-directives/headername|HeaderName]], le module inclut en général le contenu du fichier après avoir inséré un préambule HTML standard (`<html>`, `<head>`, *etc...*). L'activation de l'option `SuppressHTMLPreamble` supprime l'insertion de ce préambule, et le module va alors commencer l'affichage directement par le contenu du fichier d'en-tête. Dans ce cas par contre, le fichier d'en-tête doit contenir des instructions HTML appropriées. S'il n'y a pas de fichier d'en-tête, le préambule est généré comme dans le cas général. Si vous spécifiez aussi une directive [[13-directives/readmename|ReadmeName]], et si ce fichier existe, les balises de fermeture closing \</body\>\</html\> seront aussi omises dans la sortie, en supposant que vous ayez placé ces balises de fermeture dans ce fichier.

**SuppressIcon**

L'activation de cette option supprime l'affichage des icônes dans le cas d'un affichage "amélioré". La combinaison de `SuppressIcon` et `SuppressRules` permet de générer une sortie au format HTML 3.2 qui, selon les dernières spécifications, interdit les éléments `img` et `hr` dans les blocs `pre` (utilisés pour formater les affichages "améliorés").

**SuppressLastModified**

L'activation de cette option supprime l'affichage de la date de dernière modification dans le cas d'un affichage "amélioré". **Cette option n'a d'effet que si `FancyIndexing` est aussi activé.**

**SuppressRules**

L'activation de cette option supprime l'affichage des lignes horizontales (éléments `hr`) dans les index de répertoires. La combinaison de `SuppressIcon` et `SuppressRules` permet de générer une sortie au format HTML 3.2 qui, selon les dernières spécifications, interdit les éléments `img` et `hr` dans les blocs `pre` (utilisés pour formater les affichages "améliorés"). **Cette option n'a d'effet que si `FancyIndexing` est aussi activé.**

**SuppressSize**

L'activation de cette option supprime l'affichage de la taille du fichier dans le cas d'un affichage "amélioré". **Cette option n'a d'effet que si `FancyIndexing` est aussi activé.**

**TrackModified**

Cette option renvoie les valeurs `Last-Modified` et `ETag` pour le répertoire indexé dans l'en-tête HTTP. Elle n'est valide que si le système d'exploitation et le système de fichiers renvoient des résultats appropriés pour la fonction stat(). C'est le cas de certains systèmes Unix, ainsi que JFS sous OS/2 ou les volumes NTFS sous Win32. Ce n'est par contre pas le cas des volumes FAT Win32 et OS/2. Lorsque cette option est activée, le client ou le mandataire peuvent détecter les changements dans la liste des fichiers lorsqu'ils effectuent une requête `HEAD`. Notez que certains systèmes d'exploitation détectent correctement les nouveaux fichiers et les fichiers supprimés, mais ne détectent pas les modifications de tailles ou de dates des fichiers du répertoire. **Les modifications de taille ou de date d'un fichier existant ne mettent pas à jour l'en-tête `Last-Modified` sur toutes les plate-formes Unix.** Si c'est le cas, laissez cette option désactivée.

**Type=*type MIME***

Le mot-clé `Type` vous permet de spécifier le type MIME de la page générée. La valeur par défaut est *text/html*.

```apache
IndexOptions Type=text/plain
```

**UseOldDateFormat (*Apache HTTP Server versions 2.4.26 et ultérieures*)**

Le format de date utilisé dans le champ `Last Modified` avait été modifié par inadvertance de `"%d-%b-%Y %H:%M"` en `"%Y-%m-%d %H:%M"` dans la version 2.4.0. Cette option permet de restaurer le format de date des versions 2.2 et antérieures.

**VersionSort**

Le mot-clé `VersionSort` permet de trier les fichiers contenant des numéros de version d'une manière spécifique. Les chaînes sont triées comme d'habitude, excepté les sous-chaînes de chiffres du nom de fichier et de sa description qui sont comparées en fonction de leur valeur numérique.

**Exemple :**

```
foo-1.7
foo-1.7.2
foo-1.7.12
foo-1.8.2
foo-1.8.2a
foo-1.12
```

Si le nombre commence par le chiffre 0, il est considéré comme la partie fractionnaire d'un nombre :

```
foo-1.001
foo-1.002
foo-1.030
foo-1.04
```

**XHTML**

Le mot-clé `XHTML` enjoint [[12-modules/mod_autoindex|mod_autoindex]] de générer du code XHTML 1.0 au lieu de HTML 3.2. **Cette option n'a d'effet que si `FancyIndexing` est aussi activé.**

**None**

Le mot-clé `None` désactive toutes les options d'indexation pour le répertoire. Aucune fonctionnalité d'indexation fantaisiste ne sera activée.

> [!NOTE]
> `None` ne peut pas être préfixé par `+` ou `-`, et il ne peut être combiné avec aucun autre mot-clé de la directive `IndexOptions`. Si `None` est spécifié, il doit s'agir de la seule option présente.

**Options d'index incrémentales**

Vous devez porter une attention particulière à la manière dont les `IndexOptions` multiples sont traitées.

- Plusieurs directives `IndexOptions` apparaissant dans la même section directory sont maintenant fusionnées. Le résultat de :

  ```apache
  <Directory "/foo">
      IndexOptions HTMLTable
      IndexOptions SuppressColumnsorting
  </Directory>
  ```

  est équivalent à

  ```apache
  IndexOptions HTMLTable SuppressColumnsorting
  ```
- L'ajout de la syntaxe incrémentale (en préfixant les mots-clés avec `+` ou `-`).

Chaque fois qu'un mot-clé préfixé par '+' ou '-' est trouvé, il est appliqué aux définitions des `IndexOptions` courantes (qui ont été éventuellement héritées d'un directory de niveau supérieur). Par contre, si un mot-clé non préfixé est trouvé, il supprime toutes les definitions héritées, ainsi que toute définition incrémentale, sauf pour les options prenant une valeur (`Charset`, `Type`, `DescriptionWidth`, `NameWidth`, `IconWidth`, `IconHeight`), qui sont héritées indépendamment. Considérons l'exemple suivant :

```apache
IndexOptions +ScanHTMLTitles -IconsAreLinks FancyIndexing
IndexOptions +SuppressSize
```

L'effet global est équivalent à l'effet qu'aurait provoqué `IndexOptions FancyIndexing +SuppressSize`, car l'option non préfixée `FancyIndexing` annule les mots-clés incrémentaux situés avant elle, mais leur permet ensuite de s'incrémenter à nouveau.

Pour définir inconditionnellement les `IndexOptions` pour un répertoire particulier, tout en supprimant les définitions héritées, spécifiez les mots-clés sans préfixe `+` ou `-`

Notez que les préfixes `+` et `-` ne peuvent pas être utilisés avec les options qui prennent une valeur comme `IconWidth`, `IconHeight`, `NameWidth` ou `DescriptionWidth`.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
