---
title: "Proxy100Continue"
description: "Directive Apache Proxy100Continue (mod_proxy) — Transmission du message \"100-continue\" au serveur d'origine. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Transmission du message "100-continue" au serveur d'origine |
| **Syntaxe** | `Proxy100Continue Off\|On` |
| **Valeur par défaut** | `Proxy100Continue On` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy\|mod_proxy]] |
| **Compatibilité** | Disponible à partir de la version 2.4.40 du serveur HTTP Apache |

## Utilisation

Cette directive permet de contrôler le transfert par le mandataire du message "100-continue" (*Expect:*ation) vers le serveur d'origine. Si elle est définie à "On", le serveur d'origine décidera lui-même si le corps de la requête HTTP doit être lu. Si elle est définie à "Off", le mandataire générera lui-même une réponse intermédiaire *100 Continue* avant de transférer le corps de la requête.

> [!NOTE]
> **Contexte d'utilisation**
>
> Cette option n'est utilisable qu'avec les mandataires HTTP gérés par [[12-modules/mod_proxy_http|mod_proxy_http]].

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
