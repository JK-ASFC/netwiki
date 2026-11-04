---
title: "az keyvault"
description: "macOS — az keyvault (Azure / coffre de clés) : Gère les coffres de clés et les secrets : stockage, lecture, rotation et suppression réversible."
tags: [macos, commande, azure-cli]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Azure CLI |
| **Contexte** | Azure / coffre de clés |
| **Commande type** | `az keyvault create --resource-group rg-prod --name kv-prod` |

## Rôle

Gère les coffres de clés et les secrets : stockage, lecture, rotation et suppression réversible.

## Options

| Option | Rôle |
| --- | --- |
| `create` | crée un coffre de clés |
| `list` | liste les coffres |
| ⚠️ `purge` | efface définitivement un élément supprime |
| `set-policy` | attribue des droits d'accès |
| `--enable-rbac-authorization ‹booleen›` | gestion des droits par RBAC |
| `--retention-days ‹jours›` | durée de conservation après suppression |
| `--resource-group ‹groupe›` | conteneur logique de la ressource |
| `--name ‹nom›` | nom de la ressource visée |
| `--location ‹region›` | région Azure d'hébergement |
| `--output ‹format›` | forme de la réponse affichée |
| `--query ‹JMESPath›` | filtre applique côté client |
| `--yes` | supprime la demande de confirmation |

> [!WARNING]
> Options à manier avec précaution : `purge`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Créer un coffre**

```zsh
az keyvault create --resource-group rg-prod --name kv-prod --location francecentral --enable-rbac-authorization true
```

**Écrire un secret**

```zsh
az keyvault secret set --vault-name kv-prod --name motdepasse-bdd --value "SecretSolide"
```

**Lire sans trace visible**

```zsh
az keyvault secret show --vault-name kv-prod --name motdepasse-bdd --query value --output tsv
```

**Coffres supprimés**

```zsh
az keyvault list-deleted --output table
```

## Dans les autres shells

- [[27-commandes/01-bash/05-azure-cli/az-keyvault|az keyvault (Bash)]]

*Mots-clés : azure keyvault coffre secret clé certificat rotation purge accès rbac politique*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
