---
title: "MetaSuffix"
description: "Directive Apache MetaSuffix (mod_cern_meta) — Suffixe du fichier contenant les métainformations dans le style du CERN. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cern_meta]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Suffixe du fichier contenant les métainformations dans le style du CERN |
| **Syntaxe** | `MetaSuffix suffixe` |
| **Valeur par défaut** | `MetaSuffix .meta` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Indexes |
| **Statut** | Deprecated |
| **Module** | [[12-modules/mod_cern_meta\|mod_cern_meta]] |

## Utilisation

Spécifie le suffixe du fichier contenant les métainformations. Par exemple, si on conserve les valeurs par défaut des deux directives précédentes, une requête pour `DOCUMENT_ROOT/un-rep/index.html` provoquera la recherche du métafichier `DOCUMENT_ROOT/un-rep/.web/index.html.meta`, et utilisera son contenu pour générer les informations quant aux en-têtes MIME additionnels.

**Exemple :**

```apache
MetaSuffix .meta
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
