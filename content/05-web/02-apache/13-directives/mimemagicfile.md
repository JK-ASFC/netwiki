---
title: "MimeMagicFile"
description: "Directive Apache MimeMagicFile (mod_mime_magic) — Active la détermination du type MIME en se basant sur le contenu du fichier et en utilisant le fichier magique spécifié. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_mime_magic]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active la détermination du type MIME en se basant sur le contenu du fichier et en utilisant le fichier magique spécifié |
| **Syntaxe** | `MimeMagicFile chemin-fichier` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_mime_magic\|mod_mime_magic]] |

## Utilisation

La directive `MimeMagicFile` permet d'activer ce module, le fichier par défaut fourni étant `conf/magic`. Les chemins sans slash '/' de début sont relatifs au répertoire défini par la directive [[13-directives/serverroot|ServerRoot]]. Les serveurs virtuels utilisent le même fichier que le serveur principal sauf si un fichier spécifique a été défini pour ce serveur virtuel, auquel cas c'est ce dernier fichier qui sera utilisé.

**Exemple**

```apache
MimeMagicFile conf/magic
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
