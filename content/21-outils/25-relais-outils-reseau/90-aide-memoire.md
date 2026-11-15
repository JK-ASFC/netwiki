---
title: socat, ncat, netcat et inetutils — aide-mémoire
description: Commandes socat (relais TCP/UDP, socket Unix HAProxy et Kea, client et serveur TLS, console série, service systemd), ncat (test de port, écoute contrôlée, TLS, proxy, ProxyCommand, transfert), netcat-openbsd (scan de ports, UDP, HTTP et SMTP bruts, proxy CONNECT) et GNU inetutils (telnet, ftp, whois), équivalents Windows.
tags: [aide-mémoire, socat, ncat, netcat, nc, inetutils, telnet, test de port]
icon: terminal
---

Explications : [[01-socat-ncat-netcat-inetutils|socat, ncat, netcat-openbsd et GNU inetutils]].

> [!WARNING]
> Écoute temporaire = adresse d'écoute précise + clients autorisés + arrêt après usage. Jamais d'exécution de programme à la connexion (`-e`, `--sh-exec`, `EXEC:`).

## socat

```bash
# Relais TCP limité au réseau d'administration
socat TCP4-LISTEN:8443,bind=10.0.99.10,range=10.0.99.0/24,fork,reuseaddr TCP4:10.0.20.15:443

# Relais UDP (syslog)
sudo socat UDP4-LISTEN:514,fork,reuseaddr UDP4:10.0.98.20:514

# Socket d'administration HAProxy
echo "show stat" | sudo socat stdio /run/haproxy/admin.sock
echo "show servers state" | sudo socat stdio /run/haproxy/admin.sock

# Socket de contrôle Kea
echo '{ "command": "status-get" }' | sudo socat - UNIX-CONNECT:/run/kea/kea4-ctrl-socket

# Client TLS vérifié
socat - OPENSSL:intranet.corp.exemple.fr:443,verify=1,cafile=/etc/ssl/certs/ca-certificates.crt

# TLS mutuel devant un service local
socat OPENSSL-LISTEN:4443,cert=/etc/ssl/relais/srv-app.pem,cafile=/etc/ssl/relais/ca-corp.pem,verify=1,fork,reuseaddr TCP4:127.0.0.1:8080

# Console série 9600 bauds (sortie : Ctrl+])
sudo socat -,raw,echo=0,escape=0x1d FILE:/dev/ttyUSB0,b9600,raw,echo=0

# Traces détaillées
socat -d -d TCP4-LISTEN:8443,fork,reuseaddr TCP4:10.0.20.15:443
```

## ncat

```bash
ncat -zv srv-web.corp.exemple.fr 443                      # port TCP ouvert ?
ncat -u -v 10.0.10.53 53                                  # UDP
ncat -l -k -p 8080 --allow 10.0.20.0/24 -v                # écoute de test (serveur)
ncat -v srv-app.corp.exemple.fr 8080                      # test depuis le client
ncat --ssl --ssl-verify -v intranet.corp.exemple.fr 443   # TLS vérifié
ncat --proxy proxy.corp.exemple.fr:3128 --proxy-type http srv-externe.exemple.org 22
ncat -l -p 9000 > sauvegarde.tar.gz                       # réception
ncat --send-only srv-backup.corp.exemple.fr 9000 < sauvegarde.tar.gz
```

```text ~/.ssh/config
Host *.exemple.org
    ProxyCommand ncat --proxy proxy.corp.exemple.fr:3128 --proxy-type http %h %p
```

## netcat-openbsd

```bash
readlink -f "$(command -v nc)"                            # quelle variante ?
nc -zv srv-mail.corp.exemple.fr 20-25                     # plage de ports
nc -zvu -w 3 10.0.10.53 53                                # UDP, délai 3 s
nc -l 9000                                                # écoute (OpenBSD)
nc -N srv-backup.corp.exemple.fr 9000 < sauvegarde.tar.gz # envoi puis fermeture
nc -C srv-mail.corp.exemple.fr 25                         # SMTP (CRLF)
printf 'GET / HTTP/1.1\r\nHost: intranet.corp.exemple.fr\r\nConnection: close\r\n\r\n' | nc intranet.corp.exemple.fr 80
nc -X connect -x proxy.corp.exemple.fr:3128 srv-externe.exemple.org 22
nc -U /run/haproxy/admin.sock                             # socket Unix
```

## GNU inetutils

```bash
sudo apt install inetutils-telnet inetutils-ftp           # Debian / Ubuntu
sudo pacman -S inetutils                                  # Arch
brew install inetutils                                    # macOS : gtelnet, gftp

telnet 10.0.99.5                                          # ancien équipement (réseau d'admin)
telnet srv-mail.corp.exemple.fr 25                        # test SMTP manuel
ftp ftp.corp.exemple.fr
whois exemple.fr
```

## Windows (PowerShell)

```powershell
Test-NetConnection srv-web.corp.exemple.fr -Port 443
tnc srv-web.corp.exemple.fr -Port 443 -InformationLevel Detailed
curl.exe -v https://intranet.corp.exemple.fr
Enable-WindowsOptionalFeature -Online -FeatureName TelnetClient
Get-NetTCPConnection -State Listen | Sort-Object LocalPort
& "C:\Program Files (x86)\Nmap\ncat.exe" -zv srv-web.corp.exemple.fr 443
```
