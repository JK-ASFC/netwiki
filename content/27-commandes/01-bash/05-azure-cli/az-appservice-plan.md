---
title: "az appservice plan"
description: "Bash — az appservice plan (Azure / plan App Service) : Gère les plans App Service : la capacité et le coût sur lesquels reposent les applications web et les fonctions."
tags: [bash, commande, azure-cli]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Azure CLI |
| **Contexte** | Azure / plan App Service |
| **Commande type** | `az appservice plan create --resource-group rg-prod --name plan-prod --sku B1` |

## Rôle

Gère les plans App Service : la capacité et le coût sur lesquels reposent les applications web et les fonctions.

## Options

| Option | Rôle |
| --- | --- |
| `create` | crée un plan App Service |
| `list` | liste les plans |
| `update` | modifie un plan |
| ⚠️ `delete` | supprime un plan |
| `--sku ‹reference›` | catégorie tarifaire |
| `--number-of-workers ‹instances›` | nombre d'instances |
| `--is-linux` | crée un plan Linux |
| `--resource-group ‹groupe›` | conteneur logique de la ressource |
| `--name ‹nom›` | nom de la ressource visée |
| `--location ‹region›` | région Azure d'hébergement |
| `--output ‹format›` | forme de la réponse affichée |
| `--query ‹JMESPath›` | filtre applique côté client |
| `--yes` | supprime la demande de confirmation |

> [!WARNING]
> Options à manier avec précaution : `delete`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Créer un plan**

```bash
az appservice plan create --resource-group rg-prod --name plan-prod --sku B1 --is-linux
```

**Compter les applications par plan**

```bash
az appservice plan list --query "[].{nom:name, applications:numberOfSites}" --output table
```

**Monter en gamme**

```bash
az appservice plan update --resource-group rg-prod --name plan-prod --sku S1
```

## Dans les autres shells

- [[27-commandes/03-macos/05-azure-cli/az-appservice-plan|az appservice plan (macOS)]]

*Mots-clés : azure plan appservice capacité sku instance linux windows mise échelle coût*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
