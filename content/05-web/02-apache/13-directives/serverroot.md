---
title: "ServerRoot"
description: "Directive Apache ServerRoot (core) — Racine du répertoire d'installation du serveur. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Racine du répertoire d'installation du serveur |
| **Syntaxe** | `ServerRoot chemin de répertoire` |
| **Valeur par défaut** | `ServerRoot /usr/local/apache` |
| **Contexte** | configuration du serveur |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

La directive `ServerRoot` permet de définir le répertoire dans lequel le serveur est installé. En particulier, il contiendra les sous-répertoires `conf/` et `logs/`. Les chemins relatifs indiqués dans les autres directives (comme [[13-directives/include|Include]] ou [[13-directives/loadmodule|LoadModule]]) seront définis par rapport à ce répertoire.

```apache
ServerRoot "/home/httpd"
```

La valeur par défaut de `ServerRoot` peut être modifiée via l'argument `--prefix` de la commande [[10-commandes/configure|configure]], et de nombreuses distributions tierces du serveur proposent une valeur différente de celles listées ci-dessus.

## Voir aussi

- [[11-guides/01-generalites/demarrage-d-apache|the -d options de httpd]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
