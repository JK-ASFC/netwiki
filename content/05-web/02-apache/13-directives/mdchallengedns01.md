---
title: "MDChallengeDns01"
description: "Directive Apache MDChallengeDns01 (mod_md) — Définit la commande d'activation/désactivation des vérifications dns-01. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit la commande d'activation/désactivation des vérifications dns-01 |
| **Syntaxe** | `MDChallengeDns01 path-to-command` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |

## Utilisation

Cette directive permet de définir le programme à appeler lorsque la vérification "dns-01" doit être activée/désactivée. Le programme prend respectivement comme arguments "setup" ou "teardown" suivi du nom de domaine. Pour "setup", le programme prend comme argument supplémentaire les données de vérification "dns-01". Lorsque [[13-directives/mdchallengedns01version|MDChallengeDns01Version]] est définie à 2, \`teardown\` prend aussi comme argument le contenu de la vérification.

Tant que la méthode de vérification "http:" ou "https:" est valable, vous n'avez pas besoin de définir cette directive. Cependant, Let's Encrypt n'accepte que "dns-01" comme méthode de vérification valide pour les certificats génériques. Si vous avez besoin d'un tel certificat, vous devez alors définir cette directive.

Il est maintenant possible d'utiliser cette directive dans une section [[13-directives/mdomain|MDomain]] pour spécifier une commande spécifique au domaine considéré. Cela permet de configurer un script spécifique au fournisseur de DNS concerné.

Reportez vous à la section sur les certificats génériques pour plus de détails.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
