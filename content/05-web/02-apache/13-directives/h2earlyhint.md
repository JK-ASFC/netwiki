---
title: "H2EarlyHint"
description: "Directive Apache H2EarlyHint (mod_http2) — Ajoute un en-tête de réponse à consulter dans le code de retour 103 Early Hints. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_http2]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Ajoute un en-tête de réponse à consulter dans le code de retour 103 Early Hints |
| **Syntaxe** | `H2EarlyHint name value` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_http2\|mod_http2]] |
| **Compatibilité** | Disponible à partir de la version 2.4.58 du serveur HTTP Apache. |

## Utilisation

La directive `H2EarlyHint` permet d'ajouter un en-tête de réponse avant le démarrage du traitement proprement dit de la requête. Les en-têtes de ce style sont consultables dans les réponses intermédiaires "103 Early Hints" et ils ont pour but principal d'envoyer des informations de "préchargement" aux navigateurs clients.

*name* et *value* doivent être des champs d'en-tête HTTP valables sous peine de provoquer des échecs de réponse. La directive `H2EarlyHints` doit encore être activée pour permettre l'envoi de réponses intermédiaires de code 103. Elle peut être répétée plusieurs fois et les champs d'en-tête de même nom s'ajoutent.

**Exemple**

```apache
H2EarlyHint Link "</my.css>;rel=preload;as=style"
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
