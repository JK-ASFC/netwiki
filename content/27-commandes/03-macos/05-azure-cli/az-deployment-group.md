---
title: "az deployment group"
description: "macOS — az deployment group (Azure / déploiements) : Déploie des modèles ARM ou Bicep sur un groupe de ressources, avec validation et aperçu des changements."
tags: [macos, commande, azure-cli]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Azure CLI |
| **Contexte** | Azure / déploiements |
| **Commande type** | `az deployment group create --resource-group rg-prod --template-file modele.bicep` |

## Rôle

Déploie des modèles ARM ou Bicep sur un groupe de ressources, avec validation et aperçu des changements.

## Options

| Option | Rôle |
| --- | --- |
| `create` | lance un déploiement |
| `validate` | vérifie un modèle sans déployer |
| `what-if` | affiche les changements prévus |
| `list` | liste les déploiements du groupe |
| `show` | affiche un déploiement |
| `--template-file ‹fichier›` | modèle local à déployer |
| `--parameters ‹parametres›` | valeurs des paramètres |
| `--mode ‹mode›` | mode de déploiement |
| `--confirm-with-what-if` | affiche l'aperçu et demande confirmation |
| `--resource-group ‹groupe›` | conteneur logique de la ressource |
| `-g ‹groupe›` | forme courte de --resource-group |
| `--name ‹nom›` | nom de la ressource visée |
| `--output ‹format›` | forme de la réponse affichée |
| `--query ‹JMESPath›` | filtre applique côté client |
| `--no-wait` | rend la main sans attendre la fin |

## Exemples

**Aperçu avant déploiement**

```zsh
az deployment group what-if --resource-group rg-prod --template-file modele.bicep
```

**Déployer avec paramètres**

```zsh
az deployment group create -g arm-demo --name bicepDemo --template-file .\storage.bicep --parameters part=bicep
```

**Déployer avec confirmation**

```zsh
az deployment group create --resource-group rg-prod --template-file modele.bicep --confirm-with-what-if
```

## Dans les autres shells

- [[27-commandes/01-bash/05-azure-cli/az-deployment-group|az deployment group (Bash)]]

*Mots-clés : azure déploiement deployment arm bicep modèle template infrastructure code validation whatif*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
