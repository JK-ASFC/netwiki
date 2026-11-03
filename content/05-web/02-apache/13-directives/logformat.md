---
title: "LogFormat"
description: "Directive Apache LogFormat (mod_log_config) — Décrit un format utilisable dans un fichier journal. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_log_config]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Décrit un format utilisable dans un fichier journal |
| **Syntaxe** | `LogFormat format\|alias [alias]` |
| **Valeur par défaut** | `LogFormat "%h %l %u %t \"%r\" %>s %b"` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Base |
| **Module** | [[12-modules/mod_log_config\|mod_log_config]] |

## Utilisation

Cette directive permet de spécifier le format du fichier journal des accès.

La directive `LogFormat` se présente sous deux formes. Sous la première forme, qui ne possède qu'un seul argument, la directive définit le format qui sera utilisé dans les journaux spécifiés par les directives `TransferLog` ultérieures. L'argument unique peut contenir un *format* explicite comme décrit dans la section formats de journaux personnalisés ci-dessus. Il peut aussi contenir un *alias* faisant référence à un format de journal prédéfini par une directive `LogFormat` comme décrit plus loin.

Sous sa seconde forme, la directive `LogFormat` associe un *format* explicite à un *alias*. Cet *alias* peut ensuite s'utiliser dans les directives `LogFormat` ou [[13-directives/customlog|CustomLog]] ultérieures, ce qui évite d'avoir à répéter l'ensemble de la chaîne de format. Une directive `LogFormat` qui définit un alias **ne fait rien d'autre** -- c'est à dire qu'*elle ne fait que* définir l'alias, elle n'applique pas le format et n'en fait pas le format par défaut. Par conséquent, elle n'affecte pas les directives [[13-directives/transferlog|TransferLog]] ultérieures. En outre, la directive `LogFormat` ne peut pas utiliser un alias pour en définir un autre. Notez que l'alias ne doit pas contenir de caractère pourcent (`%`).

**Exemple**

```apache
LogFormat "%v %h %l %u %t \"%r\" %>s %b" serveur_virtuel_commun
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
