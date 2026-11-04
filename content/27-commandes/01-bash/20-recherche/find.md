---
title: "find"
description: "Bash — find (Audit & scripts) : Recherche par nom, type, age, taille - avec action."
tags: [bash, commande, recherche]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Recherche |
| **Contexte** | Audit & scripts |
| **Commande type** | `find . -name "*.log" -mtime +7 -delete` |

## Rôle

Recherche par nom, type, age, taille - avec action.

## En détail

Recherche des fichiers selon des critères (nom, taille, date, type) dans toute une arborescence. Très puissant pour retrouver ou traiter en masse.

## Options

| Option | Rôle |
| --- | --- |
| `-name ‹motif›` | nom (ex: *.log) |
| ⚠️ ` ‹condition›` | négation de la condition (ex: ! -name "*.log") |
| `-iname ‹motif›` | nom insensible à la casse |
| `-type ‹f/d›` | fichier (f) ou dossier (d) |
| `-mtime ‹+N›` | modifie il y a +/-N jours |
| `-mmin ‹±N›` | modifie il y a +/-N minutes |
| `-size ‹±N (c/k/M/G)›` | taille : c=octets, k=Kio, M=Mio, G=Gio (+ plus grand, - plus petit) |
| `-newer ‹fichier›` | plus récent qu'un fichier |
| `-maxdepth ‹N›` | profondeur max |
| `-perm ‹mode›` | par permissions (ex: -u+x, 644, /222) |
| `-exec ‹commande› {} \;` | exécute la commande sur CHAQUE fichier ({} = le fichier trouvé, \; = fin de commande : un lancement par fichier) |
| `-exec ‹commande› {} +` | regroupe les fichiers en UN seul lancement (+ au lieu de \; ; bien plus rapide sur beaucoup de fichiers) |
| `-exec ‹commande› {} ‹cible› \;` | commande avec une cible après {} (ex. copier/déplacer chaque fichier vers une cible) |
| `-execdir ‹commande› {} \;` | comme -exec mais lancé depuis le dossier de chaque fichier (plus sûr contre les noms piégés) |
| ⚠️ `-delete` | supprime les résultats trouvés |

> [!WARNING]
> Options à manier avec précaution : ` ‹condition›`, `-delete`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Purger les vieux logs**

```bash
find /var/log -name "*.log" -mtime +7 -delete
```

**Fichiers > 100 Mo**

```bash
find / -type f -size +100M 2>/dev/null
```

**Rendre .sh exécutables**

```bash
find . -name "*.sh" -exec chmod +x {} \;
```

## Dans les autres shells

- [[27-commandes/03-macos/21-recherche/find|find (macOS)]]

*Mots-clés : chercher fichiers recherche nom date taille supprimer trouver find*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
