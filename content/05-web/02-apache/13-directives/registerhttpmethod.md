---
title: "RegisterHttpMethod"
description: "Directive Apache RegisterHttpMethod (core) — Enregistrement de méthodes HTTP non standards. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Enregistrement de méthodes HTTP non standards |
| **Syntaxe** | `RegisterHttpMethod méthode [méthode [...]]` |
| **Contexte** | configuration du serveur |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | Disponible à partir de la version 2.4.24 du serveur HTTP Apache |

## Utilisation

Cette directive permet d'enregistrer des méthodes HTTP supplémentaires. Ceci s'avérera nécessaire si l'on doit utiliser des méthodes non standards avec des directives qui acceptent des noms de méthodes en paramètres, ou pour permettre l'utilisation de méthodes particulières non standards en passant par un serveur mandataire ou au sein de scripts CGI, et ceci alors que le serveur a été configuré pour ne transmettre que des méthodes reconnues aux modules.

## Voir aussi

- [[13-directives/httpprotocoloptions|HTTPProtocolOptions]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
