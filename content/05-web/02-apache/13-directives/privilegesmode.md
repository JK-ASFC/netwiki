---
title: "PrivilegesMode"
description: "Directive Apache PrivilegesMode (mod_privileges) — Fait un compromis entre d'une part l'efficacité et la vitesse de traitement et d'autre part la sécurité à l'encontre des codes malicieux supportant les privilèges. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_privileges]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Fait un compromis entre d'une part l'efficacité et la vitesse de traitement et d'autre part la sécurité à l'encontre des codes malicieux supportant les privilèges. |
| **Syntaxe** | `PrivilegesMode FAST\|SECURE\|SELECTIVE` |
| **Valeur par défaut** | `PrivilegesMode FAST` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Deprecated |
| **Module** | [[12-modules/mod_privileges\|mod_privileges]] |
| **Compatibilité** | Disponible sous Solaris 10 et OpenSolaris avec des modules MPMs non threadés (comme [[12-modules/prefork\|prefork]] ou un module personnalisé). |

## Utilisation

Cette directive permet de faire un compromis entre les performances et la sécurité à l'encontre des codes malicieux supportant les privilèges. En mode *SECURE*, chaque requête est traitée dans un sous-processus sécurisé, ce qui induit une dégradation sensible des performances. En mode *FAST*, le serveur n'est pas protégé contre l'augmentation de privilège comme décrit plus haut.

Cette directive est sensiblement différente selon qu'elle se trouve dans une section `<Directory>` (ou Location/Files/If) ou au niveau global ou dans un `<VirtualHost>`.

Au niveau global, elle définit un comportement par défaut dont hériteront les serveurs virtuels. Dans un serveur virtuel, les modes FAST ou SECURE agissent sur l'ensemble de la requête HTTP, et toute définition de ces modes dans une section `<Directory>` sera **ignorée**. Le pseudo-mode SELECTIVE confie le choix du mode FAST ou SECURE aux directives contenues dans une section`<Directory>`.

Dans une section `<Directory>`, elle ne s'applique que lorsque le mode SELECTIVE a été défini pour le serveur virtuel. Seuls FAST ou SECURE peuvent être définis dans ce contexte (SELECTIVE n'aurait pas de sens).

> [!WARNING]
> **Avertissement**
>
> Lorsque le mode SELECTIVE a été défini pour un serveur virtuel, l'activation des privilèges doit être reportée *après* la détermination, par la phase de comparaison du traitement de la requête, du contexte `<Directory>` qui s'applique à la requête. Ceci peut donner à un attaquant l'opportunité d'introduire du code via une directive [[13-directives/rewritemap|RewriteMap]] s'exécutant au niveau global ou d'un serveur virtuel *avant* que les privilèges n'aient été supprimés et l'uid/gid défini.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
