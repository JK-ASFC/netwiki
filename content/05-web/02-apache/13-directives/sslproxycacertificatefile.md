---
title: "SSLProxyCACertificateFile"
description: "Directive Apache SSLProxyCACertificateFile (mod_ssl) — Fichier contenant la concaténation des certificats de CA codés en PEM pour l'authentification des serveurs distants. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Fichier contenant la concaténation des certificats de CA codés en PEM pour l'authentification des serveurs distants |
| **Syntaxe** | `SSLProxyCACertificateFile file-path` |
| **Contexte** | configuration du serveur, serveur virtuel, proxy section |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Le contexte d'une section proxy est supporté à partir de la version 2.4.30 du serveur HTTP Apache |

## Utilisation

Cette directive permet de définir le fichier *tout-en-un* où sont stockés les certificats des Autorités de Certification (CA) pour les *serveurs distants* auxquels vous avez à faire. On les utilise lors de l'authentification du serveur distant. Un tel fichier contient la simple concaténation des différents fichiers de certificats codés en PEM, classés par ordre de préférence. On peut utiliser cette directive à la place et/ou en complément de la directive [[13-directives/sslproxycacertificatepath|SSLProxyCACertificatePath]].

**Exemple**

```apache
SSLProxyCACertificateFile
"/usr/local/apache2/conf/ssl.crt/ca-bundle-serveur.distant.crt"
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
