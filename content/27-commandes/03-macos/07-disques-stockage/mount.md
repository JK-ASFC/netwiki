---
title: "mount"
description: "macOS — mount (Montages) : Affiche les systèmes de fichiers montés (le montage manuel passe surtout par diskutil sur macOS)."
tags: [macos, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Disques & stockage |
| **Contexte** | Montages |
| **Commande type** | `mount` |

## Rôle

Affiche les systèmes de fichiers montés (le montage manuel passe surtout par diskutil sur macOS).

## Options

| Option | Rôle |
| --- | --- |
| `(sans arg)` | liste les montages actifs |
| `-t ‹type›` | filtre par type (apfs, smbfs, nfs) |
| `-r` | monte en lecture seule |

## Exemples

**Voir les montages**

```zsh
mount
```

**Monter un partage réseau**

```zsh
mount -t smbfs //user@serveur/partage /Volumes/partage
```

*Mots-clés : montage mount volume système fichiers monter*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
