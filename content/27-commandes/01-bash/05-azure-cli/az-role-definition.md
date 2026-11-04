---
title: "az role definition"
description: "Bash — az role definition (Azure / définitions de rôles) : Consulte les rôles intégrés et crée des rôles personnalisés."
tags: [bash, commande, azure-cli]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
az role definition list --name Contributor --query "[].permissions" --output json
```

**Lister les rôles intégrés**

```bash
az role definition list --query "[?roleType=='BuiltInRole'].roleName" --output tsv
```

**Créer un rôle personnalisé**

```bash
az role definition create --role-definition role-perso.json
```

## Dans les autres shells

- [[27-commandes/03-macos/05-azure-cli/az-role-definition|az role definition (macOS)]]

*Mots-clés : azure définition rôle intégré personnalisé action permission json portée*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
