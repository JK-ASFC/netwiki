---
title: "MDCertificateAgreement"
description: "Directive Apache MDCertificateAgreement (mod_md) — Acceptation des conditions d'utilisation de l'autorité de certification. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Acceptation des conditions d'utilisation de l'autorité de certification. |
| **Syntaxe** | `MDCertificateAgreement accepted` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |

## Utilisation

Lorsque vous utilisez mod\_md pour obtenir un certificat, vous devenez un client de l'autorité de certification (par exemple Let's Encrypt). Cela signifie que vous devez lire et approuver leurs conditions d'utilisation, et donc que vous avez compris ce qu'ils ont à offrir, ce qu'ils ne fournissent pas, et ce que vous devez vous-même fournir. mod\_md ne peut pas de lui-même procéder à cet agrément à votre place.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
