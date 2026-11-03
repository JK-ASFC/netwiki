---
title: "H2SerializeHeaders"
description: "Directive Apache H2SerializeHeaders (mod_http2) — Active/désactive la sérialisation du traitement des requêtes/réponses. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_http2]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active/désactive la sérialisation du traitement des requêtes/réponses |
| **Syntaxe** | `H2SerializeHeaders on\|off` |
| **Valeur par défaut** | `H2SerializeHeaders off` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_http2\|mod_http2]] |

## Utilisation

Cette directive permet de définir si les requêtes HTTP/2 doivent être sérialisées au format HTTP/1.1 pour être traitées par le noyau de `httpd`, ou si les données binaires reçues doivent être passées directement aux `request_rec`s.

La sérialisation dégrade les performances, mais garantit une meilleure compatibilité ascendante lorsque des filtres ou programmes accroche personnalisés en ont besoin.

**Exemple**

```apache
H2SerializeHeaders on
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
