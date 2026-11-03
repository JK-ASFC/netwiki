---
title: "SubstituteMaxLineLength"
description: "Directive Apache SubstituteMaxLineLength (mod_substitute) — Définit la longueur de ligne maximale. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_substitute]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit la longueur de ligne maximale |
| **Syntaxe** | `SubstituteMaxLineLength octets(b\|B\|k\|K\|m\|M\|g\|G)` |
| **Valeur par défaut** | `SubstituteMaxLineLength 1m` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_substitute\|mod_substitute]] |
| **Compatibilité** | Disponible à partir de la version 2.4.11 du serveur HTTP Apache |

## Utilisation

La taille de la ligne traitée par [[12-modules/mod_substitute|mod_substitute]] est limitée afin de restreindre l'utilisation des ressources mémoire. La directive `SubstituteMaxLineLength` permet de définir cette limite. La valeur de la limite peut être spécifiée sous la forme d'un nombre d'octets, et peut être suffixée par une des lettres `b`, `B`, `k`, `K`, `m`, `M`, `g` ou `G` pour fournir une valeur respectivement en octets, kiloOctets, mégaOctets ou gigaOctets.

**Example**

```apache
<Location "/">
    AddOutputFilterByType SUBSTITUTE text/html
    SubstituteMaxLineLength 10m
    Substitute "s/foo/bar/ni"
</Location>
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
