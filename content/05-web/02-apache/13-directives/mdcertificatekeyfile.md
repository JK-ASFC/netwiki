---
title: "MDCertificateKeyFile"
description: "Directive Apache MDCertificateKeyFile (mod_md) — Définit une clé privée statique pour le certificat statique. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit une clé privée statique pour le certificat statique. |
| **Syntaxe** | `MDCertificateKeyFile path-to-file` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |

## Utilisation

Cette directive s'utilise dans une section [[13-directives/mdomainset|<MDomainSet>]] et permet de spécifier le nom du fichier contenant la clé privée pour le domaine géré. Le certificat correspondant est spécifié via la directive [[13-directives/mdcertificatefile|MDCertificateFile]].

Cette directive est équivalente à la directive [[13-directives/sslcertificatekeyfile|SSLCertificateKeyFile]] de mod\_ssl.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
