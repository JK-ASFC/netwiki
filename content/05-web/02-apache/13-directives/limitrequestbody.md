---
title: "LimitRequestBody"
description: "Directive Apache LimitRequestBody (core) — limite la taille maximale du corps de la requête HTTP envoyée par le client. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | limite la taille maximale du corps de la requête HTTP envoyée par le client |
| **Syntaxe** | `LimitRequestBody octets` |
| **Valeur par défaut** | `LimitRequestBody 1073741824` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | All |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | Dans les versions 2.4.53 et antérieures du serveur HTTP Apache, la valeur par défaut était 0 (aucune limite) |

## Utilisation

Cette directive permet de spécifier la taille maximale d'un corps de requête, en *octets*. Une valeur de *0* signifie « sans limites ».

La directive `LimitRequestBody` permet de définir une limite pour la taille maximale autorisée du corps d'une requête HTTP en tenant compte du contexte dans lequel la directive a été placée (c'est à dire au niveau du serveur, d'un répertoire, d'un fichier ou d'une localisation). Si la requête du client dépasse cette limite, le serveur répondra par un message d'erreur et ne traitera pas la requête. La taille du corps d'une requête normale va varier de manière importante en fonction de la nature de la ressource et des méthodes autorisées pour cette dernière. Les scripts CGI utilisent souvent le corps du message pour extraire les informations d'un formulaire. Les implémentations de la méthode `PUT` nécessitent une valeur au moins aussi élevée que la taille maximale des représentations que le serveur désire accepter pour cette ressource.

L'administrateur du serveur peut utiliser cette directive pour contrôler plus efficacement les comportements anormaux des requêtes des clients, ce qui lui permettra de prévenir certaines formes d'attaques par déni de service.

Si par exemple, vous autorisez le chargement de fichiers vers une localisation particulière, et souhaitez limiter la taille des fichiers chargés à 100Ko, vous pouvez utiliser la directive suivante :

```apache
LimitRequestBody 102400
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
