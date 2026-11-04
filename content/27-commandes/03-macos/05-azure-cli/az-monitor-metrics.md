---
title: "az monitor metrics"
description: "macOS — az monitor metrics (Azure / métriques) : Relève les métriques de plateforme d'une ressource et liste celles disponibles."
tags: [macos, commande, azure-cli]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Azure CLI |
| **Contexte** | Azure / métriques |
| **Commande type** | `az monitor metrics list --resource RESOURCE_ID --metric "Percentage CPU"` |

## Rôle

Relève les métriques de plateforme d'une ressource et liste celles disponibles.

## Options

| Option | Rôle |
| --- | --- |
| `list` | consulte des métriques |
| `list-definitions` | liste les métriques disponibles |
| `--metric ‹metrique›` | métrique à relever |
| `--interval ‹intervalle›` | granularite d'agrégation |
| `--output ‹format›` | forme de la réponse affichée |
| `--query ‹JMESPath›` | filtre applique côté client |

## Exemples

**Charge processeur**

```zsh
az monitor metrics list --resource RESOURCE_ID --metric "Percentage CPU" --interval PT1H --output table
```

**Métriques disponibles**

```zsh
az monitor metrics list-definitions --resource RESOURCE_ID --output table
```

## Dans les autres shells

- [[27-commandes/01-bash/05-azure-cli/az-monitor-metrics|az monitor metrics (Bash)]]

*Mots-clés : azure métrique monitor supervision cpu mémoire agrégation intervalle définition*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
