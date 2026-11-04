---
title: "dd"
description: "macOS — dd (Copie bloc à bloc) : Copie octet à octet : clés USB, images. Sur macOS, viser /dev/rdiskN (raw) est bien plus rapide."
tags: [macos, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Disques & stockage |
| **Contexte** | Copie bloc à bloc |
| **Commande type** | `sudo dd if=image.iso of=/dev/rdisk4 bs=4m` |

## Rôle

Copie octet à octet : clés USB, images. Sur macOS, viser /dev/rdiskN (raw) est bien plus rapide.

## En détail

Copie des données bloc par bloc : créer une clé USB bootable, cloner un disque. Très puissant donc dangereux, une erreur de cible efface tout.

## Options

| Option | Rôle |
| --- | --- |
| `if= ‹source›` | fichier ou périphérique lu |
| ⚠️ `of= ‹destination›` | périphérique écrit : /dev/rdiskN efface TOUT le disque |
| `bs= ‹4m›` | taille de bloc (minuscule sur BSD : 4m, 1m) |
| `status=progress` | affiche la progression (macOS récent ; sinon Ctrl+T) |
| `count= ‹N›` | s'arrête après N blocs |

> [!WARNING]
> Options à manier avec précaution : `of= ‹destination›`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Clé USB bootable (vérifier of=)**

```zsh
sudo dd if=linux.iso of=/dev/rdisk4 bs=4m
```

**Voir le bon disque avant**

```zsh
diskutil list
```

**Progression (ancien macOS)**

```zsh
Appuyer sur Ctrl+T pendant la copie
```

## Dans les autres shells

- [[27-commandes/01-bash/07-disques-stockage/dd|dd (Bash)]]

*Mots-clés : copie bloc image disque usb dd clonage rdisk*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
