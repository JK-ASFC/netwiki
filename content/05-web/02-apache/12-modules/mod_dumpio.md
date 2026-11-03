---
title: "mod_dumpio"
description: "Module Apache mod_dumpio — Enregistre toutes les entrées/sorties dans le journal des erreurs de la manière souhaitée. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_dumpio]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Enregistre toutes les entrées/sorties dans le journal des erreurs de la manière souhaitée. |
| **Statut** | Extension |
| **Identificateur** | `dumpio_module` |
| **Fichier source** | `mod_dumpio.c` |

## Sommaire

`mod_dumpio` permet d'enregistrer toutes les entrées reçues par Apache et/ou toutes les sorties envoyées par ce dernier dans le fichier error.log.

L'enregistrement des données s'effectue juste après le décodage SSL (pour les entrées), et juste avant le codage SSL (pour les sorties). Comme on peut s'y attendre, tout ceci peut représenter un volume important de données, et ne doit être utilisé qu'à des fins de débogage.

## Activation du support dumpio

Pour activer le module, ce dernier doit être compilé et chargé par l'intermédiaire de la configuration de votre instance d'Apache. La journalisation peut ensuite être activée ou désactivée séparément pour les entrées et sorties à l'aide des directives ci-dessous. En outre, [[12-modules/mod_dumpio|mod_dumpio]] doit être configuré à [[13-directives/loglevel|LogLevel]] `trace7` :

```apache
LogLevel dumpio:trace7
```

## Directives

- [[13-directives/dumpioinput|DumpIOInput]]
- [[13-directives/dumpiooutput|DumpIOOutput]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
