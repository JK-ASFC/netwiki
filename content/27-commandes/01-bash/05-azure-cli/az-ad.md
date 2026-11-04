---
title: "az ad"
description: "Bash — az ad (Azure / Entra ID) : Gère les objets d'annuaire Entra ID : utilisateurs, groupes, applications et principaux de service."
tags: [bash, commande, azure-cli]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
az ad sp create-for-rbac --name mon-app --role Contributor --scopes /subscriptions/ID/resourceGroups/rg-prod
```

**Mon identifiant d'objet**

```bash
az ad signed-in-user show --query id --output tsv
```

**Régénérer un secret**

```bash
az ad sp credential reset --id APP_ID
```

## Dans les autres shells

- [[27-commandes/03-macos/05-azure-cli/az-ad|az ad (macOS)]]

*Mots-clés : azure ad entra annuaire utilisateur groupe application principal service secret credential*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
