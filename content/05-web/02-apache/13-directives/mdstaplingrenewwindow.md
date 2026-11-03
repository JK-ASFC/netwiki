---
title: "MDStaplingRenewWindow"
description: "Directive Apache MDStaplingRenewWindow (mod_md) — Contrôle l'ancienneté des réponses OCSP au dela de laquelle ces dernières seront renouvelées. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Contrôle l'ancienneté des réponses OCSP au dela de laquelle ces dernières seront renouvelées. |
| **Syntaxe** | `MDStaplingRenewWindow duration` |
| **Valeur par défaut** | `MDStaplingRenewWindow 33%` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |
| **Compatibilité** | Disponible à partir de la version 2.4.42 du serveur HTTP Apache |

## Utilisation

Si la durée de validité d'un réponse OCSP passe en dessous de *duration*, [[12-modules/mod_md|mod_md]] va tenter de la renouveler.

La CA à l'origine du certificat fournit aussi en général le service de réponse OCSP et détermine la durée de validité de sa réponse signée à propos de la validité du certificat. Plus longtemps une réponse sera valide, plus longtemps elle pourra être mise en cache, ce qui arrange tout le monde en matière de performances. Plus courte sera la validité d'une réponse, plus vite seront envoyées des révocations de certificats aux clients. Il est donc important de prendre en compte la qualité de service.

En ajustant la durée de validité des réponses vous-même, vous pouvez contrôler une partie du processus. Si vous spécifiez une durée de vie importante (autrement dit si vous spécifiez un petit pourcentage de validité avant que l'information n'expire), vous assurer un temps de mise en cache maximal, mais une interruption du service OCSP (par exemple un arrêt pour maintenance) aura plus de chance de vous affecter. Si vous spécifiez un pourcentage de temps avant expiration plus important, les mises à jour seront plus fréquentes, ce qui va augmenter la charge de l'infrastructure de serveurs du CA et nécessiter d'avantage de coordination entre les processus enfants de votre propre serveur.

La valeur par défaut choisie est de 33%, ce qui signifie que la demande de renouvellement interviendra lorsque la durée de vie de la réponse OCSP passera en dessous de 33%. Pour une CA qui fournit des réponses OCSP avec une durée de vie de 3 jours, cela implique 2 jours de mise en cache et 1 jour pour les tentatives de renouvellement. Pour affecter votre domaine, une interruption de service devra donc avoir une durée supérieure à 1 jour.

Vous pouvez aussi définir de manière absolue la durée de vie restante, par exemple \`2d\` pour 2 jours.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
