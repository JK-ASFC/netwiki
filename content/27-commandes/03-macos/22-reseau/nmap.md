---
title: "nmap"
description: "macOS — nmap (Scan réseau) : Découvre les hôtes et les ports d'un réseau (brew install nmap)."
tags: [macos, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Réseau |
| **Contexte** | Scan réseau |
| **Commande type** | `nmap -sn 10.0.0.0/24` |

## Rôle

Découvre les hôtes et les ports d'un réseau (brew install nmap).

## En détail

Scanne un réseau ou une machine pour découvrir les hôtes présents et les ports ouverts. Outil clé de la reconnaissance réseau et de la sécurité.

## Options

| Option | Rôle |
| --- | --- |
| `-sn` | ping scan : découvre les hôtes sans scanner les ports |
| `-sV` | détecte les versions des services |
| `-p ‹ports›` | cible des ports précis (ex. -p 22,80,443) |
| `-A` | détection agressive (OS, services, scripts) |
| `-Pn` | ne fait pas de ping préalable |

## Exemples

**Hôtes d'un réseau**

```zsh
nmap -sn 10.0.0.0/24
```

**Ports d'une machine**

```zsh
nmap -sV 10.0.0.10
```

**Ports web**

```zsh
nmap -p 80,443 example.com
```

## Dans les autres shells

- [[27-commandes/01-bash/21-reseau/nmap|nmap (Bash)]]

*Mots-clés : scan réseau nmap ports hôtes découverte sécurité brew*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
