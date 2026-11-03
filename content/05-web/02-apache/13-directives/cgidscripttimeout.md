---
title: "CGIDScriptTimeout"
description: "Directive Apache CGIDScriptTimeout (mod_cgid) — Durée maximale d'attente de la prochaine sortie du programme CGI. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cgid]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Durée maximale d'attente de la prochaine sortie du programme CGI |
| **Syntaxe** | `CGIDScriptTimeout time[s\|ms]` |
| **Valeur par défaut** | `Si non définie ou définie à 0, valeur de la directive Timeout` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Base |
| **Module** | [[12-modules/mod_cgid\|mod_cgid]] |
| **Compatibilité** | Disponible à partir de la version 2.4.10 du serveur HTTP Apache ; dans les versions précédentes, aucune durée d'attente n'était définie |

## Utilisation

Cette directive permet de limiter la durée d'attente avant les prochaines données reçues en sortie du programme CGI. Si ce temps est dépassé, la requête et le programme CGI se terminent.

**Exemple**

```apache
CGIDScriptTimeout 20
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
