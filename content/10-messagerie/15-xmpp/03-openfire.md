---
title: Openfire
description: Openfire (Ignite Realtime, Java, Apache 2.0) — serveur XMPP administré entièrement par console web : prérequis Java 17, installation sous Windows (installateur et service), Debian/Ubuntu (.deb), RHEL/Rocky (.rpm), macOS (.dmg), assistant de configuration (domaine, base embarquée ou PostgreSQL/MySQL/SQL Server, annuaire LDAP ou Active Directory), ports 5222/5269/7070/7443/9090/9091, certificats, greffons (Monitoring, REST API, Push, HTTP File Upload), salons, sauvegarde, mise à jour et dépannage.
tags: [xmpp, openfire, java, active directory, windows, console web]
icon: server
---

**Openfire** (Ignite Realtime, Apache 2.0) est un serveur XMPP en **Java** dont tout se règle dans une **console web** : c'est le choix le plus simple lorsqu'on veut un serveur de messagerie instantanée **sous Windows** ou adossé à **Active Directory** sans éditer de fichiers. Client historique associé : Spark. Présentation du protocole : [[01-prosody|XMPP et Prosody]].

| Port | Rôle |
| --- | --- |
| 5222/tcp | Clients (STARTTLS), 5223 en TLS direct |
| 5269/tcp | Fédération serveur à serveur |
| 7070/tcp, 7443/tcp | BOSH et WebSocket (HTTP / HTTPS) |
| 9090/tcp, 9091/tcp | Console d'administration (HTTP / HTTPS) |
| 5262, 5275/tcp | Connexions de composants externes |

Prérequis : **Java 17** (Openfire 4.10 et suivants ; les installateurs Windows et RPM peuvent embarquer leur propre JRE), 2 Go de RAM, une base PostgreSQL, MySQL/MariaDB, SQL Server ou Oracle pour la production (la base embarquée convient aux essais).

## Installation

Windows (installateur `.exe` des versions publiées) : il installe et démarre le **service Windows**, puis ouvre l'assistant dans le navigateur.

```powershell
$V = "5_1_2"
Invoke-WebRequest "https://github.com/igniterealtime/Openfire/releases/download/v5.1.2/openfire_${V}_x64.exe" -OutFile openfire.exe
.\openfire.exe
New-NetFirewallRule -DisplayName "Openfire XMPP" -Direction Inbound -Protocol TCP -LocalPort 5222,5269,7443 -Action Allow
& "C:\Program Files\Openfire\bin\openfire-service.exe" /start          # /stop, /install, /uninstall
```

Debian / Ubuntu :

```bash
sudo apt install -y openjdk-17-jre-headless
wget https://github.com/igniterealtime/Openfire/releases/download/v5.1.2/openfire_5.1.2_all.deb
sudo apt install -y ./openfire_5.1.2_all.deb          # installé dans /usr/share/openfire
sudo systemctl enable --now openfire
```

RHEL / Rocky / Alma :

```bash
sudo dnf install -y java-17-openjdk-headless
sudo dnf install -y https://github.com/igniterealtime/Openfire/releases/download/v5.1.2/openfire-5.1.2-1.noarch.rpm   # /opt/openfire
sudo systemctl enable --now openfire
sudo firewall-cmd --permanent --add-port={5222,5269,7443,9091}/tcp && sudo firewall-cmd --reload
```

macOS : installateur `.dmg` (dans `/usr/local/openfire`), démarrage par le panneau de préférences ou `sudo /usr/local/openfire/bin/openfire.sh`. Archive `.tar.gz` pour les autres systèmes (extraire dans `/opt`, lancer `bin/openfire.sh`).

## Assistant de configuration

Ouvrir `http://srv-xmpp-01:9090` :

1. **Langue**, puis **domaine XMPP** (`corp.exemple.fr`) et nom complet du serveur (`xmpp.corp.exemple.fr`).
2. **Base de données** : connexion standard (pilote PostgreSQL, URL `jdbc:postgresql://localhost:5432/openfire`, compte dédié) ou base embarquée.
3. **Profils utilisateurs** : base Openfire, **annuaire LDAP** ou **Active Directory** (serveur, port 636, DN de base `DC=corp,DC=exemple,DC=fr`, compte de liaison, filtres d'utilisateurs et de groupes).
4. **Compte administrateur** (ou, en mode LDAP, choix des comptes administrateurs de l'annuaire).

<!-- CAPTURE: Assistant Openfire, étape Profils utilisateurs avec Active Directory | _assets/openfire-assistant-ldap.png -->

## Console d'administration

| Onglet | Usage |
| --- | --- |
| Serveur → Gestionnaire de serveur | Informations, propriétés système, journaux, ports, **certificats TLS** (import PEM, Let's Encrypt via greffon) |
| Utilisateurs/Groupes | Comptes, groupes partagés dans les listes de contacts |
| Sessions | Sessions client et serveur, déconnexion |
| Discussion de groupe | Services et salons (MUC), droits, historique |
| Greffons | Installés et disponibles : **Monitoring** (archives, statistiques), **REST API**, **Push Notification**, **HTTP File Upload**, Certificate Manager, Fastpath |

<!-- CAPTURE: Console Openfire, liste des sessions | _assets/openfire-sessions.png -->

Réglages de sécurité conseillés (*Serveur → Paramètres du serveur*) : chiffrement **obligatoire** pour les clients et la fédération, inscription libre désactivée, administration uniquement en HTTPS (9091), port 9090 fermé, et accès réservé au réseau d'administration par le pare-feu.

L'API REST (greffon *REST API*) automatise les comptes :

```bash
curl -s -H "Authorization: $CLE_SECRETE_REST" -H 'Content-Type: application/json' -X POST https://xmpp.corp.exemple.fr:9091/plugins/restapi/v1/users -d '{"username": "jk", "password": "MdpTemporaire2026!", "name": "JK", "email": "jk@corp.exemple.fr"}'
```

`$CLE_SECRETE_REST` est la clé définie dans les réglages du greffon.

## Sauvegarde et mise à jour

À sauvegarder : la **base de données** et le dossier d'installation (`conf/openfire.xml`, `conf/security.xml`, `resources/security/` pour les certificats, `plugins/`, et `embedded-db/` si la base embarquée est utilisée). Mise à jour : arrêter le service, installer la nouvelle version par-dessus (le schéma de base est mis à jour au démarrage), vérifier la compatibilité des greffons.

## Dépannage

| Symptôme | Cause probable | Correction |
| --- | --- | --- |
| Le service ne démarre pas | Version de Java trop ancienne | Installer Java 17, `JAVA_HOME` |
| Connexion LDAP refusée | DN de liaison, filtre ou certificat LDAPS | Tester dans l'assistant, importer le certificat de l'AC |
| Clients : avertissement de certificat | Certificat autosigné généré à l'installation | Importer un certificat valide dans *Certificats TLS* |
| Pas de fédération | Port 5269 fermé, SRV absent | Pare-feu, enregistrements DNS SRV |

Journaux : `logs/openfire.log` (dossier d'installation) ou *Serveur → Journaux*. Commandes : [[90-aide-memoire|aide-mémoire]].
