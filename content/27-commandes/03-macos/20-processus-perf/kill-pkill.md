---
title: "kill / pkill"
description: "macOS — kill / pkill (Résolution d'incidents) : Signal à un processus (-15 propre, -9 brutal)."
tags: [macos, commande, processus-perf]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Processus & perf |
| **Contexte** | Résolution d'incidents |
| **Commande type** | `kill -15 <pid>` |

## Rôle

Signal à un processus (-15 propre, -9 brutal).

## En détail

Arrête un programme recalcitrant. kill vise par identifiant (PID), pkill vise par nom. Indispensable quand une application est bloquée.

## Options

| Option | Rôle |
| --- | --- |
| `-SIGTERM / -SIGKILL / -SIGHUP / -SIGINT` | signal à envoyer (un seul) : SIGTERM = arrêt propre (défaut, laisse le programme se fermer) · SIGKILL = force l'arrêt immédiat (dernier recours) · SIGHUP = fait relire sa config à un service · SIGINT = comme Ctrl+C |
| `(kill -l liste tous les signaux et leurs numeros : -15 = SIGTERM, -9 = SIGKILL, -1 = SIGHUP, -2 = SIGINT)` |  |
| `(pkill vise par NOM au lieu du PID : pkill -f motif tue par motif, pkill -HUP nginx recharge un service)` |  |

## Exemples

**Propre puis brutal**

```zsh
kill 1234 || kill -9 1234
```

**Recharger nginx**

```zsh
sudo pkill -HUP nginx
```

## Dans les autres shells

- [[27-commandes/01-bash/19-processus-perf/kill-pkill|kill / pkill (Bash)]]

*Mots-clés : tuer processus signal forcer arrêter pid stopper pkill recharger*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
