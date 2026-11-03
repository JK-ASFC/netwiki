---
title: "httxt2dbm"
description: "Commande httxt2dbm d’Apache HTTP Server — httxt2dbm - Génère des fichiers dbm à utiliser avec RewriteMap : syntaxe, options et exemples."
tags: [apache, commande, httxt2dbm]
icon: terminal
---

*httxt2dbm - Génère des fichiers dbm à utiliser avec RewriteMap*

[[10-commandes/httxt2dbm|httxt2dbm]] permet, à partir d'une entrée au format texte, de générer des fichiers dbm à utiliser dans les directives [[13-directives/rewritemap|RewriteMap]] avec le type de table `dbm`.

Si le fichier de sortie existe déjà, il ne sera pas tronqué. Les nouvelles clés seront ajoutées et les clés préexistantes mises à jour.

## Syntaxe

`httxt2dbm [ -v ] [ -f TYPE_DBM ] -i TEXTE_SOURCE -o SORTIE_DBM`

## Options

**`-v`**

Sortie plus verbeuse

**`-f TYPE_DBM`**

Spécifie le type DBM à utiliser pour le fichier de sortie. S'il n'est pas spécifié, c'est la valeur par défaut de l'APR qui sera utilisée. Les types disponibles sont : `GDBM` pour les fichiers GDBM, `SDBM` pour les fichiers SDBM, `DB` pour les fichiers DB, `NDBM` pour les fichiers NDBM, `default` pour le type DBM par défaut

**`-i TEXTE_SOURCE`**

Le fichier d'entrée à partir duquel le fichier dbm sera créé. Le fichier doit être formaté de façon à ne contenir qu'un seul enregistrement par ligne, de la forme : `clé valeur`. Voir la documentation de la directive [[13-directives/rewritemap|RewriteMap]] pour plus de détails à propos du format de ce fichier et de sa signification.

**`-o SORTIE_DBM`**

Nom du fichier dbm de sortie.

## Exemples

```bash
httxt2dbm -i rewritemap.txt -o rewritemap.dbm
httxt2dbm -f SDBM -i rewritemap.txt -o rewritemap.dbm
```

## Voir aussi

- [[10-commandes/httpd|httpd]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
