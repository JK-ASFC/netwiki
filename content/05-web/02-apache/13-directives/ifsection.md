---
title: "<IfSection>"
description: "Directive Apache <IfSection> (core) — Regroupe des directives dont le traitement est conditionné par la présence ou l'absence d'une section particulière. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Regroupe des directives dont le traitement est conditionné par la présence ou l'absence d'une section particulière |
| **Syntaxe** | `<IfSection [!]section-name> ... </IfSection>` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | All |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | Disponible à partir de la version 2.4.34 du serveur HTTP Apache |

## Utilisation

La section `<IfSection test>...</IfSection>` permet de regrouper des directives dont le traitement n'est effectué que si une section de configuration particulière est présente. Une section, par exemple `<VirtualHost>`, permet de regrouper des directives et possède un nom précédé du caractère "\<".

Les directives situées à l'intérieur d'une section `<IfSection>` ne sont traitées que si l'expression *test* est évaluée à true. Si l'expression *test* est évaluée à false, toutes les lignes situées entre les balises de début et de fin de la section sont ignorées.

*section-name* doit être spécifié sans les caractères de début "\<" ou fin "\>". L'expression *test* de la section `<IfSection>` peut prendre deux formes :

- *section-name*
- !*section-name*

Dans le premier cas, les directives qui se situent entre les balises de début et de fin de la section ne sont traitées que si une section de nom section-name est disponible à cet instant. Dans le second cas, la condition est inversée, et les directives ne sont traitées que si *section-name* n'est **pas** disponible.

Par exemple :

```apache
<IfSection VirtualHost>
   ...
</IfSection>
```

> [!NOTE]
> Cette section ne doit être utilisée que si vous devez partager le même fichier de configuration entre plusieurs versions de [[10-commandes/httpd|httpd]], sans tenir compte de la disponibilité de telle ou telle section. Dans une configuration standard, il est inutile de placer les directives dans des sections `<IfSection>`.

## Voir aussi

- [[13-directives/ifdirective|<IfDirective>]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
