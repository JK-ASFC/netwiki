---
title: "Utilisation des gestionnaires d'Apache (handlers)"
description: "Apache HTTP Server — Utilisation des gestionnaires d'Apache (handlers). Ce document décrit l'utilisation des gestionnaires d'Apache (handlers)."
tags: [apache, guide]
icon: book-open
---

Ce document décrit l'utilisation des gestionnaires d'Apache (handlers).

## Qu'est-ce qu'un gestionnaire ?

- [[12-modules/mod_actions|mod_actions]]
- [[12-modules/mod_asis|mod_asis]]
- [[12-modules/mod_cgi|mod_cgi]]
- [[12-modules/mod_imagemap|mod_imagemap]]
- [[12-modules/mod_info|mod_info]]
- [[12-modules/mod_mime|mod_mime]]
- [[12-modules/mod_negotiation|mod_negotiation]]
- [[12-modules/mod_status|mod_status]]
- [[13-directives/action|Action]]
- [[13-directives/addhandler|AddHandler]]
- [[13-directives/removehandler|RemoveHandler]]
- [[13-directives/sethandler|SetHandler]]

Un "gestionnaire" est une représentation interne à Apache de l'action qui doit être entreprise quand un fichier est appelé. En général, les fichiers ont des gestionnaires implicites, basés sur le type du fichier. Normalement, tous les fichiers sont traités simplement par le serveur, mais certains types de fichiers sont "gérés" séparément.

Les gestionnaires peuvent aussi être configurés explicitement, soit en fonction des extensions des noms de fichier, soit en fonction du chemin du fichier, sans faire référence au type de fichier. Ceci a le double avantage d'être une solution plus élégante, et aussi d'autoriser à associer à la fois un type **et** un gestionnaire avec un fichier. (Voir aussi [[12-modules/mod_mime|Fichiers avec extensions multiples]].)

Les gestionnaires peuvent être soit partie intégrante du serveur ou inclus dans un module, soit ajoutés à l'aide de la directive [[13-directives/action|Action]]. Les gestionnaires intégrés dans la distribution standard se présentent comme suit :

- **default-handler**: envoie le fichier en utilisant le `default_handler()`, qui est le gestionnaire utilisé par défaut pour traiter les contenus statiques. (core)
- **send-as-is**: envoie les fichiers avec en-têtes HTTP tels quels. ([[12-modules/mod_asis|mod_asis]])
- **cgi-script**: traite le fichier comme un script CGI. ([[12-modules/mod_cgi|mod_cgi]])
- **imap-file**: Traite le fichier comme un ensemble de règles de descriptions d'images (imagemap). ([[12-modules/mod_imagemap|mod_imagemap]])
- **server-info**: Extrait des informations sur la configuration du serveur. ([[12-modules/mod_info|mod_info]])
- **server-status**: Rédige un rapport sur le statut du serveur. ([[12-modules/mod_status|mod_status]])
- **type-map**: Traite le fichier comme une description de type pour la négociation du contenu. ([[12-modules/mod_negotiation|mod_negotiation]])

## Exemples

### Modification d'un contenu statique à l'aide d'un script CGI

Les directives suivantes vont faire en sorte que les requêtes pour des fichiers possédant une extension `html` déclenchent l'exécution du script CGI `footer.pl`.

```apache
Action add-footer /cgi-bin/footer.pl
AddHandler add-footer .html
```

À ce moment-là, le script CGI se charge d'envoyer le document initialement demandé (référencé par la variable d'environnement `PATH_TRANSLATED`) et d'effectuer tous ajout ou modification voulus.

### Fichiers avec en-têtes HTTP

Les directives suivantes vont activer le gestionnaire `send-as-is`, qui est utilisé pour les fichiers qui possèdent leurs propres en-têtes HTTP. Tous les fichiers situés dans le répertoire `/web/htdocs/asis/` seront traités par le gestionnaire `send-as-is`, sans tenir compte de l'extension de leur nom de fichier.

```apache
<Directory "/web/htdocs/asis">
    SetHandler send-as-is
</Directory>
```

## Note du développeur

Pour implémenter la fonctionnalité des gestionnaires, l' [[11-guides/09-developpement/apache-1-3-api-notes|API Apache]] a fait l'objet d'un ajout que vous pourriez être amené à utiliser. Plus précisément, un nouvel enregistrement a été ajouté à la structure `request_rec` :

```c
char *handler
```

Si vous voulez que votre module déclenche l'utilisation d'un gestionnaire, il vous suffit de définir `r->handler` avec le nom du gestionnaire à n'importe quel moment avant l'étape `invoke_handler` de la requête. Les gestionnaires sont implémentés comme auparavant, quoique l'on utilise le nom du gestionnaire à la place d'un type de contenu. Bien que ce ne soit pas obligatoire, la convention de nommage des gestionnaires stipule l'utilisation d'un mot composé séparé par des tirets, sans slashes, afin de ne pas interférer avec l'espace de nommage des types de média.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
