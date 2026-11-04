---
title: "az webapp deployment slot"
description: "Bash — az webapp deployment slot (Azure / emplacements) : Gère les emplacements de déploiement d'une application web et la bascule sans interruption."
tags: [bash, commande, azure-cli]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Azure CLI |
| **Contexte** | Azure / emplacements |
| **Commande type** | `az webapp deployment slot create --resource-group rg-prod --name monappli --slot preprod` |

## Rôle

Gère les emplacements de déploiement d'une application web et la bascule sans interruption.

## Options

| Option | Rôle |
| --- | --- |
| `create` | crée un emplacement de déploiement |
| `swap` | échange deux emplacements |
| `--resource-group ‹groupe›` | conteneur logique de la ressource |
| `--name ‹nom›` | nom de la ressource visée |
| `--output ‹format›` | forme de la réponse affichée |
| `--query ‹JMESPath›` | filtre applique côté client |
| `--yes` | supprime la demande de confirmation |

## Exemples

**Créer un emplacement**

```bash
az webapp deployment slot create --resource-group rg-prod --name monappli --slot preprod
```

**Basculer en production**

```bash
az webapp deployment slot swap --resource-group rg-prod --name monappli --slot preprod --target-slot production
```

**Revenir en arrière**

```bash
az webapp deployment slot swap --resource-group rg-prod --name monappli --slot production --target-slot preprod
```

## Dans les autres shells

- [[27-commandes/03-macos/05-azure-cli/az-webapp-deployment-slot|az webapp deployment slot (macOS)]]

*Mots-clés : azure emplacement slot preprod bascule swap déploiement sans coupure retour arrière*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
