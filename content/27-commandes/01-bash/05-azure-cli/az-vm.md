---
title: "az vm"
description: "Bash — az vm (Azure / machines virtuelles) : Crée et pilote des machines virtuelles : cycle de vie, dimensionnement, accès distant."
tags: [bash, commande, azure-cli]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Azure CLI |
| **Contexte** | Azure / machines virtuelles |
| **Commande type** | `az vm create --resource-group rg-prod --name vm01 --image Ubuntu2204` |

## Rôle

Crée et pilote des machines virtuelles : cycle de vie, dimensionnement, accès distant.

## Options

| Option | Rôle |
| --- | --- |
| `create` | crée une machine virtuelle |
| `list` | liste les machines |
| `show` | affiche une machine |
| `start` | démarre une machine arrêtée |
| ⚠️ `stop` | arrête le système sans libérer |
| ⚠️ `deallocate` | libère le matériel et stoppe la facturation |
| ⚠️ `delete` | supprime la machine |
| `restart` | redémarre la machine |
| `list-sizes` | références de taille disponibles |
| `list-vm-resize-options` | tailles compatibles avec un redimensionnement |
| `resize` | change la taille de la machine |
| `--image ‹image›` | image du système d'exploitation |
| `--size ‹taille›` | référence de dimensionnement |
| `--admin-username ‹utilisateur›` | compte administrateur |
| `--generate-ssh-keys` | génère une paire de clés SSH si absente |
| `--public-ip-address ‹adresse›` | adresse publique associée |
| `--priority ‹priorite›` | type d'allocation |
| `--resource-group ‹groupe›` | conteneur logique de la ressource |
| `--name ‹nom›` | nom de la ressource visée |
| `--location ‹region›` | région Azure d'hébergement |
| `--tags ‹cle=valeur›` | étiquettes de classement |
| `--output ‹format›` | forme de la réponse affichée |
| `--query ‹JMESPath›` | filtre applique côté client |
| `--yes` | supprime la demande de confirmation |
| `--no-wait` | rend la main sans attendre la fin |
| `--subscription ‹abonnement›` | abonnement à cibler ponctuellement |

> [!WARNING]
> Options à manier avec précaution : `stop`, `deallocate`, `delete`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Créer une VM Linux**

```bash
az vm create --resource-group rg-prod --name vm01 --image Ubuntu2204 --size Standard_B2s --admin-username azureuser --generate-ssh-keys
```

**État réel des machines**

```bash
az vm list --show-details --output table
```

**Eteindre vraiment (arrêt facturation)**

```bash
az vm deallocate --resource-group rg-prod --name vm01
```

**VM privée sans adresse publique**

```bash
az vm create --resource-group rg-prod --name vm02 --image Ubuntu2204 --public-ip-address ""
```

## Dans les autres shells

- [[27-commandes/03-macos/05-azure-cli/az-vm|az vm (macOS)]]

*Mots-clés : azure vm machine virtuelle compute taille image démarrage arrêt libération ssh extension*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
