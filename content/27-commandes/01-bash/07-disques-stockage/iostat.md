---
title: "iostat"
description: "Bash — iostat (Disques / Perf) : Statistiques d'E/S disque (paquet sysstat)."
tags: [bash, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Disques & stockage |
| **Contexte** | Disques / Perf |
| **Commande type** | `iostat -dx 2` |

## Rôle

Statistiques d'E/S disque (paquet sysstat).

## En détail

Affiche l'activité des disques (lectures et écritures) et du processeur. Sert à repérer un disque qui ralentit la machine.

## Options

| Option | Rôle |
| --- | --- |
| `-d` | n'affiche que les statistiques par PÉRIPHÉRIQUE (masque la partie CPU) |
| `-c` | n'affiche que la partie CPU |
| `-x` | statistiques ÉTENDUES : latences (r_await, w_await), file d'attente (aqu-sz), taux d'occupation (%util) |
| `-m` | tailles en Mo/s |
| `-k` | tailles en Ko/s |
| `-h` | format LISIBLE par un humain : unités adaptées et colonnes alignées |
| `-p ‹périphérique ou ALL›` | détaille aussi les PARTITIONS : -p sda (un disque) ou -p ALL (tous) |
| `-t` | horodate chaque relevé |
| `-z` | masque les périphériques sans activité |
| `-N` | affiche les noms des volumes logiques LVM (device mapper) |
| `-y` | ignore le tout premier relevé (moyennes depuis le démarrage) |
| `‹intervalle en s› ‹nb de relevés›` | rafraîchissement : intervalle en secondes, puis nombre de relevés (vide = en continu) |

## Exemples

**Débit disque**

```bash
iostat -dx 2
```

**En Mo/s**

```bash
iostat -dm 2
```

**Une fois**

```bash
iostat -dx
```

## Dans les autres shells

- [[27-commandes/03-macos/07-disques-stockage/iostat|iostat (macOS)]]

*Mots-clés : io disque débit latence performance iostat sysstat*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
