---
title: "chgrp"
description: "Bash — chgrp (Fichiers / Permissions) : Change le groupe propriétaire."
tags: [bash, commande, navigation-fichiers]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
chgrp developpeurs script.sh
```

**Récursif**

```bash
chgrp -R www-data /var/www
```

**Via chown**

```bash
chown :www-data fichier
```

## Dans les autres shells

- [[27-commandes/03-macos/15-navigation-fichiers/chgrp|chgrp (macOS)]]

*Mots-clés : groupe propriétaire permissions changer chgrp*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
