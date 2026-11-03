---
title: "MaxKeepAliveRequests"
description: "Directive Apache MaxKeepAliveRequests (core) — Nombre de requêtes permises pour une connexion persistante. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nombre de requêtes permises pour une connexion persistante |
| **Syntaxe** | `MaxKeepAliveRequests nombre` |
| **Valeur par défaut** | `MaxKeepAliveRequests 100` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

La directive `MaxKeepAliveRequests` permet de limiter le nombre de requêtes autorisées par connexion lorsque [[13-directives/keepalive|KeepAlive]] est à "on". Si sa valeur est `0`, le nombre de requêtes autorisées est illimité. Il est recommandé de définir une valeur assez haute pour des performances du serveur maximales.

Par exemple :

```apache
MaxKeepAliveRequests 500
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
