---
title: "ifconfig"
description: "macOS — ifconfig (Interfaces réseau) : Affiche et configure les interfaces réseau (outil BSD, toujours présent sur macOS)."
tags: [macos, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Réseau |
| **Contexte** | Interfaces réseau |
| **Commande type** | `ifconfig` |

## Rôle

Affiche et configure les interfaces réseau (outil BSD, toujours présent sur macOS).

## Options

| Option | Rôle |
| --- | --- |
| `(sans arg)` | liste toutes les interfaces et leurs adresses |
| `‹interface›` | détaille une interface (ex. en0 = Ethernet/Wi-Fi) |
| `‹interface› up` | active l'interface |
| `‹interface› down` | désactive l'interface |
| `-a` | toutes les interfaces, même inactives |

## Exemples

**Toutes les interfaces**

```zsh
ifconfig
```

**Adresse du Wi-Fi**

```zsh
ifconfig en0 | grep 'inet '
```

**IP publique locale**

```zsh
ipconfig getifaddr en0
```

## Dans les autres shells

- [[27-commandes/01-bash/21-reseau/ifconfig|ifconfig (Bash)]]

*Mots-clés : réseau interface ifconfig ip adresse en0 wifi ethernet*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
