---
title: ManageEngine EventLog Analyzer — aide-mémoire
description: Opérations et commandes EventLog Analyzer avec exemples — services Windows et Linux (démarrage, arrêt), ports (8400, syslog 513/514), ajout des sources (Windows via WMI/agent, syslog des équipements réseau), configuration côté équipements (Cisco, FortiGate, Linux rsyslog), rapports et alertes, sauvegarde de la base, journaux du produit, sécurisation.
tags: [aide-mémoire, eventlog analyzer, manageengine, siem, syslog, windows]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|EventLog Analyzer]].

## Services

```powershell
Get-Service | Where-Object DisplayName -like "*EventLog Analyzer*" | Format-Table Name, Status
Restart-Service -DisplayName "ManageEngine EventLog Analyzer*"
Test-NetConnection ela.corp.exemple.fr -Port 8400
```

```bash
# Linux (répertoire d'installation par défaut)
cd /opt/ManageEngine/EventLog/bin
sudo sh run.sh                 # démarrer
sudo sh shutdown.sh            # arrêter
```

## Envoyer les journaux des équipements

```cisco
logging host 10.0.98.50 transport udp port 514
logging trap informational
logging source-interface Vlan99
service timestamps log datetime msec localtime show-timezone
```

```netcli
# FortiGate
config log syslogd setting
    set status enable
    set server "10.0.98.50"
    set port 514
end
```

```bash
# Linux : /etc/rsyslog.d/90-ela.conf
echo '*.* @@10.0.98.50:514' | sudo tee /etc/rsyslog.d/90-ela.conf && sudo systemctl restart rsyslog
```

## Sources Windows

- Ajout par l'interface (*Settings → Log Source Configuration → Devices → Windows Devices*) : découverte AD ou saisie, compte de collecte avec les droits de lecture des journaux (groupe « Lecteurs des journaux d'événements ») ; collecte par agent recommandée pour les postes nomades.
- Activer au préalable les stratégies d'audit utiles (connexions, gestion des comptes, accès aux objets) par GPO :

```powershell
auditpol /get /category:*
auditpol /set /subcategory:"Logon" /success:enable /failure:enable
auditpol /set /subcategory:"User Account Management" /success:enable /failure:enable
```

## Sauvegarde et journaux

- Sauvegarde planifiée de la base depuis l'interface (*Settings → Admin Settings → Database Backup*) ou avec l'outil fourni dans `bin` (selon version), vers un emplacement distant.
- Journaux du produit : répertoire `logs` de l'installation (`serverout*.txt`, `wrapper.log`).

## Sécurisation

- [ ] Changer le compte `admin` par défaut, comptes nominatifs, authentification AD avec MFA si disponible
- [ ] HTTPS avec certificat valide sur l'interface (8400) ; accès limité au réseau d'administration
- [ ] Produit à jour (des vulnérabilités ManageEngine ont été exploitées massivement)
