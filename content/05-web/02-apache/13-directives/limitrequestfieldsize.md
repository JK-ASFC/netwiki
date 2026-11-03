---
title: "LimitRequestFieldSize"
description: "Directive Apache LimitRequestFieldSize (core) — Dédinit la taille maximale autorisée d'un en-tête de requête HTTP. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Dédinit la taille maximale autorisée d'un en-tête de requête HTTP |
| **Syntaxe** | `LimitRequestFieldSize octets` |
| **Valeur par défaut** | `LimitRequestFieldSize 8190` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

Cette directive permet de définir le nombre maximum d'*octets* autorisés dans un en-tête de requête HTTP.

La directive `LimitRequestFieldSize` permet à l'administrateur du serveur de définir la taille maximale autorisée d'un en-tête de requête HTTP. Pour un serveur, cette valeur doit être suffisamment grande pour contenir tout en-tête d'une requête client normale. La taille d'un champ d'en-tête de requête normal va varier selon les implémentations des clients, et en fonction des extensions que les utilisateurs configurent dans leurs navigateurs pour supporter la négociation de contenu détaillée. Les en-têtes d'authentification SPNEGO peuvent atteindre une taille de 12392 octets.

L'administrateur du serveur peut utiliser cette directive pour contrôler plus efficacement les comportements anormaux des requêtes des clients, ce qui lui permettra de prévenir certaines formes d'attaques par déni de service.

Par exemple :

```apache
LimitRequestFieldSize 4094
```

> [!NOTE]
> Dans des conditions normales, la valeur par défaut de cette directive ne doit pas être modifiée.

> [!WARNING]
> **Avertissement**
>
> Dans le cas des serveurs virtuels à base de noms, la valeur de cette directive est extraite du serveur virtuel par défaut (le premier de la liste) pour lequel la paire adresse IP/port correspond le mieux.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
