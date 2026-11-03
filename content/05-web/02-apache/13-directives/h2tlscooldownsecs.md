---
title: "H2TLSCoolDownSecs"
description: "Directive Apache H2TLSCoolDownSecs (mod_http2) — Durée d'inactivité d'une connexion TLS avant diminution de la taille des paquets. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_http2]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Durée d'inactivité d'une connexion TLS avant diminution de la taille des paquets |
| **Syntaxe** | `H2TLSCoolDownSecs seconds` |
| **Valeur par défaut** | `H2TLSCoolDownSecs 1` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_http2\|mod_http2]] |
| **Compatibilité** | Disponible à partir de la version 2.4.18 du serveur HTTP Apache. |

## Utilisation

Cette directive permet de spécifier le nombre de secondes avant lequel une connexion TLS inactive va diminuer la taille des paquets de données à une valeur inférieure (~1300 octets). Elle peut être définie au niveau du serveur principal ou pour un `<serveur virtuel>` spécifique.

Voir la directive [[13-directives/h2tlswarmupsize|H2TLSWarmUpSize]] pour une description du "préchauffage" de TLS. La directive `H2TLSCoolDownSecs` met en lumière le fait que les connexions peuvent se détériorer au bout d'un certain temps (et au fur et à mesure des corrections du flux TCP), et cela même si elle sont inactives. Pour ne pas détériorer les performances d'une manière générale, il est par conséquent préférable de revenir à la phase de préchauffage lorsqu'aucune donnée n'a été transmise pendant un certain nombre de secondes.

Dans les situations où les connexions peuvent être considérées comme fiables, ce délai peut être désactivé en définissant cette directive à 0.

Dans l'exemple suivant, la directive est définie à 0, ce qui désactive tout retour à une phase de préchauffage des connexions TLS. Les connexions TLS déjà préchauffées conservent donc toujours leur taille de paquet de données maximale.

**Exemple**

```apache
H2TLSCoolDownSecs 0
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
