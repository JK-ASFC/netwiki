---
title: "az account"
description: "Bash — az account (Azure / abonnements) : Consulte et change l'abonnement actif, celui que visent toutes les commandes sans --subscription."
tags: [bash, commande, azure-cli]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Azure CLI |
| **Contexte** | Azure / abonnements |
| **Commande type** | `az account show` |

## Rôle

Consulte et change l'abonnement actif, celui que visent toutes les commandes sans --subscription.

## Options

| Option | Rôle |
| --- | --- |
| `show` | affiche l'abonnement actif |
| `list` | liste les abonnements accessibles |
| `set` | change l'abonnement actif |
| `get-access-token` | récupère un jeton d'accès brut |
| `list-locations` | liste les régions disponibles |
| `clear` | vide le cache des abonnements |
| `--subscription ‹abonnement›` | abonnement à cibler ponctuellement |
| `--output ‹format›` | forme de la réponse affichée |
| `--query ‹JMESPath›` | filtre applique côté client |

## Exemples

**Voir le contexte actif**

```bash
az account show --output table
```

**Lister les abonnements**

```bash
az account list --output table
```

**Basculer d'abonnement**

```bash
az account set --subscription "Production"
```

**Régions disponibles**

```bash
az account list-locations --query "[].name" --output tsv
```

## Dans les autres shells

- [[27-commandes/03-macos/05-azure-cli/az-account|az account (macOS)]]

*Mots-clés : azure account abonnement subscription contexte actif liste jeton locataire*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
