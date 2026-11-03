---
title: "SSLProxyCheckPeerExpire"
description: "Directive Apache SSLProxyCheckPeerExpire (mod_ssl) — Configuration de la vérification de l'expiration du certificat du serveur distant. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Configuration de la vérification de l'expiration du certificat du serveur distant |
| **Syntaxe** | `SSLProxyCheckPeerExpire on\|off` |
| **Valeur par défaut** | `SSLProxyCheckPeerExpire on` |
| **Contexte** | configuration du serveur, serveur virtuel, proxy section |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Le contexte d'une section proxy est supporté à partir de la version 2.4.30 du serveur HTTP Apache |

## Utilisation

Cette directive permet de définir si l'expiration du certificat du serveur distant doit être vérifiée ou non. Si la vérification échoue, un code d'état 502 (Bad Gateway) est envoyé.

**Exemple**

```apache
SSLProxyCheckPeerExpire on
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
