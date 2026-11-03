---
title: "Messages d'erreur personnalisés"
description: "Apache HTTP Server — Messages d'erreur personnalisés. Le serveur HTTP Apache fournit des messages d'erreur génériques pour les codes de statut 4xx ou 5xx ; ces messages sont cependant relativement austères, imprécis, et peuvent s'avérer intimidants pour les visiteurs du site. Si vous le souhai"
tags: [apache, guide]
icon: book-open
---

Le serveur HTTP Apache fournit des messages d'erreur génériques pour les codes de statut 4xx ou 5xx ; ces messages sont cependant relativement austères, imprécis, et peuvent s'avérer intimidants pour les visiteurs du site. Si vous le souhaitez, vous pouvez afficher des messages d'erreur plus conviviaux, dans un langage autre que l'anglais, ou même sous une forme plus en adéquation avec le style de votre site.

Il est possible de définir des messages d'erreur personnalisés pour chaque code de statut HTTP associé à une condition d'erreur - c'est à dire tout code de statut 4xx ou 5xx.

De plus, il est possible de personnaliser le message d'erreur en fonction d'un jeu de valeurs fourni, en utilisant les [[11-guides/02-guides-pratiques/tutoriel-apache-httpd-introduction-aux-inclusions-cote-serveur-server-|Inclusions Côté Serveur (SSI)]]. Un programme CGI ou un autre gestionnaire dynamique (PHP, mod\_perl, etc...) peut aussi utiliser ces variables pour gérer les conditions d'erreur.

## Configuration

Les messages d'erreur personnalisés sont configurés via la directive [[13-directives/errordocument|ErrorDocument]], qui peut être utilisée dans un contexte global, serveur virtuel ou répertoire. On peut utiliser cette directive dans les fichiers .htaccess si [[13-directives/allowoverride|AllowOverride]] est définie à FileInfo.

```apache
ErrorDocument 500 "Désolé, notre script s'est
crashé ; comme c'est dommage !"
ErrorDocument 500 /cgi-bin/crash-recover
ErrorDocument 500 http://error.example.com/server_error.html
ErrorDocument 404 /errors/not_found.html
ErrorDocument 401 /subscription/how_to_subscribe.html
```

La syntaxe de la directive `ErrorDocument` est :

```apache
ErrorDocument <code_3_chiffres> <action>
```

où action peut être traitée comme :

1. Une URL de redirection local (si l'action commence par un "/").
2. Une URL de redirection externe (si action est une URL valide).
3. Le texte à afficher (si l'action ne répond à aucune des deux conditions précédentes). Entourez le texte de guillemets (") s'il contient plusieurs mots.

Dans le cas d'une redirection vers une URL locale, des variables d'environnement supplémentaires sont définies de façon à ce que la réponse puisse être personnalisée par la suite. Elles ne sont pas envoyées aux URLs externes.

## Variables disponibles

La redirection vers une autre URL peut être utile, mais seulement s'il est possible de transmettre certaines informations qui pourront être utilisées pour expliquer ou journaliser la condition d'erreur ou le problème plus clairement.

Pour y parvenir, lorsque la redirection d'erreur est envoyée, des variables d'environnement supplémentaires sont définies à partir des en-têtes de la requête originale en préfixant le nom d'origine de l'en-tête par 'REDIRECT\_', ce qui permet de fournir au message d'erreur le contexte de la requête originelle.

Par exemple, en plus des variables d'environnement habituelles, vous pouvez recevoir ce qui suit :

```apache
REDIRECT_HTTP_ACCEPT=*/*, image/gif, image/jpeg, image/png
REDIRECT_HTTP_USER_AGENT=Mozilla/5.0 Fedora/3.5.8-1.fc12 Firefox/3.5.8
REDIRECT_PATH=.:/bin:/usr/local/bin:/sbin
REDIRECT_QUERY_STRING=
REDIRECT_REMOTE_ADDR=121.345.78.123
REDIRECT_REMOTE_HOST=client.example.com
REDIRECT_SERVER_NAME=www.example.edu
REDIRECT_SERVER_PORT=80
REDIRECT_SERVER_SOFTWARE=Apache/2.2.15
REDIRECT_URL=/cgi-bin/buggy.pl
```

Les variables d'environnement `REDIRECT_` sont créées à partir des variables d'environnement préexistantes à la redirection qui sont préfixées par la chaîne `REDIRECT_` ; par exemple, `HTTP_USER_AGENT` devient `REDIRECT_HTTP_USER_AGENT`.

`REDIRECT_URL`, `REDIRECT_STATUS`, et `REDIRECT_QUERY_STRING` sont systématiquement définies, les autres variables n'étant définies que si l'en-tête correspondant existait avant la condition d'erreur.

**Aucune** d'entre elles ne sera définie si votre directive [[13-directives/errordocument|ErrorDocument]] spécifie une redirection *externe* (toute URL commençant par un protocole du style `http:`, même si elle fait référence au même hôte que le serveur).

## Personnalisation des messages d'erreur

Si vous faites pointer votre directive `ErrorDocument` vers certains gestionnaires dynamiques comme les inclusions côté serveur, les scripts CGI ou d'autres gestionnaires, vous pouvez utiliser les variables d'environnement supplémentaires disponibles pour personnaliser le message.

Si la directive ErrorDname-basedocument spécifie une redirection locale vers un script CGI, ce dernier doit ajouter un en-tête "`Status:`" dans sa sortie afin de s'assurer du bon acheminement jusqu'au client de la condition d'erreur qui a provoqué cette redirection. Par exemple, un script Perl spécifié par une directive ErrorDocument pourrait contenir ce qui suit :

```perl
...
print  "Content-type: text/html\n";
printf "Status: %s Condition Intercepted\n", $ENV{"REDIRECT_STATUS"};
...
```

Si un script est dédié à la gestion d'une condition d'erreur spécifique, telle que `404 Not Found`, il peut utiliser le code et le texte de l'erreur spécifiques à la place.

Notez que si la réponse contient un en-tête `Location:` (afin d'initier une redirection côté client), le script *doit* émettre un en-tête approprié (comme `302 Found`). Dans le cas contraire, l'en-tête `Location:` ne produira aucun effet.

## Messages d'erreur personnalisés multilingues

Vous trouverez dans la distribution du serveur HTTP Apache un répertoire contenant des messages d'erreur personnalisés traduits en 16 langues différentes. Pour activer cette fonctionnalité, vous pouvez aussi inclure un fichier de configuration qui se trouve dans le répertoire de configuration `conf/extra`.

Dans le fichier de configuration de votre serveur, vous trouverez un groupe de lignes du style :

```apache
# Multi-language error messages
#Include conf/extra/httpd-multilang-errordoc.conf
```

Décommentez la ligne `Include` pour activer cette fonctionnalité, et présenter des messages d'erreur dont le langage sera négocié en fonction du langage préféré défini au niveau du navigateur du client.

De plus, ces documents contiennent diverses variables `REDIRECT_`, de façon à ce que l'utilisateur final dispose d'informations supplémentaires à propos de ce qui a pu se produire, et de ce qu'il est susceptible de faire maintenant.

Ces documents peuvent être personnalisés en fournissant autant d'informations utiles que vous le souhaitez aux utilisateurs à propos de votre site, et de ce qu'ils sont susceptibles d'y trouver.

Pour pouvoir utiliser cette fonctionnalité, vous devez activer [[12-modules/mod_include|mod_include]] et [[12-modules/mod_negotiation|mod_negotiation]].

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
