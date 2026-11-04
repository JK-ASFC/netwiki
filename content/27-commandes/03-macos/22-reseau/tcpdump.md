---
title: "tcpdump"
description: "macOS — tcpdump (Capture réseau) : Capture et analyse le trafic réseau en direct."
tags: [macos, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Réseau |
| **Contexte** | Capture réseau |
| **Commande type** | `sudo tcpdump -i en0 -nn` |

## Rôle

Capture et analyse le trafic réseau en direct.

## En détail

Capture et affiche le trafic réseau en temps réel. Permet d'inspecter ce qui circule réellement sur une interface, pour un diagnostic en profondeur.

## Options

| Option | Rôle |
| --- | --- |
| `-i ‹interface›` | interface à écouter (en0, en1) |
| `-nn` | pas de résolution DNS ni de noms de ports |
| `-w ‹fichier.pcap›` | écrit la capture dans un fichier |
| `-r ‹fichier.pcap›` | rejoue une capture |
| `port ‹N›` | filtre sur un port |
| `host ‹IP›` | filtre sur une adresse |

## Exemples

**Écouter le Wi-Fi**

```zsh
sudo tcpdump -i en0 -nn
```

**Trafic web**

```zsh
sudo tcpdump -i en0 -nn 'port 80 or port 443'
```

**Vers un fichier**

```zsh
sudo tcpdump -i en0 -w capture.pcap
```

## Dans les autres shells

- [[27-commandes/01-bash/21-reseau/tcpdump|tcpdump (Bash)]]

*Mots-clés : capture réseau tcpdump paquets trafic analyse sniff*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
