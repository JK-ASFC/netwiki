---
title: "LimitRequestFields"
description: "Directive Apache LimitRequestFields (core) — Limite le nombre de champs d'en-tête autorisés dans une requête HTTP. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Limite le nombre de champs d'en-tête autorisés dans une requête HTTP |
| **Syntaxe** | `LimitRequestFields nombre` |
| **Valeur par défaut** | `LimitRequestFields 100` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

*nombre* est un entier de 0 à 32767. La valeur 0 signifie un nombre de champs illimité. La valeur par défaut est définie à la compilation par la constante `DEFAULT_LIMIT_REQUEST_FIELDS` (100 selon la distribution).

La directive `LimitRequestFields` permet à l'administrateur du serveur de modifier le nombre maximum de champs d'en-tête autorisés dans une requête HTTP. Pour un serveur, cette valeur doit être supérieure au nombre de champs qu'une requête client normale peut contenir. Le nombre de champs d'en-tête d'une requête qu'un client utilise dépasse rarement 20, mais ce nombre peut varier selon les implémentations des clients, et souvent en fonction des extensions que les utilisateurs configurent dans leurs navigateurs pour supporter la négociation de contenu détaillée. Les extensions HTTP optionnelles utilisent souvent les champs d'en-tête des requêtes.

L'administrateur du serveur peut utiliser cette directive pour contrôler plus efficacement les comportements anormaux des requêtes des clients, ce qui lui permettra de prévenir certaines formes d'attaques par déni de service. La valeur spécifiée doit être augmentée si les clients standards reçoivent une erreur du serveur indiquant que la requête comportait un nombre d'en-têtes trop important.

Par exemple :

```apache
LimitRequestFields 50
```

> [!WARNING]
> **Avertissement**
>
> Dans le cas des serveurs virtuels à base de noms, la valeur de cette directive est extraite du serveur virtuel par défaut (le premier de la liste) pour la paire adresse IP/port.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
