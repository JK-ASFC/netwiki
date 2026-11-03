---
title: "<IfDirective>"
description: "Directive Apache <IfDirective> (core) — Regroupe des directives dont le traitement est conditionné par la présence ou l'absence d'une directive particulière. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Regroupe des directives dont le traitement est conditionné par la présence ou l'absence d'une directive particulière |
| **Syntaxe** | `<IfDirective [!]directive-name> ... </IfDirective>` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | All |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | Disponible à partir de la version 2.4.34 du serveur HTTP Apache |

## Utilisation

La section `<IfDirective test>...</IfDirective>` permet de regrouper des directives dont le traitement n'est effectué que si une directive particulière est présente, autrement dit si l'expression *test* est évaluée à true. Si l'expression *test* est évaluée à false, toutes les lignes qui se trouvent entre les balises de début et de fin de la section sont ignorées.

L'expression *test* de la section `<IfDirective>` peut prendre les deux formes suivantes :

- *directive-name*
- !*directive-name*

Dans le premier cas, les directives qui se situent entre les balises de début et de fin de la section ne sont traitées que si une directive de nom directive-name est disponible à cet instant. Dans le second cas, la condition est inversée, et les directives ne sont traitées que si *directive-name* n'est **pas** disponible.

> [!NOTE]
> Cette section ne doit être utilisée que si vous devez partager le même fichier de configuration entre plusieurs versions de [[10-commandes/httpd|httpd]], sans tenir compte de la disponibilité de telle ou telle directive. Dans une configuration standard, il est inutile de placer les directives dans des sections `<IfDirective>`.

## Voir aussi

- [[13-directives/ifsection|<IfSection>]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
