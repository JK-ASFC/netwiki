---
title: "stress"
description: "macOS — stress (Charge & tests de résistance) : Impose une charge choisie de processeur, de mémoire, de disque ou d'entrées-sorties. Ni stress ni stress-ng ne sont livres avec macOS : ils viennent de Homebrew."
tags: [macos, commande, processus-perf]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Processus & perf |
| **Contexte** | Charge & tests de résistance |
| **Commande type** | `stress -c 4 -t 30s` |

## Rôle

Impose une charge choisie de processeur, de mémoire, de disque ou d'entrées-sorties. Ni stress ni stress-ng ne sont livres avec macOS : ils viennent de Homebrew.

## Options

| Option | Rôle |
| --- | --- |
| `-c ‹N›` | N processus qui saturent le processeur (sqrt) |
| `-m ‹N›` | N processus qui allouent puis liberent de la mémoire |
| `--vm-bytes ‹taille›` | mémoire allouée PAR processus -m (défaut 256M) |
| `--vm-keep` | resalit la mémoire au lieu de la libérer et de la reallouer |
| `--vm-hang ‹N›` | attend N s avant de libérer ; 0 = ne libère jamais |
| `-i ‹N›` | N processus qui appellent sync() en boucle |
| `-d ‹N›` | N processus qui écrivent puis effacent un fichier |
| `--hdd-bytes ‹taille›` | volume écrit PAR processus -d (défaut 1G) |
| `--hdd-noclean` | conserve les fichiers écrits au lieu de les effacer |
| `-t ‹duree›` | arrêt automatique après la durée (s, m, h, d, y) |
| `--backoff ‹N›` | attend N microsecondes avant de commencer |
| `-n` | montre ce qui serait fait sans rien exécuter |
| `-q` | silencieux |
| `-v` | détaillé le lancement de chaque processus |
| `(brew) brew install stress` | aucun des deux outils n'est fourni par macOS |
| `(voisin) stress-ng` | successeur maintenu, brew install stress-ng |

## Exemples

**Saturer 4 coeurs 30 s**

```zsh
stress -c 4 -t 30s
```

**Tous les coeurs**

```zsh
stress -c $(sysctl -n hw.ncpu) -t 30s
```

**Charge mixte détaillée**

```zsh
stress -c 8 -i 4 -m 2 --vm-bytes 128M -t 10s -v
```

## Dans les autres shells

- [[27-commandes/01-bash/19-processus-perf/stress|stress (Bash)]]

*Mots-clés : charge stress test résistance montée cpu mémoire disque io saturation homebrew brew hogs workers*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
