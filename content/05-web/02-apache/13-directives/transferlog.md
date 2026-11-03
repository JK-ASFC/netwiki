---
title: "TransferLog"
description: "Directive Apache TransferLog (mod_log_config) — Spécifie l'emplacement d'un fichier journal. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_log_config]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Spécifie l'emplacement d'un fichier journal |
| **Syntaxe** | `TransferLog fichier\|pipe` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Base |
| **Module** | [[12-modules/mod_log_config\|mod_log_config]] |

## Utilisation

Cette directive possède exactement les mêmes arguments et produit les mêmes effets que la directive [[13-directives/customlog|CustomLog]], à l'exception qu'elle ne permet pas de spécifier un format de journal explicite ou la journalisation conditionnelle des requêtes. En l'occurrence, le format de journal est déterminé par la dernière définition d'une directive [[13-directives/logformat|LogFormat]] qui ne définit pas d'alias. Si aucun format particulier n'a été spécifié, c'est le Common Log Format qui sera utilisé.

**Exemple**

```apache
LogFormat "%h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-agent}i\""
TransferLog "logs/access_log"
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
