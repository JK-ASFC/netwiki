---
title: "hdiutil"
description: "macOS — hdiutil (Images disque (.dmg)) : Crée, monte et manipule les images disque (.dmg, .sparseimage)."
tags: [macos, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Disques & stockage |
| **Contexte** | Images disque (.dmg) |
| **Commande type** | `hdiutil attach image.dmg` |

## Rôle

Crée, monte et manipule les images disque (.dmg, .sparseimage).

## Options

| Option | Rôle |
| --- | --- |
| `attach ‹image.dmg›` | monte une image disque |
| `detach ‹/dev/diskN›` | démonte une image montée |
| `create -size ‹1g› -fs APFS -volname ‹nom image.dmg›` | crée une image vide |
| `create -srcfolder ‹dossier image.dmg›` | crée une image à partir d'un dossier |
| `convert ‹image.dmg› -format UDZO -o ‹compressée.dmg›` | convertit/compresse |
| `-encryption` | chiffre l'image (demande un mot de passe) |

## Exemples

**Monter un .dmg**

```zsh
hdiutil attach installeur.dmg
```

**Créer une image chiffrée**

```zsh
hdiutil create -size 500m -encryption -fs APFS -volname Coffre coffre.dmg
```

**Image d'un dossier**

```zsh
hdiutil create -srcfolder ~/Projets projets.dmg
```

*Mots-clés : image disque dmg hdiutil monter créer chiffrer sparse*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
