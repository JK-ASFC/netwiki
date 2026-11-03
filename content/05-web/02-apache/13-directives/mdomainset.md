---
title: "<MDomainSet>"
description: "Directive Apache <MDomainSet> (mod_md) — Conteneur de directives à appliquer à un ou plusieurs domaines gérés. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Conteneur de directives à appliquer à un ou plusieurs domaines gérés. |
| **Syntaxe** | `<MDomainSet dns-name [ other-dns-name... ]>...</MDomainSet>` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |

## Utilisation

Cette directive est équivalente à la directive [[13-directives/mdomain|MDomain]] avec la possibilité supplémentaire d'ajouter des paramètres seulement pour le domaine géré considéré. En fait, vous pouvez aussi utiliser "\<MDomain ..\>" à titre de raccourci.

Cette directive permet de configurer un domaine géré en spécifiant un autre CA, ou d'autres paramètres de renouvellement des certificats, etc...

**Exemple**

```apache
<MDomain sandbox.example.org>
    MDCertificateAuthority   https://someotherca.com/ACME
</MDomain>
```

Cette configuration est souvent utilisée pour définir des paramètres https: spécifiques à votre domaine.

**Exemple**

```apache
<MDomain example.org>
    MDRequireHttps temporary
</MDomain>
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
