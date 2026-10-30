---
title: FreePBX — installation et interface
description: FreePBX (Sangoma), l'interface web d'administration d'Asterisk — éditions et modules (open source et commerciaux), installation de FreePBX 17 sur Debian 12 par le script officiel, assistant initial, tableau de bord, et configuration graphique pas à pas des extensions, trunks SIP, routes entrantes et sortantes, IVR, groupes de sonnerie, files d'attente, conditions horaires, messagerie, enregistrements et pare-feu intégré.
tags: [freepbx, asterisk, ipbx, interface web, trunk, ivr, debian]
icon: layout-dashboard
---

**FreePBX** est l'interface web la plus utilisée pour administrer **Asterisk** : elle génère les fichiers de configuration d'Asterisk à partir d'une base de données, ce qui permet de gérer un IPBX complet sans éditer `extensions.conf`. Développé par **Sangoma**, il existe en version libre (modules open source) avec des modules commerciaux optionnels (EndPoint Manager, Call Recording Reports…).

> [!IMPORTANT]
> Sur un système FreePBX, **ne modifiez pas** les fichiers générés (`extensions_additional.conf`, `pjsip.endpoint.conf`…) : ils sont réécrits à chaque *Apply Config*. Les personnalisations vont dans les fichiers `*_custom.conf` (ex. `extensions_custom.conf`, `pjsip.endpoint_custom_post.conf`).

## Installation (FreePBX 17 sur Debian 12)

FreePBX 17 s'installe par un **script officiel** sur un **Debian 12 minimal et neuf** (sans environnement graphique) :

```bash
sudo -i
cd /tmp
wget https://github.com/FreePBX/sng_freepbx_debian_install/raw/master/sng_freepbx_debian_install.sh -O sng_freepbx_debian_install.sh
bash sng_freepbx_debian_install.sh
```

Le script installe Asterisk (paquets Sangoma), Apache, PHP, MariaDB, FreePBX et ses modules. Ensuite : `https://<adresse-du-serveur>/admin` → création du compte administrateur, langue, fuseau horaire, activation (facultative) auprès de Sangoma.

Windows et macOS : FreePBX n'existe que pour Linux ; utilisez une machine virtuelle (Hyper-V, VirtualBox, UTM) ou une appliance Sangoma.

## Tableau de bord et principe « Apply Config »

| Élément | Rôle |
| --- | --- |
| *Dashboard* | État des services, appels en cours, enregistrements, mises à jour disponibles |
| Bouton rouge **Apply Config** | Écrit la configuration et recharge Asterisk : à cliquer après chaque série de modifications |
| *Admin → Module Admin* | Installation et mise à jour des modules |
| *Admin → System Admin* | Réseau, notifications, mises à jour (selon édition) |
| *Reports → CDR Reports*, *Asterisk Logfiles* | Historique d'appels, journaux |

## Configuration pas à pas

### 1. Paramètres SIP

*Settings → Asterisk SIP Settings* : réseaux locaux (*Local Networks*), adresse externe (*External Address*, bouton *Detect Network Settings*), codecs (G.722, alaw), plage RTP (10000–20000), transports PJSIP (UDP/TCP/TLS, ports).

### 2. Extensions (postes)

*Applications → Extensions → Add Extension → Add New SIP [chan_pjsip] Extension* : numéro (ex. 1001), nom affiché, **secret** (généré, à conserver), messagerie vocale (*Voicemail*: activer, code, adresse électronique), *Find Me/Follow Me*, enregistrement. L'onglet *Advanced* contient les réglages NAT, DTMF, transport.

### 3. Trunk SIP opérateur

*Connectivity → Trunks → Add Trunk → Add SIP (chan_pjsip) Trunk* :

| Onglet | Valeurs |
| --- | --- |
| *General* | Nom, **Outbound CallerID** (numéro présenté), nombre maximal de canaux |
| *pjsip Settings → General* | Nom d'utilisateur, secret, **Authentication** (Outbound / None pour une authentification par IP), **Registration** (Send / None), SIP Server et port |
| *pjsip Settings → Advanced* | From Domain, From User, *Contact User*, codecs, *Match (Permit)* pour les IP de l'opérateur |
| *Dialed Number Manipulation Rules* | Transformation des numéros sortants (ex. ajouter `+33`) |

### 4. Routes sortantes

*Connectivity → Outbound Routes* : nom, *Route CID*, trunk(s) dans l'ordre de préférence (bascule automatique), **Dial Patterns** :

| Motif | Rôle |
| --- | --- |
| `0[1-79]XXXXXXXX` | National hors surtaxés |
| `1[578]`, `112`, `114` | Urgences (cocher *Emergency* sur la route) |
| `00.` | International (route séparée, réservée par *Class of Service* ou code PIN) |

### 5. Routes entrantes

*Connectivity → Inbound Routes* : **DID Number** (numéro appelé tel que transmis par l'opérateur) et **Destination** (extension, IVR, groupe, file, condition horaire).

### 6. Accueil et distribution

| Module | Usage |
| --- | --- |
| *Applications → Time Conditions* + *Time Groups* | Horaires d'ouverture, jours fériés |
| *Applications → IVR* | Serveur vocal : annonce (*System Recordings*), choix 1, 2, 3… vers des destinations |
| *Applications → Ring Groups* | Groupe de postes (stratégies : ringall, hunt, memoryhunt…) |
| *Applications → Queues* | Files d'attente avec agents, musique d'attente, annonces |
| *Applications → Conferences* | Salles de conférence |
| *Admin → System Recordings* | Annonces (enregistrement par téléphone ou import WAV) |
| *Applications → Follow Me*, *Call Flow Control* | Renvoi vers mobile, interrupteur jour/nuit |

### 7. Pare-feu et sécurité

*Connectivity → Firewall* (module FreePBX) : zones (*Trusted*, *Local*, *Other*, *Internet*), **Responsive Firewall** (n'ouvre SIP aux adresses inconnues qu'après un enregistrement réussi et bloque les tentatives répétées), protection intrusion (fail2ban intégré, *Intrusion Detection*). Ajoutez le réseau d'administration en *Trusted* et n'exposez jamais l'interface `/admin` à Internet.

Suite : [[02-configuration-fwconsole|fwconsole, sauvegarde et dépannage]].
