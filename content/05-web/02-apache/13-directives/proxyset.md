---
title: "ProxySet"
description: "Directive Apache ProxySet (mod_proxy) — Définit différents paramètres relatifs à la répartition de charge des mandataires et aux membres des groupes de répartition de charge. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit différents paramètres relatifs à la répartition de charge des mandataires et aux membres des groupes de répartition de charge |
| **Syntaxe** | `ProxySet url clé=valeur [clé=valeur ...]` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy\|mod_proxy]] |
| **Compatibilité** | ProxySet n'est disponible que depuis la version 2.2 du serveur HTTP Apache. |

## Utilisation

Cette directive propose une méthode alternative pour définir tout paramètre relatif aux répartiteurs de charge et serveurs cibles de mandataires normalement définis via la directive [[13-directives/proxypass|ProxyPass]]. Si elle se trouve dans un conteneur `<Proxy url de répartiteur|url de serveur cible>`, l'argument *url* n'est pas nécessaire. Comme effet de bord, le répartiteur ou serveur cible respectif est créé. Ceci peut s'avérer utile pour la mise en oeuvre d'un mandataire inverse via une directive [[13-directives/rewriterule|RewriteRule]] au lieu de [[13-directives/proxypass|ProxyPass]].

```apache
<Proxy "balancer://hotcluster">
    BalancerMember "http://www2.example.com:8080" loadfactor=1
    BalancerMember "http://www3.example.com:8080" loadfactor=2
    ProxySet lbmethod=bytraffic
</Proxy>
```

```apache
<Proxy "http://backend">
    ProxySet keepalive=On
</Proxy>
```

```apache
ProxySet "balancer://foo" lbmethod=bytraffic timeout=15
```

```apache
ProxySet "ajp://backend:7001" timeout=15
```

> [!WARNING]
> **Avertissement**
>
> Gardez à l'esprit qu'une même clé de paramètre peut avoir différentes significations selon qu'elle s'applique à un répartiteur ou à un serveur cible, et ceci est illustré par les deux exemples précédents où il est question d'un timeout.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
