---
title: "SSLProxyCARevocationCheck"
description: "Directive Apache SSLProxyCARevocationCheck (mod_ssl) — Active la vérification des révocations basée sur les CRLs pour l'authentification du serveur distant. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active la vérification des révocations basée sur les CRLs pour l'authentification du serveur distant |
| **Syntaxe** | `SSLProxyCARevocationCheck chain\|leaf\|none` |
| **Valeur par défaut** | `SSLProxyCARevocationCheck none` |
| **Contexte** | configuration du serveur, serveur virtuel, proxy section |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Le contexte d'une section proxy est supporté à partir de la version 2.4.30 du serveur HTTP Apache |

## Utilisation

Active la vérification des révocations basée sur les Listes de révocations de Certificats (CRL) pour les *serveurs distants* auxquels vous vous connectez. A moins une des directives [[13-directives/sslproxycarevocationfile|SSLProxyCARevocationFile]] ou [[13-directives/sslproxycarevocationpath|SSLProxyCARevocationPath]] doit être définie. Lorsque cette directive est définie à `chain` (valeur recommandée), les vérifications CRL sont effectuées sur tous les certificats de la chaîne, alors que la valeur `leaf` limite la vérification au certificat hors chaîne (la feuille).

> [!NOTE]
> **Lorsque la directive est définie à `chain` ou `leaf`, les CRLs doivent être disponibles pour que la validation réussisse**
>
> Avant la version 2.3.15, les vérifications CRL dans mod\_ssl réussissaient même si aucune CRL n'était trouvée dans les chemins définis par les directives [[13-directives/sslproxycarevocationfile|SSLProxyCARevocationFile]] ou [[13-directives/sslproxycarevocationpath|SSLProxyCARevocationPath]]. Le comportement a changé avec l'introduction de cette directive : lorsque la vérification est activée, les CRLs *doivent* être présentes pour que la validation réussisse ; dans le cas contraire, elle échouera avec une erreur `"CRL introuvable"`.

**Exemple**

```apache
SSLProxyCARevocationCheck chain
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
