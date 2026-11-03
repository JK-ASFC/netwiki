---
title: "ProxyHCTPsize"
description: "Directive Apache ProxyHCTPsize (mod_proxy_hcheck) — Définit la taille totale, pour l'ensemble du serveur, du jeu de threads utilisé pour le check up des équipiers. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy_hcheck]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit la taille totale, pour l'ensemble du serveur, du jeu de threads utilisé pour le check up des équipiers |
| **Syntaxe** | `ProxyHCTPsize size` |
| **Valeur par défaut** | `ProxyHCTPsize 16` |
| **Contexte** | configuration du serveur |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy_hcheck\|mod_proxy_hcheck]] |

## Utilisation

Si Apache httpd et APR ont été compilés avec le support des threads, le module de check up peut confier ce travail à un jeu de threads associé au processus Watchdog, ce qui permet l'exécution des check up en parallèle. La directive `ProxyHCTPsize` permet de déterminer la taille de ce jeu de threads. Une valeur de `0` signifie qu'aucun jeu de threads ne sera utilisé, et le check up des différents équipiers sera alors effectué séquentiellement.

**ProxyHCTPsize**

```apache
ProxyHCTPsize 32
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
