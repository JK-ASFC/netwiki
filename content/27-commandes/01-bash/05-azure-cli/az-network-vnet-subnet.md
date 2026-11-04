---
title: "az network vnet subnet"
description: "Bash — az network vnet subnet (Azure / sous-réseau) : Gère les sous-réseaux d'un réseau virtuel : création, délégation et association de sécurité."
tags: [bash, commande, azure-cli]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Azure CLI |
| **Contexte** | Azure / sous-réseau |
| **Commande type** | `az network vnet subnet create --resource-group rg-prod --vnet-name vnet-prod --name snet-app --address-prefix 10.0.1.0/24` |

## Rôle

Gère les sous-réseaux d'un réseau virtuel : création, délégation et association de sécurité.

## Options

| Option | Rôle |
| --- | --- |
| `create` | crée un sous-réseau |
| `list` | liste les sous-réseaux |
| `--resource-group ‹groupe›` | conteneur logique de la ressource |
| `--name ‹nom›` | nom de la ressource visée |
| `--output ‹format›` | forme de la réponse affichée |
| `--query ‹JMESPath›` | filtre applique côté client |
| `--yes` | supprime la demande de confirmation |

## Exemples

**Ajouter un sous-réseau**

```bash
az network vnet subnet create --resource-group rg-prod --vnet-name vnet-prod --name snet-data --address-prefix 10.0.2.0/24
```

**Lister les sous-réseaux**

```bash
az network vnet subnet list --resource-group rg-prod --vnet-name vnet-prod --output table
```

**Associer un groupe de sécurité**

```bash
az network vnet subnet update --resource-group rg-prod --vnet-name vnet-prod --name snet-app --network-security-group nsg-app
```

## Dans les autres shells

- [[27-commandes/03-macos/05-azure-cli/az-network-vnet-subnet|az network vnet subnet (macOS)]]

*Mots-clés : azure sous-réseau subnet vnet préfixe délégation nsg table routage point terminaison*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
