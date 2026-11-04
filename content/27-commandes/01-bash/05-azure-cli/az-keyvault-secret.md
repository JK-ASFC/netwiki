---
title: "az keyvault secret"
description: "Bash — az keyvault secret (Azure / secrets) : Écrit, lit et supprime les secrets d'un coffre de clés, avec gestion des versions."
tags: [bash, commande, azure-cli]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Azure CLI |
| **Contexte** | Azure / secrets |
| **Commande type** | `az keyvault secret set --vault-name kv-prod --name motdepasse --value SecretSolide` |

## Rôle

Écrit, lit et supprime les secrets d'un coffre de clés, avec gestion des versions.

## Options

| Option | Rôle |
| --- | --- |
| `set` | crée ou met à jour un secret |
| `show` | lit un secret |
| `list` | liste les secrets |
| ⚠️ `delete` | supprime un secret |
| `--name ‹nom›` | nom de la ressource visée |
| `--output ‹format›` | forme de la réponse affichée |
| `--query ‹JMESPath›` | filtre applique côté client |
| `--yes` | supprime la demande de confirmation |

> [!WARNING]
> Options à manier avec précaution : `delete`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Écrire un secret**

```bash
az keyvault secret set --vault-name kv-prod --name motdepasse-bdd --value "SecretSolide"
```

**Lire la valeur seule**

```bash
az keyvault secret show --vault-name kv-prod --name motdepasse-bdd --query value --output tsv
```

**Inventaire sans les valeurs**

```bash
az keyvault secret list --vault-name kv-prod --output table
```

## Dans les autres shells

- [[27-commandes/03-macos/05-azure-cli/az-keyvault-secret|az keyvault secret (macOS)]]

*Mots-clés : azure secret coffre keyvault version rotation lecture suppression réversible purge*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
