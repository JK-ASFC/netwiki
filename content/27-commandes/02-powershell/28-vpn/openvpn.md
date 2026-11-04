---
title: "openvpn"
description: "PowerShell — openvpn (OpenVPN / client) : Client OpenVPN sous Windows : utile en script, l'interface graphique n'étant pas scriptable."
tags: [powershell, commande, vpn]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | VPN |
| **Contexte** | OpenVPN / client |
| **Commande type** | `openvpn --config client.ovpn` |

## Rôle

Client OpenVPN sous Windows : utile en script, l'interface graphique n'étant pas scriptable.

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
| `--block-outside-dns` | empêche toute requête DNS hors du tunnel (Windows) |
| `(dossier des profils)` | C:\Program Files\OpenVPN\config |
| `(service)` | Start-Service OpenVPNService |

## Exemples

**Connexion directe**

```powershell
openvpn --config client1.ovpn
```

**Déposer un profil**

```powershell
Copy-Item client1.ovpn 'C:\Program Files\OpenVPN\config\'
```

**Démarrer le service**

```powershell
Start-Service OpenVPNService
```

## Dans les autres shells

- [[27-commandes/01-bash/27-vpn/openvpn|openvpn (Bash)]]
- [[27-commandes/03-macos/28-vpn/openvpn|openvpn (macOS)]]

*Mots-clés : openvpn ovpn tunnel vpn tls certificat client serveur daemon tls-crypt status*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
