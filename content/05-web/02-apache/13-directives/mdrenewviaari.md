---
title: "MDRenewViaARI"
description: "Directive Apache MDRenewViaARI (mod_md) — Utilisation de l'extension ACME ARI (rfc9773). Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Utilisation de l'extension ACME ARI (rfc9773). |
| **Syntaxe** | `MDRenewViaARI on\|off` |
| **Valeur par défaut** | `MDRenewViaARI on` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |

## Utilisation

Cette directive permet d'activer ou de désactiver le déclenchement du renouvellement des certificats à l'aide de l'extension ACME ARI (rfc9773). Ces renouvellements s'ajoutent à ceux déclenchés par le mécanisme contrôlé à l'aide de la directive [[13-directives/mdrenewwindow|MDRenewWindow]].

ACME ARI permet en quelque sorte à une CA ACME de façonner le trafic entrant des renouvellements. Plus important cependant, cette extension peut informer les clients de l'urgence d'un renouvellement, par exemple lorsqu'un certificat ou une partie de sa chaîne de certification a été révoqué(e).

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
