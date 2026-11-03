---
title: "LogMessage"
description: "Directive Apache LogMessage (mod_log_debug) — Enregistre des messages personnalisés dans le journal des erreurs. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_log_debug]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Enregistre des messages personnalisés dans le journal des erreurs |
| **Syntaxe** | `LogMessage message [hook=hook] [expr=expression]` |
| **Valeur par défaut** | `Non défini` |
| **Contexte** | répertoire |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_log_debug\|mod_log_debug]] |

## Utilisation

Cette directive permet d'enregistrer un message personnalisé dans le journal des erreurs. Ce message peut utiliser des variables et des fonctions dans la [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|syntaxe ap_expr]]. D'éventuelles références à des en-têtes HTTP dans l'expression rationnelle n'entraîneront pas l'ajout des noms d'en-tête correspondants à l'en-tête Vary. Les messages sont enregistrés au loglevel info.

Le branchement (hook) précise la phase du traitement de la requête avant laquelle le message sera enregistré. Les branchements suivants sont supportés :

| Nom |
| --- |
| `pre_translate_name` |
| `translate_name` |
| `type_checker` |
| `quick_handler` |
| `map_to_storage` |
| `check_access` |
| `check_access_ex` |
| `insert_filter` |
| `check_authn` |
| `check_authz` |
| `fixups` |
| `handler` |
| `log_transaction` |

Le branchement par défaut est `log_transaction`. La valeur spéciale `all` est également supportée ; dans ce cas, le message sera enregistré à chaque phase. Tous les branchements ne sont pas exécutés pour chaque requête.

L'expression optionnelle permet de restreindre l'enregistrement du message en fonction d'une certaine condition. La syntaxe de l'expression est décrite dans la [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|documentation ap_expr]]. D'éventuelles références à des en-têtes HTTP dans l'expression rationnelle n'entraîneront pas l'ajout des noms d'en-tête correspondants à l'en-tête Vary.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
