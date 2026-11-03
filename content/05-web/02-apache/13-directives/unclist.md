---
title: "UNCList"
description: "Directive Apache UNCList (core) — Définit quels sont les noms d'hôte UNC auxquels le serveur peut accéder. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit quels sont les noms d'hôte UNC auxquels le serveur peut accéder |
| **Syntaxe** | `UNCList hostname [hostname...]` |
| **Valeur par défaut** | `unset` |
| **Contexte** | configuration du serveur |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | Windows seulement. Disponible à partir de la version 2.4.60 du serveur HTTP Apache. |

## Utilisation

Au cours de leur traitement, les requêtes pour accéder à un chemin du système de fichiers qui aboutissent à un chemin UNC échoueront si le nom d'hôte dans le chemin UNC n'a pas été spécifié par cette directive. Le but est de limiter l'accès aux chemins dérivés d'entrées non fiables.

```apache
UNCList example.com other.example.com
```

> [!WARNING]
> **Sécurité**
>
> Les valeurs spécifiées par cette directive ne sont vérifiées que par certaines composantes du serveur, avant d'accéder à des chemins du système de fichiers qui peuvent dériver par inadvertance d'entrées non fiables.
>
> Les systèmes Windows doivent être isolés au niveau de la couche réseau pour éviter les appels SMB/NTLM sortants vers des destinations inattendues, à titre de mesure plus complète et préventive.

> [!WARNING]
> **Ordre des directives**
>
> Cette directive doit être placée avant les chemins UNC utilisés dans le fichier httpd.conf. Plusieurs occurences de la directive redéfinissent la liste.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
