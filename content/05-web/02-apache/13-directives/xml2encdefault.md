---
title: "xml2EncDefault"
description: "Directive Apache xml2EncDefault (mod_xml2enc) — Définit un encodage par défaut à utiliser lorsqu'aucune information ne peut être automatiquement détectée. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_xml2enc]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit un encodage par défaut à utiliser lorsqu'aucune information ne peut être automatiquement détectée |
| **Syntaxe** | `xml2EncDefault nom` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Base |
| **Module** | [[12-modules/mod_xml2enc\|mod_xml2enc]] |

## Utilisation

Si vous traitez des données dont l'encodage est connu, mais ne contenant aucune information à propos de ce dernier, vous pouvez définir une valeur par défaut afin d'aider mod\_xml2enc à traiter correctement les données. Par exemple, pour définir la valeur par défaut Latin1 (*iso-8859-1*) specifiée dans HTTP/1.0, utilisez :

```apache
xml2EncDefault iso-8859-1
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
