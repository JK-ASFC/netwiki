---
title: "MDNotifyCmd"
description: "Directive Apache MDNotifyCmd (mod_md) — Lance un programme lorsqu'un domaine géré est opérationnel. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Lance un programme lorsqu'un domaine géré est opérationnel. |
| **Syntaxe** | `MDNotifyCmd path [ args ]` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |

## Utilisation

Cette directive permet de définir un programme à lancer lorsqu'un domaine géré a obtenu ou renouvelé son certificat. Ce programme reçoit le nom de domaine géré concerné comme argument additionnel (après les paramètres spécifiés ici). Il doit renvoyer un code d'état de 0 s'il s'est exécuté avec succès.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
