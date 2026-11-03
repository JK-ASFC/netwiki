---
title: "H2MaxSessionStreams"
description: "Directive Apache H2MaxSessionStreams (mod_http2) — Nombre maximal de flux actifs par session HTTP/2. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_http2]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nombre maximal de flux actifs par session HTTP/2. |
| **Syntaxe** | `H2MaxSessionStreams n` |
| **Valeur par défaut** | `H2MaxSessionStreams 100` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_http2\|mod_http2]] |

## Utilisation

Cette directive permet de définir le nombre maximal de flux actifs par session (connexion) HTTP/2 accepté par le serveur. Selon la RFC 7540, un flux est considéré comme actif s'il n'est ni `en attente` ni `fermé`.

**Exemple**

```apache
H2MaxSessionStreams 20
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
