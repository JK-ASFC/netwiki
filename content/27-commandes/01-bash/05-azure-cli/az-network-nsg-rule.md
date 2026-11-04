---
title: "az network nsg rule"
description: "Bash — az network nsg rule (Azure / règles de sécurité) : Crée et ordonne les règles de filtrage d'un groupe de sécurité réseau."
tags: [bash, commande, azure-cli]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Azure CLI |
| **Contexte** | Azure / règles de sécurité |
| **Commande type** | `az network nsg rule create --resource-group rg-prod --nsg-name nsg-app --name autoriser-https --priority 200` |

## Rôle

Crée et ordonne les règles de filtrage d'un groupe de sécurité réseau.

## Options

| Option | Rôle |
| --- | --- |
| `create` | ajoute une règle de filtrage |
| `list` | liste les règles |
| ⚠️ `delete` | supprime une règle |
| `--priority ‹priorite›` | ordre d'évaluation de la règle |
| `--access ‹action›` | autorise ou refuse le trafic |
| `--direction ‹sens›` | trafic entrant ou sortant |
| `--destination-port-ranges ‹ports›` | ports de destination |
| `--resource-group ‹groupe›` | conteneur logique de la ressource |
| `--name ‹nom›` | nom de la ressource visée |
| `--output ‹format›` | forme de la réponse affichée |
| `--query ‹JMESPath›` | filtre applique côté client |
| `--yes` | supprime la demande de confirmation |

> [!WARNING]
> Options à manier avec précaution : `delete`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Autoriser HTTPS**

```bash
az network nsg rule create --resource-group rg-prod --nsg-name nsg-app --name autoriser-https --priority 200 --destination-port-ranges 443 --access Allow --protocol Tcp
```

**Voir les règles implicites**

```bash
az network nsg rule list --resource-group rg-prod --nsg-name nsg-app --include-default --output table
```

**Bloquer une source**

```bash
az network nsg rule create --resource-group rg-prod --nsg-name nsg-app --name bloquer-src --priority 150 --source-address-prefixes 203.0.113.0/24 --access Deny
```

## Dans les autres shells

- [[27-commandes/03-macos/05-azure-cli/az-network-nsg-rule|az network nsg rule (macOS)]]

*Mots-clés : azure règle nsg filtrage port priorité autorisation refus entrant sortant protocole*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
