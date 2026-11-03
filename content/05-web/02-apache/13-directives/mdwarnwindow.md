---
title: "MDWarnWindow"
description: "Directive Apache MDWarnWindow (mod_md) — Définit la fenêtre de temps pendant laquelle vous serez informé de l'expiration prochaine d'un certificat. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit la fenêtre de temps pendant laquelle vous serez informé de l'expiration prochaine d'un certificat. |
| **Syntaxe** | `MDWarnWindow duration` |
| **Valeur par défaut** | `MDWarnWindow 10%` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |

## Utilisation

Voir la directive [[13-directives/mdrenewwindow|MDRenewWindow]] pour une description de la méthode à employer pour spécifier cette durée.

Le module inspecte la durée de vie restante des certificats et invoque [[13-directives/mdmessagecmd|MDMessageCmd]] lorsqu'une de ces durées devient inférieure à la fenêtre de temps spécifiée. Si l'on conserve la valeur par défaut, cette durée correspond à 9 jours pour les certificats de Let's Encrypt.

Cette directive s'applique aussi aux domaines gérés via des fichiers de certificats statiques (voir la directive [[13-directives/mdcertificatefile|MDCertificateFile]]).

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
