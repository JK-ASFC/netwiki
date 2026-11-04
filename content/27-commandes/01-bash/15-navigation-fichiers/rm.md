---
title: "rm"
description: "Bash — rm (Fichiers / Suppression) : Supprime fichiers et répertoires."
tags: [bash, commande, navigation-fichiers]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Navigation & fichiers |
| **Contexte** | Fichiers / Suppression |
| **Commande type** | `rm fichier.txt` |

## Rôle

Supprime fichiers et répertoires.

## En détail

Supprime des fichiers et des dossiers. Attention : il n'y a pas de corbeille, la suppression est définitive.

## Options

| Option | Rôle |
| --- | --- |
| ⚠️ `-rf` | récursif + force (DANGER) |
| `-i` | demande confirmation |
| `-r` | récursif (dossiers) |
| `--` | fin des options |

> [!WARNING]
> Options à manier avec précaution : `-rf`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Un fichier**

```bash
rm fichier.txt
```

**Avec confirmation**

```bash
rm -i *.tmp
```

**Un dossier**

```bash
rm -r ancien_projet/
```

## Dans les autres shells

- [[27-commandes/03-macos/15-navigation-fichiers/rm|rm (macOS)]]

*Mots-clés : supprimer effacer fichier dossier danger rm*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
