---
title: "launchctl"
description: "macOS — launchctl (Services (launchd)) : Pilote launchd, le gestionnaire de services et d'agents de macOS (l'équivalent de systemctl)."
tags: [macos, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Système |
| **Contexte** | Services (launchd) |
| **Commande type** | `launchctl list` |

## Rôle

Pilote launchd, le gestionnaire de services et d'agents de macOS (l'équivalent de systemctl).

## Options

| Option | Rôle |
| --- | --- |
| `list` | liste les services chargés (PID, état, label) |
| `load -w ‹fichier.plist›` | charge un service et l'active au démarrage |
| `unload -w ‹fichier.plist›` | décharge un service et le désactive |
| `bootstrap ‹domaine› ‹plist›` | syntaxe moderne pour charger un service |
| `bootout ‹domaine› ‹plist›` | syntaxe moderne pour retirer un service |
| `kickstart -k ‹domaine/service›` | redémarre un service |
| `print ‹domaine/service›` | état détaillé d'un service |
| `enable ‹service›` | autorise le service |
| `setenv ‹VAR valeur›` | définit une variable pour launchd |

## Exemples

**Lister les services**

```zsh
launchctl list
```

**Charger un agent utilisateur**

```zsh
launchctl load -w ~/Library/LaunchAgents/com.exemple.plist
```

**Redémarrer un service**

```zsh
sudo launchctl kickstart -k system/com.exemple.service
```

*Mots-clés : service launchd démon agent launchctl démarrer charger plist*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
