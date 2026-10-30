---
title: Présentation, installation et configuration
description: Fail2ban — principe (surveillance des journaux, filtres, actions de bannissement), installation sous Debian/Ubuntu, RHEL et macOS, jail.local (prisons SSH, serveurs web, messagerie, VPN), lecture du journal systemd, actions nftables et firewalld, bannissement progressif, prison « recidive », liste blanche et alternatives sous Windows.
tags: [fail2ban, bannissement, force brute, ssh, nftables, firewalld, sécurité]
icon: info
---

**Fail2ban** surveille les journaux (fichiers ou journal systemd), repère par **expressions régulières** les échecs répétés (authentification SSH, SMTP, IMAP, pages de connexion web, VPN) et **bannit** temporairement les adresses fautives dans le pare-feu. Simple et éprouvé, il réduit fortement le bruit et les attaques par force brute sur les services exposés.

```mermaid
flowchart LR
  J["Journaux<br/>(journald, /var/log/…)"] --> F["Filtre<br/>(regex failregex)"]
  F -- "maxretry échecs<br/>en findtime" --> A["Action<br/>(nftables, firewalld,<br/>iptables, courriel)"]
  A --> B["IP bannie pendant bantime"]
```

| Notion | Rôle |
| --- | --- |
| **Prison** (*jail*) | Associe un filtre, des journaux, des seuils et une action |
| **Filtre** | Expressions `failregex` / `ignoreregex` (`/etc/fail2ban/filter.d/`) |
| **Action** | Ce qui est fait au bannissement (`/etc/fail2ban/action.d/`) |
| `maxretry`, `findtime`, `bantime` | Nombre d'échecs, fenêtre d'observation, durée du bannissement |

## Installation

```bash
sudo apt install fail2ban                 # Debian / Ubuntu
sudo dnf install epel-release && sudo dnf install fail2ban fail2ban-firewalld   # RHEL
sudo systemctl enable --now fail2ban
fail2ban-client version
```

macOS : `brew install fail2ban` (action `pf`). Windows n'est pas pris en charge : utilisez **IPBan** (DigitalRuby) ou les protections intégrées (verrouillage de compte, pare-feu, Defender).

## jail.local

Ne modifiez jamais `jail.conf` : créez `jail.local` ou des fichiers dans `jail.d/`.

```fail2ban /etc/fail2ban/jail.local
[DEFAULT]
# Lecture du journal systemd (Debian 12 n'écrit plus /var/log/auth.log par défaut)
backend = systemd
banaction = nftables-multiport
banaction_allports = nftables-allports
bantime = 1h
findtime = 10m
maxretry = 5
# Bannissement progressif : chaque récidive multiplie la durée
bantime.increment = true
bantime.factor = 2
bantime.maxtime = 1w
# Ne jamais bannir l'administration
ignoreip = 127.0.0.1/8 ::1 10.0.99.0/24
destemail = securite@exemple.fr
sender = fail2ban@exemple.fr

[sshd]
enabled = true
port = ssh
mode = aggressive

[nginx-http-auth]
enabled = true
logpath = /var/log/nginx/error.log
backend = auto

[postfix-sasl]
enabled = true
port = smtp,submission,submissions

[dovecot]
enabled = true

[recidive]
enabled = true
logpath = /var/log/fail2ban.log
backend = auto
banaction = %(banaction_allports)s
bantime = 1w
findtime = 1d
maxretry = 3
```

| Paramètre | Remarque |
| --- | --- |
| `backend = systemd` | Lit journald (filtres qui utilisent `journalmatch`) ; `auto` pour les fichiers |
| `banaction` | `nftables-multiport`, `firewallcmd-rich-rules` (RHEL), `iptables-multiport`, `pf` (macOS/BSD) |
| `mode = aggressive` (sshd) | Inclut aussi les échanges de clés avortés, préauthentification |
| `recidive` | Bannit **longtemps et sur tous les ports** les adresses bannies plusieurs fois |
| `ignoreip` | Liste blanche (réseaux d'administration, supervision) |

```bash
sudo fail2ban-client -t                 # tester la configuration
sudo systemctl reload fail2ban
sudo fail2ban-client status
sudo fail2ban-client status sshd
```

> [!WARNING]
> Fail2ban ne protège que ce qui est **journalisé** et ne remplace ni l'authentification par clé, ni le MFA, ni un filtrage d'accès aux services d'administration. Derrière un **reverse proxy** ou un répartiteur, les journaux doivent contenir l'**adresse réelle** du client (X-Forwarded-For / PROXY protocol), sinon c'est le proxy qui sera banni.

## Suite

[[02-filtres-exploitation|Filtres personnalisés, actions et exploitation]]
