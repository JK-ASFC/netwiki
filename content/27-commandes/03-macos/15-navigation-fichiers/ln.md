---
title: "ln"
description: "macOS — ln (Fichiers / Liens) : Crée des liens symboliques ou physiques."
tags: [macos, commande, navigation-fichiers]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Navigation & fichiers |
| **Contexte** | Fichiers / Liens |
| **Commande type** | `ln -s /opt/app/bin/app /usr/local/bin/app` |

## Rôle

Crée des liens symboliques ou physiques.

## En détail

Crée un lien vers un fichier, c'est-a-dire un raccourci. Le lien symbolique (-s) pointe vers le chemin d'origine.

## Options

| Option | Rôle |
| --- | --- |
| `-s` | lien symbolique |
| `-f` | force (remplace) |
| `(sans -s)` | lien physique |

## Exemples

**Lien symbolique**

```zsh
ln -s /opt/app/bin/app /usr/local/bin/app
```

**Forcer**

```zsh
ln -sf /etc/conf /etc/conf.actif
```

**Lien physique**

```zsh
ln data.bin copie.bin
```

## Dans les autres shells

- [[27-commandes/01-bash/15-navigation-fichiers/ln|ln (Bash)]]

*Mots-clés : lien symbolique physique raccourci ln*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
