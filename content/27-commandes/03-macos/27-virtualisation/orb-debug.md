---
title: "orb debug"
description: "macOS — orb debug (Docker / Débogage) : Ouvre un shell de débogage outillé dans n'importe quel conteneur, même minimal, sans shell ou en lecture seule, local ou sur un hôte Docker distant."
tags: [macos, commande, virtualisation]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Virtualisation |
| **Contexte** | Docker / Débogage |
| **Commande type** | `orb debug mon-conteneur` |

## Rôle

Ouvre un shell de débogage outillé dans n'importe quel conteneur, même minimal, sans shell ou en lecture seule, local ou sur un hôte Docker distant.

## Options

| Option | Rôle |
| --- | --- |
| `‹conteneur›` | nom ou identifiant du conteneur |
| `-c ‹contexte›` | contexte Docker : hôte distant |
| `(dctl) dctl install nvim` | installe un outil dans le shell de débogage |
| `(distroless) conteneur sans shell` | cas où docker exec ne suffit pas |

## Exemples

**Déboguer un conteneur local**

```zsh
orb debug web
```

**Sur un hôte Docker distant**

```zsh
orb debug -c servy web
```

**Créer le contexte distant**

```zsh
docker context create servy --docker host=ssh://user@192.168.1.100
```

*Mots-clés : orbstack orb debug conteneur docker shell distroless diagnostic dctl*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
