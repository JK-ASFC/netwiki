---
title: "az acr"
description: "Bash — az acr (Azure / registre de conteneurs) : Gère un registre d'images de conteneurs privé : connexion, construction, listage et purge."
tags: [bash, commande, azure-cli]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Azure CLI |
| **Contexte** | Azure / registre de conteneurs |
| **Commande type** | `az acr create --resource-group rg-prod --name acrprod --sku Basic` |

## Rôle

Gère un registre d'images de conteneurs privé : connexion, construction, listage et purge.

## Options

| Option | Rôle |
| --- | --- |
| `create` | crée un registre |
| `login` | authentifie le client Docker |
| `build` | construit une image dans Azure |
| `run` | exécute une tâche dans le registre |
| `--sku ‹reference›` | catégorie du registre |
| `--admin-enabled ‹booleen›` | compte administrateur du registre |
| `--resource-group ‹groupe›` | conteneur logique de la ressource |
| `--name ‹nom›` | nom de la ressource visée |
| `--location ‹region›` | région Azure d'hébergement |
| `--output ‹format›` | forme de la réponse affichée |
| `--query ‹JMESPath›` | filtre applique côté client |
| `--yes` | supprime la demande de confirmation |

## Exemples

**Créer un registre**

```bash
az acr create --resource-group rg-prod --name acrprod --sku Basic
```

**Se connecter**

```bash
az acr login --name acrprod
```

**Construire sans Docker local**

```bash
az acr build --registry acrprod --image monapp:1.0 .
```

**Lister les étiquettes**

```bash
az acr repository show-tags --name acrprod --repository monapp --output table
```

## Dans les autres shells

- [[27-commandes/03-macos/05-azure-cli/az-acr|az acr (macOS)]]

*Mots-clés : azure acr registre conteneur image docker build push tag repository purge sku*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
