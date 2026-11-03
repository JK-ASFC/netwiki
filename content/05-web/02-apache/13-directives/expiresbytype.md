---
title: "ExpiresByType"
description: "Directive Apache ExpiresByType (mod_expires) — Définition de la valeur de l'en-tête Expires en fonction du type MIME. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_expires]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définition de la valeur de l'en-tête `Expires` en fonction du type MIME |
| **Syntaxe** | `ExpiresByType type MIME <code>secondes` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Indexes |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_expires\|mod_expires]] |

## Utilisation

Cette directive permet de définir la valeur de l'en-tête `Expires` et de la directive `max-age` de l'en-tête `Cache-Control` générés pour les documents du type MIME spécifié (par exemple, `text/html`). Le second argument définit le nombre de secondes qui seront ajoutées à un temps de base pour calculer la date d'expiration. `Cache-Control: max-age` se calcule en soustrayant la date de la requête de la date d'expiration et s'exprime en secondes.

Le champ `<code>` permet de spécifier quel temps doit être utilisé comme temps de base; `M` signifie que c'est la date de dernière modification du fichier qui doit être utilisée comme temps de base, alors que `A` signifie que c'est le moment où le client a accédé au document qui doit être utilisé comme temps de base.

La différence d'effet est subtile. Si on utilise `M`, toutes les copies existantes du document dans tous les caches expireront au même moment, ce qui peut convenir par exemple pour une notice hebdomadaire qui correspond toujours à la même URL. Si on utilise `A`, la date d'expiration sera différente pour chaque client, ce qui peut convenir pour des fichiers d'images qui ne changent pas très souvent, et en particulier pour un ensemble de documents en relation qui se réfèrent tous aux mêmes images (ces images sont alors accédées de manière répétitive dans un intervalle de temps assez court).

**Exemple :**

```apache
# active la génération des en-têtes Expires
ExpiresActive On
# les images GIF expirent au bout d'un mois dans le cache du
# client
ExpiresByType image/gif A2592000
# les documents HTML restent valables une semaine après leur date
# de dernière modification
ExpiresByType text/html M604800
```

Notez que cette directive ne produit d'effet que si `ExpiresActive On` a été spécifié. Elle l'emporte, mais *seulement* pour le type MIME spécifié, sur toute date d'expiration définie par la directive [[13-directives/expiresdefault|ExpiresDefault]].

Vous pouvez aussi définir le mode de calcul de la date d'expiration en utilisant une syntaxe alternative, comme décrit plus haut dans ce document.

Le type MIME peut utiliser des caractères génériques pour le sous-type, comme dans `image/*`. Cet exemple correspond à tout sous-type sous le type principal. Lorsque le type de contenu d'une requête ne correspond pas à une entrée `ExpiresByType` spécifique, une entrée avec caractères génériques pour le type principal est recherchée avant de se rebattre sur [[13-directives/expiresdefault|ExpiresDefault]].

**Exemple avec caractères génériques ::**

```apache
ExpiresActive On
# Toutes les images sont périmées après 1 mois
ExpiresByType image/* "access plus 1 month"
# Override specifically for GIF
ExpiresByType image/gif "access plus 1 week"
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
