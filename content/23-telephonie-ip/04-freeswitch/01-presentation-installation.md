---
title: FreeSWITCH — présentation et installation
description: FreeSWITCH, plateforme de commutation téléphonique libre (SignalWire) — usages (IPBX, SBC, conférence, centre d'appels, WebRTC), architecture modulaire (Sofia SIP, dialplan XML, Lua, ESL), installation sous Linux (dépôt SignalWire avec jeton, sources), Windows (MSI), macOS (Homebrew), Docker, arborescence de configuration, sécurisation initiale et interface graphique FusionPBX.
tags: [freeswitch, voip, sip, ipbx, fusionpbx, installation, windows, macos]
icon: server-cog
---

**FreeSWITCH** (licence MPL, maintenu par **SignalWire**) est un moteur de communication multi-plateforme conçu pour la montée en charge : IPBX, serveur de conférences, SBC, centre d'appels, passerelle WebRTC (module `mod_verto`). Il ne propose pas d'interface graphique : celle-ci vient de projets comme **FusionPBX** (le plus répandu).

## Architecture

| Élément | Rôle |
| --- | --- |
| **mod_sofia** | Pile SIP : *profils* (`internal` port 5060 pour les postes, `external` port 5080 pour les trunks) et *gateways* (comptes opérateurs) |
| **Annuaire** (*directory*) | Utilisateurs SIP en XML |
| **Dialplan XML** | Extensions avec conditions sur des variables (expressions régulières) et actions |
| Applications | `bridge`, `answer`, `playback`, `voicemail`, `conference`, `ivr`, `callcenter`, `record_session`… |
| Scripts | Lua, JavaScript, Python |
| **ESL** (*Event Socket Library*) | Contrôle externe par TCP 8021 (supervision, applications) |
| `fs_cli` | Console d'administration |

## Installation

### Linux (Debian 12)

Les paquets officiels sont distribués par SignalWire et nécessitent un **jeton personnel gratuit** (compte SignalWire) :

```bash
TOKEN=pat_xxxxxxxxxxxxxxxx
sudo apt update && sudo apt install -y gnupg2 wget lsb-release
sudo wget --http-user=signalwire --http-password=$TOKEN -O /usr/share/keyrings/signalwire-freeswitch-repo.gpg \
  https://freeswitch.signalwire.com/repo/deb/debian-release/signalwire-freeswitch-repo.gpg
echo "machine freeswitch.signalwire.com login signalwire password $TOKEN" | sudo tee /etc/apt/auth.conf.d/freeswitch.conf
sudo chmod 600 /etc/apt/auth.conf.d/freeswitch.conf
echo "deb [signed-by=/usr/share/keyrings/signalwire-freeswitch-repo.gpg] https://freeswitch.signalwire.com/repo/deb/debian-release/ $(lsb_release -sc) main" | sudo tee /etc/apt/sources.list.d/freeswitch.list
sudo apt update && sudo apt install -y freeswitch-meta-all
sudo systemctl enable --now freeswitch
fs_cli
```

Alternative : compilation depuis les sources (dépôt GitHub `signalwire/freeswitch`, dépendances `spandsp` et `sofia-sip` à compiler d'abord), ou **FusionPBX** dont le script d'installation installe FreeSWITCH, PostgreSQL et l'interface web.

### Windows

Installeur **MSI** 64 bits (site de FreeSWITCH, section *Windows*) : installe FreeSWITCH comme service dans `C:\Program Files\FreeSWITCH` ; `fs_cli.exe` dans le même dossier. Pensez au pare-feu Windows (5060, 5080, plage RTP 16384–32768).

```powershell
Get-Service FreeSWITCH
& "C:\Program Files\FreeSWITCH\fs_cli.exe" -x "sofia status"
New-NetFirewallRule -DisplayName "FreeSWITCH SIP" -Direction Inbound -Protocol UDP -LocalPort 5060,5080 -RemoteAddress 10.0.0.0/8 -Action Allow
New-NetFirewallRule -DisplayName "FreeSWITCH RTP" -Direction Inbound -Protocol UDP -LocalPort 16384-32768 -Action Allow
```

### macOS et Docker

```bash
brew install freeswitch          # macOS (laboratoire, développement)
freeswitch -nc                   # démarrage en arrière-plan
fs_cli
```

Docker : images communautaires (réseau `host` conseillé à cause de la plage RTP).

## Arborescence de configuration

| Chemin (Linux) | Contenu |
| --- | --- |
| `/etc/freeswitch/vars.xml` | Variables globales : **`default_password`**, domaine, codecs, adresses |
| `/etc/freeswitch/sip_profiles/internal.xml`, `external.xml` | Profils SIP |
| `/etc/freeswitch/sip_profiles/external/*.xml` | Gateways (trunks) |
| `/etc/freeswitch/directory/default/*.xml` | Utilisateurs |
| `/etc/freeswitch/dialplan/default.xml`, `public.xml` | Dialplan interne / entrant |
| `/etc/freeswitch/autoload_configs/` | Configuration des modules (`modules.conf.xml`, `event_socket.conf.xml`, `acl.conf.xml`…) |
| `/var/log/freeswitch/freeswitch.log` | Journal |

## Sécurisation initiale

> [!WARNING]
> La configuration d'exemple définit `default_password=1234` pour **tous** les utilisateurs 1000 à 1019 : changez-la immédiatement (et supprimez les utilisateurs inutiles), sinon le serveur sera utilisé pour de la fraude en quelques heures.

```xml
<!-- /etc/freeswitch/vars.xml -->
<X-PRE-PROCESS cmd="set" data="default_password=Zr8vK3qW7pLx2NcT9mBd"/>
```

```xml
<!-- /etc/freeswitch/autoload_configs/event_socket.conf.xml -->
<configuration name="event_socket.conf" description="Socket Client">
  <settings>
    <param name="listen-ip" value="127.0.0.1"/>
    <param name="listen-port" value="8021"/>
    <param name="password" value="Qm5tY8wR2vKp6XzL"/>
  </settings>
</configuration>
```

Le mot de passe ESL par défaut (`ClueCon`) est connu de tous : changez-le et limitez l'écoute à `127.0.0.1`.

## Interface graphique : FusionPBX

**FusionPBX** (PHP, PostgreSQL) apporte une interface web multi-locataire au-dessus de FreeSWITCH : domaines, extensions, gateways, routes, IVR, files (*call center*), conférences, messagerie, CDR, provisionnement de postes. Installation sur Debian par le script officiel du projet (dépôt `fusionpbx-install.sh`), puis administration sur `https://<serveur>`.

Suite : [[02-configuration-fs-cli|configuration, dialplan XML et fs_cli]].
