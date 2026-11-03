---
title: "Didacticiel du serveur HTTP Apache : Contenu dynamique basé sur CGI"
description: "Apache HTTP Server — Didacticiel du serveur HTTP Apache : Contenu dynamique basé sur CGI."
tags: [apache, guide]
icon: book-open
---

## Introduction

- [[12-modules/mod_alias|mod_alias]]
- [[12-modules/mod_cgi|mod_cgi]]
- [[12-modules/mod_cgid|mod_cgid]]
- [[13-directives/addhandler|AddHandler]]
- [[13-directives/options|Options]]
- [[13-directives/scriptalias|ScriptAlias]]

CGI (Common Gateway Interface) définit une méthode d'interaction entre un serveur web et des programmes générateurs de contenu externes, plus souvent appelés programmes CGI ou scripts CGI. Il s'agit d'une méthode simple pour ajouter du contenu dynamique à votre site web en utilisant votre langage de programmation préféré. Ce document est une introduction à la configuration de CGI sur votre serveur web HTTP Apache, et une initiation à l'écriture de programmes CGI.

## Configurer httpd pour autoriser CGI

La configuration de httpd doit autoriser l’exécution de CGI pour que les programmes CGI fonctionnent. Il existe plusieurs manières d’y parvenir, qui sont décrites ci-après.

La prise en charge de CGI est assurée par deux modules : [[12-modules/mod_cgid|mod_cgid]] et [[12-modules/mod_cgi|mod_cgi]]. [[12-modules/mod_cgid|mod_cgid]] utilise un démon externe dédié pour gérer les processus CGI et est requis lorsque httpd utilise un MPM threadé (tel que [[12-modules/event|event]] ou [[12-modules/worker|worker]]). [[12-modules/mod_cgi|mod_cgi]] exécute les programmes CGI directement depuis le processus du serveur et est utilisé avec les MPMs non threadés tels que [[12-modules/prefork|prefork]], ou sous Windows. Du point de vue de la configuration, ils sont interchangeables — les directives sont les mêmes. Voir les pages de référence de [[12-modules/mod_cgi|mod_cgi]] et [[12-modules/mod_cgid|mod_cgid]] pour les détails de l’implémentation.

> [!WARNING]
> Si httpd a été compilé avec le support des modules partagés (DSO), vous devez vous assurer que le module approprié est chargé ; vous devez pour cela vérifier que la directive [[13-directives/loadmodule|LoadModule]] correspondante n'a pas été commentée dans votre `httpd.conf`. Pour un MPM threadé :
>
> ```apache
> LoadModule cgid_module modules/mod_cgid.so
> ```
>
> Pour Windows, ou un MPM non threadé comme prefork :
>
> ```apache
> LoadModule cgi_module modules/mod_cgi.so
> ```

### ScriptAlias

La directive [[13-directives/scriptalias|ScriptAlias]] indique à httpd qu'un répertoire particulier est dédié aux programmes CGI. httpd considérera que tout fichier situé dans ce répertoire est un programme CGI, et tentera de l'exécuter lorsque cette ressource fera l'objet d'une requête client.

La directive [[13-directives/scriptalias|ScriptAlias]] se présente comme suit :

```apache
ScriptAlias "/cgi-bin/" "/usr/local/apache2/cgi-bin/"
```

Cet exemple est tiré de votre fichier de configuration `httpd.conf` par défaut, si vous avez installé httpd dans son répertoire par défaut. La directive [[13-directives/scriptalias|ScriptAlias]] est similaire à la directive [[13-directives/alias|Alias]], qui définit à quel répertoire particulier doit correspondre un préfixe d'URL. `Alias` et `ScriptAlias` sont généralement utilisés pour accéder à des répertoires situés en dehors du répertoire défini par la directive [[13-directives/documentroot|DocumentRoot]]. La différence entre `Alias` et `ScriptAlias` réside dans le fait que `ScriptAlias` indique en plus que tout ce qui se trouve sous le préfixe d'URL doit être considéré comme un programme CGI. Ainsi, l'exemple ci-dessus indique à httpd que toute requête pour une ressource commençant par `/cgi-bin/` doit être servie depuis le répertoire `/usr/local/apache2/cgi-bin/`, et doit être traitée en tant que programme CGI.

Par exemple, si une requête pour l'URL `http://www.example.com/cgi-bin/test.py` est effectuée, httpd tentera d'exécuter le fichier `/usr/local/apache2/cgi-bin/test.py` et en renverra la sortie. Le fichier doit exister, être exécutable, et produire une sortie sous le format attendu, sinon httpd renverra un message d'erreur.

### CGI en dehors des répertoires ScripAlias

Pour des raisons de sécurité, la localisation des programmes CGI est souvent restreinte aux répertoires définis par [[13-directives/scriptalias|ScriptAlias]]. De cette manière, les administrateurs peuvent contrôler précisément qui est autorisé à utiliser les programmes CGI. Cependant, si les précautions adéquates quant à la sécurité sont prises, il n'y a aucune raison pour que les programmes CGI ne puissent pas être exécutés depuis d'autres répertoires. Par exemple, vous pouvez autoriser les utilisateurs à enregistrer des contenus web dans leurs répertoires home à l'aide de la directive [[13-directives/userdir|UserDir]]. S'ils veulent mettre en oeuvre leurs propres programmes CGI, mais n'ont pas l'autorisation d'accès au répertoire `cgi-bin` principal, ils devront être en mesure d'exécuter ces programmes depuis un autre répertoire.

L'autorisation d'exécution des programmes CGI dans un répertoire arbitraire se fait en deux étapes. En premier lieu, le gestionnaire `cgi-script` doit être activé à l'aide d'une directive [[13-directives/addhandler|AddHandler]] ou [[13-directives/sethandler|SetHandler]]. En second lieu, `ExecCGI` doit être spécifié dans la directive [[13-directives/options|Options]].

### Utilisation d'options explicites pour permettre l'exécution des programmes CGI

Vous pouvez utiliser de manière explicite la directive [[13-directives/options|Options]] dans le fichier de configuration de votre serveur principal, pour indiquer que l'exécution des programmes CGI est permise depuis un répertoire particulier :

```apache
<Directory "/usr/local/apache2/htdocs/somedir">
Options +ExecCGI
</Directory>
```

La directive ci-dessus indique à httpd qu'il doit permettre l'exécution des fichiers CGI. Vous devez aussi indiquer au serveur quels fichiers sont des fichiers CGI. La directive [[13-directives/addhandler|AddHandler]] suivante indique au serveur qu'il doit traiter tous les fichiers possédant une extension `cgi` ou `py` en tant que programmes CGI :

```apache
AddHandler cgi-script .cgi .py
```

### Fichiers .htaccess

Le [[11-guides/02-guides-pratiques/tutoriel-du-serveur-http-apache-fichiers-htaccess|tutoriel .htaccess]] montre comment activer les programmes CGI si vous n'avez pas accès au fichier `httpd.conf`.

### Répertoires utilisateurs

Pour permettre l'exécution en tant que programme CGI de tout fichier possédant l'extension `.cgi` et situé dans un répertoire utilisateur, vous pouvez utiliser la configuration suivante :

```apache
<Directory "/home/*/public_html">
Options +ExecCGI
AddHandler cgi-script .cgi
</Directory>
```

Pour indiquer un sous-répertoire `cgi-bin` d'un répertoire utilisateur où tout fichier sera traité en tant que programme CGI, vous pouvez utiliser ceci :

```apache
<Directory "/home/*/public_html/cgi-bin">
Options ExecCGI
SetHandler cgi-script
</Directory>
```

## Ecrire un programme CGI

La programmation CGI diffère de la programmation "standard" sur deux points.

En premier lieu, toute sortie de votre programme CGI doit être précédée d'un en-tête MIME-type. Il s'agit d'un en-tête HTTP qui indique au client quel type de contenu il reçoit. La plupart du temps, il se présente comme suit :

```
Content-type: text/html
```

En second lieu, votre sortie doit être en HTML, ou tout autre format qu'un navigateur est en mesure d'afficher. La plupart du temps, il s'agira de HTML, mais occasionnellement, vous pouvez être amené à écrire un programme CGI qui renvoie une image GIF, ou un autre type de contenu non-HTML.

A part ces deux différences, un programme CGI ressemblera à tout autre programme que vous pourriez être amené à écrire.

### Votre premier programme CGI

L'exemple suivant est un exemple de programme CGI qui permet d'afficher une ligne de caractères dans votre navigateur. Ecrivez ce qui suit, enregistrez le dans un fichier nommé `premier.py`, et placez le dans votre répertoire `cgi-bin`.

```python
#!/usr/bin/env python3
print("Content-type: text/html\n")
print("Hello, World.")
```

La première ligne indique au système d’exploitation quel interpréteur utiliser. La première invocation de print affiche l’en-tête content-type suivi d’une ligne vide (le `\n` dans la chaîne et la nouvelle ligne qu’ajoute `print()`), qui matérialise la fin des en-têtes HTTP. La seconde invocation de print affiche le corps. C’est là tout ce dont un programme CGI a besoin pour produire une réponse.

Si vous ouvrez votre navigateur favori et lui indiquez l'adresse

```
http://www.example.com/cgi-bin/premier.py
```

ou toute autre URL correspondant à votre programme CGI, Vous verrez la ligne `Bonjour tout le monde . . .` s'afficher dans la fenêtre de votre navigateur. Ce n'est pas extraordinaire, mais si vous y êtes parvenu, vous avez de bonnes chances d'y parvenir pour tout autre programme plus sophistiqué.

## Mais ça ne marche toujours pas !

Quatre sorties basiques pourront apparaître dans votre navigateur lorsque vous essayez d'accéder à votre programme CGI depuis le web :

**Le flux de sortie de votre programme CGI**

Impeccable ! Cela signifie que tout fonctionne correctement. Si la sortie est correcte mais n'est pas traitée correctement par le navigateur, assurez-vous d'avoir défini `Content-Type` de manière appropriée dans votre programme CGI.

**Le code source de votre programme CGI ou un message "POST Method Not Allowed"**

Cela signifie que vous n'avez pas configuré httpd de manière à ce qu'il puisse traiter votre programme CGI. Relisez la section sur la configuration de httpd, et essayez de trouver votre erreur.

**Un message commençant par "Forbidden"**

Ce type de message est révélateur d'un problème de droits. Consultez le journal des erreurs de httpd et la section ci-dessous sur les droits des fichiers.

**Un message contenant "Internal Server Error"**

Si vous consultez le journal des erreurs de httpd, vous y trouverez probablement des messages du type "Premature end of script headers" (Fin prématurée des en-têtes de script), éventuellement accompagnés d'un message d'erreur généré par votre programme CGI. Dans ce cas, il va vous falloir lire chacune des sections ci-dessous pour déterminer ce qui empêche votre programme CGI de générer les en-têtes appropriés.

### Droits des fichiers

Souvenez-vous que le serveur ne s'exécute pas sous votre nom. En d'autres termes, lorsque le serveur a démarré, il s'exécute avec les droits d'un utilisateur non privilégié - en général `nobody`, ou `www` - et en conséquence, il aura besoin de droits supplémentaires pour pouvoir exécuter des fichiers dont vous êtes le propriétaire. En général, pour qu'un fichier ait des droits suffisants pour être exécutable par `nobody`, il suffit de lui attribuer des droits d'exécution pour tout le monde :

```bash
chmod a+x first.py
```

En outre, si votre programme doit pouvoir accéder en lecture et/ou écriture à d'autres fichiers, ces derniers devront avoir les droits appropriés.

### Chemin des exécutables (PATH) et variables d'environnement

Lorsque vous lancez un programme depuis la ligne de commande, certaines informations sont passées au shell sans que vous vous en doutiez. Par exemple, la variable `PATH` indique au shell où il doit rechercher les exécutables auxquels vous faites référence.

Lorsqu'un programme s'exécute depuis le serveur web en tant que programme CGI, sa variable `PATH` n'aura peut-être pas la même valeur. Tout programme que vous invoquez dans votre programme CGI ( comme par exemple `sendmail`) devra être spécifié par son chemin complet, de façon à ce que le shell puisse le trouver lorsqu'il tentera d'exécuter votre programme CGI.

Un exemple typique de spécification de programme est le chemin vers l'interpréteur de script (souvent `python3`) que l'on trouve à la première ligne de votre programme CGI et qui va ressembler à ceci :

```python
#!/usr/bin/env python3
```

Assurez-vous qu'il s'agit bien du chemin correct vers l'interpréteur.

> [!WARNING]
> Lors de l'édition de scripts CGI sous Windows, il se peut que des caractères de fin de ligne soient ajoutés au chemin de l'interpréteur. Assurez-vous donc que les fichiers sont bien transmis au serveur en mode ASCII. Dans le cas contraire, l'OS pourra envoyer des avertissements "Command not found" à cause des caractères de fin de ligne non reconnus car considérés comme faisant partie du nom de fichier de l'interpréteur.

### Variables d'environnement manquantes

Si votre programme CGI dépend de variables d'environnement non standards, vous devrez vous assurez que ces variables lui sont bien transmises par httpd.

Lorsque des en-têtes HTTP ne sont pas transmis à l'environnement, assurez-vous qu'ils sont bien formatés selon la [RFC 2616](https://www.rfc-editor.org/rfc/rfc2616), section 4.2 : les noms d'en-têtes doivent commencer par une lettre, elle-même suivie de lettres, chiffres ou traits d'union. Tout en-tête dont le nom viole cette règle sera ignoré.

### Erreurs inhérentes au programme

La plupart des échecs dans l'exécution d'un programme CGI proviennent du programme lui-même. Ceci est particulièrement vrai lorsque ce satané programme CGI se bloque, alors que vous avez appris à ne plus commettre les deux erreurs précédentes. La première chose à faire est de vous assurer que votre programme s'exécute depuis la ligne de commande, avant de le tester à partir du serveur web. Par exemple, essayez :

```
cd /usr/local/apache2/cgi-bin
./premier.py
```

(N'invoquez pas l'interpréteur `python3`. Le shell et httpd doivent être capable de le déterminer à partir de l'information sur le chemin située sur la première ligne du script.)

La première chose que vous devriez voir affichée par votre programme est un ensemble d'en-têtes HTTP, comprenant entre autres le `Content-Type`, et suivi d'une ligne vide. Si vous voyez quoi que ce soit d'autre, httpd renverra l'erreur `Premature end of script headers` si vous tentez d'exécuter le programme depuis le serveur. Voir Ecriture d'un programme CGI ci-dessus pour plus de détails.

### Journalisation des erreurs

Les journaux d'erreurs sont vos amis. Toute anomalie de fonctionnement est consignée dans le journal des erreurs et c'est ici que vous devez regarder en premier en cas de problème. Si l'hébergeur de votre site ne vous donne pas accès au journal des erreurs, vous avez tout intérêt à vous tourner vers quelqu'un d'autre. Apprenez à déchiffrer les journaux d'erreurs, et vous vous apercevrez que la plupart des problèmes seront rapidement identifiés . . . et résolus.

### Suexec

Le programme [[11-guides/01-generalites/support-suexec|suexec]] permet d'exécuter les programmes CGI avec des droits différents selon le serveur virtuel ou le répertoire utilisateur dans lequel ils se situent. Suexec effectue une vérification des droits très stricte, et toute anomalie détectée au cours de cette vérification entraînera un echec d'exécution de votre programme CGI avec affichage de l'erreur `Premature end of script headers`.

Pour savoir si vous pouvez utiliser suexec, tapez la commande `apachectl -V`, et regardez le chemin indiqué par `SUEXEC_BIN`. Si au démarrage d'httpd, ce dernier trouve un exécutable [[10-commandes/suexec|suexec]] dans ce chemin, suexec sera activé.

Si vous ne maîtrisez pas le fonctionnement de suexec, il vous est déconseillé de l'utiliser. Pour désactiver suexec, supprimer (ou renommez) l'exécutable [[10-commandes/suexec|suexec]] pointé par `SUEXEC_BIN` et redémarrez le serveur. Si après une lecture de [[11-guides/01-generalites/support-suexec|suexec]], vous décidez quand-même de l'utiliser, tapez la commande `suexec -V` pour voir où se situe le journal de suexec, et utilisez ce dernier pour déterminer quelles règles vous violez éventuellement.

## Que se passe-t-il en coulisse

Lorsque vos compétences en programmation CGI seront plus poussées, il s'avérera intéressant pour vous de mieux comprendre ce qui se passe en coulisse, et en particulier la manière dont le navigateur et le serveur dialoguent entre eux. En effet, bien qu'il soit tout à fait louable d'écrire un programme qui affiche "Bonjour tout le monde . . .", cela ne sert pas à grand chose.

### Variables d'environnement

Les variables d'environnement sont des valeurs qui gravitent autour de vous lorsque vous utilisez votre ordinateur. Elles sont très utiles, à l'instar de votre chemin par défaut (où votre ordinateur va rechercher le fichier physique correspondant à la commande que vous avez tapée), votre nom d'utilisateur, le type de votre terminal, etc... Pour obtenir une liste complète des variables d'environnement standards que vous utilisez tous les jours, tapez `env` dans votre interpréteur de commandes.

Au cours de la transaction CGI, le serveur et le navigateur définissent aussi des variables d'environnement, de façon à ce qu'ils puissent communiquer entre eux. Ces variables définissent entre autre le type de navigateur (Netscape, IE, Lynx), le type de serveur (httpd, IIS, WebSite), le nom du programme CGI en cours d'exécution, etc...

Ces variables sont à la disposition du programmeur CGI, et elles constituent 50% de la communication client-serveur. La liste complète des variables requises se trouve dans la [RFC 3875](https://www.rfc-editor.org/rfc/rfc3875) (Common Gateway Interface).

Ce programme CGI basique en Python permet d'afficher toutes les variables d'environnement qui sont échangées. Deux programmes similaires sont fournis avec la distribution de httpd et situés dans le répertoire `cgi-bin`. Notez que certaines variables sont obligatoires, alors que d'autres sont optionnelles, si bien que vous verrez s'afficher certaines variables qui ne font pas partie de la liste officielle. De plus, httpd vous propose de nombreuses méthodes pour [[11-guides/01-generalites/apache-httpd-et-les-variables-d-environnement|ajouter vos propres variables d'environnement]] aux variables de base fournies par défaut.

```python
#!/usr/bin/env python3
import os

print("Content-type: text/html\n")
for key, value in os.environ.items():
print(f"{key} --> {value}<br>")
```

### STDIN et STDOUT

L'entrée standard (`STDIN`) et la sortie standard (`STDOUT`) constituent d'autres voies de communication entre le client et le serveur. Dans un contexte normal, `STDIN` correspond au clavier, ou à un fichier fourni au programme à des fins de traitement, et `STDOUT` à la console ou à l'écran.

Lorsque vous transmettez un formulaire web à un programme CGI par la méthode `POST`, les données de ce formulaire sont transcrites dans un format spécial et transmises à votre programme CGI via `STDIN`. Le programme peut alors les traiter comme si elles provenaient du clavier ou d'un fichier.

Ce "format spécial" est très simple. Un nom de champ et sa valeur sont reliés entre eux par un signe "égal" (=), et chacune de ces paires nom champ/valeur est séparée de la suivante par un "et" commercial (&). Les caractères spéciaux comme les espaces, les "et" commerciaux, et les signes "égal" sont convertis en leur équivalent hexadécimal pour éviter qu'ils ne gâchent le travail. La chaîne contenant les données doit ressembler à ceci :

```
name=Rich%20Bowen&city=Lexington&state=KY&sidekick=Squirrel%20Monkey
```

Vous verrez aussi parfois une chaîne de ce type accolée à une URL. Dans ce cas, le serveur enregistre cette chaîne dans la variable d'environnement appelée `QUERY_STRING`. On a alors affaire à une requête de type `GET`. Votre formulaire HTML indique laquelle des méthodes `GET` ou `POST` est utilisée pour transmettre les données, en définissant l'attribut `METHOD` au niveau de la balise `FORM`.

Votre programme est ensuite chargé d'extraire les informations utiles de cette chaîne. Heureusement, des bibliothèques et des modules sont à votre disposition pour vous aider à traiter ces données, et à gérer les différents aspects de votre programme CGI.

## Bibliothèques et modules CGI

Pour écrire un programme CGI, il vous est conseillé d'utiliser une bibliothèque de code, ou un module, qui effectueront une grande partie du travail de base pour vous. Ceci vous permettra de diminuer le nombre d'erreurs et d'accélérer le développement.

Si vous écrivez des programmes CGI en Python, le module `cgi` de la bibliothèque standard (obsolète dans Python 3.11, supprimé dans Python 3.13) prenait en charge l’analyse de formulaire. Avec les versions actuelles de Python, utilisez le module `urllib.parse` pour analyser les chaîne de paramètres et les données de formulaire. Pour des applications plus complexes, orientez-vous vers un cadriciel WSGI léger, bien que cela aille au-delà du domaine de la CGI traditionnelle.

## Pour plus d'informations

La spécification CGI actuelle est disponible dans la [RFC 3875](https://www.rfc-editor.org/rfc/rfc3875) (Common Gateway Interface).

Lorsque vous postez une question à propos d'un problème CGI que vous rencontrez, que ce soit dans une liste de diffusion ou dans un newsgroup, faites en sorte de fournir suffisamment d'informations sur le problème rencontré, ce que vous attendiez exactement, et en quoi ce qui se produit est réellement différent de ce que vous attendiez, quel serveur vous utilisez, en quel langage votre programme CGI a été écrit, et, si possible, son code source. Ceci permettra une résolution plus aisée de votre problème.

> [!NOTE]
> Les questions à propos de problèmes CGI ne doivent **jamais** être postées dans la base de données de bogues de httpd, à moins que vous ne soyez sûr d'avoir trouvé un problème dans le code source de httpd.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
