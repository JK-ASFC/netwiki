---
title: "az identity"
description: "macOS — az identity (Azure / identités managees) : Gère les identités managees, qui permettent à une ressource Azure de s'authentifier sans aucun secret."
tags: [macos, commande, azure-cli]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Azure CLI |
| **Contexte** | Azure / identités managees |
| **Commande type** | `az identity create --resource-group rg-prod --name id-app` |

## Rôle

Gère les identités managees, qui permettent à une ressource Azure de s'authentifier sans aucun secret.

## Options

| Option | Rôle |
| --- | --- |
| `create` | crée une identité managée |
| `list` | liste les identités |
| `show` | affiche une identité |
| ⚠️ `delete` | supprime une identité |
| `--resource-group ‹groupe›` | conteneur logique de la ressource |
| `--name ‹nom›` | nom de la ressource visée |
| `--location ‹region›` | région Azure d'hébergement |
| `--output ‹format›` | forme de la réponse affichée |
| `--query ‹JMESPath›` | filtre applique côté client |
| `--yes` | supprime la demande de confirmation |

> [!WARNING]
> Options à manier avec précaution : `delete`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Créer une identité**

```zsh
az identity create --resource-group rg-prod --name id-app
```

**Récupérer principalId**

```zsh
az identity show --resource-group rg-prod --name id-app --query principalId --output tsv
```

**Lui donner un rôle**

```zsh
az role assignment create --assignee OBJECT_ID --role "Key Vault Secrets User" --scope /subscriptions/ID/resourceGroups/rg-prod
```

## Dans les autres shells

- [[27-commandes/01-bash/05-azure-cli/az-identity|az identity (Bash)]]

*Mots-clés : azure identité managée managed identity sans secret principal objet client attribution*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
