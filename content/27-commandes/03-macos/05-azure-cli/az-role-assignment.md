---
title: "az role assignment"
description: "macOS — az role assignment (Azure / attributions de rôles) : Attribue, audite et retire les rôles RBAC sur une portée donnée."
tags: [macos, commande, azure-cli]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Azure CLI |
| **Contexte** | Azure / attributions de rôles |
| **Commande type** | `az role assignment create --assignee user@exemple.fr --role Reader --resource-group rg-prod` |

## Rôle

Attribue, audite et retire les rôles RBAC sur une portée donnée.

## Options

| Option | Rôle |
| --- | --- |
| `create` | attribue un rôle |
| `list` | liste les attributions |
| ⚠️ `delete` | retire une attribution |
| `--assignee ‹identite›` | beneficiaire du rôle |
| `--role ‹role›` | rôle attribue |
| `--scope ‹portee›` | niveau d'application du rôle |
| `--output ‹format›` | forme de la réponse affichée |
| `--query ‹JMESPath›` | filtre applique côté client |
| `--yes` | supprime la demande de confirmation |

> [!WARNING]
> Options à manier avec précaution : `delete`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Donner un accès en lecture**

```zsh
az role assignment create --assignee alice@exemple.fr --role Reader --resource-group rg-prod
```

**Auditer un compte**

```zsh
az role assignment list --assignee alice@exemple.fr --all --output table
```

**Retirer un accès**

```zsh
az role assignment delete --assignee alice@exemple.fr --role Reader --resource-group rg-prod
```

## Dans les autres shells

- [[27-commandes/01-bash/05-azure-cli/az-role-assignment|az role assignment (Bash)]]

*Mots-clés : azure attribution rôle rbac assignée portée scope permission audit héritage*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
