---
title: MeshCentral
description: MeshCentral, plateforme libre de gestion et de prise en main à distance par le web — architecture (serveur Node.js, agents Windows, Linux, macOS), installation (npm et systemd, Docker), config.json (domaine, certificats, base MongoDB ou NeDB), groupes d'appareils et déploiement des agents, bureau, terminal et fichiers à distance, Intel AMT, utilisateurs, LDAP/OIDC, 2FA, journaux, sécurité et sauvegarde.
tags: [meshcentral, prise en main à distance, gestion de parc, agent, node.js, auto-hébergé]
icon: monitor
---

**MeshCentral** (Apache 2.0) est un serveur web auto-hébergé pour gérer et dépanner à distance des ordinateurs : **bureau à distance**, **terminal** (PowerShell, shell), **gestionnaire de fichiers**, informations matérielles et logicielles, exécution de commandes sur des groupes, réveil (Wake-on-LAN) et gestion **Intel AMT** hors bande. Les agents se connectent au serveur en HTTPS/WebSocket sortant : aucun port à ouvrir sur les postes.

## Installation

```bash
# Node.js LTS requis (voir Node.js)
sudo useradd -r -m -d /opt/meshcentral -s /usr/sbin/nologin meshcentral
sudo -u meshcentral bash -c 'cd /opt/meshcentral && npm install meshcentral'
sudo -u meshcentral node /opt/meshcentral/node_modules/meshcentral      # premier lancement : crée meshcentral-data/
```

```ini /etc/systemd/system/meshcentral.service
[Unit]
Description=MeshCentral
After=network.target

[Service]
User=meshcentral
WorkingDirectory=/opt/meshcentral
ExecStart=/usr/bin/node /opt/meshcentral/node_modules/meshcentral
Restart=always
AmbientCapabilities=CAP_NET_BIND_SERVICE

[Install]
WantedBy=multi-user.target
```

Docker : image `ghcr.io/ylianst/meshcentral`. Voir [[06-nodejs/01-presentation-installation|Node.js]].

## config.json

```json /opt/meshcentral/meshcentral-data/config.json
{
  "settings": {
    "cert": "mesh.corp.exemple.fr",
    "port": 443,
    "redirPort": 80,
    "aliasPort": 443,
    "mongoDb": "mongodb://127.0.0.1:27017/meshcentral",
    "agentPong": 300,
    "tlsOffload": false
  },
  "domains": {
    "": {
      "title": "Support informatique",
      "newAccounts": false,
      "userNameIsEmail": true,
      "passwordRequirements": { "min": 12, "upper": 1, "lower": 1, "numeric": 1, "force2factor": true },
      "auth": "ldap",
      "ldapUserName": "displayName",
      "ldapOptions": {
        "url": "ldaps://dc01.corp.exemple.fr:636",
        "bindDN": "CN=svc-mesh,OU=Services,DC=corp,DC=exemple,DC=fr",
        "bindCredentials": "MotDePasseServiceLdap",
        "searchBase": "OU=Utilisateurs,DC=corp,DC=exemple,DC=fr",
        "searchFilter": "(sAMAccountName={{username}})"
      }
    }
  },
  "letsencrypt": { "email": "admin@exemple.fr", "names": "mesh.corp.exemple.fr", "production": true }
}
```

Base **NeDB** (fichiers) par défaut, **MongoDB** pour les parcs importants. Certificat Let's Encrypt, certificat interne, ou terminaison TLS par un reverse proxy (`tlsOffload`). L'authentification OIDC/SAML est aussi possible ; activez la **2FA** (TOTP, clés FIDO2).

## Agents

1. Créer un **groupe d'appareils** (*Ajouter un groupe*) : avec agent (gestion complète) ou sans agent (Intel AMT seulement).
2. *Ajouter un agent* : installateur Windows (`meshagent.exe` lié au groupe), commande d'installation Linux/macOS, ou lien d'assistance ponctuelle (agent temporaire).
3. Déployer par GPO, Intune ou [[09-pdq-deploy|PDQ Deploy]] : `meshagent.exe -fullinstall`.

```bash
# Linux : commande fournie par l'interface (télécharge l'agent lié au groupe)
(wget "https://mesh.corp.exemple.fr/meshagents?script=1" -O ./meshinstall.sh || curl -L … ) && chmod 755 ./meshinstall.sh && sudo ./meshinstall.sh https://mesh.corp.exemple.fr '<identifiant du groupe>'
```

## Fonctions

| Fonction | Usage |
| --- | --- |
| Bureau à distance | Avec ou sans consentement de l'utilisateur (paramètre du groupe), multi-écrans |
| Terminal | PowerShell/cmd, shell Linux, en tant que système ou utilisateur |
| Fichiers | Transfert, édition |
| Événements, informations | Matériel, logiciels, journaux, état de l'antivirus |
| Actions groupées | Commandes, scripts, redémarrages sur plusieurs appareils |
| **Intel AMT** | KVM matériel, mise sous tension, même système arrêté (postes vPro) |
| Partage d'appareil | Lien temporaire pour un prestataire |

## Sécurité et exploitation

- [ ] Création de compte libre désactivée (`newAccounts: false`), comptes nominatifs, **2FA imposée**
- [ ] Droits par groupe d'appareils (support niveau 1 : bureau avec consentement ; administrateurs : terminal et fichiers)
- [ ] **Consentement** de l'utilisateur et notification pour les postes de travail (RGPD, transparence)
- [ ] Journaux d'audit (qui s'est connecté à quoi) exportés au SIEM ; enregistrement de sessions si nécessaire
- [ ] Serveur à jour (`npm update meshcentral` ou mise à jour depuis l'interface), sauvegarde de `meshcentral-data` et de la base (fonction de sauvegarde automatique intégrée)
- [ ] Le serveur contrôle **tous** les postes : protégez-le comme un actif critique (tier 0 si des serveurs critiques y sont rattachés)
