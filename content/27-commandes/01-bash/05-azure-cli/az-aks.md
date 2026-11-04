---
title: "az aks"
description: "Bash — az aks (Azure / Kubernetes) : Gère les clusters Kubernetes managés : création, mise à l'échelle, mise à jour et accès kubectl."
tags: [bash, commande, azure-cli]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Azure CLI |
| **Contexte** | Azure / Kubernetes |
| **Commande type** | `az aks create --resource-group rg-prod --name aks-prod --node-count 3` |

## Rôle

Gère les clusters Kubernetes managés : création, mise à l'échelle, mise à jour et accès kubectl.

## Options

| Option | Rôle |
| --- | --- |
| `create` | crée un cluster Kubernetes |
| `list` | liste les clusters |
| `get-credentials` | récupère la configuration kubectl |
| ⚠️ `delete` | supprime un cluster |
| `scale` | change le nombre de noeuds |
| `upgrade` | met à jour la version de Kubernetes |
| `get-versions` | versions disponibles dans la région |
| `nodepool add` | ajoute un pool de noeuds |
| `--node-count ‹nombre›` | nombre de noeuds |
| `--node-vm-size ‹taille›` | taille des noeuds |
| `--enable-managed-identity` | utilise une identité managée |
| `--network-plugin ‹plugin›` | modèle réseau du cluster |
| `--resource-group ‹groupe›` | conteneur logique de la ressource |
| `--name ‹nom›` | nom de la ressource visée |
| `--location ‹region›` | région Azure d'hébergement |
| `--output ‹format›` | forme de la réponse affichée |
| `--query ‹JMESPath›` | filtre applique côté client |
| `--yes` | supprime la demande de confirmation |
| `--no-wait` | rend la main sans attendre la fin |

> [!WARNING]
> Options à manier avec précaution : `delete`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Créer un cluster**

```bash
az aks create --resource-group rg-prod --name aks-prod --node-count 3 --enable-managed-identity --generate-ssh-keys
```

**Configurer kubectl**

```bash
az aks get-credentials --resource-group rg-prod --name aks-prod
```

**Versions disponibles**

```bash
az aks get-versions --location francecentral --output table
```

**Mettre à jour**

```bash
az aks upgrade --resource-group rg-prod --name aks-prod --kubernetes-version 1.30.0
```

## Dans les autres shells

- [[27-commandes/03-macos/05-azure-cli/az-aks|az aks (macOS)]]

*Mots-clés : azure aks kubernetes cluster noeud pool mise échelle credentials kubectl version mise jour*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
