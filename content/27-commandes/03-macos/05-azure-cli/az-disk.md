---
title: "az disk"
description: "macOS — az disk (Azure / disques managés) : Gère les disques managés : création, attachement, instantanés et redimensionnement."
tags: [macos, commande, azure-cli]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Azure CLI |
| **Contexte** | Azure / disques managés |
| **Commande type** | `az disk create --resource-group rg-prod --name disk01 --size-gb 128` |

## Rôle

Gère les disques managés : création, attachement, instantanés et redimensionnement.

## Options

| Option | Rôle |
| --- | --- |
| `create` | crée un disque manage |
| `list` | liste les disques |
| ⚠️ `delete` | supprime un disque |
| `update` | modifie un disque existant |
| `--size-gb ‹taille›` | taille en gigaoctets |
| `--sku ‹reference›` | type de disque |
| `--zone ‹zone›` | zone de disponibilité |
| `--source ‹source›` | instantané ou disque d'origine |
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

**Créer un disque**

```zsh
az disk create --resource-group rg-prod --name disk01 --size-gb 128 --sku Premium_LRS
```

**Trouver les disques orphelins**

```zsh
az disk list --query "[?diskState=='Unattached'].{nom:name, taille:diskSizeGb}" --output table
```

**Restaurer depuis un instantané**

```zsh
az disk create --resource-group rg-prod --name disk-restaure --source snap01
```

## Dans les autres shells

- [[27-commandes/01-bash/05-azure-cli/az-disk|az disk (Bash)]]

*Mots-clés : azure disque disk manage stockage instantané snapshot chiffrement taille performance*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
