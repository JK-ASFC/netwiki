---
title: GLPI — inventaire et assistance
description: Utiliser GLPI au quotidien — inventaire natif avec GLPI Agent (installation silencieuse sur Windows, Linux et macOS, tâches d'inventaire, découverte réseau et inventaire SNMP des équipements, déploiement), règles d'import et d'affectation, CMDB et relations, gestion des tickets (catégories, SLA/OLA, règles métier, gabarits, satisfaction), problèmes et changements, catalogue de services (formulaires), base de connaissances, tableaux de bord, API REST et dépannage.
tags: [glpi, glpi agent, inventaire, snmp, tickets, sla, cmdb, itil]
icon: clipboard-list
---

## Inventaire avec GLPI Agent

Depuis GLPI 10, l'**inventaire natif** reçoit les données du **GLPI Agent** (successeur de FusionInventory) sans plugin. Activez-le : *Administration → Inventaire → Activer l'inventaire*.

```powershell
# Windows : installation silencieuse (MSI) pointant vers le serveur
msiexec /i GLPI-Agent-1.15-x64.msi /quiet SERVER="https://glpi.corp.exemple.fr/" ADD_FIREWALL_EXCEPTION=1 RUNNOW=1 TAG="Siege" EXECMODE=Service
```

```bash
# Linux : script d'installation (perl) ; macOS : paquet .pkg
sudo perl glpi-agent-1.15-linux-installer.pl --server="https://glpi.corp.exemple.fr/" --tag=Siege --runnow --install
sudo glpi-agent --force          # inventaire immédiat
```

| Tâche de l'agent | Usage |
| --- | --- |
| **Inventory** | Matériel, logiciels, réseau, antivirus, utilisateurs du poste |
| **NetDiscovery** | Découverte des équipements d'un réseau (ping, SNMP) |
| **NetInventory** | Inventaire **SNMP** détaillé des commutateurs, routeurs, imprimantes (ports, VLAN, connexions, MAC) |
| Deploy, Collect, ESX | Déploiement de logiciels, collecte de fichiers/registre, inventaire VMware |

Pour le réseau : déclarer des **identifiants SNMP** (*Administration → Inventaire → Identifiants SNMP*, SNMPv3 de préférence), puis lancer découverte et inventaire depuis un agent désigné. GLPI relie alors les postes aux **ports des commutateurs** (via les tables MAC), utile pour localiser un appareil.

**Règles d'import et de liaison** (*Administration → Règles*) : éviter les doublons (critères numéro de série, UUID, MAC), affecter l'**entité** et le **lieu** selon l'étiquette (`TAG`), le sous-réseau ou le nom.

## CMDB

Éléments du parc (ordinateurs, réseau, téléphones, logiciels, licences, contrats, fournisseurs, certificats, data centers et baies) liés par des **relations** (impact) : un ticket sur un service montre les éléments concernés. Les **certificats** et **contrats** peuvent générer des alertes d'expiration.

## Assistance (tickets)

| Élément | Configuration |
| --- | --- |
| **Catégories ITIL** | Arborescence (Réseau > Wi-Fi, Postes > Logiciels) avec groupe technicien par défaut |
| **SLA / OLA** | *Configuration → Niveaux de services* : délais de prise en charge et de résolution, calendriers, escalades |
| **Règles métier** | Affectation automatique selon la catégorie, le demandeur, l'entité, l'urgence |
| Gabarits | Champs obligatoires et prédéfinis selon le type de demande |
| Notifications | Accusé de réception, suivi, résolution, enquête de satisfaction |
| Collecteur | Tickets créés depuis les courriels (voir l'article précédent) |

Processus ITIL complémentaires : **Problèmes** (cause racine d'incidents répétés), **Changements** (analyse d'impact, validation, plan de retour arrière), **Projets**.

## Catalogue de services et base de connaissances

- Le plugin **Formcreator** (ou les **formulaires natifs** de GLPI 11) crée des formulaires guidés (demande d'accès, nouveau poste, création de compte) qui génèrent des tickets avec validations.
- La **base de connaissances** publie des articles aux utilisateurs (FAQ) ou aux techniciens, liés aux catégories : solutions proposées lors de la saisie d'un ticket.

## Tableaux de bord et API

Tableaux de bord intégrés (parc, assistance, SLA), rapports, exports. L'**API REST** (*Configuration → Générale → API*) permet de créer des tickets depuis la supervision ou un outil d'automatisation ([[05-ia-productivite/06-n8n|n8n]]) :

```bash
SESSION=$(curl -s -H "App-Token: $APP_TOKEN" -H "Authorization: user_token $USER_TOKEN" https://glpi.corp.exemple.fr/apirest.php/initSession | jq -r .session_token)
curl -s -X POST -H "App-Token: $APP_TOKEN" -H "Session-Token: $SESSION" -H "Content-Type: application/json" \
  -d '{"input": {"name": "Alerte supervision : lien WAN Lyon coupé", "content": "Créé automatiquement", "urgency": 4, "itilcategories_id": 12}}' \
  https://glpi.corp.exemple.fr/apirest.php/Ticket
```

## Dépannage

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Agents qui n'envoient rien | URL du serveur, certificat, inventaire désactivé côté GLPI | Journal de l'agent, `glpi-agent --force --debug`, activation de l'inventaire |
| Doublons d'ordinateurs | Règles de liaison, images clonées | Critères de règles (UUID, série), Sysprep des images |
| Tickets non créés depuis les courriels | Collecteur, actions automatiques non exécutées | Cron, journal du collecteur, droits de la boîte |
| Notifications non envoyées | File d'attente non traitée (cron), SMTP | Action automatique `queuednotification`, configuration SMTP |
| Inventaire SNMP incomplet | Modèle non reconnu, identifiants | SNMPv3, `sysObjectID`, mises à jour du dictionnaire de l'agent |
