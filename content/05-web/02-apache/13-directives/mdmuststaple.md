---
title: "MDMustStaple"
description: "Directive Apache MDMustStaple (mod_md) — Définit si les nouveaux certificats doivent avoir le drapeau OCSP Must Staple activé. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit si les nouveaux certificats doivent avoir le drapeau OCSP Must Staple activé. |
| **Syntaxe** | `MDMustStaple on\|off` |
| **Valeur par défaut** | `MDMustStaple off` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |

## Utilisation

Cette directive permet de définir si les nouveaux certificats doivent avoir le drapeau OCSP Must Staple activé ou non. Si un certificat possède ce drapeau, le serveur devra envoyer une réponse avec agrafage OCSP à chaque client. Ceci ne fonctionne que si vous configurez [[12-modules/mod_ssl|mod_ssl]] pour générer cette agrafe (voir la directive [[13-directives/sslusestapling|SSLUseStapling]] et ses directives dérivées).

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
