---
title: "az acr repository"
description: "Bash — az acr repository (Azure / dépôts d'images) : Inspecte et nettoie les dépôts d'images d'un registre de conteneurs."
tags: [bash, commande, azure-cli]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Azure CLI |
| **Contexte** | Azure / dépôts d'images |
| **Commande type** | `az acr repository list --name acrprod` |

## Rôle

Inspecte et nettoie les dépôts d'images d'un registre de conteneurs.

## Options

| Option | Rôle |
| --- | --- |
| `list` | liste les dépôts |
| ⚠️ `delete` | supprime un dépôt |
| `--name ‹nom›` | nom de la ressource visée |
| `--output ‹format›` | forme de la réponse affichée |
| `--query ‹JMESPath›` | filtre applique côté client |
| `--yes` | supprime la demande de confirmation |

> [!WARNING]
> Options à manier avec précaution : `delete`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Lister les dépôts**

```bash
az acr repository list --name acrprod --output table
```

**Étiquettes d'une image**

```bash
az acr repository show-tags --name acrprod --repository monapp --output table
```

**Supprimer un dépôt**

```bash
az acr repository delete --name acrprod --repository ancienne-app --yes
```

## Dans les autres shells

- [[27-commandes/03-macos/05-azure-cli/az-acr-repository|az acr repository (macOS)]]

*Mots-clés : azure acr dépôt repository image étiquette tag manifeste suppression purge*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
