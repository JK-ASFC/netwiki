---
title: "mod_xml2enc"
description: "Module Apache mod_xml2enc — Support avancé de l'internationalisation et des jeux de caractères pour les modules de filtrage basés sur libxml2. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_xml2enc]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Support avancé de l'internationalisation et des jeux de caractères pour les modules de filtrage basés sur libxml2 |
| **Statut** | Base |
| **Identificateur** | `xml2enc_module` |
| **Fichier source** | `mod_xml2enc.c` |
| **Compatibilité** | Disponible depuis la version 2.4 du serveur HTTP Apache. Disponible en tant que module tiers dans les versions 2.2.x |

## Sommaire

Ce module fournit un support avancé de l'internationalisation pour les modules de filtrage supportant les balises (markup-aware) comme [[12-modules/mod_proxy_html|mod_proxy_html]]. Il est capable de détecter automatiquement l'encodage des données en entrée et de s'assurer qu'elle sont traitées correctement par l'interpréteur [libxml2](http://xmlsoft.org/), y compris la conversion en Unicode (UTF-8) si nécessaire. Il peut aussi convertir les données dans l'encodage de votre choix après le traitement des balises, et s'assurera que le *jeu de caractères* approprié sera défini dans l'en-tête HTTP *Content-Type*.

## Utilisation

Il existe deux scénarios d'utilisation : le cas des modules programmés pour travailler avec mod\_xml2enc ; et les autres :

**Modules de filtrages programmés pour mod\_xml2enc**

Les modules comme [[12-modules/mod_proxy_html|mod_proxy_html]] versions 3.1 et supérieures utilisent la fonction optionnelle `xml2enc_charset` pour déterminer la valeur de l'argument "jeu de caractères" à transmettre à l'interpréteur libxml2, et disposent de la fonction optionnelle `xml2enc_filter` pour effectuer un encodage ultérieur éventuel. L'utilisation de mod\_xml2enc avec un module préprogrammé à cet effet ne nécessite aucune configuration : ce dernier configurera mod\_xml2enc pour vous (sachant que vous pouvez tout de même le personnaliser via les directives de configuration ci-dessous).

**Modules de filtrages non programmés pour mod\_xml2enc**

Pour utiliser mod\_xml2enc avec un module basé sur libxml2 qui n'a pas été explicitement programmé pour mod\_xml2enc, vous devrez configurer la chaîne de filtrage vous-même. Ainsi, pour utiliser mod\_xml2enc avec un filtre **foo** fourni par un module **mod\_foo** et pour améliorer le support i18n de ce dernier avec HTML et XML, vous pouvez utiliser les directives suivantes :

```
FilterProvider iconv    xml2enc Content-Type $text/html
FilterProvider iconv    xml2enc Content-Type $xml
FilterProvider markup   foo Content-Type $text/html
FilterProvider markup   foo Content-Type $xml
FilterChain     iconv markup
```

**mod\_foo** supportera alors tout jeu de caractère supporté soit par libxml2, soit par apr\_xlate/iconv, soit par les deux.

## API de programmation

Les programmeurs de modules de filtrage basés sur libxml2 sont encouragés à les préprogrammer pour mod\_xml2enc, afin de fournir un support i18n solide aux utilisateurs sans avoir à réinventer la roue. L'API de programmation est décrite dans *mod\_xml2enc.h*, et [[12-modules/mod_proxy_html|mod_proxy_html]] est un exemple de son utilisation.

## Détection et encodage

A la différence de [[12-modules/mod_charset_lite|mod_charset_lite]], mod\_xml2enc est conçu pour travailler avec des données dont l'encodage ne peut pas être connu, et donc configuré, à l'avance. Il utilise donc les techniques de 'reniflage' suivantes pour détecter le type d'encodage des données HTTP :

1. Si l'en-tête HTTP *Content-Type* contient un paramètre *charset*, c'est ce dernier qui sera utilisé.
2. Si les données commancent par une balise XML concernant l'ordre des octets (BOM) ou par une déclaration d'encodage XML, c'est celle-ci qui sera utilisée.
3. Si un type d'encodage est déclaré dans un élément HTML `<META>`, c'est ce dernier qui sera utilisé.
4. Si aucun des éléments précédents n'est trouvé, c'est la valeur par défaut définie par la directive `xml2EncDefault` qui sera utilisée.

Les conditions sont testées dans cet ordre . Dès qu'une règle s'applique, elle est utilisée et la détection est terminée.

## Codage en sortie

[libxml2](http://xmlsoft.org/) utilise toujours UTF-8 (Unicode) en interne, et les modules de filtrage basés sur libxml2 utiliseront cet encodage en sortie par défaut. mod\_xml2enc peut modifier l'encodage en sortie via l'API, mais il n'y a actuellement aucun moyen de le configurer directement.

La modification de l'encodage en sortie ne devrait (du moins en théorie) jamais être nécessaire, et est même déconseillée à cause de la charge de traitement supplémentaire imposée au serveur par une conversion non nécessaire.

## Codages non supportés

Si vous travaillez avec des encodages non supportés par aucune des méthodes de conversion disponibles sur votre plateforme, vous pouvez tout de même leur associer un alias vers un code supporté via la directive `xml2EncAlias`.

## Directives

- [[13-directives/xml2encdefault|xml2EncDefault]]
- [[13-directives/xml2encalias|xml2EncAlias]]
- [[13-directives/xml2startparse|xml2StartParse]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
