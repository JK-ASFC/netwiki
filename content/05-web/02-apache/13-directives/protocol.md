---
title: "Protocol"
description: "Directive Apache Protocol (core) — Protocole pour une socket d'écoute. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Protocole pour une socket d'écoute |
| **Syntaxe** | `Protocol protocole` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | Disponible depuis la version 2.1.5 d'Apache, mais seulement depuis la version 2.3.3 sous Windows. |

## Utilisation

Cette directive permet de spécifier le protocole utilisé pour une socket d'écoute particulière. Le protocole sert à déterminer quel module doit traiter une requête, et d'appliquer les optimisations spécifiques au protocole via la directive `AcceptFilter`.

Dans la plupart des configurations, cette directive n'est pas nécessaire. Si elle n'est pas définie, le protocole par défaut pour le port 443 est `https` et `http` pour tous les autres ports. La connaissance du protocole permet de déterminer quel module doit traiter la requête, et d'appliquer les optimisations spécifiques au protocole via la directive [[13-directives/acceptfilter|AcceptFilter]].

Par exemple, si vous travaillez avec le protocole `https` sur un port non standard, spécifiez le protocole de manière explicite :

```apache
Protocol https
```

Vous pouvez aussi spécifier le protocole via la directive [[13-directives/listen|Listen]].

## Voir aussi

- [[13-directives/acceptfilter|AcceptFilter]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
