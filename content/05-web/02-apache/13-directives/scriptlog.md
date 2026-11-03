---
title: "ScriptLog"
description: "Directive Apache ScriptLog (mod_cgi) — Chemin du fichier journal des erreurs du script CGI. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cgi]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Chemin du fichier journal des erreurs du script CGI |
| **Syntaxe** | `ScriptLog chemin fichier` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Base |
| **Module** | [[12-modules/mod_cgi\|mod_cgi]] |

## Utilisation

La directive `ScriptLog` permet de définir le chemin du fichier journal des erreurs du script CGI. Si cette directive n'est pas définie, aucune journalisation des erreurs n'est effectuée. Si elle est définie, toute erreur CGI sera enregistrée dans le fichier dont le nom est fourni en argument. S'il s'agit d'un chemin de fichier relatif, il est considéré par rapport au répertoire défini par la directive [[13-directives/serverroot|ServerRoot]].

**Exemple**

```apache
ScriptLog logs/cgi_log
```

Ce journal sera ouvert par l'utilisateur sous lequel les processus enfants s'exécutent, c'est à dire l'utilisateur spécifié par la directive du serveur [[13-directives/user|User]]. Ceci implique que le répertoire dans lequel se trouve le journal doit être accessible en écriture pour cet utilisateur, ou bien que le fichier est créé manuellement et accessible en écriture pour cet utilisateur. Si vous placez le journal du script dans votre répertoire principal des journaux, ne modifiez **JAMAIS** les permissions de ce dernier afin de le le rendre accessible en écriture par l'utilisateur sous lequel les processus enfants s'exécutent.

Notez que l'on ne doit activer la journalisation des scripts qu'à des fins de débogage lors de l'écriture de scripts CGI, et non de manière permanente sur un serveur en production. Elle n'est pas optimisée en terme de performances et d'efficacité, et peut présenter des problèmes de sécurité si on l'utilise dans un cadre autre que celui pour lequel elle a été conçue.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
