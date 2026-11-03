---
title: "MDCAChallenges"
description: "Directive Apache MDCAChallenges (mod_md) — Type de négociation ACME utilisée pour prouver l'appartenance du domaine. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Type de négociation ACME utilisée pour prouver l'appartenance du domaine. |
| **Syntaxe** | `MDCAChallenges name [ name ... ]` |
| **Valeur par défaut** | `MDCAChallenges tls-alpn-01 http-01 dns-01` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |

## Utilisation

Cette directive permet de définir les types de négociation utilisés (par ordre de préférences) pour prouver l'appartenance du domaine. Les types de négociation supportés par le module sont 'tls-alpn-01', 'dns-01' et 'http-01'. Le module parcourt toute la configuration du serveur pour déterminer quelles méthodes peuvent être utilisées.

Si par exemple le serveur est en écoute sur le port 80, c'est la méthode 'http-01' qui sera disponible. Pour 'dns-01', une commande [[13-directives/mdchallengedns01|MDChallengeDns01]] définie sera requise. La méthode 'tls-alpn-01' est décrite ci-dessus dans 'https: Challenges'.

Cette sélection automatique fonctionne pour la plupart des configurations. Mais comme Apache est un serveur très puissant avec de nombreuses options de configuration, certains cas pourront poser des problèmes. Par exemple, il peut être en écoute sur plusieurs adresses IP, certaines étant accessibles en https: et d'autres non.

Si vous définissez `MDCAChallenges` directement, la sélection automatique est désactivée. A la place, le module va utiliser la liste de méthodes de négociation spécifiée pour dialoguer avec le serveur ACME (un type de négociation doit aussi être proposé par le serveur). Ces méthodes de négociation sont examinées dans l'ordre selon lequel elles sont spécifiées.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
