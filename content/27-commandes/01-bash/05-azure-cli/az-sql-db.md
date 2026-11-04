---
title: "az sql db"
description: "Bash — az sql db (Azure / base SQL) : Crée, dimensionne et restaure les bases de données Azure SQL."
tags: [bash, commande, azure-cli]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Azure CLI |
| **Contexte** | Azure / base SQL |
| **Commande type** | `az sql db create --resource-group rg-prod --server sql-prod --name basedb` |

## Rôle

Crée, dimensionne et restaure les bases de données Azure SQL.

## Options

| Option | Rôle |
| --- | --- |
| `create` | crée une base de données |
| `list` | liste les bases d'un serveur |
| ⚠️ `delete` | supprime une base |
| `show-connection-string` | génère une chaîne de connexion |
| `restore` | restaure à un instant donne |
| `--service-objective ‹niveau›` | niveau de service de la base |
| `--backup-storage-redundancy ‹redondance›` | redondance des sauvegardes |
| `--resource-group ‹groupe›` | conteneur logique de la ressource |
| `--name ‹nom›` | nom de la ressource visée |
| `--output ‹format›` | forme de la réponse affichée |
| `--query ‹JMESPath›` | filtre applique côté client |
| `--yes` | supprime la demande de confirmation |

> [!WARNING]
> Options à manier avec précaution : `delete`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Créer une base**

```bash
az sql db create --resource-group rg-prod --server sql-prod --name basedb --service-objective S0
```

**Lister les bases**

```bash
az sql db list --resource-group rg-prod --server sql-prod --output table
```

**Restaurer à un instant**

```bash
az sql db restore --resource-group rg-prod --server sql-prod --name basedb --dest-name basedb-restauree --time 2026-07-01T10:00:00
```

## Dans les autres shells

- [[27-commandes/03-macos/05-azure-cli/az-sql-db|az sql db (macOS)]]

*Mots-clés : azure sql base donnée dtu vcore niveau service restauration sauvegarde chaîne connexion*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
