---
title: socat, ncat, netcat-openbsd et GNU inetutils
description: Outils réseau en ligne de commande pour l'administrateur — socat (GPL, adresses TCP/UDP/OPENSSL/UNIX/FILE, relais de ports avec fork, relais syslog UDP, API par socket Unix de HAProxy et Kea, enveloppe TLS et mTLS, console série), ncat du projet Nmap (test de port -z, écoute -l -k, TLS --ssl, contrôle d'accès --allow, proxy HTTP et ProxyCommand SSH, transfert de fichier), netcat-openbsd (nc par défaut de Debian/Ubuntu et macOS, -z -v -u -w -N -X, variantes traditional et BusyBox) et GNU inetutils (telnet, ftp, tftp, whois, ping, traceroute ; services historiques à ne pas exposer) ; équivalents Windows (Test-NetConnection, curl.exe, client Telnet), sécurité et dépannage.
tags: [socat, ncat, netcat, nc, inetutils, telnet, test de port, relais tcp, tls, port série, diagnostic réseau]
icon: cable
---

Ces petits outils répondent aux questions quotidiennes de l'administrateur réseau : *« le port 443 de ce serveur est-il joignable depuis ce VLAN ? »*, *« que répond réellement ce service ? »*, *« comment exposer temporairement ce port ? »*, *« comment parler à ce socket d'administration ? »*. Pour la capture et l'analyse fine, voir [[02-reseau-diagnostic/01-wireshark-capture|Wireshark et tcpdump]] ; pour la découverte de ports à grande échelle, [[02-reseau-diagnostic/03-nmap|Nmap]].

| Outil | Licence | Points forts | Paquet |
| --- | --- | --- | --- |
| **socat** | GPL 2 | Relie deux « adresses » quelconques : TCP, UDP, TLS, socket Unix, fichier, port série, processus | `socat` |
| **ncat** | Licence Nmap (NPSL) | netcat moderne : TLS, contrôle d'accès, proxy, mode courtier ; existe sous Windows | `ncat`, `nmap-ncat`, installeur Nmap |
| **netcat-openbsd** | BSD | `nc` installé par défaut sur Debian/Ubuntu et macOS ; tests rapides | `netcat-openbsd` |
| **GNU inetutils** | GPL 3 | Clients historiques : `telnet`, `ftp`, `tftp`, `whois`, `ping`, `traceroute` | `inetutils-*`, `inetutils` |

> [!WARNING]
> Ces outils peuvent ouvrir un port sur un serveur. Une écoute temporaire doit être **limitée** (pare-feu, `--allow`, adresse d'écoute précise), **surveillée** et **arrêtée** après usage. Les options qui exécutent un programme à chaque connexion (`-e`, `-c`, `--sh-exec` de netcat/ncat, adresse `EXEC`/`SYSTEM` de socat) donnent un shell à quiconque se connecte : à proscrire hors d'un laboratoire isolé. Sur les serveurs sensibles, n'installez pas ces outils en permanence.

## Installation

| Système | socat | ncat | netcat-openbsd | GNU inetutils |
| --- | --- | --- | --- | --- |
| Debian / Ubuntu | `sudo apt install socat` | `sudo apt install ncat` | `sudo apt install netcat-openbsd` | `sudo apt install inetutils-telnet inetutils-ftp inetutils-traceroute` |
| RHEL / Rocky / Fedora | `sudo dnf install socat` | `sudo dnf install nmap-ncat` | `sudo dnf install netcat` | Non empaqueté : `telnet`, `ftp`, `whois` séparés (`sudo dnf install telnet ftp whois`) |
| Alpine | `sudo apk add socat` | `sudo apk add nmap-ncat` | `sudo apk add netcat-openbsd` | `sudo apk add inetutils-telnet` |
| Arch | `sudo pacman -S socat` | `sudo pacman -S nmap` | `sudo pacman -S openbsd-netcat` | `sudo pacman -S inetutils` |
| macOS | `brew install socat` | `brew install nmap` | `nc` intégré | `brew install inetutils` (commandes préfixées `g` : `gtelnet`, `gftp`) |
| FreeBSD | `sudo pkg install socat` | `sudo pkg install nmap` | `nc` intégré | Outils du système de base |
| Windows | WSL | `winget install Insecure.Nmap` (ncat inclus) | WSL | Client Telnet de Windows (voir plus bas) |

## socat

`socat` relie deux **adresses** et copie les données dans les deux sens : `socat [options] <adresse1> <adresse2>`. Une adresse est un type suivi de paramètres et d'options séparées par des virgules : `TCP4-LISTEN:8443,fork,reuseaddr`, `OPENSSL:intranet.corp.exemple.fr:443`, `UNIX-CONNECT:/run/haproxy/admin.sock`, `-` (entrée/sortie standard).

| Adresse | Rôle |
| --- | --- |
| `TCP4-LISTEN:port` / `TCP4:hôte:port` | Écoute / connexion TCP (IPv4 ; `TCP6`, `TCP` selon besoin) |
| `UDP4-LISTEN:port` / `UDP4:hôte:port` | Écoute / envoi UDP |
| `OPENSSL:hôte:port` / `OPENSSL-LISTEN:port` | Client / serveur TLS (`cert=`, `key=`, `cafile=`, `verify=`) |
| `UNIX-CONNECT:chemin` / `UNIX-LISTEN:chemin` | Socket Unix |
| `FILE:/dev/ttyUSB0,b9600,raw,echo=0` | Port série |
| `-` ou `STDIO` | Terminal courant |

Options utiles : `fork` (un processus par connexion, sinon socat s'arrête après la première), `reuseaddr` (relance immédiate), `bind=10.0.99.10` (adresse d'écoute), `range=10.0.99.0/24` (clients autorisés), `-d -d` (traces), `-T 30` (délai d'inactivité).

### Relais de ports

```bash
# Relais TCP : le port 8443 de cette machine renvoie vers le 443 de srv-web, clients d'administration seulement
socat TCP4-LISTEN:8443,bind=10.0.99.10,range=10.0.99.0/24,fork,reuseaddr TCP4:10.0.20.15:443

# Relais syslog UDP vers le collecteur central
sudo socat UDP4-LISTEN:514,fork,reuseaddr UDP4:10.0.98.20:514
```

Pour un relais permanent, créez un service systemd plutôt qu'une commande dans un terminal :

```ini /etc/systemd/system/relais-web.service
[Unit]
Description=Relais TCP 8443 vers srv-web:443
After=network-online.target
Wants=network-online.target

[Service]
ExecStart=/usr/bin/socat TCP4-LISTEN:8443,bind=10.0.99.10,range=10.0.99.0/24,fork,reuseaddr TCP4:10.0.20.15:443
DynamicUser=yes
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload && sudo systemctl enable --now relais-web
```

### API d'administration par socket Unix

```bash
# HAProxy : statistiques et état des serveurs
echo "show stat" | sudo socat stdio /run/haproxy/admin.sock
echo "disable server web/srv-web-01" | sudo socat stdio /run/haproxy/admin.sock

# Kea DHCP : commande JSON sur le socket de contrôle
echo '{ "command": "status-get" }' | sudo socat - UNIX-CONNECT:/run/kea/kea4-ctrl-socket
```

Voir [[01-haproxy/01-presentation|HAProxy]] et [[02-kea/01-presentation-installation|Kea DHCP]].

### TLS

```bash
# Client TLS avec vérification du certificat (équivalent de openssl s_client, en interactif)
socat - OPENSSL:intranet.corp.exemple.fr:443,verify=1,cafile=/etc/ssl/certs/ca-certificates.crt

# Ajouter du TLS mutuel devant un service qui n'en a pas (port 8080 local)
socat OPENSSL-LISTEN:4443,cert=/etc/ssl/relais/srv-app.pem,cafile=/etc/ssl/relais/ca-corp.pem,verify=1,fork,reuseaddr TCP4:127.0.0.1:8080
```

`srv-app.pem` contient le certificat et la clé du serveur ; `verify=1` avec `cafile=` exige un certificat client signé par l'AC de l'entreprise. Pour un service durable, préférez un vrai mandataire ([[03-nginx/01-presentation|Nginx]], [[01-haproxy/01-presentation|HAProxy]], stunnel).

### Console série

```bash
# Console d'un commutateur par adaptateur USB-série (9600 bauds), sortie avec Ctrl+]
sudo socat -,raw,echo=0,escape=0x1d FILE:/dev/ttyUSB0,b9600,raw,echo=0
```

## ncat

`ncat` est la réécriture de netcat par le projet Nmap. Mêmes usages que `nc`, avec TLS, contrôle d'accès et proxys, et il fonctionne aussi sous **Windows**.

```bash
# Tester qu'un port TCP est ouvert (sans envoyer de données)
ncat -zv srv-web.corp.exemple.fr 443

# Port UDP (le résultat n'est fiable que si le service répond)
ncat -u -v 10.0.10.53 53

# Écoute de test pour valider une règle de pare-feu (sur le serveur), clients autorisés seulement
ncat -l -k -p 8080 --allow 10.0.20.0/24 -v
# … puis depuis un poste du VLAN 20
ncat -v srv-app.corp.exemple.fr 8080

# Client TLS, avec vérification du certificat
ncat --ssl --ssl-verify -v intranet.corp.exemple.fr 443

# Traverser le proxy HTTP de l'entreprise
ncat --proxy proxy.corp.exemple.fr:3128 --proxy-type http srv-externe.exemple.org 22

# Transfert ponctuel d'un fichier (réception puis envoi)
ncat -l -p 9000 > sauvegarde.tar.gz
ncat --send-only srv-backup.corp.exemple.fr 9000 < sauvegarde.tar.gz
```

Utilisation comme `ProxyCommand` SSH (sortie par le proxy) :

```text ~/.ssh/config
Host *.exemple.org
    ProxyCommand ncat --proxy proxy.corp.exemple.fr:3128 --proxy-type http %h %p
```

Sous Windows, `ncat.exe` est installé avec Nmap (`C:\Program Files (x86)\Nmap\ncat.exe`) et s'utilise avec les mêmes options dans PowerShell.

## netcat-openbsd (`nc`)

Debian et Ubuntu installent `netcat-openbsd` par défaut, macOS et FreeBSD fournissent leur `nc` BSD. Attention : les options diffèrent selon la variante.

| Variante | Écoute | Particularités |
| --- | --- | --- |
| OpenBSD (`netcat-openbsd`, macOS) | `nc -l 9000` | `-z` scan, `-N` ferme après fin de fichier, `-X`/`-x` proxy, `-U` socket Unix, pas de `-e` |
| Traditionnelle (`netcat-traditional`) | `nc -l -p 9000` | Ancienne, `-e` présent : à éviter |
| BusyBox (Alpine, équipements) | `nc -l -p 9000` | Options réduites |
| ncat | `ncat -l 9000` | Voir plus haut |

```bash
# Version installée (Debian/Ubuntu)
readlink -f "$(command -v nc)"

# Ports TCP 20 à 25 ouverts ?
nc -zv srv-mail.corp.exemple.fr 20-25

# DNS en UDP, délai 3 s
nc -zvu -w 3 10.0.10.53 53

# Requête HTTP brute (voir les en-têtes réels du serveur)
printf 'GET / HTTP/1.1\r\nHost: intranet.corp.exemple.fr\r\nConnection: close\r\n\r\n' | nc intranet.corp.exemple.fr 80

# Dialogue SMTP manuel (fins de ligne CRLF)
nc -C srv-mail.corp.exemple.fr 25

# Sortie par un proxy HTTP CONNECT (ProxyCommand SSH)
nc -X connect -x proxy.corp.exemple.fr:3128 srv-externe.exemple.org 22

# Envoyer un fichier et fermer à la fin
nc -N srv-backup.corp.exemple.fr 9000 < sauvegarde.tar.gz
```

Référence de la commande : [[01-bash/21-reseau/nc-netcat|nc (netcat)]].

## GNU inetutils

GNU inetutils regroupe des **clients et serveurs réseau historiques** : `telnet`, `ftp`, `tftp`, `rsh`/`rlogin`, `whois`, `ping`, `traceroute`, `ifconfig`, `hostname`, `logger`, ainsi que les démons `inetd`, `telnetd`, `ftpd`, `tftpd`, `syslogd`. Sous Debian/Ubuntu, chaque programme est un paquet séparé (`inetutils-telnet`, `inetutils-ftp`, `inetutils-ping`, `inetutils-traceroute`, `inetutils-tools`…) ; Arch installe tout avec `inetutils`.

Les **clients** restent utiles pour tester un service texte ou administrer un vieil équipement (pour TFTP, voir [[06-tftp/01-presentation-installation|serveur et clients TFTP]]) :

```bash
# Console Telnet d'un ancien équipement (réseau d'administration uniquement)
telnet 10.0.99.5

# Tester un service texte (SMTP, POP, IMAP) à la main
telnet srv-mail.corp.exemple.fr 25

# Client FTP (serveur interne historique)
ftp ftp.corp.exemple.fr

# Titulaire d'un nom de domaine
whois exemple.fr
```

> [!WARNING]
> Les **serveurs** `telnetd`, `ftpd`, `rshd`, `rlogind` transmettent identifiants et données **en clair**. Ne les installez pas : utilisez [[01-openssh/01-presentation|OpenSSH]] (SSH, SFTP) et, pour le transfert de fichiers, un serveur FTPS/SFTP. Sur les équipements réseau, désactivez Telnet au profit de SSH.

`ping` et `traceroute` d'inetutils ont des options différentes de `iputils-ping` et du `traceroute` de Linux ; sur Debian/Ubuntu, les paquets habituels restent `iputils-ping` et `traceroute` (voir [[26-diagnostic-l2-l3/01-traceroute-fping-arp-scan-arping|traceroute, fping, arp-scan et arping]]).

## Équivalents Windows

| Besoin | Commande Windows |
| --- | --- |
| Tester un port TCP | `Test-NetConnection srv-web.corp.exemple.fr -Port 443` (alias `tnc`) |
| Requête HTTP | `curl.exe -v https://intranet.corp.exemple.fr` (intégré depuis Windows 10) |
| Client Telnet | `Enable-WindowsOptionalFeature -Online -FeatureName TelnetClient` puis `telnet 10.0.99.5` |
| Relais, TLS, écoute | `ncat.exe` (installé avec Nmap) |
| Ports en écoute | `Get-NetTCPConnection -State Listen` |

## Dépannage

| Symptôme | Cause | Correction |
| --- | --- | --- |
| `nc: invalid option -- 'e'` ou `-p` refusé avec `-l` | Variante OpenBSD de netcat | `nc -l 9000` ; pour exécuter un programme, ne pas utiliser netcat |
| `Connection refused` | Port fermé sur la cible (service arrêté, écoute sur 127.0.0.1) | `ss -ltnp` sur la cible ; adresse d'écoute du service |
| Délai expiré sans réponse | Paquet filtré par un pare-feu (cible ou intermédiaire) | Tester depuis un autre VLAN ; journaux du pare-feu |
| Test UDP « réussi » sans service | UDP sans connexion : absence de rejet ICMP ≠ port ouvert | Interroger le service (`dig`, `snmpget`) |
| socat s'arrête après le premier client | Option `fork` absente | Ajouter `,fork,reuseaddr` à l'adresse d'écoute |
| `socat … Address already in use` | Port déjà pris ou socket en `TIME_WAIT` | `ss -ltnp \| grep 8443` ; option `reuseaddr` |
| TLS : `certificate verify failed` | Chaîne incomplète ou AC d'entreprise absente | `cafile=` (socat), `--ssl-trustfile` (ncat) ; voir [[19-audit-tls/01-presentation-utilisation\|audit TLS]] |

Commandes prêtes à copier : [[90-aide-memoire|aide-mémoire]].
