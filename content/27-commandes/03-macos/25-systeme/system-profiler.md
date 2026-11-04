---
title: "system_profiler"
description: "macOS — system_profiler (Inventaire matériel) : Inventaire détaillé du matériel et du logiciel (équivalent d'un rapport système)."
tags: [macos, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Système |
| **Contexte** | Inventaire matériel |
| **Commande type** | `system_profiler SPHardwareDataType` |

## Rôle

Inventaire détaillé du matériel et du logiciel (équivalent d'un rapport système).

## Options

| Option | Rôle |
| --- | --- |
| `SPHardwareDataType` | modèle, puce, mémoire, numéro de série |
| `SPSoftwareDataType` | OS, noyau, uptime |
| `SPStorageDataType` | volumes et disques |
| `SPNetworkDataType` | interfaces réseau |
| `-detailLevel ‹mini/basic/full›` | niveau de détail |

## Exemples

**Matériel**

```zsh
system_profiler SPHardwareDataType
```

**Logiciel**

```zsh
system_profiler SPSoftwareDataType
```

**Stockage**

```zsh
system_profiler SPStorageDataType
```

*Mots-clés : matériel inventaire hardware system_profiler rapport*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
