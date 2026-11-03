---
title: "MDServerStatus"
description: "Directive Apache MDServerStatus (mod_md) — Définit si les informations à propos des domaines gérés sont ajoutés ou non à server-status. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit si les informations à propos des domaines gérés sont ajoutés ou non à `server-status`. |
| **Syntaxe** | `MDServerStatus on\|off` |
| **Valeur par défaut** | `MDServerStatus off` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |
| **Compatibilité** | La valeur par défaut est « off » à partir de la version 2.4.69 du serveur HTTP Apache |

## Utilisation

Si cette directive est activée, une section est ajoutée au gestionnaire « `server-status` » de [[12-modules/mod_status|mod_status]], qui liste tous les domaines gérés avec leur nom DNS, l'état de renouvellement du certificat, la durée de vie de ce dernier, ainsi que d'autres propriétés fondamentales.

Comme avec « `md-status` », la sortie de « `server-status` » **doit** être protégée de la vue du public en instaurant des restrictions d’autorisation appropriées.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
