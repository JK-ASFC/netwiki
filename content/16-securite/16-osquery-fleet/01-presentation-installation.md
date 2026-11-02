---
title: Présentation, installation et utilisation
description: osquery (Linux Foundation, Apache 2.0/GPL) — expose le système d'exploitation sous forme de tables SQL (processus, ports, utilisateurs, paquets, logiciels, certificats, clés de démarrage, chiffrement disque) sur Windows, Linux et macOS : osqueryi interactif, démon osqueryd, packs et requêtes planifiées, journaux de résultats ; FleetDM (MIT pour l'essentiel : gestion d'un parc d'agents osquery, requêtes en direct, politiques de conformité, inventaire logiciel et vulnérabilités, fleetctl, installation Docker, paquets fleetd) ; Kolide Launcher (agent historique, Kolide racheté par 1Password) ; cas d'usage sécurité et inventaire.
tags: [osquery, fleetdm, fleet, kolide, inventaire, conformité, sql, endpoint]
icon: info
---

**osquery** transforme une machine en **base de données** : « quels postes ont un port 3389 ouvert ? », « qui a une clé SSH autorisée en plus ? », « quels Mac n'ont pas FileVault ? » se posent en **SQL**, de la même façon sur Windows, Linux et macOS. **FleetDM** pilote des milliers d'agents osquery depuis une console : requêtes en direct, politiques de conformité, inventaire des logiciels et vulnérabilités.

## osquery

| Système | Installation |
| --- | --- |
| Windows | `winget install osquery.osquery` (ou MSI) |
| Debian/Ubuntu | Dépôt `pkg.osquery.io/deb` puis `sudo apt install osquery` |
| RHEL | Dépôt `pkg.osquery.io/rpm` |
| macOS | `brew install --cask osquery` ou PKG |

```sql
-- osqueryi
SELECT pid, name, path, cmdline FROM processes WHERE on_disk = 0;                        -- processus dont le binaire a été supprimé
SELECT p.name, l.port, l.address FROM listening_ports l JOIN processes p USING (pid) WHERE l.port IN (22, 3389, 5900);
SELECT name, version FROM programs WHERE name LIKE '%AnyDesk%';                           -- Windows
SELECT * FROM authorized_keys;                                                           -- Linux/macOS
SELECT * FROM bitlocker_info;                                                            -- Windows : état du chiffrement
SELECT name, path, source FROM startup_items;
```

Démon : `osqueryd` avec `/etc/osquery/osquery.conf` (requêtes planifiées, packs) ; résultats dans `/var/log/osquery/osqueryd.results.log` à envoyer au SIEM.

## FleetDM

```bash
# Serveur : MySQL 8 + Redis + binaire fleet (ou Docker Compose / Helm)
fleet prepare db --mysql_address=mysql:3306 --mysql_username=fleet --mysql_password="$MDP"
fleet serve --mysql_address=mysql:3306 --mysql_username=fleet --mysql_password="$MDP" --redis_address=redis:6379 \
  --server_cert=/etc/fleet/fleet.crt --server_key=/etc/fleet/fleet.key
# Agents : générer des paquets fleetd préconfigurés (osquery + mises à jour + certificat)
fleetctl package --type=msi --fleet-url=https://fleet.corp.exemple.fr --enroll-secret="$SECRET"     # aussi --type=deb, rpm, pkg
fleetctl login --address https://fleet.corp.exemple.fr ; fleetctl get hosts
fleetctl query --hosts poste-01,srv-web-01 --query "SELECT * FROM os_version;"
```

**Politiques** (oui/non par machine) : « disque chiffré », « pare-feu actif », « EDR installé » ; tableau de conformité et automatisations (webhook, ticket). **Kolide Launcher** était l'agent du produit Kolide (désormais 1Password Device Trust) ; pour un parc auto-hébergé, utilisez **fleetd**.

<!-- CAPTURE: FleetDM — liste des hôtes et politiques | _assets/fleet-hotes.png -->
<!-- CAPTURE: FleetDM — requête en direct sur plusieurs hôtes | _assets/fleet-requete.png -->

Commandes : [[90-aide-memoire|aide-mémoire]].
