---
title: "SSLProxyCheckPeerCN"
description: "Directive Apache SSLProxyCheckPeerCN (mod_ssl) — Configuration de la vérification du champ CN du certificat du serveur distant. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Configuration de la vérification du champ CN du certificat du serveur distant |
| **Syntaxe** | `SSLProxyCheckPeerCN on\|off` |
| **Valeur par défaut** | `SSLProxyCheckPeerCN on` |
| **Contexte** | configuration du serveur, serveur virtuel, proxy section |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Le contexte d'une section proxy est supporté à partir de la version 2.4.30 du serveur HTTP Apache |

## Utilisation

Cette directive permet de définir si le champ CN du certificat du serveur distant doit être comparé au nom de serveur de l'URL de la requête. S'ils ne correspondent pas, un code d'état 502 (Bad Gateway) est envoyé. A partir de la version 2.4.5, SSLProxyCheckPeerCN a été remplacé par [[13-directives/sslproxycheckpeername|SSLProxyCheckPeerName]].

De la version 2.4.5 à la version 2.4.20, spécifier `SSLProxyCheckPeerName off` était suffisant pour obtenir ce comportement (car la valeur par défaut de `SSLProxyCheckPeerCN` était `on`). Avec ces versions, les deux directives doivent être définies à `off` pour éviter toute validation du nom de certificat du serveur distant, et de nombreux utilisateurs ont signalé ce comportement comme très perturbant.

A partir de la version 2.4.21, toutes les configurations qui activent au moins une des deux directives `SSLProxyCheckPeerName` ou `SSLProxyCheckPeerCN` adopteront le nouveau comportement de la directive [[13-directives/sslproxycheckpeername|SSLProxyCheckPeerName]], et toutes les configurations qui désactivent une des deux directives `SSLProxyCheckPeerName` ou `SSLProxyCheckPeerCN` éviteront toute validation du nom de certificat du serveur distant. Seule la configuration suivante permettra de retrouver la comparaison de CN traditionnelle pour les versions 2.4.21 et supérieures :

**Exemple**

```apache
SSLProxyCheckPeerCN on
SSLProxyCheckPeerName off
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
