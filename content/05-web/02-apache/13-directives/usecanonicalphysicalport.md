---
title: "UseCanonicalPhysicalPort"
description: "Directive Apache UseCanonicalPhysicalPort (core) — Définit la manière dont le serveur détermine son propre port. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit la manière dont le serveur détermine son propre port |
| **Syntaxe** | `UseCanonicalPhysicalPort On\|Off` |
| **Valeur par défaut** | `UseCanonicalPhysicalPort Off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

Dans de nombreuses situations, Apache httpd doit construire une URL *auto-identifiante* -- c'est à dire une URL qui fait référence au serveur lui-même. Avec `UseCanonicalPhysicalPort On`, Apache httpd va fournir le numéro de port physique réel utilisé par la requête en tant que port potentiel, pour construire le port canonique afin que le serveur puisse alimenter la directive [[13-directives/usecanonicalname|UseCanonicalName]]. Avec `UseCanonicalPhysicalPort Off`, Apache httpd n'utilisera pas le numéro de port physique réel, mais au contraire se référera aux informations de configuration pour construire un numéro de port valide.

> [!NOTE]
> **Note**
>
> L'ordre dans lequel s'effectue la recherche quand on utilise le port physique est le suivant :
>
> **`UseCanonicalName On`**
>
> 1. Port indiqué dans [[13-directives/servername|Servername]]
> 2. Port physique
> 3. Port par défaut pour le contexte/protocole (comme 80 ou 443)
>
> **`UseCanonicalName Off | DNS`**
>
> 1. Port spécifié dans l'en-tête `Host:`
> 2. Port physique
> 3. Port spécifié par [[13-directives/servername|Servername]]
> 4. Port par défaut pour le contexte/protocole (comme 80 ou 443)
>
> Avec `UseCanonicalPhysicalPort Off`, on reprend l'ordre ci-dessus en supprimant "Port physique".

## Voir aussi

- [[13-directives/usecanonicalname|UseCanonicalName]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
