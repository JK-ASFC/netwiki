---
title: "MDCertificateProtocol"
description: "Directive Apache MDCertificateProtocol (mod_md) — Le protocole à utiliser avec l'autorité de certification. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Le protocole à utiliser avec l'autorité de certification. |
| **Syntaxe** | `MDCertificateProtocol protocol` |
| **Valeur par défaut** | `MDCertificateProtocol ACME` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |

## Utilisation

Cette directive permet de spécifier le protocole à utiliser. Pour l'heure, seul le protocole `ACME` est supporté.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
