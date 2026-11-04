---
title: "openvpn"
description: "macOS — openvpn (OpenVPN / client-serveur) : Lance un client ou un serveur OpenVPN à partir d'un fichier de configuration."
tags: [macos, commande, vpn]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | VPN |
| **Contexte** | OpenVPN / client-serveur |
| **Commande type** | `openvpn --config client.ovpn` |

## Rôle

Lance un client ou un serveur OpenVPN à partir d'un fichier de configuration.

## Options

| Option | Rôle |
| --- | --- |
| `--config ‹fichier›` | fichier de configuration (.ovpn ou .conf) |
| `--daemon` | passe en arrière-plan |
| `--verb ‹0-9›` | niveau de détail du journal (3 par défaut) |
| `--log ‹fichier›` | écrit le journal dans un fichier |
| `--status ‹fichier› ‹sec›` | état des clients connectés, rafraîchi périodiquement |
| `--genkey secret ‹fichier›` | génère une clé tls-crypt (OpenVPN 2.5+) |
| `--data-ciphers ‹liste›` | algorithmes de données acceptés |
| `--auth-user-pass [‹fichier›]` | identifiants, ou fichier les contenant |
| `--cd ‹dossier›` | se place dans ce dossier avant de lire les chemins relatifs |
| `--mssfix ‹octets›` | limite la taille des segments TCP dans le tunnel |
| `--explicit-exit-notify` | prévient le serveur à la déconnexion (UDP) |
| `--test-crypto` | vérifie la configuration cryptographique sans se connecter |
| `--show-ciphers` | liste les algorithmes disponibles |
| `--auth-nocache` | ne garde pas les identifiants en mémoire |
| `(chemin Homebrew)` | /opt/homebrew/etc/openvpn |
| `(service)` | sudo brew services start openvpn |

## Exemples

**Installer**

```zsh
brew install openvpn
```

**Se connecter**

```zsh
sudo openvpn --config client1.ovpn
```

**En service**

```zsh
sudo brew services start openvpn
```

## Dans les autres shells

- [[27-commandes/01-bash/27-vpn/openvpn|openvpn (Bash)]]
- [[27-commandes/02-powershell/28-vpn/openvpn|openvpn (PowerShell)]]

*Mots-clés : openvpn ovpn tunnel vpn tls certificat client serveur daemon tls-crypt status*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
