---
title: "SessionCookieRemove"
description: "Directive Apache SessionCookieRemove (mod_session_cookie) — Détermine si les cookies de session doivent être supprimés des en-têtes HTTP entrants. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_session_cookie]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Détermine si les cookies de session doivent être supprimés des en-têtes HTTP entrants |
| **Syntaxe** | `SessionCookieRemove On\|Off` |
| **Valeur par défaut** | `SessionCookieRemove Off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_session_cookie\|mod_session_cookie]] |

## Utilisation

La directive `SessionCookieRemove` permet de déterminer si les cookies contenant la session doivent être supprimés des en-têtes pendant le traitement de la requête.

Dans le cas d'un mandataire inverse où le serveur Apache sert de frontal à un serveur d'arrière-plan, révéler le contenu du cookie de session à ce dernier peut conduire à une violation de la confidentialité. À ce titre, si cette directive est définie à "on", le cookie de session sera supprimé des en-têtes HTTP entrants.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
