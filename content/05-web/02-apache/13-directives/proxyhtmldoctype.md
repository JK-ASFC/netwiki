---
title: "ProxyHTMLDocType"
description: "Directive Apache ProxyHTMLDocType (mod_proxy_html) — Définit une déclaration de type de document HTML ou XHTML. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy_html]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit une déclaration de type de document HTML ou XHTML. |
| **Syntaxe** | `ProxyHTMLDocType HTML\|XHTML [Legacy]OR ProxyHTMLDocType fpi [SGML\|XML]` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Base |
| **Module** | [[12-modules/mod_proxy_html\|mod_proxy_html]] |
| **Compatibilité** | Disponible depuis la version 2.4 du serveur HTTP Apache. Disponible en tant que module tiers dans les versions 2.x antérieures. |

## Utilisation

Avec la première syntaxe, les documents seront déclarés de type HTML 4.01 ou XHTML 1.0 selon l'option spécifiée. Cette option détermine aussi si la syntaxe utilisée en sortie est HTML ou XHTML. Notez que le format des documents en provenance du serveur d'arrière-plan n'est pas important, car l'interpréteur le détectera automatiquement. Si le second argument optionnel est défini à `Legacy`, les documents seront déclarés de type "Transitional" ; cette option peut être nécessaire si vous mandatez du contenu datant d'avant 1998, ou si vous travaillez avec des outils de création/publication déficients.

Avec la deuxième syntaxe, cette directive vous permet d'insérer votre propre FPI (Formal Public Identifier). Le second argument optionnel détermine si la syntaxe utilisée sera SGML/HTML ou XML/XHTML.

Par défaut, aucun FPI n'est inséré, étant donné qu'il vaut mieux pas de FPI du tout qu'un FPI bogué. Si par contre votre serveur d'arrière-plan génère du contenu HTML ou XHTML correct, vous pouvez définir cette directive en conséquence.

Avec la première syntaxe, mod\_proxy\_html va aussi mettre le code HTML en conformité avec le standard spécifié. Il ne pourra pas corriger toutes les erreurs, mais il va supprimer les éléments et attributs non conformes. Il peut aussi journaliser les autres erreurs si la directive [[13-directives/loglevel|LogLevel]] est définie à Debug.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
