---
title: "CGIScriptTimeout"
description: "Directive Apache CGIScriptTimeout (mod_cgi) — Le temps d'attente maximum pour une sortie du programme CGI. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cgi]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Le temps d'attente maximum pour une sortie du programme CGI |
| **Syntaxe** | `CGIScriptTimeout time[s\|ms]` |
| **Valeur par défaut** | `La valeur par défaut de la directive Timeout lorsqu'elle n'est pas définie` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Base |
| **Module** | [[12-modules/mod_cgi\|mod_cgi]] |
| **Compatibilité** | Disponible à partir de la version 2.4.59 du serveur HTTP Apache. |

## Utilisation

Cette directive permet de limiter le temps d'attente jusqu'à une prochaine sortie du programme CGI. Si ce temps est dépassé, le traitement de la requête et l'exécution du programme CGI sont terminés.

**Exemple**

```apache
CGIScriptTimeout 20
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
