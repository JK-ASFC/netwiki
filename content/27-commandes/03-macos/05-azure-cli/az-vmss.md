---
title: "az vmss"
description: "macOS — az vmss (Azure / groupes identiques) : Gère des groupes de machines identiques, avec mise à l'échelle et mises à jour progressives."
tags: [macos, commande, azure-cli]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Azure CLI |
| **Contexte** | Azure / groupes identiques |
| **Commande type** | `az vmss create --resource-group rg-prod --name vmss-web --image Ubuntu2204` |

## Rôle

Gère des groupes de machines identiques, avec mise à l'échelle et mises à jour progressives.

## Options

| Option | Rôle |
| --- | --- |
| `create` | crée un groupe identique |
| `list` | liste les groupes |
| `scale` | fixe le nombre d'instances |
| `list-instances` | liste les machines du groupe |
| `update-instances` | applique le modèle aux instances |
| ⚠️ `delete` | supprime le groupe et ses instances |
| ⚠️ `restart` | redémarre les instances |
| `--instance-count ‹nombre›` | nombre d'instances initial |
| `--upgrade-policy-mode ‹mode›` | stratégie de mise à niveau |
| `--vm-sku ‹taille›` | référence des instances |
| `--resource-group ‹groupe›` | conteneur logique de la ressource |
| `--name ‹nom›` | nom de la ressource visée |
| `--location ‹region›` | région Azure d'hébergement |
| `--output ‹format›` | forme de la réponse affichée |
| `--query ‹JMESPath›` | filtre applique côté client |
| `--no-wait` | rend la main sans attendre la fin |
| `--yes` | supprime la demande de confirmation |

> [!WARNING]
> Options à manier avec précaution : `delete`, `restart`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Créer un groupe**

```zsh
az vmss create --resource-group rg-prod --name vmss-web --image Ubuntu2204 --instance-count 2 --vm-sku Standard_B2s
```

**Passer a 5 instances**

```zsh
az vmss scale --resource-group rg-prod --name vmss-web --new-capacity 5
```

**Voir les instances**

```zsh
az vmss list-instances --resource-group rg-prod --name vmss-web --output table
```

## Dans les autres shells

- [[27-commandes/01-bash/05-azure-cli/az-vmss|az vmss (Bash)]]

*Mots-clés : azure vmss scale set groupe identique elasticite instances mise échelle équilibrage*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
