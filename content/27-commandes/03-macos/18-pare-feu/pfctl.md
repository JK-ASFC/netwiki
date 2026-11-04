---
title: "pfctl"
description: "macOS — pfctl (Pare-feu pf (paquets)) : Contrôle pf, le pare-feu à filtrage de paquets de macOS (hérité d'OpenBSD) : l'équivalent BSD d'iptables. Les règles se déclarent dans /etc/pf.conf."
tags: [macos, commande, pare-feu]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Pare-feu |
| **Contexte** | Pare-feu pf (paquets) |
| **Commande type** | `sudo pfctl -sr` |

## Rôle

Contrôle pf, le pare-feu à filtrage de paquets de macOS (hérité d'OpenBSD) : l'équivalent BSD d'iptables. Les règles se déclarent dans /etc/pf.conf.

## Options

| Option | Rôle |
| --- | --- |
| `-e` | active pf |
| ⚠️ `-d` | désactive pf : plus aucun filtrage n'est appliqué |
| `-f ‹/etc/pf.conf›` | charge un jeu de règles depuis un fichier |
| `-n -f ‹fichier›` | vérifie la syntaxe SANS charger (simulation) |
| `-s rules` | affiche les règles de filtrage chargées |
| `-s nat` | affiche les règles de traduction d'adresses (NAT) |
| `-s states` | affiche les connexions suivies (table d'états) |
| `-s info` | statistiques et état global de pf |
| `-a ‹ancre›` | cible une ancre précise (sous-ensemble nommé de règles) |
| ⚠️ `-F all` | VIDE toutes les règles ET la table d'états : coupe le filtrage |
| `-t ‹table› -T ‹add/delete/show›` | gère les tables d'adresses |
| `-v` | verbeux (compteurs par règle) |

> [!WARNING]
> Options à manier avec précaution : `-d`, `-F all`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Voir les règles actives**

```zsh
sudo pfctl -sr
```

**Tester la config avant de charger**

```zsh
sudo pfctl -n -f /etc/pf.conf
```

**Charger la config**

```zsh
sudo pfctl -f /etc/pf.conf
```

**Activer pf**

```zsh
sudo pfctl -e
```

*Mots-clés : pare-feu firewall pf pfctl paquets filtrage règles iptables bsd openbsd nat*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
