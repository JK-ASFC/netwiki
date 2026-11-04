---
title: "az network vnet"
description: "Bash — az network vnet (Azure / réseau virtuel) : Crée et gère les réseaux virtuels et leurs sous-réseaux, socle d'adressage de toute infrastructure Azure."
tags: [bash, commande, azure-cli]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Azure CLI |
| **Contexte** | Azure / réseau virtuel |
| **Commande type** | `az network vnet create --resource-group rg-prod --name vnet-prod --address-prefix 10.0.0.0/16` |

## Rôle

Crée et gère les réseaux virtuels et leurs sous-réseaux, socle d'adressage de toute infrastructure Azure.

## Options

| Option | Rôle |
| --- | --- |
| `create` | crée un réseau virtuel |
| `list` | liste les réseaux virtuels |
| `show` | affiche un réseau virtuel |
| ⚠️ `delete` | supprime un réseau virtuel |
| `peering create` | crée un appairage entre réseaux |
| `--address-prefix ‹CIDR›` | espace d'adresses du réseau |
| `--subnet-name ‹nom›` | premier sous-réseau crée |
| `--dns-servers ‹adresses›` | résolveurs DNS du réseau |
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

**Créer un réseau avec sous-réseau**

```bash
az network vnet create --resource-group rg-prod --name vnet-prod --address-prefix 10.0.0.0/16 --subnet-name snet-app --subnet-prefix 10.0.1.0/24
```

**Cartographier l'adressage**

```bash
az network vnet list --query "[].{nom:name, espace:addressSpace.addressPrefixes[0]}" --output table
```

**Ajouter un sous-réseau**

```bash
az network vnet subnet create --resource-group rg-prod --vnet-name vnet-prod --name snet-data --address-prefix 10.0.2.0/24
```

## Dans les autres shells

- [[27-commandes/03-macos/05-azure-cli/az-network-vnet|az network vnet (macOS)]]

*Mots-clés : azure réseau virtuel vnet sous-réseau subnet adressage cidr appairage peering*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
