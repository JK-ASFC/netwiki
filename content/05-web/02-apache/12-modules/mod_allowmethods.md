---
title: "mod_allowmethods"
description: "Module Apache mod_allowmethods — Ce module permet de restreindre aisément les méthodes HTTP pouvant être utilisées sur le serveur. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_allowmethods]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Ce module permet de restreindre aisément les méthodes HTTP pouvant être utilisées sur le serveur |
| **Statut** | Expérimental |
| **Identificateur** | `allowmethods_module` |
| **Fichier source** | `mod_allowmethods.c` |
| **Compatibilité** | Disponible à partir de la version 2.3 du serveur HTTP Apache |

## Sommaire

Ce module permet de restreindre aisément les méthodes HTTP pouvant être utilisées sur le serveur. La configuration la plus courante est du style :

```apache
<Location "/">
   AllowMethods GET POST OPTIONS
</Location>
```

## Directives

- [[13-directives/allowmethods|AllowMethods]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
