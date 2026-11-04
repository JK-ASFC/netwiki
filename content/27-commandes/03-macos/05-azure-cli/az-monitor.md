---
title: "az monitor"
description: "macOS — az monitor (Azure / supervision) : Consulte les métriques, les journaux et les alertes de supervision des ressources Azure."
tags: [macos, commande, azure-cli]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Azure CLI |
| **Contexte** | Azure / supervision |
| **Commande type** | `az monitor metrics list --resource RESOURCE_ID --metric "Percentage CPU"` |

## Rôle

Consulte les métriques, les journaux et les alertes de supervision des ressources Azure.

## Options

| Option | Rôle |
| --- | --- |
| `log-analytics query` | interroge un espace de travail |
| `alert-rule create` | crée une règle d'alerte |
| `action-group create` | crée un groupe d'action |
| `diagnostic-settings create` | active l'envoi des journaux |
| `--resource-group ‹groupe›` | conteneur logique de la ressource |
| `--output ‹format›` | forme de la réponse affichée |
| `--query ‹JMESPath›` | filtre applique côté client |

## Exemples

**Charge processeur d'une VM**

```zsh
az monitor metrics list --resource RESOURCE_ID --metric "Percentage CPU" --interval PT1H --output table
```

**Métriques disponibles**

```zsh
az monitor metrics list-definitions --resource RESOURCE_ID --output table
```

**Activer les journaux**

```zsh
az monitor diagnostic-settings create --name diag --resource RESOURCE_ID --workspace WORKSPACE_ID --logs "[{category:AuditEvent,enabled:true}]"
```

## Dans les autres shells

- [[27-commandes/01-bash/05-azure-cli/az-monitor|az monitor (Bash)]]

*Mots-clés : azure monitor supervision métrique alerte journal log analytics diagnostic seuil action*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
