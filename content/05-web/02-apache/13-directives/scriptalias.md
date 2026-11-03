---
title: "ScriptAlias"
description: "Directive Apache ScriptAlias (mod_alias) — Fait correspondre une URL à une zone du système de fichiers et désigne la cible comme script CGI. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_alias]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Fait correspondre une URL à une zone du système de fichiers et désigne la cible comme script CGI |
| **Syntaxe** | `ScriptAlias [chemin URL] chemin fichier\|chemin répertoire` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Base |
| **Module** | [[12-modules/mod_alias\|mod_alias]] |

## Utilisation

La directive `ScriptAlias` présente le même comportement que la directive [[13-directives/alias|Alias]], mais désigne en plus le répertoire cible comme conteneur de scripts CGI qui seront traitées par le gestionnaire cgi-script du module [[12-modules/mod_cgi|mod_cgi]]. Les URLs dont le chemin URL sensible à la casse (décodé avec caractères %) commence par *chemin URL* seront mises en correspondance avec les scripts dont le chemin commence par le second argument, qui est un chemin complet dans le système de fichiers local.

```apache
ScriptAlias "/cgi-bin/" "/web/cgi-bin/"
```

Une requête pour `http://example.com/cgi-bin/foo` ferait exécuter par le serveur le script `/web/cgi-bin/foo`. Cette configuration est sensiblement équivalente à :

```apache
Alias "/cgi-bin/" "/web/cgi-bin/"
<Location "/cgi-bin">
    SetHandler cgi-script
    Options +ExecCGI
</Location>
```

Vous pouvez aussi utiliser `ScriptAlias` avec un script ou gestionnaire de votre cru. Par exemple :

```apache
ScriptAlias "/cgi-bin/" "/web/cgi-handler.pl"
```

Dans ce scénario, tous les fichiers faisant l'objet d'une requête dans `/cgi-bin/` seront traités par le fichier que vous avez spécifié, ce qui vous permet d'utiliser votre propre gestionnaire. Vous pouvez l'utiliser comme enveloppe (wrapper) pour les scripts CGI afin d'ajouter du contenu, ou autre action "maison".

> [!WARNING]
> Il est préférable d'éviter de placer les scripts CGI dans l'arborescence de [[13-directives/documentroot|DocumentRoot]] afin d'éviter de révéler accidentellement leur code source lors d'une modification de configuration. On y parvient aisément avec `ScriptAlias` en mettant en correspondance une URL et en désignant la cible comme scripts CGI par la même occasion. Si vous choisissez de placer vos scripts CGI dans un répertoire accessible depuis le web, n'utilisez pas `ScriptAlias`. Utilisez plutôt [[13-directives/directory|<Directory>]], [[13-directives/sethandler|SetHandler]], et [[13-directives/options|Options]] comme dans l'exemple suivant :
>
> ```apache
> <Directory "/usr/local/apache2/htdocs/cgi-bin">
>     SetHandler cgi-script
>     Options ExecCGI
> </Directory>
> ```
>
> Ceci est nécessaire car plusieurs *chemins URL* peuvent correspondre à la même zone du système de fichiers, court-circuitant ainsi la directive `ScriptAlias` et révélant le code source des scripts CGI s'ils ne sont pas protégés par une section [[13-directives/directory|<Directory>]].

Si la directive `ScriptAlias` est définie au sein d'une section [[13-directives/location|<Location>]] ou [[13-directives/locationmatch|<LocationMatch>]] et si l'argument *chemin URL* est omis, l'argument *URL* sera interprété en utilisant la [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|syntaxe des expressions]].
Cette syntaxe est disponible à partir de la version 2.4.19 du serveur HTTP Apache.

```apache
<Location "/cgi-bin">
    ScriptAlias "/web/cgi-bin/"
</Location>
<LocationMatch "/cgi-bin/errors/(?<NUMBER>[0-9]+)">
    ScriptAlias "/web/cgi-bin/errors/%{env:MATCH_NUMBER}.cgi"
</LocationMatch>
```

## Voir aussi

- [[11-guides/02-guides-pratiques/didacticiel-du-serveur-http-apache-contenu-dynamique-base-sur-cgi|Tutoriel CGI]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
