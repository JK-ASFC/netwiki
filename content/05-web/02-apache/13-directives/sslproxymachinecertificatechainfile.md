---
title: "SSLProxyMachineCertificateChainFile"
description: "Directive Apache SSLProxyMachineCertificateChainFile (mod_ssl) — Fichier de certificats de CA encodés PEM concaténés permettant au mandataire de choisir un certificat. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Fichier de certificats de CA encodés PEM concaténés permettant au mandataire de choisir un certificat |
| **Syntaxe** | `SSLProxyMachineCertificateChainFile nom-fichier` |
| **Contexte** | configuration du serveur, serveur virtuel, proxy section |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Le contexte d'une section proxy est supporté à partir de la version 2.4.30 du serveur HTTP Apache |

## Utilisation

Cette directive permet de définir le fichier global où est enregistrée la chaîne de certification pour tous les certificats clients utilisés. Elle est nécessaire si le serveur distant présente une liste de certificats de CA qui ne sont pas les signataires directs d'un des certificats clients configurés.

Ce fichier contient tout simplement la concaténation des différents fichiers de certificats encodés PEM. Au démarrage, chaque certificat client configuré est examiné et une chaîne de certification est construite.

> [!WARNING]
> **Avertissement en matière de sécurité**
>
> Si cette directive est définie, tous les certificats contenus dans le fichier spécifié seront considérés comme étant de confiance, comme s'ils étaient aussi désignés dans la directive [[13-directives/sslproxycacertificatefile|SSLProxyCACertificateFile]].

**Exemple**

```apache
SSLProxyMachineCertificateChainFile
"/usr/local/apache2/conf/ssl.crt/proxyCA.pem"
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
