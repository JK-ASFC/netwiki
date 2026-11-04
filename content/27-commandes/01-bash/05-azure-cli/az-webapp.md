---
title: "az webapp"
description: "Bash — az webapp (Azure / applications web) : Déploie et pilote des applications web : publication, journaux, variables et emplacements."
tags: [bash, commande, azure-cli]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Azure CLI |
| **Contexte** | Azure / applications web |
| **Commande type** | `az webapp create --resource-group rg-prod --plan plan-prod --name monappli` |

## Rôle

Déploie et pilote des applications web : publication, journaux, variables et emplacements.

## Options

| Option | Rôle |
| --- | --- |
| `create` | crée une application web |
| `list` | liste les applications |
| ⚠️ `delete` | supprime une application |
| `restart` | redémarre l'application |
| `log tail` | suit les journaux en direct |
| `config appsettings set` | définit des variables d'application |
| `deployment source config` | configure un déploiement continu |
| `--runtime ‹environnement›` | pile d'exécution |
| `--plan ‹plan›` | plan App Service porteur |
| `--resource-group ‹groupe›` | conteneur logique de la ressource |
| `--name ‹nom›` | nom de la ressource visée |
| `--output ‹format›` | forme de la réponse affichée |
| `--query ‹JMESPath›` | filtre applique côté client |
| `--yes` | supprime la demande de confirmation |

> [!WARNING]
> Options à manier avec précaution : `delete`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Créer une application**

```bash
az webapp create --resource-group rg-prod --plan plan-prod --name monappli --runtime "PYTHON:3.12"
```

**Suivre les journaux**

```bash
az webapp log tail --resource-group rg-prod --name monappli
```

**Mise en production sans coupure**

```bash
az webapp deployment slot swap --resource-group rg-prod --name monappli --slot preprod --target-slot production
```

## Dans les autres shells

- [[27-commandes/03-macos/05-azure-cli/az-webapp|az webapp (macOS)]]

*Mots-clés : azure webapp application web app service déploiement journal paramètre emplacement slot redémarrage*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
