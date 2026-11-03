---
title: "Script"
description: "Directive Apache Script (mod_actions) — Active un script CGI dans le cas d'une méthode de requête particulière. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_actions]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active un script CGI dans le cas d'une méthode de requête particulière. |
| **Syntaxe** | `Script méthode script cgi` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Base |
| **Module** | [[12-modules/mod_actions\|mod_actions]] |

## Utilisation

Cette directive ajoute une action qui va activer *script cgi* lorsqu'un fichier est demandé en utilisant la méthode *méthode*. *script cgi* est le chemin URL d'une ressource qui a été désignée comme script CGI en utilisant les directives [[13-directives/scriptalias|ScriptAlias]] ou [[13-directives/addhandler|AddHandler]]. L'URL et le chemin du document demandé sont envoyés en utilisant les variables d'environnement CGI standards `PATH_INFO` et `PATH_TRANSLATED`.

> [!NOTE]
> Tous les noms de méthode peuvent être utilisés. **Les noms de méthode sont sensibles à la casse**, si bien que `Script PUT` et `Script put` ont des effets totalement différents.

Notez que la commande `Script` ne définit que des actions par défaut. Si un script CGI est appelé, ou toute autre ressource capable de gérer la méthode de la requête en interne, il agira en conséquence. Notez aussi que `Script` avec une méthode `GET` ne sera appelé que si la requête possède des arguments (par exemple foo.html?hi). Dans le cas contraire, la requête sera traitée normalement.

```apache
# All GET requests go here
Script GET "/cgi-bin/search"

# A CGI PUT handler
Script PUT "/~bob/put.cgi"
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
