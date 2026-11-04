---
title: "az storage blob"
description: "Bash — az storage blob (Azure / objets blob) : Transfère et gère les objets blob : envoi, téléchargement, synchronisation et niveaux d'accès."
tags: [bash, commande, azure-cli]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Azure CLI |
| **Contexte** | Azure / objets blob |
| **Commande type** | `az storage blob upload --account-name stprod01 --container-name docs --name f.txt --file ./f.txt` |

## Rôle

Transfère et gère les objets blob : envoi, téléchargement, synchronisation et niveaux d'accès.

## Options

| Option | Rôle |
| --- | --- |
| `upload` | envoie un fichier |
| `download` | télécharge un objet |
| `list` | liste les objets d'un conteneur |
| ⚠️ `delete` | supprime un objet |
| `copy start` | copie un objet entre comptes |
| `sync` | synchronise un dossier local |
| `set-tier` | change le niveau d'accès d'un objet |
| `generate-sas` | crée une signature d'accès partage |
| `--container-name ‹conteneur›` | conteneur cible |
| `--auth-mode ‹mode›` | méthode d'authentification |
| `--output ‹format›` | forme de la réponse affichée |
| `--query ‹JMESPath›` | filtre applique côté client |
| `--subscription ‹abonnement›` | abonnement à cibler ponctuellement |

> [!WARNING]
> Options à manier avec précaution : `delete`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Envoyer un fichier**

```bash
az storage blob upload --account-name stprod01 --container-name docs --name rapport.pdf --file ./rapport.pdf --auth-mode login
```

**Envoyer un dossier**

```bash
az storage blob upload-batch --account-name stprod01 --destination docs --source ./dossier
```

**Lien temporaire**

```bash
az storage blob generate-sas --account-name stprod01 --container-name docs --name rapport.pdf --permissions r --expiry 2026-12-31
```

## Dans les autres shells

- [[27-commandes/03-macos/05-azure-cli/az-storage-blob|az storage blob (macOS)]]

*Mots-clés : azure blob objet conteneur upload download sync stockage sas niveau archive*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
