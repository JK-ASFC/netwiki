---
title: "VHostCGIMode"
description: "Directive Apache VHostCGIMode (mod_privileges) — Détermine si le serveur virtuel peut exécuter des sous-processus, et définit les privilèges disponibles pour ces dernier. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_privileges]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Détermine si le serveur virtuel peut exécuter des sous-processus, et définit les privilèges disponibles pour ces dernier. |
| **Syntaxe** | `VHostCGIMode On\|Off\|Secure` |
| **Valeur par défaut** | `VHostCGIMode On` |
| **Contexte** | serveur virtuel |
| **Statut** | Deprecated |
| **Module** | [[12-modules/mod_privileges\|mod_privileges]] |
| **Compatibilité** | Disponible sous Solaris 10 et OpenSolaris avec les modules MPM non-threadés ([[12-modules/prefork\|prefork]] ou MPM personnalisé). |

## Utilisation

Détermine si le serveur virtuel est autorisé à exécuter fork et exec, et définit les [privilèges](https://docs.oracle.com/cd/E19253-01/816-4863/6mb20lvfd/index.html) requis pour exécuter des sous-processus. Si cette directive est définie à *Off* le serveur virtuel ne disposera d'aucun privilège et ne pourra exécuter ni des programmes ou scripts CGI classiques via le module traditionnel [[12-modules/mod_cgi|mod_cgi]], ni des programmes externes similaires tels que ceux créés via le module [[12-modules/mod_ext_filter|mod_ext_filter]] ou les programmes de réécriture externes utilisés par la directive [[13-directives/rewritemap|RewriteMap]]. Notez que ceci n'empêche pas l'exécution de programmes CGI via d'autres processus et sous d'autres modèles de sécurité comme [mod\_fcgid](https://httpd.apache.org/mod_fcgid/), ce qui est la solution recommandée sous Solaris.

Si cette directive est définie à *On* ou *Secure*, le serveur virtuel pourra exécuter les scripts et programmes externes cités ci-dessus. Définir la directive `VHostCGIMode` à *Secure* a pour effet supplémentaire de n'accorder aucun privilège aux sous-processus, comme décrit dans la directive `VHostSecure`.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
