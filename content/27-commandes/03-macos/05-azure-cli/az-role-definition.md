---
title: "az role definition"
description: "macOS — az role definition (Azure / définitions de rôles) : Consulte les rôles intégrés et crée des rôles personnalisés."
tags: [macos, commande, azure-cli]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Azure CLI |
| **Contexte** | Azure / définitions de rôles |
| **Commande type** | `az role definition list --name Contributor` |

## Rôle

Consulte les rôles intégrés et crée des rôles personnalisés.

## Options

| Option | Rôle |
| --- | --- |
| `list` | liste les rôles disponibles |
| `create` | crée un rôle personnalisé |
| `--output ‹format›` | forme de la réponse affichée |
| `--query ‹JMESPath›` | filtre applique côté client |

## Exemples

**Voir les actions d'un rôle**

```zsh
az role definition list --name Contributor --query "[].permissions" --output json
```

**Lister les rôles intégrés**

```zsh
az role definition list --query "[?roleType=='BuiltInRole'].roleName" --output tsv
```

**Créer un rôle personnalisé**

```zsh
az role definition create --role-definition role-perso.json
```

## Dans les autres shells

- [[27-commandes/01-bash/05-azure-cli/az-role-definition|az role definition (Bash)]]

*Mots-clés : azure définition rôle intégré personnalisé action permission json portée*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
