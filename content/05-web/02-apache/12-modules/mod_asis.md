---
title: "mod_asis"
description: "Module Apache mod_asis — Envoie des fichiers contenant leurs propres en-têtes HTTP. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_asis]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Envoie des fichiers contenant leurs propres en-têtes HTTP |
| **Statut** | Base |
| **Identificateur** | `asis_module` |
| **Fichier source** | `mod_asis.c` |

## Sommaire

Ce module fournit le gestionnaire `send-as-is` qui permet au serveur HTTP Apache d'envoyer le document sans ajouter la plupart des en-têtes HTTP habituels.

On peut l'utiliser pour envoyer tous types de données en provenance du serveur, y compris les redirections et autres réponses HTTP spéciales, sans devoir faire appel à un script CGI ou nph.

Pour des raisons historiques, ce module traitera aussi tout fichier dont le type MIME est `httpd/send-as-is`.

## Mode d'emploi

Dans le fichier de configuration, associez les fichiers asis au gestionnaire `send-as-is` comme ceci :

```apache
AddHandler send-as-is asis
```

Le contenu de tout fichier possédant l'extension `.asis` sera envoyé par Apache httpd au client pratiquement tel quel. En particulier, les en-têtes HTTP seront déduits du fichier lui-même selon les règles du module [[12-modules/mod_cgi|mod_cgi]], si bien qu'un fichier asis doit inclure des en-têtes valides, et utiliser l'en-tête CGI `Status:` pour déterminer le code de réponse HTTP. L'en-tête `Content-Length:` sera automatiquement inséré ou, s'il est déjà présent, corrigé par httpd.

Voici un exemple de fichier dont le contenu est envoyé *tel quel* pour informer un client qu'un fichier a été déplacé.

```
Status: 301 Ou se trouve cette URL maintenant
Location: http://xyz.example.com/foo/bar.html
Content-type: text/html

<html>
<head>
<title>Mauvaises excuses</title>
</head>
<body>
<h1>La merveilleuse page de Fred a été déplacée vers
<a href="http://xyz.example.com/foo/bar.html">le site de
Joe</a>.
</h1>
</body>
</html>
```

> [!NOTE]
> **Notes :**
>
> Le serveur ajoute systématiquement les en-têtes `Date:` et `Server:` aux données qu'il envoie au client, si bien qu'ils n'ont pas besoin d'être inclus dans le fichier. Le serveur n'ajoute *pas* d'en-tête `Last-Modified`, ce qu'il devrait probablement faire.

## Voir aussi

- [[12-modules/mod_headers|mod_headers]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
