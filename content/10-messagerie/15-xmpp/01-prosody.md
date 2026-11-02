---
title: XMPP et Prosody
description: XMPP (Jabber) — protocole ouvert de messagerie instantanée fédérée (JID, client-serveur 5222, serveur-serveur 5269, enregistrements DNS SRV, extensions XEP modernes : MAM, Carbons, Stream Management, HTTP File Upload, OMEMO, MUC), comparatif des serveurs, et Prosody (Lua, MIT) : installation Debian/Ubuntu (paquets officiels), RHEL (EPEL), Alpine, Arch, FreeBSD, macOS, Docker, configuration prosody.cfg.lua (VirtualHost, salons MUC, partage de fichiers, chiffrement obligatoire), certificats (prosodyctl cert import), comptes, modules communautaires, BOSH et WebSocket, sauvegarde, mise à jour et dépannage.
tags: [xmpp, jabber, prosody, messagerie instantanée, fédération, omemo, muc]
icon: info
---

**XMPP** (*Extensible Messaging and Presence Protocol*, ex-Jabber) est le protocole **ouvert et fédéré** historique de la messagerie instantanée : chaque organisation exploite son serveur, les utilisateurs ont une adresse de type courriel (**JID** : `jk@corp.exemple.fr`) et les serveurs communiquent entre eux. Il sert de base à de nombreux produits (WhatsApp à l'origine, Jitsi Meet pour la signalisation, objets connectés) et reste très répandu en entreprise et dans le secteur public pour sa sobriété et son interopérabilité. Alternative moderne : [[11-matrix/01-synapse-ess|Matrix]].

| Fonction | Extension (XEP) |
| --- | --- |
| Historique côté serveur | MAM (XEP-0313) |
| Messages sur tous les appareils | Carbons (XEP-0280) |
| Reconnexion mobile sans perte | Stream Management (XEP-0198) |
| Envoi de fichiers | HTTP File Upload (XEP-0363) |
| Salons de discussion | MUC (XEP-0045) |
| Chiffrement de bout en bout | OMEMO (XEP-0384) |
| Notifications push mobiles | Push (XEP-0357) |

## Ports et DNS

| Port | Rôle |
| --- | --- |
| 5222/tcp | Clients (STARTTLS) |
| 5223/tcp | Clients en TLS direct (selon configuration) |
| 5269/tcp | Fédération serveur à serveur |
| 5280/5281 tcp | HTTP/HTTPS : BOSH, WebSocket, partage de fichiers, administration |
| 3478/udp et tcp | STUN/TURN pour les appels audio/vidéo (coturn) |

```text
_xmpp-client._tcp.corp.exemple.fr. 3600 IN SRV 0 5 5222 xmpp.corp.exemple.fr.
_xmpp-server._tcp.corp.exemple.fr. 3600 IN SRV 0 5 5269 xmpp.corp.exemple.fr.
salons.corp.exemple.fr.            3600 IN CNAME xmpp.corp.exemple.fr.
fichiers.corp.exemple.fr.          3600 IN CNAME xmpp.corp.exemple.fr.
```

## Choisir un serveur

| Serveur | Langage | Licence | Points forts |
| --- | --- | --- | --- |
| **Prosody** | Lua | MIT | Léger, simple, modules nombreux, base de Snikket et de Jitsi |
| [[02-ejabberd\|ejabberd]] | Erlang | GPL v2 | Très grande échelle, cluster, API, interface web |
| [[03-openfire\|Openfire]] | Java | Apache 2.0 | Console web complète, greffons, intégration AD, Windows |
| [[04-snikket-mongooseim\|Snikket]] | Prosody en conteneur | Apache 2.0 | Clé en main, invitations, clients dédiés |
| [[04-snikket-mongooseim\|MongooseIM]] | Erlang | Apache 2.0 | Haute disponibilité, GraphQL, opérateurs |

## Installation de Prosody

Prosody 13 est la version stable (0.12 encore répandue dans les distributions).

Debian / Ubuntu (dépôt officiel, versions à jour) :

```bash
echo "deb [signed-by=/usr/share/keyrings/prosody.gpg] https://packages.prosody.im/debian $(lsb_release -sc) main" | sudo tee /etc/apt/sources.list.d/prosody.list
sudo wget -O /usr/share/keyrings/prosody.gpg https://prosody.im/files/prosody-debian-packages.key
sudo apt update && sudo apt install -y prosody lua-dbi-postgresql
```

Autres systèmes :

```bash
sudo dnf install -y epel-release && sudo dnf install -y prosody        # RHEL, Rocky, Alma (EPEL)
sudo apk add prosody                                                    # Alpine
sudo pacman -S prosody                                                  # Arch
sudo pkg install prosody && sudo sysrc prosody_enable=YES              # FreeBSD
brew tap prosody/prosody && brew install prosody                        # macOS
docker run -d --name prosody -p 5222:5222 -p 5269:5269 -p 5281:5281 -v /srv/prosody/config:/etc/prosody -v /srv/prosody/data:/var/lib/prosody prosodyim/prosody:13.0
```

**Windows** n'est pas pris en charge officiellement : utiliser [[03-openfire|Openfire]], WSL 2, Docker ou une VM Linux.

```bash
sudo firewall-cmd --permanent --add-port={5222,5269,5281}/tcp && sudo firewall-cmd --reload    # RHEL
sudo ufw allow 5222,5269,5281/tcp                                                              # Ubuntu
```

## Configuration

Fichier `/etc/prosody/prosody.cfg.lua` (Lua) ; un fichier par domaine possible dans `/etc/prosody/conf.d/`.

```lua
admins = { "admin@corp.exemple.fr" }

-- sécurité
c2s_require_encryption = true
s2s_require_encryption = true
s2s_secure_auth = true
allow_registration = false
authentication = "internal_hashed"

-- stockage SQL (sinon fichiers dans /var/lib/prosody)
storage = "sql"
sql = { driver = "PostgreSQL", database = "prosody", username = "prosody", password = "MdpProsody2026", host = "localhost" }

-- historique serveur (MAM)
archive_expires_after = "1y"

VirtualHost "corp.exemple.fr"

Component "salons.corp.exemple.fr" "muc"
    modules_enabled = { "muc_mam" }
    restrict_room_creation = "local"

Component "fichiers.corp.exemple.fr" "http_file_share"
    http_file_share_size_limit = 100 * 1024 * 1024
    http_file_share_expires_after = 30 * 86400
```

Les modules courants (`mam`, `carbons`, `smacks`, `pep`, `blocklist`, `ping`, `bosh`, `websocket`…) s'activent dans `modules_enabled` de la section globale ; le fichier fourni par le paquet les liste avec des commentaires.

### Certificats

```bash
sudo certbot certonly --standalone -d corp.exemple.fr -d salons.corp.exemple.fr -d fichiers.corp.exemple.fr
sudo prosodyctl --root cert import /etc/letsencrypt/live
sudo systemctl reload prosody
```

À automatiser par un *hook* de renouvellement certbot (`--deploy-hook "prosodyctl --root cert import /etc/letsencrypt/live"`).

### Comptes et administration

```bash
sudo prosodyctl adduser jk@corp.exemple.fr
sudo prosodyctl passwd jk@corp.exemple.fr
sudo prosodyctl deluser ancien.agent@corp.exemple.fr
sudo prosodyctl check            # configuration, DNS, certificats, connectivité
sudo prosodyctl status ; sudo prosodyctl about
sudo prosodyctl shell            # console d'administration interactive (utilisateurs, sessions, modules)
```

Authentification d'entreprise : module communautaire `mod_auth_ldap` (annuaire LDAP ou AD), `authentication = "cyrus"` (SASL, Kerberos) ou fournisseurs OAuth. Installer un module communautaire :

```bash
sudo prosodyctl install --server=https://modules.prosody.im/rocks/ mod_auth_ldap
```

### Web (BOSH et WebSocket)

Activer `bosh` et `websocket` dans `modules_enabled` : les clients web comme [[05-clients-conversejs|Converse.js]] se connectent alors à `https://xmpp.corp.exemple.fr:5281/http-bind` ou `wss://xmpp.corp.exemple.fr:5281/xmpp-websocket` (ou via un reverse proxy sur le port 443).

## Sauvegarde et mise à jour

Sauvegarder `/etc/prosody/` et les données : `/var/lib/prosody/` (stockage fichiers) ou la base SQL (`pg_dump prosody`). Passer du stockage fichiers à SQL : `prosody-migrator`. Mise à jour : `sudo apt update && sudo apt upgrade prosody`, puis `prosodyctl check` ; lire les notes de version lors d'un changement de version majeure (0.12 → 13).

## Dépannage

| Symptôme | Cause probable | Correction |
| --- | --- | --- |
| Clients refusés (« certificate »/« TLS ») | Certificat absent ou expiré | `prosodyctl check certs`, `cert import` |
| Pas de fédération avec un autre domaine | SRV absent, port 5269 fermé, `s2s_secure_auth` | `prosodyctl check dns`, `check connectivity` |
| Historique absent sur un nouvel appareil | `mam` non activé | Ajouter `mam` aux modules |
| Fichiers non envoyés | Composant `http_file_share` absent, certificat du sous-domaine | Composant et certificat `fichiers.` |
| Messages perdus sur mobile | Stream Management/push absents | Modules `smacks`, `cloud_notify` |

Journaux : `/var/log/prosody/prosody.log` et `prosody.err`. Commandes : [[90-aide-memoire|aide-mémoire]].
