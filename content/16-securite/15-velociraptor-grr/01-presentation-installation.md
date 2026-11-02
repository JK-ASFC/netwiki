---
title: Présentation, installation et utilisation
description: Velociraptor (Rapid7, AGPL) et GRR Rapid Response (Google, Apache 2.0) — investigation numérique et réponse à incident à distance sur des milliers de postes : architecture serveur/clients, Velociraptor (binaire unique, génération de configuration, agents Windows MSI, Linux et macOS, artefacts VQL, collectes et chasses sur tout le parc, notebooks, surveillance d'événements, collecteur hors ligne, quarantaine, intégrations) et GRR (flux et chasses, Fleetspeak, déploiement Docker), collecte de preuves, chaîne de conservation et bonnes pratiques.
tags: [velociraptor, grr, dfir, forensic, réponse à incident, vql, artefacts]
icon: info
---

Lors d'un incident, il faut collecter vite et à grande échelle : processus, connexions, tâches planifiées, clés de démarrage, journaux d'événements, MFT, historique des navigateurs… **Velociraptor** le fait sur tout le parc en quelques minutes grâce à des **artefacts** écrits en **VQL** (*Velociraptor Query Language*). **GRR** (Google) poursuit le même but mais est plus lourd et moins actif ; Velociraptor est aujourd'hui l'outil libre de référence.

## Velociraptor

```bash
# Binaire unique (Windows, Linux, macOS) depuis les versions GitHub
./velociraptor-linux-amd64 config generate -i        # assistant : nom DNS du serveur, ports (8000 clients, 8889 interface), certificats, utilisateurs
sudo ./velociraptor-linux-amd64 --config server.config.yaml debian server --binary velociraptor-linux-amd64   # crée un paquet .deb du serveur
sudo dpkg -i velociraptor_server_*.deb               # service velociraptor_server
./velociraptor-linux-amd64 --config server.config.yaml config client > client.config.yaml
```

Clients : dans l'interface, *Server Artifacts → Server.Utils.CreateMSI* génère un **MSI Windows** préconfiguré (déploiement par GPO ou [[06-support-parc/09-pdq-deploy|PDQ Deploy]]) ; paquets `.deb`/`.rpm` et binaire macOS pour les autres systèmes. Port **8000** des clients vers le serveur (TLS épinglé).

### Collectes et chasses

- **Collect** sur un poste : artefacts `Windows.System.Pslist`, `Windows.Network.Netstat`, `Windows.Persistence.PermanentWMIEvents`, `Windows.EventLogs.EvtxHunter`, `Windows.KapeFiles.Targets` (collecte type KAPE).
- **Hunt** sur tout le parc : par exemple chercher un hachage, un nom de fichier, une clé de registre ou une connexion vers une IP malveillante.
- **Notebooks** : analyser les résultats en VQL ; **Event monitoring** : surveillance continue (création de processus, journaux).
- **Collecteur hors ligne** : exécutable autonome pour une machine isolée du réseau.

```sql
SELECT Name, Pid, CommandLine, Exe FROM pslist() WHERE Exe =~ '(?i)\\\\appdata\\\\local\\\\temp\\\\'
```

## GRR

Déploiement par conteneurs (Docker Compose du projet) avec une base MySQL et **Fleetspeak** pour la communication avec les clients ; agents Windows, Linux et macOS générés par le serveur. Interface sur le port 8000 : clients, **flows** (collectes sur un client), **hunts** (sur le parc).

> [!TIP]
> Testez le déploiement et quelques collectes **avant** un incident ; documentez qui peut lancer des chasses (les collectes peuvent contenir des données personnelles) et conservez les preuves avec leur empreinte (hachage) et l'horodatage.

<!-- CAPTURE: Velociraptor — résultats d'une chasse sur le parc | _assets/velociraptor-chasse.png -->
<!-- CAPTURE: Velociraptor — vue d'un client et collecte d'artefacts | _assets/velociraptor-client.png -->

Commandes : [[90-aide-memoire|aide-mémoire]].
