---
title: "openvpn"
description: "Bash — openvpn (OpenVPN / client-serveur) : Lance un client ou un serveur OpenVPN à partir d'un fichier de configuration."
tags: [bash, commande, vpn]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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
| `--client-config-dir ‹dossier›` | réglages par client, côté serveur |

## Exemples

**Se connecter**

```bash
sudo openvpn --config client1.ovpn
```

**Clé tls-crypt**

```bash
openvpn --genkey secret ta.key
```

**Suivre les clients connectés**

```bash
sudo openvpn --config server.conf --status /run/openvpn.status 10
```

## Dans les autres shells

- [[27-commandes/02-powershell/28-vpn/openvpn|openvpn (PowerShell)]]
- [[27-commandes/03-macos/28-vpn/openvpn|openvpn (macOS)]]

*Mots-clés : openvpn ovpn tunnel vpn tls certificat client serveur daemon tls-crypt status*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
