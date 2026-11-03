---
title: "DTracePrivileges"
description: "Directive Apache DTracePrivileges (mod_privileges) — Détermine si les privilèges requis par dtrace sont activés. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_privileges]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Détermine si les privilèges requis par dtrace sont activés. |
| **Syntaxe** | `DTracePrivileges On\|Off` |
| **Valeur par défaut** | `DTracePrivileges Off` |
| **Contexte** | configuration du serveur |
| **Statut** | Deprecated |
| **Module** | [[12-modules/mod_privileges\|mod_privileges]] |
| **Compatibilité** | \>Disponible sous Solaris 10 et OpenSolaris avec les modules MPM non-threadés ([[12-modules/prefork\|prefork]] ou MPM personnalisé). |

## Utilisation

Cette directive qui s'applique à l'ensemble du serveur permet de déterminer si Apache s'exécutera avec les [privilèges](https://docs.oracle.com/cd/E19253-01/816-4863/6mb20lvfd/index.html) requis pour exécuter [dtrace](https://docs.oracle.com/cd/E19253-01/819-5488/gbwaz/index.html). Notez que la définition *DTracePrivileges On* n'activera pas à elle-seule DTrace, mais que *DTracePrivileges Off* l'empêchera de fonctionner.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
