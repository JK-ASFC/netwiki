---
title: "chown"
description: "Bash — chown (Administration des comptes) : Change propriétaire et groupe."
tags: [bash, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Sécurité & accès |
| **Contexte** | Administration des comptes |
| **Commande type** | `chown -R www-data:www-data /var/www` |

## Rôle

Change propriétaire et groupe.

## En détail

Change le propriétaire (et éventuellement le groupe) d'un fichier. Sert à confier un fichier au bon utilisateur.

## Options

| Option | Rôle |
| --- | --- |
| `-R` | récursif |
| `user:group` | les deux |
| `--reference=‹fichier›` | copie d'un autre |

## Exemples

**Dossier web au service**

```bash
sudo chown -R www-data:www-data /var/www
```

## Dans les autres shells

- [[27-commandes/03-macos/23-securite-acces/chown|chown (macOS)]]

*Mots-clés : propriétaire groupe appartenance chown possession*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
