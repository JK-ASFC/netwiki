---
title: "SessionInclude"
description: "Directive Apache SessionInclude (mod_session) — Définit les préfixes d'URL pour lesquels une session est valide. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_session]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit les préfixes d'URL pour lesquels une session est valide |
| **Syntaxe** | `SessionInclude chemin` |
| **Valeur par défaut** | `toutes URLs` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_session\|mod_session]] |

## Utilisation

La directive `SessionInclude` permet de définir les préfixes d'URL spécifiques pour lesquels une session sera valide. Ceci peut améliorer l'efficacité d'un site web, en ciblant de manière plus précise l'espace d'URL pour lequel une session devra être maintenue. Par défaut, toutes les URLs du contexte ou du conteneur courant sont incluses dans la session.

> [!WARNING]
> **Avertissement**
>
> Cette directive a un comportement similaire à celui de l'attribut *chemin* des cookies HTTP, mais ne doit pas être confondue avec cet attribut. En effet, cette directive ne définit pas l'attribut *chemin*, qui doit être configuré séparément.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
