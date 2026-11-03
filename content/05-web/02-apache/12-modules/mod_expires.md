---
title: "mod_expires"
description: "Module Apache mod_expires — Génération des en-têtes HTTP Expires et Cache-Control en fonction de critères spécifiés par l'utilisateur. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_expires]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Génération des en-têtes HTTP Expires et Cache-Control en fonction de critères spécifiés par l'utilisateur |
| **Statut** | Extension |
| **Identificateur** | `expires_module` |
| **Fichier source** | `mod_expires.c` |

## Sommaire

Ce module permet de contrôler la définition de l'en-tête HTTP `Expires` et la directive `max-age` de l'en-tête HTTP `Cache-Control` dans les réponses du serveur. La date d'expiration peut être définie soit par rapport à la date de dernière modification du fichier source, soit par rapport à l'heure d'accès du client.

Ces en-têtes HTTP permettent d'informer le client quant à la validité et à la persistence du document. S'il est présent dans le cache, et tant qu'il n'est pas arrivé à expiration, le document sera servi à partir de ce dernier, plutôt qu'à partir du document source. Après expiration, la copie du document dans le cache sera considérée comme "expirée" et donc invalide, et une nouvelle copie devra être obtenue à partir du document source.

Pour modifier les directives de contrôle du cache autres que `max-age` (voir la [RFC 2616](https://www.rfc-editor.org/rfc/rfc2616)), vous pouvez utiliser la directive [[13-directives/header|Header]].

Lorsque l'en-tête `Expires` est déjà présent dans la réponse générée par le serveur, par exemple s'il a été créé par un script CGI ou un serveur original via un serveur mandataire, ce module n'ajoute aucun en-tête `Expires` ou `Cache-Control`.

## Autre syntaxe de définition de l'intervalle

Pour une syntaxe plus lisible, on peut aussi utiliser les directives [[13-directives/expiresdefault|ExpiresDefault]] et [[13-directives/expiresbytype|ExpiresByType]] comme suit :

```apache
ExpiresDefault "base  [plus num type] [num type] ..."
ExpiresByType type/encoding "base  [plus num type] [num type] ..."
```

où *base* peut être :

- `access`
- `now` (équivalent à '`access`')
- `modification`

Le mot-clé `plus` est optionnel. *num* doit correspondre à une valeur entière \[compatible avec `atoi()`\], et *type* peut être choisi parmi :

- `years`
- `months`
- `weeks`
- `days`
- `hours`
- `minutes`
- `seconds`

Par exemple, pour faire expirer par défaut les documents 1 mois après leur accès, on peut utiliser une des directives suivantes :

```apache
ExpiresDefault "access plus 1 month"
ExpiresDefault "access plus 4 weeks"
ExpiresDefault "access plus 30 days"
```

La date d'expiration peut être définie plus précisément en ajoutant plusieurs clauses '*num* *type*' :

```apache
ExpiresByType text/html "access plus 1 month 15 days 2 hours"
ExpiresByType image/gif "modification plus 5 hours 3 minutes"
```

Notez que si vous utilisez une configuration basée sur la date de modification, l'en-tête Expires ne sera pas ajouté à un contenu qui ne provient pas directement d'un fichier sur disque ; et ceci tout simplement parce que ce type de contenu ne possède pas de date de modification.

## Directives

- [[13-directives/expiresactive|ExpiresActive]]
- [[13-directives/expiresbytype|ExpiresByType]]
- [[13-directives/expiresdefault|ExpiresDefault]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
