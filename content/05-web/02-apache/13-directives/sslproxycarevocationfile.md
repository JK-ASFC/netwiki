---
title: "SSLProxyCARevocationFile"
description: "Directive Apache SSLProxyCARevocationFile (mod_ssl) — Fichier contenant la concaténation des CRLs de CA codés en PEM pour l'authentification des serveurs distants. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Fichier contenant la concaténation des CRLs de CA codés en PEM pour l'authentification des serveurs distants |
| **Syntaxe** | `SSLProxyCARevocationFile file-path` |
| **Contexte** | configuration du serveur, serveur virtuel, proxy section |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Le contexte d'une section proxy est supporté à partir de la version 2.4.30 du serveur HTTP Apache |

## Utilisation

Cette directive permet de définir le fichier *tout-en-un* où sont rassemblées les Listes de Révocation de Certificats (CRLs) des Autorités de certification (CAs) pour les *serveurs distants* auxquels vous avez à faire. On les utilise pour l'authentification des serveurs distants. Un tel fichier contient la simple concaténation des différents fichiers de CRLs codés en PEM, classés par ordre de préférence. Cette directive peut être utilisée à la place et/ou en complément de la directive [[13-directives/sslproxycarevocationpath|SSLProxyCARevocationPath]].

**Exemple**

```apache
SSLProxyCARevocationFile
"/usr/local/apache2/conf/ssl.crl/ca-bundle-serveur.distant.crl"
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
