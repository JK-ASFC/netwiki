---
title: "mod_brotli"
description: "Module Apache mod_brotli — Compression du contenu via Brotli avant sa livraison au client. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_brotli]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Compression du contenu via Brotli avant sa livraison au client |
| **Statut** | Extension |
| **Identificateur** | `brotli_module` |
| **Fichier source** | `mod_brotli.c` |
| **Compatibilité** | Disponible à partir de la version 2.4.26 du serveur HTTP Apache |

## Sommaire

Le module [[12-modules/mod_brotli|mod_brotli]] fournit le filtre en sortie `BROTLI_COMPRESS` qui permet de compresser un contenu avant sa livraison au client en utilisant la bibliothèque brotli. Ce filtre est implémenté en utilisant la bibliothèque Brotli que l'on peut trouver à [https://github.com/google/brotli](https://github.com/google/brotli).

## Exemples de configurations

> [!WARNING]
> **Compression et TLS**
>
> Certaines applications web sont vulnérables à une attaque de type vol d'informations lorsqu'une connexion TLS transmet des données compressées. Pour plus d'informations, étudiez en détail la famille d'attaques "BREACH".

Voici une configuration simple qui compresse des types de contenus courants au format texte :

**Compression de certains types seulement**

```apache
AddOutputFilterByType BROTLI_COMPRESS text/html text/plain text/xml text/css text/javascript application/javascript
```

## Activation de la compression

> [!WARNING]
> **Compression et TLS**
>
> Certaines applications web sont vulnérables à une attaque de type vol d'informations lorsqu'une connexion TLS transmet des données compressées. Pour plus d'informations, étudiez en détail la famille d'attaques "BREACH".

### Compression en sortie

La compression est implémentée par le [[11-guides/01-generalites/filtres|filtre]] `BROTLI_COMPRESS`. La directive suivante active la compression pour les documents correspondant au conteneur dans lequel elle est placée :

```apache
SetOutputFilter BROTLI_COMPRESS
SetEnvIfNoCase Request_URI \.(?:gif|jpe?g|png)$ no-brotli
```

Si vous voulez restreindre la compression à certains types MIME particuliers, vous pouvez utiliser la directive [[13-directives/addoutputfilterbytype|AddOutputFilterByType]]. Dans l'exemple suivant, l'activation de la compression est restreinte aux fichiers html de la documentation d'Apache httpd :

```apache
<Directory "/your-server-root/manual">
    AddOutputFilterByType BROTLI_COMPRESS text/html
</Directory>
```

> [!NOTE]
> **Note**
>
> Le filtre `BROTLI_COMPRESS` est toujours inséré après les filtres RESOURCE comme PHP ou SSI. Il n'affecte jamais les sous-requêtes internes.

> [!NOTE]
> **Note**
>
> Définie via [[13-directives/setenv|SetEnv]], la variable d'environnement `no-brotli` permet de désactiver la compression brotli pour une requête particulière, et ceci même si elle est supportée par le client.

## Interaction avec les serveurs mandataires

Le module [[12-modules/mod_brotli|mod_brotli]] envoie un en-tête de réponse HTTP `Vary:Accept-Encoding` pour indiquer aux mandataires qu'une réponse mise en cache ne doit être envoyée qu'aux clients qui envoient l'en-tête de requête `Accept-Encoding` approprié. Ceci permet d'éviter d'envoyer du contenu compressé à un client qui ne sera pas en mesure de le décompresser.

Si vous utilisez des exclusions spéciales dépendant, par exemple, de l'en-tête `User-Agent`, vous devez faire un ajout manuel à l'en-tête `Vary` afin d'informer les mandataires des restrictions supplémentaires. Par exemple, dans une configuration typique où l'addition du filtre `BROTLI_COMPRESS` dépend de l'en-tête `User-Agent`, vous devez ajouter :

```apache
Header append Vary User-Agent
```

Si votre décision d'utiliser la compression ou non dépend d'autres informations que le contenu d'en-têtes de requêtes (par exemple la version HTTP), vous devez affecter la valeur `*` à l'en-tête `Vary`. Ceci permet d'éviter que des mandataires qui le supportent n'effectuent une mise en cache intégrale.

**Exemple**

```apache
Header set Vary *
```

## Servir un contenu pré-compressé

comme [[12-modules/mod_brotli|mod_brotli]] compresse systématiquement un contenu pour chaque requête le concernant, il est possible d'obtenir un gain en performance en pré-compressant le contenu et en disant à mod\_brotli de le servir sans le recompresser. Pour cela, vous pouvez utiliser une configuration du style :

```apache
<IfModule mod_headers.c>
    # Sert des fichiers CSS compressés par brotli, s'ils existent
    # et si le client supporte brotli.
    RewriteEngine On
    RewriteCond "%{HTTP:Accept-encoding}" "br"
    RewriteCond "%{LA-U:REQUEST_FILENAME}.br" "-s"
    RewriteRule "^(.*)\.css"              "$1.css.br" [QSA]

    # Servir des fichiers JS compressés par brotli, s’ils existent
    # et si le client accepte brotli.
    RewriteCond "%{HTTP:Accept-encoding}" "br"
    RewriteCond "%{LA-U:REQUEST_FILENAME}.br" "-s"
    RewriteRule "^(.*)\.js"               "$1.js.br" [QSA]

    # Sert des types de contenu corrects, et évite la double compression.
    RewriteRule "\.css\.br$" "-" [T=text/css,E=no-brotli:1,E=no-gzip:1]
    RewriteRule "\.js\.br$"  "-" [T=text/javascript,E=no-brotli:1,E=no-gzip:1]

    <FilesMatch "(\.js\.br|\.css\.br)$">
      # Sert un type d'encodage correct.
      Header append Content-Encoding br

      # Force les mandataires à mettre en cache séparément les fichiers css/js
      # compressés ou non par brotli.
      Header append Vary Accept-Encoding
    </FilesMatch>
</IfModule>
```

## Directives

- [[13-directives/brotlifilternote|BrotliFilterNote]]
- [[13-directives/brotlicompressionquality|BrotliCompressionQuality]]
- [[13-directives/brotlicompressionwindow|BrotliCompressionWindow]]
- [[13-directives/brotlicompressionmaxinputblock|BrotliCompressionMaxInputBlock]]
- [[13-directives/brotlialteretag|BrotliAlterETag]]

## Voir aussi

- [[11-guides/01-generalites/filtres|Filters]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
