---
title: "az storage account"
description: "macOS — az storage account (Azure / compte de stockage) : Crée et configure les comptes de stockage, socle des objets blob, partages de fichiers et files."
tags: [macos, commande, azure-cli]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Azure CLI |
| **Contexte** | Azure / compte de stockage |
| **Commande type** | `az storage account create --resource-group rg-prod --name stprod01 --sku Standard_LRS` |

## Rôle

Crée et configure les comptes de stockage, socle des objets blob, partages de fichiers et files.

## Options

| Option | Rôle |
| --- | --- |
| `create` | crée un compte de stockage |
| `list` | liste les comptes |
| `show` | affiche un compte |
| ⚠️ `delete` | supprime un compte |
| `update` | modifie un compte existant |
| `--sku ‹redondance›` | niveau de redondance |
| `--kind ‹type›` | type de compte |
| `--access-tier ‹niveau›` | niveau d'accès par défaut |
| `--allow-blob-public-access ‹booleen›` | accès anonyme aux objets |
| `--min-tls-version ‹version›` | version TLS minimale |
| `--resource-group ‹groupe›` | conteneur logique de la ressource |
| `--name ‹nom›` | nom de la ressource visée |
| `--location ‹region›` | région Azure d'hébergement |
| `--tags ‹cle=valeur›` | étiquettes de classement |
| `--output ‹format›` | forme de la réponse affichée |
| `--query ‹JMESPath›` | filtre applique côté client |
| `--yes` | supprime la demande de confirmation |

> [!WARNING]
> Options à manier avec précaution : `delete`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Créer un compte**

```zsh
az storage account create --resource-group rg-prod --name stprod01 --sku Standard_LRS --kind StorageV2
```

**Durcir un compte existant**

```zsh
az storage account update --resource-group rg-prod --name stprod01 --allow-blob-public-access false --min-tls-version TLS1_2
```

**Auditer les comptes ouverts**

```zsh
az storage account list --query "[?allowBlobPublicAccess].name" --output tsv
```

## Dans les autres shells

- [[27-commandes/01-bash/05-azure-cli/az-storage-account|az storage account (Bash)]]

*Mots-clés : azure stockage storage compte blob fichier redondance sku chiffrement clé accès réseau*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
