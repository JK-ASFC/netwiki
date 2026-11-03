---
title: "SSLProxyMachineCertificatePath"
description: "Directive Apache SSLProxyMachineCertificatePath (mod_ssl) — Répertoire des clés et certificats clients codés en PEM que le mandataire doit utiliser. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Répertoire des clés et certificats clients codés en PEM que le mandataire doit utiliser |
| **Syntaxe** | `SSLProxyMachineCertificatePath chemin-répertoire` |
| **Contexte** | configuration du serveur, serveur virtuel, proxy section |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Le contexte d'une section proxy est supporté à partir de la version 2.4.30 du serveur HTTP Apache |

## Utilisation

Cette directive permet de définir le répertoire où sont stockés les clés et certificats clients permettant au serveur mandataire de s'authentifier auprès des serveurs distants.

mod\_ssl va essayer de charger tous les fichiers contenus dans le répertoire spécifié, comme si ces derniers étaient définis individuellement via la directive [[13-directives/sslproxymachinecertificatefile|SSLProxyMachineCertificateFile]].

> [!WARNING]
> Actuellement, les clés privées chiffrées ne sont pas supportées.

> [!WARNING]
> Seules les clés au format PKCS1 RSA, DSA ou EC sont supportées. Les clés au format PKCS8, autrement dit celles commençant par "`-----BEGIN PRIVATE KEY-----`", doivent être converties via une commande du style "`openssl rsa -in private-pkcs8.pem -outform pem`".

**Exemple**

```apache
SSLProxyMachineCertificatePath "/usr/local/apache2/conf/proxy.crt/"
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
