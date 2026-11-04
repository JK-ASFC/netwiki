---
title: "tail"
description: "Bash — tail (Analyse de logs) : Fin d'un fichier ; -f pour suivre en direct."
tags: [bash, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Fichiers & texte |
| **Contexte** | Analyse de logs |
| **Commande type** | `tail -f -n 100 app.log` |

## Rôle

Fin d'un fichier ; -f pour suivre en direct.

## En détail

Affiche les dernières lignes d'un fichier. Avec -f, suit un fichier de log en direct au fur et à mesure qu'il grandit.

## Options

| Option | Rôle |
| --- | --- |
| `-f` | suit les nouvelles lignes |
| `-n ‹N›` | N dernières lignes |
| `-F` | suit malgré la rotation |
| `--pid=‹PID›` | s'arrête avec un process |

## Exemples

**Suivre un log**

```bash
tail -f /var/log/syslog
```

**Deux logs à la fois**

```bash
tail -f app.log error.log
```

## Dans les autres shells

- [[27-commandes/03-macos/10-fichiers-texte/tail|tail (macOS)]]

*Mots-clés : logs lire suivre fin tail temps réel surveiller*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
