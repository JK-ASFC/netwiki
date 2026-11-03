---
title: "SSLProxyVerifyDepth"
description: "Directive Apache SSLProxyVerifyDepth (mod_ssl) — Niveau de profondeur maximum dans les certificats de CA lors de la vérification du certificat du serveur distant. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Niveau de profondeur maximum dans les certificats de CA lors de la vérification du certificat du serveur distant |
| **Syntaxe** | `SSLProxyVerifyDepth niveau` |
| **Valeur par défaut** | `SSLProxyVerifyDepth 1` |
| **Contexte** | configuration du serveur, serveur virtuel, proxy section |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Le contexte d'une section proxy est supporté à partir de la version 2.4.30 du serveur HTTP Apache |

## Utilisation

Cette directive permet de définir le niveau de profondeur maximum jusqu'auquel mod\_ssl doit aller au cours de sa vérification avant de décider que le serveur distant ne possède pas de certificat valide.

La profondeur correspond en fait au nombre maximum de fournisseurs de certificats intermédiaires, c'est à dire le nombre maximum de certificats de CA que l'on peut consulter lors de la vérification du certificat du serveur distant. Une profondeur de 0 signifie que seuls les certificats de serveurs distants auto-signés sont acceptés, et la profondeur par défaut de 1 que le certificat du serveur distant peut être soit auto-signé, soit signé par une CA connue directement du serveur (en d'autres termes, le certificat de CA est référencé par la directive [[13-directives/sslproxycacertificatepath|SSLProxyCACertificatePath]]), etc...

**Exemple**

```apache
SSLProxyVerifyDepth 10
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
