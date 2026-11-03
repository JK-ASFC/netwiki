---
title: "mod_env"
description: "Module Apache mod_env — Modifie l'environnement transmis aux scripts CGI et aux pages SSI. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_env]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Modifie l'environnement transmis aux scripts CGI et aux pages SSI |
| **Statut** | Base |
| **Identificateur** | `env_module` |
| **Fichier source** | `mod_env.c` |

## Sommaire

Ce module permet de contrôler les variables d'environnement internes utilisées par divers modules du serveur HTTP Apache. Ces variables sont aussi accessibles aux scripts CGI en tant que variables d'environnement système natives, et disponibles dans les pages SSI. Les variables d'environnement peuvent être transmises depuis le shell qui a lancé le processus [[10-commandes/httpd|httpd]]. Elles peuvent également être définies ou supprimées au cours du processus de configuration.

## Directives

- [[13-directives/passenv|PassEnv]]
- [[13-directives/setenv|SetEnv]]
- [[13-directives/unsetenv|UnsetEnv]]

## Voir aussi

- [[11-guides/01-generalites/apache-httpd-et-les-variables-d-environnement|Variables d'environnement]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
