---
title: "SSLProxyCACertificatePath"
description: "Directive Apache SSLProxyCACertificatePath (mod_ssl) — Répertoire des certificats de CA codés en PEM pour l'authentification des serveurs distants. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Répertoire des certificats de CA codés en PEM pour l'authentification des serveurs distants |
| **Syntaxe** | `SSLProxyCACertificatePath chemin-répertoire` |
| **Contexte** | configuration du serveur, serveur virtuel, proxy section |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Le contexte d'une section proxy est supporté à partir de la version 2.4.30 du serveur HTTP Apache |

## Utilisation

Cette directive permet de spécifier le répertoire où sont stockés les certificats des Autorités de Certification (CAs) pour les serveurs distants auxquels vous avez à faire. On les utilise pour vérifier le certificat du serveur distant lors de l'authentification de ce dernier.

Les fichiers de ce répertoire doivent être codés en PEM et ils sont accédés via des noms de fichier sous forme de condensés ou hash. Il ne suffit donc pas de placer les fichiers de certificats dans ce répertoire : vous devez aussi créer des liens symboliques nommés *valeur-de-hashage*`.N`, et vous devez toujours vous assurer que ce répertoire contient les liens symboliques appropriés.

**Exemple**

```apache
SSLProxyCACertificatePath "/usr/local/apache2/conf/ssl.crt/"
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
