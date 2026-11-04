---
title: "tar"
description: "PowerShell — tar (Archivage / WAMP) : tar.exe est intégré à Windows 10/11 : crée et extrait des archives .tar et .tar.gz."
tags: [powershell, commande, archivage-compression]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Archivage & compression |
| **Contexte** | Archivage / WAMP |
| **Commande type** | `tar -czf ‹archive.tar.gz› ‹dossier›` |

## Rôle

tar.exe est intégré à Windows 10/11 : crée et extrait des archives .tar et .tar.gz.

## En détail

Regroupe plusieurs fichiers en une seule archive (.tar), souvent compressée (.tar.gz). La façon standard d'empaqueter un dossier sous Linux.

## Options

| Option | Rôle |
| --- | --- |
| `-c` | crée une archive |
| `-x` | extrait une archive |
| `-t` | liste le contenu |
| `-z` | compression gzip (.tar.gz) |
| `-f ‹archive›` | nom du fichier d'archive |
| `-v` | mode verbeux |
| `-C ‹dossier›` | change de dossier (extraction) |

## Exemples

**Créer (gzip)**

```powershell
tar -czf site.tar.gz .\site
```

**Extraire**

```powershell
tar -xzf site.tar.gz
```

**Extraire vers un dossier**

```powershell
tar -xzf site.tar.gz -C C:\www
```

## Dans les autres shells

- [[27-commandes/01-bash/03-archivage-compression/tar|tar (Bash)]]
- [[27-commandes/03-macos/03-archivage-compression/tar|tar (macOS)]]

*Mots-clés : tar archive windows tar.exe gzip extraire créer compresser bsdtar*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
