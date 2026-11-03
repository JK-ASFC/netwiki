---
title: "SessionEnv"
description: "Directive Apache SessionEnv (mod_session) — Définit si le contenu de la session doit être enregistré dans la variable d'environnement HTTP_SESSION. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_session]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit si le contenu de la session doit être enregistré dans la variable d'environnement *HTTP\_SESSION* |
| **Syntaxe** | `SessionEnv On\|Off` |
| **Valeur par défaut** | `SessionEnv Off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_session\|mod_session]] |

## Utilisation

Lorsque la directive `SessionEnv` est définie à *On*, le contenu de la session est enregistré dans une variable d'environnement CGI nommée *HTTP\_SESSION*.

La chaîne est écrite sous le même format que celui de la chaîne d'arguments d'une URL, comme dans l'exemple suivant :

```
clé1=foo&clé3=bar
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
