---
title: "SuexecUserGroup"
description: "Directive Apache SuexecUserGroup (mod_suexec) — L'utilisateur et le groupe sous lesquels les programmes CGI doivent s'exécuter. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_suexec]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | L'utilisateur et le groupe sous lesquels les programmes CGI doivent s'exécuter |
| **Syntaxe** | `SuexecUserGroup Utilisateur Groupe` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_suexec\|mod_suexec]] |

## Utilisation

La directive `SuexecUserGroup` permet de spécifier l'utilisateur et le groupe sous lesquels les programmes CGI doivent s'exécuter. Les requêtes non CGI seront toujours traitées avec l'utilisateur spécifié par la directive [[13-directives/user|User]].

**Exemple**

```apache
SuexecUserGroup nobody nogroup
```

Le démarrage échouera si cette directive est spécifiée et si la fonctionnalité suEXEC est désactivée.

## Voir aussi

- [[13-directives/suexec|Suexec]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
