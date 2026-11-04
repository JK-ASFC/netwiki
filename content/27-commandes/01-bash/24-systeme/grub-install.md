---
title: "grub-install"
description: "Bash — grub-install (Démarrage (boot)) : Installe le chargeur GRUB sur un disque."
tags: [bash, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Système |
| **Contexte** | Démarrage (boot) |
| **Commande type** | `grub-install /dev/sda` |

## Rôle

Installe le chargeur GRUB sur un disque.

## Options

| Option | Rôle |
| --- | --- |
| `--target ‹plateforme›` | cible (ex: x86_64-efi) |
| `--efi-directory ‹chemin›` | partition EFI (ex: /boot/efi) |
| `--recheck` | re-détecte le disque |

## Exemples

**Installer GRUB**

```bash
grub-install /dev/sda
```

**Régénérer la config**

```bash
update-grub
```

*Mots-clés : grub boot démarrage bootloader installer mbr efi grub-install*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
