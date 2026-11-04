---
title: "history"
description: "Bash — history (Historique du shell) : Liste les commandes déjà tapées (pour les rejouer ou les retrouver)."
tags: [bash, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Système |
| **Contexte** | Historique du shell |
| **Commande type** | `history` |

## Rôle

Liste les commandes déjà tapées (pour les rejouer ou les retrouver).

## Options

| Option | Rôle |
| --- | --- |
| `-c` | efface tout l'historique de la session |
| `-w` | écrit l'historique dans le fichier |
| `(!N)` | rejoue la commande numéro N |
| `(!!)` | rejoue la dernière commande |

## Exemples

**Tout**

```bash
history
```

**20 dernières**

```bash
history 20
```

**Chercher une commande**

```bash
history | grep ssh
```

## Dans les autres shells

- [[27-commandes/03-macos/25-systeme/history|history (macOS)]]

*Mots-clés : history historique commandes rappel bash rechercher rejouer*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
