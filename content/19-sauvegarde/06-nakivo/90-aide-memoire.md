---
title: NAKIVO Backup & Replication — aide-mémoire
description: Opérations et commandes NAKIVO avec exemples — installation (Linux, Windows, appliance, NAS), services (Director, Transporter), ports, interface web, référentiels (immuabilité, déduplication), travaux de sauvegarde et de réplication, restaurations (VM, fichiers, objets), auto-sauvegarde de la configuration, API HTTP, journaux et bundle de support.
tags: [aide-mémoire, nakivo, sauvegarde, réplication, vmware, hyper-v]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|NAKIVO]].

## Installation et services

```bash
sudo sh ./NAKIVO_Backup_Replication_vX.Y.Z_Installer-TRIAL.sh      # installeur Linux (Director + Transporter)
sudo systemctl status nkv-dirsvc nkv-bhsvc                       # Director, Transporter (noms selon version)
sudo ss -ltnp | grep -E '4443|9446'                              # interface web, Transporter
```

```powershell
Get-Service | Where-Object DisplayName -like "*NAKIVO*" | Format-Table Name, DisplayName, Status
```

Interface web : `https://<director>:4443`.

## Logique de configuration (interface web)

| Étape | Points clés |
| --- | --- |
| Inventaire | vCenter/ESXi, Hyper-V, Proxmox, Microsoft 365, serveurs physiques |
| Transporters | Au plus près des données (un par site), répartition de charge |
| Référentiels | Local, NAS, S3 compatible ; **immuabilité** (référentiel Linux durci ou objet verrouillé) ; chiffrement |
| Travaux | Sauvegarde, copie de sauvegarde hors site, réplication (VM de secours), planification et rétention (GFS) |
| Restauration | VM complète, restauration instantanée, fichiers, objets applicatifs (AD, Exchange, SQL) |
| Reprise | Plans de reprise (*Site Recovery*) testés à blanc |

## Auto-sauvegarde et support

- *Settings → General → System settings → Self-backup* : sauvegarde de la configuration du Director vers un ou plusieurs référentiels.
- *Help → Support → Create support bundle* : archive des journaux pour l'assistance.

## API HTTP

```bash
# Authentification (JSON-RPC sur /c/router) puis appels ; voir la documentation API de votre version
curl -sk -c cookies.txt -H "Content-Type: application/json" https://nakivo.exemple.fr:4443/c/router \
  -d '{"action":"AuthenticationManagement","method":"login","data":["admin","'"$MDP"'",false],"type":"rpc","tid":1}'
```

## Bonnes pratiques

- [ ] Compte administrateur nominatif et MFA sur l'interface
- [ ] Référentiel immuable + copie hors site, chiffrement des sauvegardes
- [ ] Vérification automatique des sauvegardes (amorçage de VM et capture d'écran)
- [ ] Mises à jour régulières du Director et des Transporters
