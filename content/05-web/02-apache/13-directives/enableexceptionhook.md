---
title: "EnableExceptionHook"
description: "Directive Apache EnableExceptionHook (mpm_common) — Active un hook (\"point d'accrochage logiciel\") qui exécute des gestionnaires d'exception après un crash. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mpm_common]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active un hook ("point d'accrochage logiciel") qui exécute des gestionnaires d'exception après un crash |
| **Syntaxe** | `EnableExceptionHook On\|Off` |
| **Valeur par défaut** | `EnableExceptionHook Off` |
| **Contexte** | configuration du serveur |
| **Statut** | MPM |
| **Module** | [[12-modules/mpm_common\|mpm_common]] |

## Utilisation

Pour des raisons de sécurité, cette directive n'est disponible que si la compilation du serveur a été configurée avec l'option `--enable-exception-hook`. Elle permet d'activer un hook ("point d'accrochage logiciel") qui autorise certains modules externes à effectuer un branchement et accomplir telle ou telle action après le crash d'un processus enfant.

Deux modules, `mod_whatkilledus` et `mod_backtrace` utilisent ce hook. Veuillez vous référer à la [page EnableExceptionHook](https://emptyhammock.com/projects/httpd/diag/) de Jeff Trawick pour plus d'informations à leur sujet.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
