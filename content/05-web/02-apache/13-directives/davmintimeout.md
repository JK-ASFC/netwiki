---
title: "DavMinTimeout"
description: "Directive Apache DavMinTimeout (mod_dav) — Durée minimale pendant laquelle le serveur maintient un verrou sur une ressource DAV. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_dav]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Durée minimale pendant laquelle le serveur maintient un verrou sur une ressource DAV |
| **Syntaxe** | `DavMinTimeout secondes` |
| **Valeur par défaut** | `DavMinTimeout 0` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_dav\|mod_dav]] |

## Utilisation

Lorsqu'un client demande le verrouillage d'une ressource DAV, il peut aussi spécifier une durée au bout de laquelle le verrou sera automatiquement supprimé par le serveur. Cette valeur ne constitue qu'une demande, et le serveur peut l'ignorer ou informer le client qu'il va utiliser une valeur arbitraire.

La directive `DavMinTimeout` permet de spécifier, en secondes, la durée minimale de verrouillage à renvoyer au client. Les Répertoires Web de Microsoft présentent une durée par défaut de 120 secondes ; la directive `DavMinTimeout` permet de définir une valeur supérieure (par exemple 600 secondes), afin de réduire les risques de perte du verrou par le client suite à une surcharge du réseau.

**Exemple**

```apache
<Location "/MSWord">
    DavMinTimeout 600
</Location>
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
