---
title: "DefaultIcon"
description: "Directive Apache DefaultIcon (mod_autoindex) — Icône à afficher par défaut lorsqu'aucun icône spécifique n'est précisé. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_autoindex]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Icône à afficher par défaut lorsqu'aucun icône spécifique n'est précisé |
| **Syntaxe** | `DefaultIcon chemin URL` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Indexes |
| **Statut** | Base |
| **Module** | [[12-modules/mod_autoindex\|mod_autoindex]] |

## Utilisation

La directive `DefaultIcon` permet de définir l'icône à afficher à côté d'un fichier lorsqu'aucun icône spécifique n'a été précisé, dans le cas d'un affichage `FancyIndexing`. *chemin URL* est une URL relative (échappée par des caractères '%') vers l'icône ou une URL pleinement qualifiée.

```apache
DefaultIcon /icon/unknown.png
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
