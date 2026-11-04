---
title: "az network nsg"
description: "macOS — az network nsg (Azure / groupe de sécurité) : Gère les groupes de sécurité réseau, le pare-feu applique aux sous-réseaux et aux cartes réseau."
tags: [macos, commande, azure-cli]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Azure CLI |
| **Contexte** | Azure / groupe de sécurité |
| **Commande type** | `az network nsg create --resource-group rg-prod --name nsg-app` |

## Rôle

Gère les groupes de sécurité réseau, le pare-feu applique aux sous-réseaux et aux cartes réseau.

## Options

| Option | Rôle |
| --- | --- |
| `create` | crée un groupe de sécurité |
| `list` | liste les groupes de sécurité |
| `show` | affiche un groupe et ses règles |
| ⚠️ `delete` | supprime un groupe de sécurité |
| `--resource-group ‹groupe›` | conteneur logique de la ressource |
| `--name ‹nom›` | nom de la ressource visée |
| `--location ‹region›` | région Azure d'hébergement |
| `--output ‹format›` | forme de la réponse affichée |
| `--query ‹JMESPath›` | filtre applique côté client |
| `--yes` | supprime la demande de confirmation |

> [!WARNING]
> Options à manier avec précaution : `delete`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Créer un groupe**

```zsh
az network nsg create --resource-group rg-prod --name nsg-app
```

**Autoriser HTTPS**

```zsh
az network nsg rule create --resource-group rg-prod --nsg-name nsg-app --name autoriser-https --priority 200 --destination-port-ranges 443 --access Allow --protocol Tcp
```

**Voir toutes les règles**

```zsh
az network nsg rule list --resource-group rg-prod --nsg-name nsg-app --include-default --output table
```

## Dans les autres shells

- [[27-commandes/01-bash/05-azure-cli/az-network-nsg|az network nsg (Bash)]]

*Mots-clés : azure nsg sécurité pare-feu règle filtrage port priorité entrant sortant flux*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
