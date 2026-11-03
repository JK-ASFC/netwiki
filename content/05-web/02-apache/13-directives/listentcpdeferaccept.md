---
title: "ListenTCPDeferAccept"
description: "Directive Apache ListenTCPDeferAccept (mpm_common) — Valeur de l'option de socket TCP_DEFER_ACCEPT si elle est définie. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mpm_common]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Valeur de l'option de socket TCP\_DEFER\_ACCEPT si elle est définie |
| **Syntaxe** | `ListenTCPDeferAccept integer` |
| **Valeur par défaut** | `ListenTCPDeferAccept 30` |
| **Contexte** | configuration du serveur |
| **Statut** | MPM |
| **Module** | [[12-modules/mpm_common\|mpm_common]] |
| **Compatibilité** | Disponible à partir de la version 2.5.1 du serveur HTTP Apache |

## Utilisation

La valeur spécifiée ici est définie comme valeur de l'option de socket `TCP_DEFER_ACCEPT` si cette dernière est définie sur le socket d'écoute. Cela se produit sous Linux lorsque la directive [[13-directives/acceptfilter|AcceptFilter]] est définie à toute autre valeur que `none`. Dans tous les autres cas, ce réglage est ignoré. Pour plus de détails, voir la page de manuel de [tcp(7)](http://man7.org/linux/man-pages/man7/tcp.7.html) sous Linux.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
