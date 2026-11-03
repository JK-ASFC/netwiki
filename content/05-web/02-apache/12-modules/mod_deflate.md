---
title: "mod_deflate"
description: "Module Apache mod_deflate — Comprime le contenu avant de le servir au client. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_deflate]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Comprime le contenu avant de le servir au client |
| **Statut** | Extension |
| **Identificateur** | `deflate_module` |
| **Fichier source** | `mod_deflate.c` |

## Sommaire

Le module [[12-modules/mod_deflate|mod_deflate]] implémente le filtre de sortie `DEFLATE` qui permet de compresser la sortie de votre serveur avant de l'envoyer au client sur le réseau.

## Codages supportés

Le seul codage supporté est `gzip` afin d'assurer une complète compatibilité avec les anciens navigateurs. Le codage `deflate` n'est donc pas supporté ; voir à ce sujet la [documentation de zlib](https://zlib.net/zlib_faq.html#faq39) pour une explication détaillée.

## Exemples de configurations

> [!WARNING]
> **Compression et TLS**
>
> Certaines applications web sont vulnérables à une attaque pour vol d'informations lorsqu'une connexion TLS transporte des données compressées par deflate. Pour plus de détails, documentez-vous sur la famille d'attaques "BREACH".

Voici un exemple simple de configuration qui permet de compresser les types de contenu à base de texte.

**Ne compresse que certains types de documents**

```apache
AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
```

## Activation de la compression

> [!WARNING]
> **Compression et TLS**
>
> Certaines applications web sont vulnérables à une attaque pour vol d'informations lorsqu'une connexion TLS transporte des données compressées par deflate. Pour plus de détails, documentez-vous sur la famille d'attaques "BREACH".

### Compression de la sortie

La compression est implémentée par le [[11-guides/01-generalites/filtres|filtre]] `DEFLATE`. La directive suivante active la compression des documents dans le conteneur où elle est placée :

```apache
SetOutputFilter DEFLATE
SetEnvIfNoCase Request_URI "\.(?:gif|jpe?g|png)$" no-gzip
```

Si vous voulez limiter la compression à certains types MIME particuliers, vous pouvez utiliser la directive [[13-directives/addoutputfilterbytype|AddOutputFilterByType]]. Voici un exemple où la compression n'est activée que pour les fichiers html de la documentation d'Apache httpd:

```apache
<Directory "/your-server-root/manual">
    AddOutputFilterByType DEFLATE text/html
</Directory>
```

> [!NOTE]
> **Note**
>
> Le filtre `DEFLATE` est toujours inséré après les filtres RESOURCE comme PHP ou SSI. Il n'affecte jamais les sous-requêtes internes.

> [!NOTE]
> **Note**
>
> La variable d'environnement `force-gzip`, définie à l'aide de la directive [[13-directives/setenv|SetEnv]], permet d'ignorer la configuration de votre navigateur quant aux codages acceptés, et d'envoyer sans condition une sortie compressée.

### Décompression de la sortie

Le module [[12-modules/mod_deflate|mod_deflate]] fournit aussi un filtre permettant de décompresser un corps de réponse compressé par gzip. Pour activer cette fonctionnalité, vous devez insérer le filtre `INFLATE` dans la chaîne de filtrage en sortie via la directive [[13-directives/setoutputfilter|SetOutputFilter]] ou [[13-directives/addoutputfilter|AddOutputFilter]], comme dans l'exemple suivant :

```apache
<Location "/dav-area">
    ProxyPass "http://example.com/"
    SetOutputFilter INFLATE
</Location>
```

Dans cet exemple, les sorties compressées par gzip en provenance de example.com seront décompressées afin de pouvoir être éventuellement traitées par d'autres filtres.

### Décompression de l'entrée

Le module [[12-modules/mod_deflate|mod_deflate]] fournit également un filtre permettant de décompresser un corps de requête compressé par gzip. Pour activer cette fonctionnalité, vous devez insérer le filtre `DEFLATE` dans la chaîne de filtrage en entrée via la directive [[13-directives/setinputfilter|SetInputFilter]] ou [[13-directives/addinputfilter|AddInputFilter]], comme dans l'exemple suivant :

```apache
<Location "/dav-area">
    SetInputFilter DEFLATE
</Location>
```

Désormais, si une requête contient un en-tête `Content-Encoding: gzip`, son corps sera automatiquement décompressé. Peu de navigateurs sont actuellement en mesure de compresser les corps de requêtes. Cependant, certaines applications spécialisées supportent les requêtes compressées, comme par exemple certains clients [WebDAV](https://www.webdav.org).

> [!WARNING]
> **Note à propos de l'en-tête `Content-Length`**
>
> Si vous évaluez vous-même la taille du corps de requête, *ne faites pas confiance à l'en-tête `Content-Length`!* L'en-tête Content-Length indique la longueur des données en provenance du client, et *non* la quantité d'octets que représente le flux de données décompressé.

## Prise en compte des serveurs mandataires

Le module [[12-modules/mod_deflate|mod_deflate]] envoie un en-tête de réponse HTTP `Vary: Accept-Encoding` pour avertir les mandataires qu'une réponse enregistrée dans le cache ne doit être envoyée qu'aux clients qui ont envoyé l'en-tête de requête `Accept-Encoding` approprié. Ceci permet d'éviter l'envoi d'un contenu compressé à un client qui ne sera pas en mesure de l'interpréter.

Si vous avez défini des exclusions spécifiques dépendant, par exemple, de l'en-tête `User-Agent`, vous devez ajouter manuellement des données à l'en-tête `Vary` afin d'informer les mandataires des restrictions supplémentaires. Par exemple, dans la configuration classique où l'addition du filtre `DEFLATE` dépend du contenu de l'en-tête `User-Agent`, vous devez spécifier :

```apache
Header append Vary User-Agent
```

Si votre décision de compresser le contenu dépend d'autres informations que celles contenues dans les en-têtes de la requête (par exemple la version HTTP), vous devez attribuer à l'en-tête `Vary` la valeur `*`, ce qui permet d'empêcher les mandataires compatibles de tout mettre en cache.

**Exemple**

```apache
Header set Vary *
```

## Servir du contenu précompressé

Comme [[12-modules/mod_deflate|mod_deflate]] recompresse le contenu demandé à chaque requête, il est possible de gagner en performances en précompressant ce contenu, et en forçant [[12-modules/mod_deflate|mod_deflate]] à servir ce contenu précompressé sans avoir à le recompresser à chaque requête. Pour ce faire, utilisez une configuration du style :

```apache
<IfModule mod_headers.c>
    # Servir des fichiers JS et CSS compressés avec gzip, s'ils existent, et
    # si le client accepte gzip.
    RewriteCond "%{HTTP:Accept-encoding}" "gzip"
     RewriteCond "%{REQUEST_FILENAME}\.gz" -s
    RewriteRule "^(.*)\.(css|js)"              "$1\.$2\.gz" [QSA]

    # Servir des types de contenus corrects, et empêcher mod_deflate
    # d'effectuer un double gzip.
    RewriteRule "\.css\.gz$" "-" [T=text/css,E=no-gzip:1]
    RewriteRule "\.js\.gz$"  "-" [T=text/javascript,E=no-gzip:1]


    <FilesMatch "(\.js\.gz|\.css\.gz)$">
      # Servir le type de codage correct.
      Header append Content-Encoding gzip

      # Force les mandataires à mettre en cache séparément les fichiers
      # css/js gzippés & non gzippés.
      Header append Vary Accept-Encoding
    </FilesMatch>
</IfModule>
```

## Directives

- [[13-directives/deflatefilternote|DeflateFilterNote]]
- [[13-directives/deflatebuffersize|DeflateBufferSize]]
- [[13-directives/deflatewindowsize|DeflateWindowSize]]
- [[13-directives/deflatememlevel|DeflateMemLevel]]
- [[13-directives/deflatecompressionlevel|DeflateCompressionLevel]]
- [[13-directives/deflateinflatelimitrequestbody|DeflateInflateLimitRequestBody]]
- [[13-directives/deflateinflateratiolimit|DeflateInflateRatioLimit]]
- [[13-directives/deflateinflateratioburst|DeflateInflateRatioBurst]]
- [[13-directives/deflatealteretag|DeflateAlterETag]]

## Voir aussi

- [[11-guides/01-generalites/filtres|Les filtres]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
