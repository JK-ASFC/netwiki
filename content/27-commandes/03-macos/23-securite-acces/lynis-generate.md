---
title: "lynis generate"
description: "macOS — lynis generate (Audit / Génération) : Génère des éléments utilisés par Lynis, comme les identifiants d'hôte (hostid et hostid2) qui servent d'empreinte de la machine."
tags: [macos, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Sécurité & accès |
| **Contexte** | Audit / Génération |
| **Commande type** | `lynis generate hostids` |

## Rôle

Génère des éléments utilisés par Lynis, comme les identifiants d'hôte (hostid et hostid2) qui servent d'empreinte de la machine.

## Options

| Option | Rôle |
| --- | --- |
| `hostids` | génère les identifiants d'hôte |
| `(pas de systemd-units) launchd` | systemd n'existe pas sous macOS |

## Exemples

**Voir les identifiants actuels**

```zsh
lynis show hostids
```

**Générer des identifiants**

```zsh
lynis generate hostids
```

**Contrôler les réglages**

```zsh
lynis show settings
```

## Dans les autres shells

- [[27-commandes/01-bash/22-securite-acces/lynis-generate|lynis generate (Bash)]]

*Mots-clés : lynis generate hostids systemd-units identifiant hôte empreinte*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
