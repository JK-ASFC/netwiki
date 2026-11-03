---
title: "MultiviewsMatch"
description: "Directive Apache MultiviewsMatch (mod_mime) — Les types de fichiers qui seront inclus lors d'une recherche de correspondance de fichier avec les vues multiples (MultiViews). Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_mime]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Les types de fichiers qui seront inclus lors d'une recherche de correspondance de fichier avec les vues multiples (MultiViews) |
| **Syntaxe** | `MultiviewsMatch Any\|NegotiatedOnly\|Filters\|Handlers [Handlers\|Filters]` |
| **Valeur par défaut** | `MultiviewsMatch NegotiatedOnly` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Base |
| **Module** | [[12-modules/mod_mime\|mod_mime]] |

## Utilisation

La directive `MultiviewsMatch` permet trois comportements différents pour la fonctionnalité Multiviews du module [[12-modules/mod_negotiation|mod_negotiation]]. Les vues multiples permettent d'associer une requête pour un fichier, par exemple `index.html`, à toute extension négotiée s'ajoutant à la requête de base, par exemple `index.html.en`, `index.html.fr`, ou `index.html.gz`.

L'option `NegotiatedOnly` implique que toute extension s'ajoutant au nom de base doit correspondre à une extension de [[12-modules/mod_mime|mod_mime]] reconnue pour la négociation de contenu, par exemple Charset, Content-Type, Language, ou Encoding. C'est la valeur d'option par défaut, et la contrainte la plus stricte dont les effets de bord inattendus sont les moins nombreux.

Pour inclure des extensions associées avec des gestionnaires et/ou des filtres, définissez la directive `MultiviewsMatch` avec les mots-clés `Handlers`, `Filters`, ou les deux. Si tous les autres facteurs sont égaux, c'est le fichier de plus petite taille qui sera servi ; par exemple, si le choix doit s'opérer entre `index.html.cgi` de 500 octets et `index.html.pl` de 1000 octets, c'est le fichier `.cgi` qui l'emportera dans cet exemple. Les utilisateurs de fichiers `.asis` auront avantage à utiliser l'option Handler, si les fichiers `.asis` sont associés au gestionnaire `asis-handler`.

Vous pouvez enfin autoriser l'association de toute extension avec l'option `Any`, même si [[12-modules/mod_mime|mod_mime]] ne reconnaît pas l'extension. Ceci peut conduire à des résultats imprévisibles, comme l'envoi de fichiers .old ou .bak contrairement aux souhaits du webmaster.

Par exemple, la configuration suivante va permettre l'inclusion des extensions associées aux gestionnaires et aux filtres dans les vues multiples, tout en excluant les fichiers de type inconnu :

```apache
MultiviewsMatch Handlers Filters
```

L'utilisation de la directive `MultiviewsMatch` dans une section [[13-directives/location|<Location>]] ou [[13-directives/locationmatch|<LocationMatch>]] n'est pas permise.

## Voir aussi

- [[13-directives/options|Options]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
