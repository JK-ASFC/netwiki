---
title: "chroot"
description: "Bash — chroot (Isolation / Maintenance) : Exécute une commande avec un autre dossier comme racine /."
tags: [bash, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Sécurité & accès |
| **Contexte** | Isolation / Maintenance |
| **Commande type** | `chroot /mnt/newroot /bin/bash` |

## Rôle

Exécute une commande avec un autre dossier comme racine /.

## Options

| Option | Rôle |
| --- | --- |
| `--userspec ‹user:groupe›` | sous une autre identité |

## Exemples

**Shell dans la nouvelle racine**

```bash
chroot /mnt/newroot /bin/bash
```

**Réparer depuis un live USB**

```bash
chroot /mnt /bin/bash
```

**Sous une autre identité**

```bash
chroot --userspec=svc:svc /mnt id
```

*Mots-clés : racine isolation réparation dépannage chroot*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
