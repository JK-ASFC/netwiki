---
title: "ProxyErrorOverride"
description: "Directive Apache ProxyErrorOverride (mod_proxy) — Outrepasser les pages d'erreur pour les contenus mandatés. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Outrepasser les pages d'erreur pour les contenus mandatés |
| **Syntaxe** | `ProxyErrorOverride Off\|On [code ...]` |
| **Valeur par défaut** | `ProxyErrorOverride Off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy\|mod_proxy]] |
| **Compatibilité** | La liste de codes d'états a été ajoutée à partir de la version 2.4.47 du serveur HTTP Apache. |

## Utilisation

Cette directive est utile pour les configurations de mandataires inverses, lorsque vous souhaitez que les pages d'erreur envoyées aux utilisateurs finaux présentent un aspect homogène. Elle permet aussi l'inclusion de fichiers (via les SSI de [[12-modules/mod_include|mod_include]]) pour obtenir le code d'erreur et agir en conséquence (le comportement par défaut afficherait la page d'erreur du serveur mandaté, alors que c'est le message d'erreur SSI qui sera affiché si cette directive est à "on").

Cette directive n'affecte pas le traitement des réponses informatives (1xx), de type succès normal (2xx), ou de redirection (3xx).

Par défaut, `ProxyErrorOverride` affecte toutes les réponses avec un code compris entre 400 inclus et 600 exclus.

**Exemple de configuration par défaut**

```apache
ProxyErrorOverride  On
```

Pour n'affecter que les réponses possèdant certains codes d'état particuliers, vous pouvez spécifier ces derniers sous la forme d'une liste en les séparant par des espaces. Les réponses dont le code d'état ne fait pas partie de la liste ne seront pas affectées. Vous ne pouvez spécifier que des codes d'erreurs, donc compris entre 400 inclus et 600 exclus.

**Exemple de configuration personnalisée**

```apache
ProxyErrorOverride  On 403 405 500 501 502 503 504
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
