---
title: "LimitRequestLine"
description: "Directive Apache LimitRequestLine (core) — Définit la taille maximale d'une ligne de requête HTTP. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit la taille maximale d'une ligne de requête HTTP |
| **Syntaxe** | `LimitRequestLine octets` |
| **Valeur par défaut** | `LimitRequestLine 8190` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

Cette directive permet de définir la taille maximale autorisée pour une ligne de requête HTTP en *octets*.

La directive `LimitRequestLine` permet à l'administrateur du serveur de définir la taille maximale autorisée d'une ligne de requête HTTP client. Comme une requête comporte une méthode HTTP, un URI, et une version de protocole, la directive `LimitRequestLine` impose une restriction sur la longueur maximale autorisée pour un URI dans une requête au niveau du serveur. Pour un serveur, cette valeur doit être suffisamment grande pour référencer les noms de toutes ses ressources, y compris toutes informations pouvant être ajoutées dans la partie requête d'une méthode `GET`.

L'administrateur du serveur peut utiliser cette directive pour contrôler plus efficacement les comportements anormaux des requêtes des clients, ce qui lui permettra de prévenir certaines formes d'attaques par déni de service.

Par exemple :

```apache
LimitRequestLine 4094
```

> [!NOTE]
> Dans des conditions normales, cette directive doit conserver sa valeur par défaut.

> [!WARNING]
> **Avertissement**
>
> Dans le cas des serveurs virtuels à base de noms, la valeur de cette directive est extraite du serveur virtuel par défaut (le premier de la liste) pour lequel la paire adresse IP/port correspond le mieux.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
