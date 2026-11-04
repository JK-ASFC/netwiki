---
title: "chmod"
description: "Bash — chmod (Durcissement / Sécurité) : Permissions : 7=rwx 5=r-x 0=--- (proprio/groupe/autres)."
tags: [bash, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Sécurité & accès |
| **Contexte** | Durcissement / Sécurité |
| **Commande type** | `chmod 750 script.sh` |

## Rôle

Permissions : 7=rwx 5=r-x 0=--- (proprio/groupe/autres).

## En détail

Modifie les permissions d'un fichier : qui peut le lire, l'écrire ou l'exécuter. Au coeur de la sécurité des fichiers sous Linux.

## Options

| Option | Rôle |
| --- | --- |
| `-R` | récursif |
| `+x` | ajoute exécution |
| `u/g/o` | proprio/groupe/autres |
| `640` | notation octale |

## Exemples

**Script exécutable**

```bash
chmod +x deploy.sh
```

**Sécuriser une clé**

```bash
chmod 600 ~/.ssh/id_ed25519
```

## Dans les autres shells

- [[27-commandes/03-macos/23-securite-acces/chmod|chmod (macOS)]]

*Mots-clés : droits permissions exécutable rwx sécuriser accès chmod*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
