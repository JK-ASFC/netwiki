---
title: "ln"
description: "Bash — ln (Fichiers / Liens) : Crée des liens symboliques ou physiques."
tags: [bash, commande, navigation-fichiers]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
ln -s /opt/app/bin/app /usr/local/bin/app
```

**Forcer**

```bash
ln -sf /etc/conf /etc/conf.actif
```

**Lien physique**

```bash
ln data.bin copie.bin
```

## Dans les autres shells

- [[27-commandes/03-macos/15-navigation-fichiers/ln|ln (macOS)]]

*Mots-clés : lien symbolique physique raccourci ln*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
