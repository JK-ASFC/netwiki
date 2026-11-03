---
title: "MDMember"
description: "Directive Apache MDMember (mod_md) — Nom d'hôte additionnel pour le domaine géré. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nom d'hôte additionnel pour le domaine géré. |
| **Syntaxe** | `MDMember hostname` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |

## Utilisation

Plutôt que de lister tous les noms DNS sur la même ligne, vous pouvez utiliser la directive `MDMember` pour ajouter des noms d'hôte à un domaine géré.

**Exemple**

```apache
<MDomain example.org>
    MDMember www.example.org
    MDMember mail.example.org
</MDomain>
```

Si vous utilisez cette directive au niveau de la configuration globale, en dehors de tout serveur virtuel correspondant à un domaine géré, vous ne pouvez spécifier qu'une valeur, 'auto' ou 'manual' comme mode par défaut pour tous les autres domaines gérés. Voir la directive [[13-directives/mdomain|MDomain]] pour une description de ces valeurs.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
