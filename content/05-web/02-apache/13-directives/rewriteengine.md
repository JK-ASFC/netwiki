---
title: "RewriteEngine"
description: "Directive Apache RewriteEngine (mod_rewrite) — Active ou désactive l'exécution du moteur de réécriture. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_rewrite]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active ou désactive l'exécution du moteur de réécriture |
| **Syntaxe** | `RewriteEngine on\|off` |
| **Valeur par défaut** | `RewriteEngine off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_rewrite\|mod_rewrite]] |

## Utilisation

La directive `RewriteEngine` active ou désactive l'exécution du moteur de réécriture. Si sa valeur est `off`, ce module n'exécutera aucun traitement et ne mettra pas à jour les variables d'environnement `SCRIPT_URx`.

Plutôt que de commenter toutes les directives [[13-directives/rewriterule|RewriteRule]], il est préférable d'utiliser cette directive si l'on souhaite désactiver les règles de réécriture dans un contexte particulier.

Notez que les hôtes virtuels n'héritent pas des configurations de réécriture. Ceci implique que vous devez insérer une directive `RewriteEngine on` dans chaque hôte virtuel pour lequel vous souhaitez utiliser des règles de réécriture.

Les directives [[13-directives/rewritemap|RewriteMap]] du type `prg` ne sont pas prises en compte au cours de l'initialisation du serveur si elle ont été définies dans un contexte où la directive `RewriteEngine` n'a pas été définie à `on`.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
