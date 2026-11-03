---
title: "MDRenewMode"
description: "Directive Apache MDRenewMode (mod_md) — Contrôle le renouvellement des certificats. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Contrôle le renouvellement des certificats. |
| **Syntaxe** | `MDRenewMode always\|auto\|manual` |
| **Valeur par défaut** | `MDRenewMode auto` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |

## Utilisation

En mode "auto" (mode par défaut), le module va agir de la manière la plus opportune pour chaque domaine géré. Si un domaine ne possède pas de certificat, le module en demandera un à l'autorité de certification.

Si par contre vous avez défini un domaine géré qui n'est utilisé par aucun serveur virtuel, le module n'effectuera aucune demande de renouvellement. De même, pour les domaines gérés avec des fichiers de certificats statiques (voir [[13-directives/mdcertificatefile|MDCertificateFile]]), le module supposera que vous avez votre propre source et n'effectuera aucune demande de renouvellement.

Avec le mode "always", le module renouvellera les certificats des modules gérés, même s'il ne sont pas utilisés ou possèdent un fichier de certificats statique.

A l'opposé, avec le mode "manual", mod\_md n'effectuera aucune demande automatique de renouvellement pour aucun domaine géré.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
