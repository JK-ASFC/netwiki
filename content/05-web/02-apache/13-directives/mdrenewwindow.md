---
title: "MDRenewWindow"
description: "Directive Apache MDRenewWindow (mod_md) — Définit le moment auquel un certificat doit être renouvelé. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit le moment auquel un certificat doit être renouvelé. |
| **Syntaxe** | `MDRenewWindow duration` |
| **Valeur par défaut** | `MDRenewWindow 33%` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |

## Utilisation

Lorsqu'un certificat arrive à expiration, [[12-modules/mod_md|mod_md]] va tenter d'en obtenir un nouveau signé.

Normalement, les certificats ont une validité de 90 jours, et mod\_md les renouvelle lorsqu'il leur reste 33% de durée de vie (soit 30 jours pour une durée de vie de 90 jours). Si cela ne correspond pas à ce que vous souhaitez, vous pouvez spécifier une autre valeur comme dans les exemples suivants :

**Exemple**

```apache
# 21 jours avant expiration
MDRenewWindow 21d
# 30 secondes (peut-être un peu juste !)
MDRenewWindow 30s
# lorsqu'il reste 10% de durée de vie au certificat
MDRenewWindow 10%
```

En mode pilotage automatique, le module va vérifier le statut des domaines gérés au moins toutes les 12 heures pour voir s'il y a quelque chose à faire. En cas d'erreur, par exemple lorsque le CA est inaccessible, il va dans un premier temps réessayer après quelques secondes. Si l'erreur persiste, il va réduire son intervalle de vérification de 12 à 1 heure.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
