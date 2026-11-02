---
title: Application Mullvad VPN
description: Mullvad VPN app — client open source (GPL) du service VPN commercial Mullvad, axé vie privée : WireGuard et OpenVPN, numéro de compte sans e-mail, coupe-circuit et mode verrouillé (lockdown), DNS filtrants, multihop, DAITA et obfuscation (UDP over TCP, Shadowsocks, QUIC), split tunneling, installation Windows, macOS, Linux (dépôt APT/RPM), Android, iOS, CLI mullvad, et place d'un VPN grand public face à un VPN d'entreprise.
tags: [mullvad, vpn, wireguard, vie privée, client, cli]
icon: info
---

L'**application Mullvad VPN** est le client libre du service **Mullvad** (Suède) : il ne s'agit pas d'un VPN d'entreprise pour joindre un réseau interne, mais d'un **VPN de confidentialité** (sortie Internet via les serveurs de Mullvad). Pour un administrateur, il sert à tester un service depuis un autre pays, protéger un poste sur un Wi-Fi public, ou comparer avec les clients d'entreprise.

| Fonction | Détail |
| --- | --- |
| Protocoles | **WireGuard** (par défaut) ; OpenVPN abandonné progressivement par le service |
| Compte | Numéro à 16 chiffres, sans e-mail ; paiement possible en espèces ou cryptomonnaie |
| **Coupe-circuit** | Toujours actif ; **Lockdown mode** bloque tout trafic hors VPN, même app fermée |
| DNS | Blocage publicités, traqueurs, logiciels malveillants, contenus adultes, jeux d'argent ; DNS personnalisé |
| Anti-censure | *UDP-over-TCP*, Shadowsocks, QUIC, multihop, **DAITA** (brouillage de l'analyse de trafic) |
| Split tunneling | Applications exclues du tunnel (Windows, Linux, Android, macOS) |
| Accès au LAN | Option *Local network sharing* (imprimantes, NAS) |

## Installation

```bash
# Debian/Ubuntu : dépôt officiel
sudo curl -fsSLo /usr/share/keyrings/mullvad-keyring.asc https://repository.mullvad.net/deb/mullvad-keyring.asc
echo "deb [signed-by=/usr/share/keyrings/mullvad-keyring.asc arch=$(dpkg --print-architecture)] https://repository.mullvad.net/deb/stable stable main" | sudo tee /etc/apt/sources.list.d/mullvad.list
sudo apt update && sudo apt install mullvad-vpn
# Fedora/RHEL
sudo dnf config-manager addrepo --from-repofile=https://repository.mullvad.net/rpm/stable/mullvad.repo && sudo dnf install mullvad-vpn
```

Windows : `winget install MullvadVPN.MullvadVPN` ou installeur ; macOS : PKG ou `brew install --cask mullvad-vpn` ; Android : Play Store ou F-Droid ; iOS : App Store.

## CLI

```bash
mullvad account login 1234567890123456
mullvad relay set location se got           # pays et ville (Göteborg)
mullvad lockdown-mode set on
mullvad dns set default --block-ads --block-trackers --block-malware
mullvad lan set allow
mullvad connect ; mullvad status ; mullvad disconnect
```

> [!NOTE]
> Sur un poste d'entreprise, un VPN grand public peut contourner la supervision et la politique de sécurité : faites valider son usage. Pour joindre le réseau interne, utilisez le VPN d'entreprise ([[03-wireguard/01-presentation-installation|WireGuard]], [[02-openvpn/01-presentation|OpenVPN]], [[11-netbird-nebula/01-netbird|NetBird]]).

Interface : [[04-interface-graphique|interfaces graphiques]] · commandes : [[90-aide-memoire|aide-mémoire]].
