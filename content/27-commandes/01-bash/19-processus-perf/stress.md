---
title: "stress"
description: "Bash — stress (Charge & tests de résistance) : Impose une charge choisie de processeur, de mémoire, de disque ou d'entrées-sorties pour observer le système sous contrainte. Absent des installations par défaut."
tags: [bash, commande, processus-perf]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Processus & perf |
| **Contexte** | Charge & tests de résistance |
| **Commande type** | `stress -c 4 -t 30s` |

## Rôle

Impose une charge choisie de processeur, de mémoire, de disque ou d'entrées-sorties pour observer le système sous contrainte. Absent des installations par défaut.

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
| `(paquet) apt install stress` | dnf, pacman et zypper le fournissent aussi |
| `(voisin) stress-ng` | successeur maintenu, bien plus de types de charge |

## Exemples

**Saturer 4 coeurs 30 s**

```bash
stress -c 4 -t 30s
```

**Occuper 2 Go de mémoire**

```bash
stress -m 2 --vm-bytes 1G -t 1m
```

**Charge mixte détaillée**

```bash
stress -c 8 -i 4 -m 2 --vm-bytes 128M -t 10s -v
```

## Dans les autres shells

- [[27-commandes/03-macos/20-processus-perf/stress|stress (macOS)]]

*Mots-clés : charge stress test résistance montée cpu mémoire disque io saturation oom bench hogs workers*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
