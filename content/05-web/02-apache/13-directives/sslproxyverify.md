---
title: "SSLProxyVerify"
description: "Directive Apache SSLProxyVerify (mod_ssl) — Niveau de vérification du certificat du serveur distant. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Niveau de vérification du certificat du serveur distant |
| **Syntaxe** | `SSLProxyVerify niveau` |
| **Valeur par défaut** | `SSLProxyVerify none` |
| **Contexte** | configuration du serveur, serveur virtuel, proxy section |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Le contexte d'une section proxy est supporté à partir de la version 2.4.30 du serveur HTTP Apache |

## Utilisation

Lorsqu'un mandataire est configuré pour faire suivre les requêtes vers un serveur SSL distant, cette directive permet de configurer la vérification du certificat de ce serveur distant.

Les valeurs de *niveau*x disponibles sont les suivantes :

- **none**: aucun certificat n'est requis pour le serveur distant
- **optional**: le serveur distant *peut* présenter un certificat valide
- **require**: le serveur distant *doit* présenter un certificat valide
- **optional\_no\_ca**: le serveur distant peut présenter un certificat valide
  mais il n'est pas nécessaire qu'il soit vérifiable (avec succès).

En pratique, seuls les niveaux **none** et **require** sont vraiment intéressants, car le niveau **optional** ne fonctionne pas avec tous les serveurs, et le niveau **optional\_no\_ca** va tout à fait à l'encontre de l'idée que l'on peut se faire de l'authentification (mais peut tout de même être utilisé pour établir des pages de test SSL, etc...).

**Exemple**

```apache
SSLProxyVerify require
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
