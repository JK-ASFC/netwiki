---
title: "chgrp"
description: "macOS — chgrp (Fichiers / Permissions) : Change le groupe propriétaire."
tags: [macos, commande, navigation-fichiers]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Navigation & fichiers |
| **Contexte** | Fichiers / Permissions |
| **Commande type** | `chgrp -R www-data /var/www` |

## Rôle

Change le groupe propriétaire.

## En détail

Change le groupe propriétaire d'un fichier. Sert à gérer qui peut y accéder via les permissions de groupe.

## Options

| Option | Rôle |
| --- | --- |
| `-R` | récursif |
| `--reference=‹fichier›` | copie le groupe d'un autre |
| `-v` | verbeux |

## Exemples

**Un fichier**

```zsh
chgrp developpeurs script.sh
```

**Récursif**

```zsh
chgrp -R www-data /var/www
```

**Via chown**

```zsh
chown :www-data fichier
```

## Dans les autres shells

- [[27-commandes/01-bash/15-navigation-fichiers/chgrp|chgrp (Bash)]]

*Mots-clés : groupe propriétaire permissions changer chgrp*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
