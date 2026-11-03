---
title: "mod_proxy_ftp"
description: "Module Apache mod_proxy_ftp — Module fournissant le support FTP à mod_proxy. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_proxy_ftp]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Module fournissant le support FTP à mod\_proxy |
| **Statut** | Extension |
| **Identificateur** | `proxy_ftp_module` |
| **Fichier source** | `mod_proxy_ftp.c` |

## Sommaire

Pour pouvoir fonctionner, ce module *requiert* le chargement de [[12-modules/mod_proxy|mod_proxy]]. Il fournit le support du mandatement des sites FTP. Notez que le support FTP est actuellement limité à la méthode GET.

Ainsi, pour pouvoir traiter les requêtes FTP mandatées, [[12-modules/mod_proxy|mod_proxy]], et [[12-modules/mod_proxy_ftp|mod_proxy_ftp]] doivent être chargés dans le serveur.

> [!WARNING]
> **Avertissement**
>
> N'activez pas la fonctionnalité de mandataire avant d'avoir [[12-modules/mod_proxy|sécurisé votre serveur]]. Les serveurs mandataires ouverts sont dangereux non seulement pour votre réseau, mais aussi pour l'Internet au sens large.

## Pourquoi les fichiers du type *xxx* ne sont-ils pas téléchargeables par FTP ?

Ce type particulier de fichier n'est probablement pas défini en temps que `application/octet-stream` dans le fichier de configuration mime.types de votre mandataire. La ligne suivante peut y remédier :

```
application/octet-stream   bin dms lha lzh exe class tgz taz
```

Vous pouvez aussi utiliser la directive [[13-directives/forcetype|ForceType]] pour définir par défaut tous les types de fichiers en tant que fichiers binaires :

```apache
ForceType application/octet-stream
```

## Comment puis-je forcer le téléchargement FTP en mode ASCII du fichier *xxx* ?

Dans les rares siruations où vous devez télécharger un fichier spécifique en utilisant la méthode de transfert FTP `ASCII` (alors que le mode transfert par défaut est `binary`), vous pouvez modifier le mode de transfert de [[12-modules/mod_proxy|mod_proxy]] en suffixant la requête avec `;type=a` pour forcer un transfert en mode ASCII (les listings de répertoires FTP sont cependant quant à eux transmis en mode ASCII).

## Comment puis-je effectuer un chargement FTP ?

Actuellement, seule la méthode GET est supportée pour FTP dans [[12-modules/mod_proxy|mod_proxy]]. Vous pouvez par contre utiliser le chargement HTTP (POST or PUT) via un mandataire Apache.

## Comment puis-je accéder par FTP à des fichiers situés en dehors de mon répertoire home ?

Un URI FTP est considéré comme relatif au répertoire home de l'utilisateur connecté. Hélas, vous ne pouvez pas utiliser /../ pour atteindre des répertoires de niveau supérieur, car les points sont interprétés par le navigateur et ne sont donc pas vraiment envoyés au serveur FTP. Pour traiter ce problème, une méthode nommée *Squid %2f hack* a été implémentée dans le mandataire FTP Apache ; cette solution est aussi utilisée par d'autres serveurs mandataires courants comme le [Cache mandataire Squid](http://www.squid-cache.org/). En préfixant par `/%2f` le chemin de votre requête, vous pouvez faire en sorte que le mandataire modifie le répertoire FTP racine en `/` (au lieu du répertoire home). Par exemple, pour extraire le fichier `/etc/motd`, vous pourriez utiliser l'URL :

```
ftp://utilisateur@serveur/%2f/etc/motd
```

## Comment puis-je dissimuler le mot de passe FTP apparaissant en clair dans la ligne d'URL de mon navigateur ?

Apache utilise différentes stratégies pour effectuer une connexion à un serveur FTP à l'aide d'un nom d'utilisateur et d'un mot de passe. En l'absence de nom d'utilisateur et de mot de passe dans l'URL, Apache tente une connexion anonyme auprès du serveur FTP comme suit :

```
utilisateur : anonymous
mot de passe : apache-proxy@
```

Ceci fonctionne avec tous les serveurs FTP courants configurés pour accepter les connexions anonymes.

Pour une connexion personnalisée avec un nom d'utilisateur spécifique, vous pouvez intégrer ce dernier dans l'URL comme suit :

```
ftp://nom-utilisateur@serveur/mon-fichier
```

> [!NOTE]
> **HttpProtocolOptions**
>
> Par défaut, la directive [[13-directives/httpprotocoloptions|HttpProtocolOptions]] est définie à `Strict`, ce qui a pour effet de rejeter les URLs contenant des informations sur l’utilisateur (nom ou mot de passe), en accord avec la RFC 7230. Pour utiliser des données d’authentification dans les URLs FTP, vous devez spécifier `HttpProtocolOptions Unsafe`.

Si le serveur FTP demande un mot de passe pour ce nom d'utilisateur (ce qu'il est censé faire), Apache va renvoyer au client une réponse `401` (Autorisation requise), ce qui fera afficher au navigateur une boîte de dialogue utilisateur/mot de passe. Une fois le mot de passe saisi, la connexion est tentée à nouveau, et si elle réussit, la ressource demandée est présentée. L'avantage de cette procédure réside dans le fait que votre navigateur n'affiche pas le mot de passe en clair, ce qu'il aurait fait si vous aviez utilisé l'URL :

```
ftp://nom-utilisateur:mot-de-passe@serveur/mon-fichier
```

> [!NOTE]
> **Note**
>
> Le mot de passe transmis de cette manière n'est pas chiffré lorsqu'il est envoyé. Il transite entre votre navigateur et le serveur mandataire Apache sous la forme d'une chaîne de texte en clair codée en base64, et entre le mandataire Apache et le serveur FTP en texte pur. Vous devez par conséquent réfléchir à deux fois avant d'accéder à votre serveur FTP via HTTP (et d'une manière générale avant d'accéder à vos fichiers personnels via FTP !) sur des canaux non sécurisés, car des oreilles indiscrètes pourraient intercepter votre mot de passe au cours de son transfert.

## Pourquoi reçois-je un listing de fichiers alors que j'ai demandé le téléchargement d'un fichier ?

Apache examine l'URL de la requête afin de permettre la navigation dans les répertoires d'un serveur FTP ainsi que le téléchargement de fichiers. Si elle ressemble à un répertoire, ou contient des caractères génériques ("\*?\[{~"), alors Apache considère que c'est un listing qui est demandé, et non un téléchargement.

Vous pouvez désactiver le traitement spécial des noms contenant des caractères génériques. Voir à cet effet la directive [[13-directives/proxyftplistonwildcard|ProxyFtpListOnWildcard]].

## Directives

- [[13-directives/proxyftplistonwildcard|ProxyFtpListOnWildcard]]
- [[13-directives/proxyftpescapewildcards|ProxyFtpEscapeWildcards]]
- [[13-directives/proxyftpdircharset|ProxyFtpDirCharset]]

## Voir aussi

- [[12-modules/mod_proxy|mod_proxy]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
