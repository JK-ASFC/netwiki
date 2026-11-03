---
title: "NameVirtualHost"
description: "Directive Apache NameVirtualHost (core) — OBSOLETE : Définit une adresse IP pour les serveurs virtuels à base de nom. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | OBSOLETE : Définit une adresse IP pour les serveurs virtuels à base de nom |
| **Syntaxe** | `NameVirtualHost adresse[:port]` |
| **Contexte** | configuration du serveur |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

Avant la version 2.3.11, il était nécessaire de définir une directive `NameVirtualHost` pour indiquer au serveur qu'une paire adresse IP/port particulière pouvait être utilisée comme serveur virtuel à base de nom. Depuis la version 2.3.11, chaque fois qu'une paire adresse IP/port est utilisée dans plusieurs serveurs virtuels, l'hébergement virtuel à base de nom est automatiquement activé pour cette adresse.

Cette directive n'a actuellement plus aucun effet.

## Voir aussi

- [[11-guides/03-serveurs-virtuels/00-documentation-sur-les-serveurs-virtuels-apache|Documentation sur les serveurs virtuels]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
