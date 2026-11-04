---
title: "deluser"
description: "Bash — deluser (Comptes / Suppression) : Supprime un compte (Debian/Ubuntu)."
tags: [bash, commande, comptes-utilisateurs]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Comptes & utilisateurs |
| **Contexte** | Comptes / Suppression |
| **Commande type** | `deluser jdupont` |

## Rôle

Supprime un compte (Debian/Ubuntu).

## En détail

Supprime un compte utilisateur (et, en option, son dossier personnel). Variante conviviale de userdel sous Debian/Ubuntu.

## Options

| Option | Rôle |
| --- | --- |
| `--remove-home` | supprime le home |
| `--remove-all-files` | tout supprimer |
| `(groupe)` | retire d'un groupe |
| `userdel` | équivalent RHEL |

## Exemples

**Supprimer le compte**

```bash
deluser jdupont
```

**Avec le home**

```bash
deluser --remove-home jdupont
```

**Retirer d'un groupe**

```bash
deluser jdupont docker
```

*Mots-clés : supprimer compte utilisateur debian deluser userdel*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
