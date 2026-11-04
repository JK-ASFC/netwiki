---
title: "az ad"
description: "macOS — az ad (Azure / Entra ID) : Gère les objets d'annuaire Entra ID : utilisateurs, groupes, applications et principaux de service."
tags: [macos, commande, azure-cli]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Azure CLI |
| **Contexte** | Azure / Entra ID |
| **Commande type** | `az ad sp create-for-rbac --name mon-app` |

## Rôle

Gère les objets d'annuaire Entra ID : utilisateurs, groupes, applications et principaux de service.

## Options

| Option | Rôle |
| --- | --- |
| `app create` | crée une inscription d'application |
| `user list` | liste les utilisateurs |
| `group create` | crée un groupe |
| `signed-in-user show` | affiche le compte connecte |
| `--output ‹format›` | forme de la réponse affichée |
| `--query ‹JMESPath›` | filtre applique côté client |

## Exemples

**Créer un compte applicatif**

```zsh
az ad sp create-for-rbac --name mon-app --role Contributor --scopes /subscriptions/ID/resourceGroups/rg-prod
```

**Mon identifiant d'objet**

```zsh
az ad signed-in-user show --query id --output tsv
```

**Régénérer un secret**

```zsh
az ad sp credential reset --id APP_ID
```

## Dans les autres shells

- [[27-commandes/01-bash/05-azure-cli/az-ad|az ad (Bash)]]

*Mots-clés : azure ad entra annuaire utilisateur groupe application principal service secret credential*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
