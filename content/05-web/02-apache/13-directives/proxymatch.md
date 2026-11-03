---
title: "<ProxyMatch>"
description: "Directive Apache <ProxyMatch> (mod_proxy) — Conteneur de directives s'appliquant à des ressources mandatées correspondant à une expression rationnelle. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Conteneur de directives s'appliquant à des ressources mandatées correspondant à une expression rationnelle |
| **Syntaxe** | `<ProxyMatch regex> ...</ProxyMatch>` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy\|mod_proxy]] |

## Utilisation

La directive `<ProxyMatch>` est identique à la directive [[13-directives/proxy|<Proxy>]], à l'exception qu'elle définit les URLs auxquelles elle s'applique en utilisant une expression rationnelle.

> [!WARNING]
> **Avertissement**
>
> Cette section de configuration ne rend canonique aucune partie de la chaîne comparée, comme les protocoles, les noms d’hôte, les adresses IP, etc. Il faut être très prudent si on l’utilise pour le contrôle d’accès en ne se limitant pas à interdire l’accès par défaut et en autorisant certains noms d’hôte donnés plutôt que l’inverse, où une interdiction pourrait être court-circuitée en utilisant des formes alternatives.

A partir de la version 2.4.8, les groupes nommés et les références arrières sont extraits et enregistrés dans l'environnement avec leur nom en majuscules et préfixé par "MATCH\_". Ceci permet de référencer des URLs dans des [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|expressions]] ou au sein de modules comme [[12-modules/mod_rewrite|mod_rewrite]]. Pour éviter toute confusion, les références arrières numérotées (non nommées) sont ignorées. Vous devez utiliser à la place des groupes nommés.

```apache
<ProxyMatch "^http://(?<sitename>[^/]+)">
    Require ldap-group cn=%{env:MATCH_SITENAME},ou=combined,o=Example
</ProxyMatch>
```

## Voir aussi

- [[13-directives/proxy|<Proxy>]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
