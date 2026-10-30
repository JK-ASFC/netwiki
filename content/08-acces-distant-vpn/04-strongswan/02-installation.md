---
title: Installation (Linux, Windows, macOS)
description: Installer strongSwan avec swanctl sur Debian/Ubuntu et RHEL, arborescence /etc/swanctl, service charon-systemd, réglages noyau et pare-feu (IKE, NAT-T, ESP), journalisation de charon, migration depuis ipsec.conf, et rôle des clients IPsec natifs de Windows et macOS.
tags: [strongswan, installation, swanctl, charon, pare-feu, linux, windows, macos]
icon: download
---

## Debian / Ubuntu

```bash
sudo apt update
sudo apt install charon-systemd strongswan-swanctl strongswan-pki \
                 libcharon-extra-plugins libcharon-extauth-plugins libstrongswan-extra-plugins
sudo systemctl enable --now strongswan          # service « strongswan » = charon-systemd (swanctl)
swanctl --version
```

> [!NOTE]
> Le paquet `strongswan` (méta-paquet) installe aussi l'ancienne interface `ipsec`/`starter` (service `strongswan-starter`). N'activez **qu'un seul** des deux services : `strongswan` (swanctl, recommandé) ou `strongswan-starter` (ipsec.conf, déprécié).

## RHEL / Rocky / Alma

```bash
sudo dnf install epel-release
sudo dnf install strongswan
sudo systemctl enable --now strongswan          # charon-systemd ; configuration dans /etc/strongswan/swanctl/
```

RHEL fournit par défaut **Libreswan** (`dnf install libreswan`) ; strongSwan vient d'EPEL. Les chemins sont préfixés par `/etc/strongswan/` (ex. `/etc/strongswan/swanctl/swanctl.conf`, commande `swanctl` identique).

## Arborescence swanctl

| Chemin (Debian) | Contenu |
| --- | --- |
| `/etc/swanctl/swanctl.conf` | Connexions, pools d'adresses, secrets (ou `include conf.d/*.conf`) |
| `/etc/swanctl/conf.d/*.conf` | Une connexion par fichier (recommandé) |
| `/etc/swanctl/x509ca/` | Certificats des AC de confiance |
| `/etc/swanctl/x509/` | Certificats de la passerelle |
| `/etc/swanctl/private/` (ou `ecdsa/`, `rsa/`) | Clés privées |
| `/etc/swanctl/x509crl/` | CRL |
| `/etc/strongswan.conf` + `/etc/strongswan.d/` | Configuration de charon et des plugins (journaux, DNS, RADIUS…) |

```bash
sudo swanctl --load-all            # charger connexions, secrets, certificats
sudo swanctl --list-conns
sudo swanctl --list-sas
```

## Noyau et pare-feu

```bash
cat <<'EOF' | sudo tee /etc/sysctl.d/90-ipsec.conf
net.ipv4.ip_forward = 1
net.ipv6.conf.all.forwarding = 1
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0
EOF
sudo sysctl --system
```

```bash
# nftables : IKE, NAT-T, ESP
sudo nft add rule inet filter input udp dport { 500, 4500 } accept
sudo nft add rule inet filter input meta l4proto esp accept
# firewalld
sudo firewall-cmd --permanent --add-service=ipsec && sudo firewall-cmd --reload
```

> [!IMPORTANT]
> Si la passerelle fait aussi du **NAT** vers Internet, excluez le trafic IPsec de la traduction, sinon les paquets destinés au site distant sont « masqués » avant d'être chiffrés et ne correspondent plus aux politiques :
> ```bash
> nft insert rule ip nat postrouting ip saddr 10.0.0.0/16 ip daddr 192.168.11.0/24 accept
> # ou : nft … meta ipsec exists accept / rt ipsec exists
> ```

## Journalisation de charon

```text /etc/strongswan.d/charon-logging.conf
charon {
    filelog {
        charon {
            path = /var/log/charon.log
            time_format = %b %e %T
            ike_name = yes
            append = yes
            default = 1
            flush_line = yes
        }
    }
    syslog {
        identifier = charon
        daemon {
            default = 1
            ike = 1
            cfg = 1
        }
    }
}
```

Niveaux : `-1` silencieux, `0` essentiel, `1` normal, `2` détaillé (négociation), `3`-`4` débogage. Pour diagnostiquer : `ike = 2`, `cfg = 2`, `knl = 2`, `net = 1`.

```bash
sudo journalctl -u strongswan -f
```

## Migrer depuis ipsec.conf

| ipsec.conf (ancien) | swanctl.conf |
| --- | --- |
| `conn nom` | `connections { nom { … } }` |
| `left=` / `right=` | `local_addrs` / `remote_addrs` |
| `leftsubnet` / `rightsubnet` | `children { … { local_ts / remote_ts } }` |
| `ike=` / `esp=` | `proposals` / `esp_proposals` |
| `leftauth=pubkey` + `leftcert=` | `local { auth = pubkey  certs = … }` |
| `ipsec.secrets` | Section `secrets { }` |
| `auto=start` / `auto=route` | `start_action = start` / `trap` |

L'outil `swanctl` ne lit pas `ipsec.conf` : la conversion est manuelle (structure très proche).

## Windows et macOS

| Système | Rôle |
| --- | --- |
| **Windows 10/11, Server** | **Client IKEv2 natif** (aucun logiciel à installer) : connexions par `Add-VpnConnection`, GPO, Intune. Pour un **serveur** IPsec sous Windows : RRAS (rôle *Accès à distance*) — pas de strongSwan serveur |
| **macOS / iOS** | **Client IKEv2 natif** (profils `.mobileconfig`). `brew install strongswan` fournit les outils (`pki`, client en ligne de commande) pour des tests |
| **Android** | Application **strongSwan VPN Client** (officielle) |

La configuration de ces clients face à une passerelle strongSwan est décrite dans [[04-acces-distant-ikev2]].
