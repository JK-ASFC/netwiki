---
title: "Dav"
description: "Directive Apache Dav (mod_dav) — Active les méthodes HTTP WebDAV. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_dav]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active les méthodes HTTP WebDAV |
| **Syntaxe** | `Dav On\|Off\|nom fournisseur` |
| **Valeur par défaut** | `Dav Off` |
| **Contexte** | répertoire |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_dav\|mod_dav]] |

## Utilisation

La directive `Dav` permet d'activer les méthodes HTTP WebDAV pour le conteneur condidéré :

```apache
<Location "/foo">
    Dav On
</Location>
```

La valeur `On` est en fait un alias vers le fournisseur par défaut `filesystem` implémenté par le module [[12-modules/mod_dav_fs|mod_dav_fs]]. Notez que lorsque DAV est activé pour un conteneur, on *ne peut pas* le désactiver pour ses sous-conteneurs. Pour un exemple de configuration complet, reportez-vous à la section précédente.

> [!WARNING]
> N'activez pas WebDAV tant que votre serveur n'est pas sécurisé. Si vous passez outre cette recommandation, tout le monde pourra enregistrer des fichiers sur votre système.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
