---
title: "PassEnv"
description: "Directive Apache PassEnv (mod_env) — Transmet des variables d'environnement depuis le shell. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_env]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Transmet des variables d'environnement depuis le shell |
| **Syntaxe** | `PassEnv var-env [var-env] ...` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Base |
| **Module** | [[12-modules/mod_env\|mod_env]] |

## Utilisation

Cette directive permet de spécifier quelles variables d'environnement système natives doivent être disponibles en tant que variables d'environnement internes pour les modules du serveur HTTP Apache, et propagées vers les scripts CGI et les pages SSI. Leurs valeurs sont issues de l'environnement natif de l'OS associé au shell qui a invoqué le processus [[10-commandes/httpd|httpd]].

**Exemple**

```apache
PassEnv LD_LIBRARY_PATH
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
