---
title: "Action"
description: "Directive Apache Action (mod_actions) — Active un script CGI pour un gestionnaire ou un type de contenu particulier. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_actions]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active un script CGI pour un gestionnaire ou un type de contenu particulier |
| **Syntaxe** | `Action type d'action script cgi [virtual]` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Base |
| **Module** | [[12-modules/mod_actions\|mod_actions]] |
| **Compatibilité** | Le modificateur `virtual` et le passage de gestionnaire ont été introduits dans Apache httpd 2.1 |

## Utilisation

Cette directive ajoute une action qui va activer *script cgi* lorsque *type d'action* est déclenché par la requête. *script cgi* est un chemin URL vers une ressource qui a été désignée comme script CGI à l'aide des directives [[13-directives/scriptalias|ScriptAlias]] ou [[13-directives/addhandler|AddHandler]]. *type d'action* peut être soit un [[11-guides/01-generalites/utilisation-des-gestionnaires-d-apache-handlers|gestionnaire]], soit un type de contenu MIME. L'URL et le chemin du document correspondant sont envoyés en utilisant les variables d'environnement CGI standards PATH\_INFO et `PATH_TRANSLATED`. Le gestionnaire utilisé pour cette requête particulière est transmis à l'aide de la variable `REDIRECT_HANDLER`.

**Exemple : type MIME**

```apache
# Requests for files of a particular MIME content type:
Action image/gif /cgi-bin/images.cgi
```

Dans cet exemple, les requêtes pour des fichiers possédant le type de contenu MIME `image/gif` seront traitées par le script CGI `/cgi-bin/images.cgi`.

**Example: File extension**

```apache
# Files of a particular file extension
AddHandler my-file-type .xyz
Action my-file-type "/cgi-bin/program.cgi"
```

Dans cet exemple, les requêtes pour des fichiers possédant l'extension `.xyz` seront traitées par le script CGI `/cgi-bin/programme.cgi`.

Le modificateur optionnel `virtual` permet de désactiver la vérification de l'existence du fichier demandé. Ceci peut s'avérer utile, par exemple, si vous voulez utiliser la directive `Action` pour des localisations virtuelles.

```apache
<Location "/news">
    SetHandler news-handler
    Action news-handler "/cgi-bin/news.cgi" virtual
</Location>
```

## Voir aussi

- [[13-directives/addhandler|AddHandler]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
