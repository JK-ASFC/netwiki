---
title: "az group"
description: "macOS — az group (Azure / groupes de ressources) : Gère les groupes de ressources, unité de regroupement et de suppression de tout déploiement Azure."
tags: [macos, commande, azure-cli]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Azure CLI |
| **Contexte** | Azure / groupes de ressources |
| **Commande type** | `az group create --name rg-prod --location francecentral` |

## Rôle

Gère les groupes de ressources, unité de regroupement et de suppression de tout déploiement Azure.

## Options

| Option | Rôle |
| --- | --- |
| `create` | crée un groupe de ressources |
| `list` | liste les groupes |
| `show` | affiche un groupe |
| ⚠️ `delete` | supprime le groupe et TOUT son contenu |
| `exists` | teste l'existence d'un groupe |
| `export` | exporte le groupe en modèle ARM |
| `wait` | attend un état donne |
| `--name ‹nom›` | nom de la ressource visée |
| `--location ‹region›` | région Azure d'hébergement |
| `--tags ‹cle=valeur›` | étiquettes de classement |
| `--output ‹format›` | forme de la réponse affichée |
| `--query ‹JMESPath›` | filtre applique côté client |
| `--yes` | supprime la demande de confirmation |
| `--no-wait` | rend la main sans attendre la fin |
| `--subscription ‹abonnement›` | abonnement à cibler ponctuellement |

> [!WARNING]
> Options à manier avec précaution : `delete`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Créer un groupe**

```zsh
az group create --name rg-prod --location francecentral
```

**Lister avec étiquettes**

```zsh
az group list --query "[].{nom:name, region:location}" --output table
```

**Supprimer sans confirmation**

```zsh
az group delete --name rg-test --yes --no-wait
```

**Exporter en modèle**

```zsh
az group export --name rg-prod > modele.json
```

## Dans les autres shells

- [[27-commandes/01-bash/05-azure-cli/az-group|az group (Bash)]]

*Mots-clés : azure groupe ressource resource group création suppression verrou export modèle*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
