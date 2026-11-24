---
title: Présentation, installation et exploitation
description: Node-RED — outil de programmation par flux (Node.js, Apache 2.0) pour câbler capteurs, API, files de messages et services : concepts (nœuds, flux, câblage, messages, contexte flow/global), installation (npm, script Raspberry Pi, Docker nodered/node-red, add-on Home Assistant), settings.js (port 1880, adminAuth bcrypt, credentialSecret, httpNodeAuth), nœuds de base (inject, debug, function, change, switch, http in/out, mqtt in/out, exec), palette et installation de nœuds, intégration MQTT, Zigbee et domotique, tableau de bord, projets Git, CLI node-red-admin, sécurité (HTTPS, reverse proxy), sauvegarde et dépannage.
tags: [node-red, flux, iot, automatisation, mqtt, nodejs, tableau de bord]
icon: info
---

**Node-RED** relie visuellement des briques (**nœuds**) par des **câbles** pour construire un traitement : lire un capteur [[12-recherche-messages/05-mosquitto/01-presentation-configuration|MQTT]], appeler une API, transformer un message, écrire dans une base, envoyer une notification. C'est la « colle » de l'IoT et de l'automatisation domestique ou de bureau, au-dessus de [[04-domotique/01-home-assistant-openhab-domoticz|Home Assistant]] ou en complément.

## Concepts

| Notion | Rôle |
| --- | --- |
| **Nœud** | Une brique : entrée (`mqtt in`, `inject`, `http in`), traitement (`function`, `change`, `switch`), sortie (`mqtt out`, `debug`, `http response`) |
| **Flux** (*flow*) | Un onglet de nœuds câblés ensemble |
| **Message** (`msg`) | Objet qui circule entre nœuds ; charge utile dans `msg.payload`, topic dans `msg.topic` |
| **Câble** | Relie une sortie à une (ou plusieurs) entrée(s) |
| **Contexte** | Mémoire persistante : `context` (nœud), `flow` (onglet), `global` (instance) |
| **Palette** | Catalogue des types de nœuds installés (extensible depuis la bibliothèque) |

## Installation

```bash
# npm (Linux, Windows, macOS) — Node.js LTS requis
sudo npm install -g --unsafe-perm node-red
node-red                                   # démarre sur http://localhost:1880
```

| Méthode | Détail |
| --- | --- |
| Raspberry Pi / Debian | Script officiel : `bash <(curl -sL https://raw.githubusercontent.com/node-red/linux-installers/master/deb/update-nodejs-and-nodered)` (installe Node.js, Node-RED, service systemd `nodered`) |
| Docker | `docker run -d -p 1880:1880 -v node_red_data:/data --name nodered nodered/node-red` |
| Home Assistant | Add-on **Node-RED** (intégré à Supervisor, SSO avec HA) |
| Service | `sudo systemctl enable --now nodered` (après le script d'installation) |

Données dans `~/.node-red/` (ou `/data` en Docker) : `flows.json` (les flux), `flows_cred.json` (identifiants chiffrés), `settings.js`, et `node_modules/` (nœuds installés).

## Configuration (`settings.js`)

```javascript ~/.node-red/settings.js (extraits)
module.exports = {
  uiPort: 1880,
  // Authentification de l'éditeur (générer le hachage : node-red admin hash-pw)
  adminAuth: {
    type: "credentials",
    users: [{ username: "admin", password: "$2b$08$…", permissions: "*" }],
  },
  // Clé de chiffrement des identifiants (sinon régénérée, perte des mots de passe des nœuds)
  credentialSecret: "une-phrase-secrete-longue",
  // Protéger les endpoints HTTP créés par les nœuds http in
  httpNodeAuth: { user: "api", pass: "$2b$08$…" },
  // Derrière un reverse proxy TLS
  // uiHost: "127.0.0.1",
  functionGlobalContext: {},
};
```

```bash
node-red admin hash-pw            # produit le hachage bcrypt pour adminAuth / httpNodeAuth
```

## Nœuds de base

| Nœud | Usage |
| --- | --- |
| `inject` | Déclencher un flux (bouton, périodique, au démarrage) |
| `debug` | Afficher `msg` dans le panneau de débogage |
| `function` | Code JavaScript (`return msg;`) pour une logique sur mesure |
| `change` | Modifier des propriétés de `msg` sans code (set, move, delete, jsonata) |
| `switch` | Router selon une condition |
| `template` | Mettre en forme (Mustache) |
| `http in` / `http response` / `http request` | Créer une API ou appeler une API |
| `mqtt in` / `mqtt out` | S'abonner / publier sur un courtier MQTT |
| `exec` | Lancer une commande système |
| `link in`/`link out` | Relier des flux entre onglets |

## Palette : installer des nœuds

```bash
# Depuis l'interface : menu → « Manage palette » → onglet Install
# ou en ligne de commande, dans le dossier de données :
cd ~/.node-red && npm install node-red-dashboard node-red-contrib-home-assistant-websocket
sudo systemctl restart nodered
```

Nœuds très utilisés : **node-red-dashboard** (tableau de bord web `/ui`, ou **Dashboard 2.0**), `node-red-contrib-home-assistant-websocket`, nœuds Modbus, SNMP, Telegram, e-mail, InfluxDB, PostgreSQL. L'IoT se câble typiquement ainsi : [[06-zigbee-zwave/01-zigbee2mqtt-zwavejs|Zigbee2MQTT]] → MQTT → Node-RED (logique) → tableau de bord ou Home Assistant.

## Projets (Git) et exploitation

- **Projets** : activer `editorTheme.projects.enabled = true` pour versionner `flows.json` avec **Git** (historique, branches, déploiement).
- **Déploiement** : bouton *Deploy* (complet, modifié, ou nœuds seuls) applique les changements à chaud.
- **Sauvegarde** : copier `~/.node-red/` (surtout `flows.json`, `flows_cred.json`, `settings.js`, et **conserver `credentialSecret`** sans quoi les identifiants sont illisibles).
- **Import/export** : menu → Export (presse-papiers ou fichier) d'un nœud, d'un flux ou de tout.

```bash
node-red-admin hash-pw                     # (paquet node-red-admin) idem admin hash-pw
sudo journalctl -u nodered -f              # journaux du service
```

## Sécurité

- [ ] **adminAuth** activé (jamais d'éditeur ouvert) ; mots de passe en **bcrypt**
- [ ] **HTTPS** (option `https` de settings.js) ou **reverse proxy** TLS, éditeur lié à `127.0.0.1`
- [ ] `httpNodeAuth` sur les endpoints `http in` exposés
- [ ] `credentialSecret` défini et sauvegardé
- [ ] `functionExternalModules` et le nœud `exec` maîtrisés (exécution de code) ; réseau IoT isolé
- [ ] Node-RED et les nœuds de la palette tenus à jour

## Dépannage

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Identifiants des nœuds perdus après restauration | `credentialSecret` manquant/différent | Restaurer la même clé dans `settings.js` |
| Nœud absent après import d'un flux | Nœud de palette non installé | *Manage palette* → installer le `node-red-contrib-…` |
| `mqtt in` reste « connecting » | Courtier injoignable, identifiants, TLS | Vérifier le courtier ([[12-recherche-messages/05-mosquitto/02-ponts-exploitation\|Mosquitto]]), port 1883/8883 |
| Éditeur inaccessible | Service arrêté, port, lié à 127.0.0.1 | `systemctl status nodered`, reverse proxy |
| Flux qui boucle / fuite mémoire | Câblage récursif, contexte non borné | Panneau de débogage, revoir les `function`/contexte |

Commandes : [[90-aide-memoire|aide-mémoire]].
