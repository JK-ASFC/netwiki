---
title: "nmap"
description: "Bash — nmap (Découverte / Audit réseau) : Hôtes, ports ouverts et versions de services."
tags: [bash, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Réseau |
| **Contexte** | Découverte / Audit réseau |
| **Commande type** | `nmap -sV -p- 10.20.0.0/24` |

## Rôle

Hôtes, ports ouverts et versions de services.

## En détail

Scanne un réseau ou une machine pour découvrir les hôtes présents et les ports ouverts. Outil clé de la reconnaissance réseau et de la sécurité.

## Options

| Option | Rôle |
| --- | --- |
| `-sV` | version |
| `-p-` | tous les ports |
| `-sn` | hôtes seuls |
| `-A` | agressif |
| `-Pn` | saute le ping |
| `-T4` | rapide |
| `-p ‹ports›` | ports précis (ex: 22,80,443 ou 1-1000) |
| `-O` | détection du système d'exploitation |
| `-sC` | scripts NSE par défaut |

## Exemples

**Hôtes vivants**

```bash
nmap -sn 10.20.0.0/24
```

**Ports cibles**

```bash
nmap -sV -p 22,80,443 10.20.0.1
```

## Dans les autres shells

- [[27-commandes/03-macos/22-reseau/nmap|nmap (macOS)]]

*Mots-clés : scan ports réseau sécurité découverte services version pentest nmap audit*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
