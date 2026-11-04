---
title: "chattr"
description: "Bash — chattr (Attributs de fichiers) : Pose des attributs étendus sur un fichier ext2/3/4 : immuable, ajout seul… Ils s'appliquent MÊME à root."
tags: [bash, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Sécurité & accès |
| **Contexte** | Attributs de fichiers |
| **Commande type** | `chattr +i /etc/resolv.conf` |

## Rôle

Pose des attributs étendus sur un fichier ext2/3/4 : immuable, ajout seul… Ils s'appliquent MÊME à root.

## Options

| Option | Rôle |
| --- | --- |
| `+i / -i` | IMMUABLE : le fichier ne peut plus être modifié, renommé ni supprimé, même par root (-i pour lever) |
| `+a / -a` | APPEND ONLY : on ne peut qu'AJOUTER à la fin, jamais réécrire ni tronquer (idéal pour un journal) |
| `+A / -A` | n'actualise plus la date d'accès (atime) : moins d'écritures inutiles |
| `+d / -d` | exclut le fichier des sauvegardes réalisées par dump |
| `+S / -S` | écritures SYNCHRONES : écrit immédiatement sur le disque, sans passer par le cache |
| `+u / -u` | conserve les données après suppression pour permettre une restauration |
| `-R` | applique récursivement à tout un dossier |
| `-V` | verbeux : confirme chaque changement |

## Exemples

**Verrouiller un fichier**

```bash
sudo chattr +i /etc/resolv.conf
```

**Déverrouiller**

```bash
sudo chattr -i /etc/resolv.conf
```

**Journal en ajout seul**

```bash
sudo chattr +a /var/log/audit.log
```

**Vérifier**

```bash
lsattr /etc/resolv.conf
```

*Mots-clés : attribut immuable append only chattr protection fichier verrouiller*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
