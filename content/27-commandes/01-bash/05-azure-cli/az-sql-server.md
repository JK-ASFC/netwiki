---
title: "az sql server"
description: "Bash — az sql server (Azure / serveur SQL) : Crée et sécurisé le serveur logique qui héberge les bases Azure SQL."
tags: [bash, commande, azure-cli]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Azure CLI |
| **Contexte** | Azure / serveur SQL |
| **Commande type** | `az sql server create --resource-group rg-prod --name sql-prod --admin-user sqladmin` |

## Rôle

Crée et sécurisé le serveur logique qui héberge les bases Azure SQL.

## Options

| Option | Rôle |
| --- | --- |
| `create` | crée un serveur logique |
| `firewall-rule create` | ouvre le pare-feu du serveur |
| `--admin-user ‹utilisateur›` | administrateur du serveur |
| `--resource-group ‹groupe›` | conteneur logique de la ressource |
| `--name ‹nom›` | nom de la ressource visée |
| `--output ‹format›` | forme de la réponse affichée |
| `--query ‹JMESPath›` | filtre applique côté client |
| `--yes` | supprime la demande de confirmation |
| `--location ‹region›` | région Azure d'hébergement |

## Exemples

**Créer un serveur**

```bash
az sql server create --resource-group rg-prod --name sql-prod --location francecentral --admin-user sqladmin
```

**Autoriser un poste**

```bash
az sql server firewall-rule create --resource-group rg-prod --server sql-prod --name poste --start-ip-address 203.0.113.10 --end-ip-address 203.0.113.10
```

**Autoriser les services Azure**

```bash
az sql server firewall-rule create --resource-group rg-prod --server sql-prod --name azure --start-ip-address 0.0.0.0 --end-ip-address 0.0.0.0
```

## Dans les autres shells

- [[27-commandes/03-macos/05-azure-cli/az-sql-server|az sql server (macOS)]]

*Mots-clés : azure sql serveur logique pare-feu firewall administrateur entra réseau accès*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
