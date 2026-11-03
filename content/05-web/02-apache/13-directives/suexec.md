---
title: "Suexec"
description: "Directive Apache Suexec (mod_unixd) — Active ou désactive la fonctionnalité suEXEC. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_unixd]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active ou désactive la fonctionnalité suEXEC |
| **Syntaxe** | `Suexec On\|Off` |
| **Valeur par défaut** | `On si le binaire suexec existe avec les mode et propriétaire appropriés, Off dans le cas contraire` |
| **Contexte** | configuration du serveur |
| **Statut** | Base |
| **Module** | [[12-modules/mod_unixd\|mod_unixd]] |

## Utilisation

Lorsque cette directive est définie à On, le démarrage échouera si le binaire suexec n'existe pas, ou possède un propriétaire ou mode fichier invalide.

Lorsque cette directive est définie à Off, suEXEC sera désactivé, même si le binaire suexec existe et possède un propriétaire et mode fichier valides.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
