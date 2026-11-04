---
title: "az resource"
description: "Bash — az resource (Azure / ressources génériques) : Agit sur n'importe quelle ressource Azure, y compris celles sans commande dédiée dans la CLI."
tags: [bash, commande, azure-cli]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Azure CLI |
| **Contexte** | Azure / ressources génériques |
| **Commande type** | `az resource list --resource-group rg-prod` |

## Rôle

Agit sur n'importe quelle ressource Azure, y compris celles sans commande dédiée dans la CLI.

## Options

| Option | Rôle |
| --- | --- |
| `list` | liste les ressources |
| `show` | affiche une ressource |
| ⚠️ `delete` | supprime une ressource |
| `update` | modifie une propriété |
| `move` | déplace vers un autre groupe |
| `tag` | applique des étiquettes |
| `wait` | attend un état |
| `--resource-type ‹type›` | type de la ressource |
| `--ids ‹identifiants›` | identifiants complets |
| `--resource-group ‹groupe›` | conteneur logique de la ressource |
| `--name ‹nom›` | nom de la ressource visée |
| `--location ‹region›` | région Azure d'hébergement |
| `--tags ‹cle=valeur›` | étiquettes de classement |
| `--output ‹format›` | forme de la réponse affichée |
| `--query ‹JMESPath›` | filtre applique côté client |
| `--yes` | supprime la demande de confirmation |

> [!WARNING]
> Options à manier avec précaution : `delete`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Inventaire complet**

```bash
az resource list --output table
```

**Compter par type**

```bash
az resource list --query "[].type" --output tsv
```

**Étiqueter en masse**

```bash
az resource list --resource-group rg-prod --query "[].id" --output tsv
```

## Dans les autres shells

- [[27-commandes/03-macos/05-azure-cli/az-resource|az resource (macOS)]]

*Mots-clés : azure ressource générique inventaire étiquette déplacement type api audit universel*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
