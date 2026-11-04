---
title: "az configure"
description: "Bash — az configure (Azure / préférences) : Fixe les valeurs par défaut de la CLI pour ne plus répéter les mêmes paramètres."
tags: [bash, commande, azure-cli]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Azure CLI |
| **Contexte** | Azure / préférences |
| **Commande type** | `az configure --defaults group=rg-prod` |

## Rôle

Fixe les valeurs par défaut de la CLI pour ne plus répéter les mêmes paramètres.

## Options

| Option | Rôle |
| --- | --- |
| `--defaults ‹cle=valeur›` | définit une valeur par défaut |
| `--list-defaults` | affiche les valeurs par défaut |
| `--scope ‹portee›` | portée du réglage |
| `(mode interactif)` | az configure sans argument |

## Exemples

**Groupe et région par défaut**

```bash
az configure --defaults group=rg-prod location=francecentral
```

**Voir les défauts**

```bash
az configure --list-defaults --output table
```

**Effacer un défaut**

```bash
az configure --defaults group=
```

## Dans les autres shells

- [[27-commandes/03-macos/05-azure-cli/az-configure|az configure (macOS)]]

*Mots-clés : azure configure défaut préférence config groupe région format sortie interactif*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
