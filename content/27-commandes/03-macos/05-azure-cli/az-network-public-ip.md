---
title: "az network public-ip"
description: "macOS — az network public-ip (Azure / adresse publique) : Gère les adresses IP publiques, leur mode d'allocation et leur référence tarifaire."
tags: [macos, commande, azure-cli]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Azure CLI |
| **Contexte** | Azure / adresse publique |
| **Commande type** | `az network public-ip create --resource-group rg-prod --name ip-web --sku Standard` |

## Rôle

Gère les adresses IP publiques, leur mode d'allocation et leur référence tarifaire.

## Options

| Option | Rôle |
| --- | --- |
| `create` | crée une adresse publique |
| `list` | liste les adresses publiques |
| `show` | affiche une adresse |
| ⚠️ `delete` | supprime une adresse |
| `update` | modifie une adresse |
| `--sku ‹reference›` | catégorie de l'adresse |
| `--allocation-method ‹methode›` | attribution statique ou dynamique |
| `--dns-name ‹etiquette›` | étiquette DNS publique |
| `--resource-group ‹groupe›` | conteneur logique de la ressource |
| `--name ‹nom›` | nom de la ressource visée |
| `--location ‹region›` | région Azure d'hébergement |
| `--output ‹format›` | forme de la réponse affichée |
| `--query ‹JMESPath›` | filtre applique côté client |
| `--yes` | supprime la demande de confirmation |

> [!WARNING]
> Options à manier avec précaution : `delete`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Adresse statique Standard**

```zsh
az network public-ip create --resource-group rg-prod --name ip-web --sku Standard --allocation-method Static
```

**Adresses inutilisées**

```zsh
az network public-ip list --query "[?ipConfiguration==null].name" --output tsv
```

**Avec nom DNS**

```zsh
az network public-ip create --resource-group rg-prod --name ip-web --sku Standard --dns-name monappli-prod
```

## Dans les autres shells

- [[27-commandes/01-bash/05-azure-cli/az-network-public-ip|az network public-ip (Bash)]]

*Mots-clés : azure adresse publique ip statique dynamique sku standard basic zone dns*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
