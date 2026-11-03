---
title: "DeflateFilterNote"
description: "Directive Apache DeflateFilterNote (mod_deflate) — Enregistre le taux de compression sous la forme d'une note à des fins de journalisation. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_deflate]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Enregistre le taux de compression sous la forme d'une note à des fins de journalisation |
| **Syntaxe** | `DeflateFilterNote [type] nom de la note` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_deflate\|mod_deflate]] |

## Utilisation

La directive `DeflateFilterNote` permet de spécifier qu'une note à propos du taux de compression doit être attachée à la requête. Le nom de la note est passé sous la forme d'un argument de la directive. Vous pouvez utiliser cette note à des fins statistiques en enregistrant sa valeur dans votre [[11-guides/01-generalites/fichiers-journaux|journal des accès]].

**Exemple**

```apache
DeflateFilterNote ratio

LogFormat '"%r" %b (%{ratio}n) "%{User-agent}i"' deflate
CustomLog "logs/deflate_log" deflate
```

Pour extraire des informations plus précises de vos journaux, vous pouvez utiliser l'argument *type* pour spécifier le type de données de la note enregistrée dans le journal. *type* peut prendre une des valeurs suivantes :

**`Input`**

Enregistre dans la note la taille en octets du flux en entrée du filtre.

**`Output`**

Enregistre dans la note la taille en octets du flux en sortie du filtre.

**`Ratio`**

Enregistre le taux de compression (`sortie/entrée * 100`) dans la note. Il s'agit de la valeur par défaut si l'argument *type* est omis.

Vous pouvez donc configurer votre journalisation de la manière suivante :

**Journalisation détaillée**

```apache
DeflateFilterNote Input instream
DeflateFilterNote Output outstream
DeflateFilterNote Ratio ratio

LogFormat '"%r" %{outstream}n/%{instream}n (%{ratio}n%%)' deflate
CustomLog "logs/deflate_log" deflate
```

## Voir aussi

- [[12-modules/mod_log_config|mod_log_config]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
