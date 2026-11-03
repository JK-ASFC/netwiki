---
title: "IndexStyleSheet"
description: "Directive Apache IndexStyleSheet (mod_autoindex) — Ajoute une feuille de style CSS à l'index du répertoire. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_autoindex]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Ajoute une feuille de style CSS à l'index du répertoire |
| **Syntaxe** | `IndexStyleSheet chemin-url` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Indexes |
| **Statut** | Base |
| **Module** | [[12-modules/mod_autoindex\|mod_autoindex]] |

## Utilisation

La directive `IndexStyleSheet` permet de définir le nom du fichier qui servira de feuille de style CSS pour l'index.

```apache
IndexStyleSheet "/css/style.css"
```

L'utilisation de cette directive en conjonction avec `IndexOptions HTMLTable` ajoute plusieurs classes CSS au document HTML résultant. Un identifiant CSS `indexlist` est attribué à l'ensemble de la table et les classes suivantes sont associées aux différentes parties du listing :

| Classe | Définition |
| --- | --- |
| tr.indexhead | Ligne d'en-tête du listing |
| th.indexcolicon and td.indexcolicon | Colonne de l'icône |
| th.indexcolname and td.indexcolname | Colonne du nom du fichier |
| th.indexcollastmod and td.indexcollastmod | Colonne de la date de dernière modification |
| th.indexcolsize and td.indexcolsize | Colonne de la taille du fichier |
| th.indexcoldesc and td.indexcoldesc | Colonne de la description |
| tr.breakrow | Pied de page |
| tr.odd and tr.even | Alternance des lignes paires et impaires |

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
