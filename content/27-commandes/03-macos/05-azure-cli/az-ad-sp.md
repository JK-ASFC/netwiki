---
title: "az ad sp"
description: "macOS — az ad sp (Azure / principaux de service) : Crée et entretient les principaux de service, comptes applicatifs d'Entra ID."
tags: [macos, commande, azure-cli]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Azure CLI |
| **Contexte** | Azure / principaux de service |
| **Commande type** | `az ad sp create-for-rbac --name mon-app` |

## Rôle

Crée et entretient les principaux de service, comptes applicatifs d'Entra ID.

## Options

| Option | Rôle |
| --- | --- |
| `create-for-rbac` | crée un principal de service |
| `list` | liste les principaux de service |
| `credential reset` | regenere le secret d'un principal |
| `--display-name ‹nom›` | nom affiche de l'objet |
| `--years ‹annees›` | durée de validité du secret |
| `--output ‹format›` | forme de la réponse affichée |
| `--query ‹JMESPath›` | filtre applique côté client |

## Exemples

**Créer un compte applicatif**

```zsh
az ad sp create-for-rbac --name mon-app --role Contributor --scopes /subscriptions/ID/resourceGroups/rg-prod
```

**Lister par nom**

```zsh
az ad sp list --display-name mon-app --output table
```

**Régénérer le secret**

```zsh
az ad sp credential reset --id APP_ID
```

## Dans les autres shells

- [[27-commandes/01-bash/05-azure-cli/az-ad-sp|az ad sp (Bash)]]

*Mots-clés : azure principal service sp application secret credential rotation rbac automatisation*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
