---
title: "SessionExpiryUpdateInterval"
description: "Directive Apache SessionExpiryUpdateInterval (mod_session) — Définit le nombre de secondes dont la durée d'expiration d'une session peut changer sans que cette session soit mise à jour. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_session]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit le nombre de secondes dont la durée d'expiration d'une session peut changer sans que cette session soit mise à jour |
| **Syntaxe** | `SessionExpiryUpdateInterval interval` |
| **Valeur par défaut** | `SessionExpiryUpdateInterval 0 (mise à jour systématique)` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_session\|mod_session]] |
| **Compatibilité** | Disponible à partir de la version 2.4.41 du serveur HTTP Apache |

## Utilisation

La directive `SessionExpiryUpdateInterval` permet d'éviter le coût de l'écriture d'une session pour chaque requête en n'effectuant cette mise à jour que lorsque la date d'expiration a changé. Ceci permet d'améliorer les performances d'un site web ou de réduire la charge d'une base de données lorsqu'on utilise [[12-modules/mod_session_dbd|mod_session_dbd]]. La session est systématiquement mise à jour si les données stockées dans la session ont été modifiées ou si la durée d'expiration a été modifiée d'une durée supérieure à l'intervalle spécifié.

Définir l'intervalle à 0 désactive cette directive, et l'expiration de la session sera alors rafraîchie pour chaque requête.

Cette directive n'a d'effet que si on l'utilise en combinaison avec la directive [[13-directives/sessionmaxage|SessionMaxAge]] qui active l'expiration des sessions. Les sessions sans date d'expiration ne sont écrites que lorsque les données qu'elles renferment ont été modifiées.

> [!WARNING]
> **Avertissement**
>
> Comme l'expiration de la session n'est pas systématiquement rafraîchie à chaque requête, une session peut arriver à expiration plus tôt d'un nombre de secondes spécifié dans le paramètre *interval*. Définir un petit intervalle est en général assez sur, mais en revenche n'a qu'un effet minime sur la prise en compte des durées d'expiration.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
