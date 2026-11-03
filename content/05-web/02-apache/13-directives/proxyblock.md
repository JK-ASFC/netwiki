---
title: "ProxyBlock"
description: "Directive Apache ProxyBlock (mod_proxy) — Termes, serveurs ou domaines bloqués par le mandataire. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Termes, serveurs ou domaines bloqués par le mandataire |
| **Syntaxe** | `ProxyBlock *\|terme\|serveur\|domaine [terme\|serveur\|domaine] ...` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy\|mod_proxy]] |

## Utilisation

La directive `ProxyBlock` permet de spécifier une liste de termes, serveurs et/ou domaines, séparés par des espaces. Les requêtes de documents HTTP, HTTPS, FTP vers des sites dont les noms contiennent des termes, noms de serveur ou domaine correspondants seront *bloqués* par le serveur mandataire. La module proxy va aussi tenter de déterminer les adresses IP des éléments de la liste qui peuvent correspondre à des noms d'hôtes au cours du démarrage, et les mettra en cache à des fins de comparaisons ultérieures. Ceci peut ralentir le démarrage du serveur.

**Exemple**

```apache
ProxyBlock "news.example.com" "auctions.example.com" "friends.example.com"
```

Notez qu'`example` suffirait aussi pour atteindre ces sites.

Hosts conviendrait aussi s'il était référencé par adresse IP.

Notez aussi que

```apache
ProxyBlock "*"
```

bloque les connexions vers tous les sites.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
