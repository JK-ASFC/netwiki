---
title: "BrotliFilterNote"
description: "Directive Apache BrotliFilterNote (mod_brotli) — Enregistre le taux de compression dans une note à des fins de journalisation. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_brotli]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Enregistre le taux de compression dans une note à des fins de journalisation |
| **Syntaxe** | `BrotliFilterNote [type] notename` |
| **Valeur par défaut** | `None` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_brotli\|mod_brotli]] |

## Utilisation

La directive `BrotliFilterNote` permet d'indiquer qu'une note à propos du taux de compression doit être attachée à la requête. L'argument *notename* permet de spécifier le nom de la note. Vous pouvez utiliser cette note à des fins de statistiques en ajoutant l'information correspondante à votre [[11-guides/01-generalites/fichiers-journaux|access log]].

**Exemple**

```apache
BrotliFilterNote ratio

LogFormat '"%r" %b (%{ratio}n) "%{User-agent}i"' brotli
CustomLog "logs/brotli_log" brotli
```

Si vous souhaitez que l'information enregistrée dans vos journaux soit plus pertinente, vous pouvez renseigner l'argument optionnel *type* afin de spécifier le type de données à enregistrer dans la note à journaliser. L'argument *type* accepte les valeurs suivantes :

**`Input`**

Enregistre dans la note le nombre d'octets contenus dans le flux d'entrée du filtre.

**`Output`**

Enregistre dans la note le nombre d'octets contenus dans le flux de sortie du filtre.

**`Ratio`**

Enregistre dans la note le taux de compression (`output/input * 100`). Il s'agit de l'option par défaut si l'argument *type* est omis.

Vous pouvez alors configurer vos journaux de la manière suivante :

**Journalisation spécifique**

```apache
BrotliFilterNote Input instream
BrotliFilterNote Output outstream
BrotliFilterNote Ratio ratio

LogFormat '"%r" %{outstream}n/%{instream}n (%{ratio}n%%)' brotli
CustomLog "logs/brotli_log" brotli
```

## Voir aussi

- [[12-modules/mod_log_config|mod_log_config]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
