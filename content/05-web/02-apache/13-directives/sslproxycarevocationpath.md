---
title: "SSLProxyCARevocationPath"
description: "Directive Apache SSLProxyCARevocationPath (mod_ssl) — Répertoire des CRLs de CA codés en PEM pour l'authentification des serveurs distants. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Répertoire des CRLs de CA codés en PEM pour l'authentification des serveurs distants |
| **Syntaxe** | `SSLProxyCARevocationPath chemin-répertoire` |
| **Contexte** | configuration du serveur, serveur virtuel, proxy section |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Le contexte d'une section proxy est supporté à partir de la version 2.4.30 du serveur HTTP Apache |

## Utilisation

Cette directive permet de définir le répertoire où sont stockées les Listes de Révocation de Certificats (CRL) des Autorités de Certification (CAs) pour les serveurs distants auxquels vous avez à faire. On les utilise pour révoquer les certificats des serveurs distants au cours de l'authentification de ces derniers.

Les fichiers de ce répertoire doivent être codés en PEM et ils sont accédés via des noms de fichier sous forme de condensés ou hash. Il ne suffit donc pas de placer les fichiers de CRL dans ce répertoire : vous devez aussi créer des liens symboliques nommés *valeur-de-hashage*`.rN`, et vous devez toujours vous assurer que ce répertoire contient les liens symboliques appropriés.

**Exemple**

```apache
SSLProxyCARevocationPath "/usr/local/apache2/conf/ssl.crl/"
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
