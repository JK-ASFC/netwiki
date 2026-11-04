---
title: "tcpdump"
description: "Bash — tcpdump (Analyse réseau / Forensic) : Capture de paquets avec filtre BPF."
tags: [bash, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Réseau |
| **Contexte** | Analyse réseau / Forensic |
| **Commande type** | `tcpdump -i eth0 -nn port 443` |

## Rôle

Capture de paquets avec filtre BPF.

## En détail

Capture et affiche le trafic réseau en temps réel. Permet d'inspecter ce qui circule réellement sur une interface, pour un diagnostic en profondeur.

## Options

| Option | Rôle |
| --- | --- |
| `-i ‹interface›` | interface |
| `-nn` | ni DNS ni ports |
| `-w ‹fichier.pcap›` | écrit |
| `-r ‹fichier.pcap›` | relit |
| `-c ‹N›` | arrête après N |

## Exemples

**Trafic web**

```bash
sudo tcpdump -i any -nn port 80 or port 443
```

**Sauver un pcap**

```bash
sudo tcpdump -i eth0 -w capture.pcap
```

## Dans les autres shells

- [[27-commandes/03-macos/22-reseau/tcpdump|tcpdump (macOS)]]

*Mots-clés : capture paquets trafic analyse réseau pcap sniff écoute tcpdump*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
