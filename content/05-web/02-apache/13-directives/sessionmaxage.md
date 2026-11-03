---
title: "SessionMaxAge"
description: "Directive Apache SessionMaxAge (mod_session) — Définit une durée de vie maximale pour la session en secondes. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_session]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit une durée de vie maximale pour la session en secondes |
| **Syntaxe** | `SessionMaxAge durée de vie maximale` |
| **Valeur par défaut** | `SessionMaxAge 0` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_session\|mod_session]] |

## Utilisation

La directive `SessionMaxAge` permet de définir la durée maximale pendant laquelle une session restera valide. Lorsqu'une session est sauvegardée, cette durée est réinitialisée et la session peut continuer d'exister. Si la durée d'une session dépasse cette limite sans qu'une requête au serveur ne vienne la rafraîchir, la session va passer hors délai et sera supprimée. Lorsqu'une session est utilisée pour stocker les informations de connexion d'un utilisateur, ceci aura pour effet de le déconnecter automatiquement après le délai spécifié.

Donner à cette directive la valeur 0 empêche l'expiration de la session.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
