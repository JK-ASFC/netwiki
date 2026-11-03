---
title: "mod_version"
description: "Module Apache mod_version — Configuration dépendant de la version. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_version]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Configuration dépendant de la version |
| **Statut** | Extension |
| **Identificateur** | `version_module` |
| **Fichier source** | `mod_version.c` |

## Sommaire

Ce module a été conçu pour être utilisé dans les suites de tests et les grands réseaux qui doivent prendre en compte différentes versions de httpd et différentes configurations. Il fournit un nouveau conteneur -- [[13-directives/ifversion|<IfVersion>]], qui apporte une grande souplesse dans la vérification de version en permettant une comparaison numérique et l'utilisation d'expressions rationnelles.

**Exemples**

```apache
<IfVersion 2.4.2>
    # la version actuelle de httpd est exactement 2.4.2
</IfVersion>

<IfVersion >= 2.5>
    # utilise vraiment les nouvelles fonctionnalités :-)
</IfVersion>
```

Voir ci-dessous pour d'autres exemples.

## Directives

- [[13-directives/ifversion|<IfVersion>]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
