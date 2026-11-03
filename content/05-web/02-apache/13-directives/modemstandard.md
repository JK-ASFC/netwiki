---
title: "ModemStandard"
description: "Directive Apache ModemStandard (mod_dialup) — Standard de modem à simuler. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_dialup]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Standard de modem à simuler |
| **Syntaxe** | `ModemStandard V.21\|V.26bis\|V.32\|V.34\|V.92` |
| **Contexte** | répertoire |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_dialup\|mod_dialup]] |

## Utilisation

Cette directive permet de spécifier le standard de modem que vous souhaitez simuler.

```apache
<Location "/mysite">
    ModemStandard "V.26bis"
</Location>
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
