---
title: "Protocols"
description: "Directive Apache Protocols (core) — Protocoles disponibles pour un serveur virtuel ou non. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Protocoles disponibles pour un serveur virtuel ou non |
| **Syntaxe** | `Protocols protocole ...` |
| **Valeur par défaut** | `Protocols http/1.1` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | Disponible à partir de la version 2.4.17 du serveur HTTP Apache. |

## Utilisation

Cette directive permet de spécifier la liste des protocoles supportés par un serveur virtuel ou non. Cette liste énumère les protocoles qu'un client sera autorisé à négocier avec ce serveur.

Par défaut, seul le protocole http/1.1 est disponible (compatible avec les clients http/1.0 et http/0.9). Par conséquent, vous devez fournir cette liste si vous voulez étendre les protocoles disponibles pour le serveur.

Par exemple, si vous voulez autoriser le protocole HTTP/2 pour un serveur avec TLS, utilisez cette directive comme suit :

```apache
Protocols h2 http/1.1
```

Les protocoles valides sont `http/1.1` pour les connexions http et https, `h2` pour les connections https et `h2c` pour les connexions http. D'autres modules peuvent fournir d'autres protocoles.

Spécifier des protocoles non disponibles ou désactivés n'aura aucun effet, et ceux-ci seront simplement ignorés.

> [!NOTE]
> **Note**
>
> Le protocole `http/1.1` est toujours disponible, même s’il est exclu de cette directive. Cette dernière permet de spécifier les protocoles supplémentaires disponibles pour la négociation, ainsi que leur ordre de préférence lorsqu’elle est utilisée avec la directive `ProtocolsHonorOrder`.

Si un serveur virtuel ne possède pas de directive Protocols propre, il hérite des protocoles spécifiés pour le serveur principal. Autrement dit, les directives Protocols définies au niveau d'un serveur virtuel remplacent celles définies au niveau du serveur principal.

## Voir aussi

- [[13-directives/protocolshonororder|ProtocolsHonorOrder]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
