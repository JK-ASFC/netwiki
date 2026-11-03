---
title: "SetEnv"
description: "Directive Apache SetEnv (mod_env) — Définit des variables d'environnement. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_env]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit des variables d'environnement |
| **Syntaxe** | `SetEnv var-env [valeur]` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Base |
| **Module** | [[12-modules/mod_env\|mod_env]] |

## Utilisation

Définit une variable d'environnement interne, cette dernière étant ensuite disponible pour les modules du serveur HTTP Apache et transmise aux scripts CGI et aux pages SSI.

**Exemple**

```apache
SetEnv SPECIAL_PATH /foo/bin
```

Si l'argument *valeur* est absent, la variable est définie à la valeur d'une chaîne vide.

> [!NOTE]
> Les variables d'environnement internes définies par cette directive le sont *après* l'exécution de la plupart des directives du traitement initial des requêtes, comme les contrôles d'accès et la mise en correspondance des URIs avec les noms de fichiers. Si la variable d'environnement est sensée intervenir au cours de cette phase initiale du traitement, par exemple pour la directive [[13-directives/rewriterule|RewriteRule]], vous devez plutôt utiliser la directive [[13-directives/setenvif|SetEnvIf]] pour définir cette variable.

## Voir aussi

- [[11-guides/01-generalites/apache-httpd-et-les-variables-d-environnement|Variables d'environnement]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
