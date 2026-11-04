---
title: "az storage account keys"
description: "Bash — az storage account keys (Azure / clés de stockage) : Consulte et fait tourner les clés d'accès d'un compte de stockage."
tags: [bash, commande, azure-cli]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Azure CLI |
| **Contexte** | Azure / clés de stockage |
| **Commande type** | `az storage account keys list --resource-group rg-prod --account-name stprod01` |

## Rôle

Consulte et fait tourner les clés d'accès d'un compte de stockage.

## Options

| Option | Rôle |
| --- | --- |
| `list` | affiche les clés d'accès |
| `renew` | regenere une clé d'accès |
| `--resource-group ‹groupe›` | conteneur logique de la ressource |
| `--output ‹format›` | forme de la réponse affichée |
| `--query ‹JMESPath›` | filtre applique côté client |

## Exemples

**Lister les clés**

```bash
az storage account keys list --resource-group rg-prod --account-name stprod01 --output table
```

**Faire tourner la seconde clé**

```bash
az storage account keys renew --resource-group rg-prod --account-name stprod01 --key secondary
```

**Récupérer une seule clé**

```bash
az storage account keys list --resource-group rg-prod --account-name stprod01 --query "[0].value" --output tsv
```

## Dans les autres shells

- [[27-commandes/03-macos/05-azure-cli/az-storage-account-keys|az storage account keys (macOS)]]

*Mots-clés : azure clé accès stockage rotation renouvellement secret compte connexion*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
