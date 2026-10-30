---
title: PDQ Deploy et PDQ Inventory
description: PDQ Deploy et PDQ Inventory pour les parcs Windows — fonctionnement (serveur et console, exécution distante par services temporaires), prérequis réseau (SMB, RPC, ADMIN$), identifiants de déploiement, bibliothèque de paquets maintenus, paquets personnalisés (MSI, EXE, PowerShell, conditions, redémarrages), collections dynamiques et déploiements ciblés, planifications, PDQ Connect (agent cloud), sécurité et dépannage.
tags: [pdq deploy, pdq inventory, déploiement, windows, paquets, mises à jour, gestion de parc]
icon: rocket
---

**PDQ Deploy** et **PDQ Inventory** (PDQ.com, commerciaux avec versions gratuites limitées) sont des outils simples et efficaces pour les parcs **Windows** gérés en Active Directory :

| Produit | Rôle |
| --- | --- |
| **PDQ Inventory** | Inventaire (matériel, logiciels, mises à jour, services, utilisateurs) par balayage sans agent ; **collections dynamiques** (ex. « Chrome obsolète », « Windows 11 sans BitLocker ») |
| **PDQ Deploy** | Déploiement de logiciels, mises à jour et scripts sur les machines ou collections |
| **PDQ Connect** | Version **cloud** avec agent : postes nomades hors du réseau, sans VPN |

## Fonctionnement

Depuis le serveur PDQ, les étapes sont copiées dans le partage **`ADMIN$`** de la cible et exécutées par un **service temporaire** (comme PsExec) sous les identifiants de déploiement, puis le résultat remonte à la console.

Prérequis sur les cibles : partage administratif `ADMIN$`, **SMB 445** et **RPC** ouverts depuis le serveur PDQ (règle de pare-feu limitée à son adresse), compte de déploiement **administrateur local** des machines (via GPO), résolution DNS correcte.

## Paquets

| Source | Remarques |
| --- | --- |
| **Package Library** (abonnement) | Centaines de paquets prêts et mis à jour (navigateurs, Adobe Reader, 7-Zip, Java, mises à jour cumulatives…) : déploiement automatique des nouvelles versions |
| Paquets personnalisés | Étapes : *Install* (MSI/EXE avec paramètres silencieux), *Command*, **PowerShell**, *File Copy*, *Reboot*, *Sleep*, *Nested package* |
| Conditions | Architecture, version de Windows, présence d'un fichier ou d'une clé, PowerShell qui retourne vrai |

```powershell Étape PowerShell d'un paquet (exemple)
# Désinstaller une ancienne version avant d'installer la nouvelle, codes de retour gérés par PDQ
$ancien = Get-Package -Name "Logiciel Métier*" -ErrorAction SilentlyContinue
if ($ancien) { $ancien | Uninstall-Package -Force }
Start-Process msiexec.exe -ArgumentList '/i "\\srv-depot\Logiciels\LogicielMetier-5.2.msi" /qn /norestart' -Wait -NoNewWindow
exit $LASTEXITCODE
```

Codes de retour réussis à déclarer (0, 3010 = redémarrage requis, 1641).

## Déploiements ciblés et planifiés

1. **Inventaire** : collection dynamique « Logiciel Métier < 5.2 ».
2. **Deploy** : planification *Heartbeat* (dès qu'une machine de la collection est en ligne) ou horaire, avec **anneaux** (groupe pilote d'abord).
3. Le résultat met à jour l'inventaire : la machine sort de la collection.

## Sécurité

- [ ] Compte de déploiement **dédié**, mot de passe long et tournant, interdit d'ouverture de session interactive, surveillé ; jamais un administrateur du domaine (il serait exposé sur chaque cible)
- [ ] Serveur PDQ protégé comme un serveur d'administration (il contrôle tout le parc)
- [ ] Paquets depuis des sources de confiance, vérification des signatures et empreintes ; dépôt de logiciels en lecture seule pour les utilisateurs
- [ ] Ouvertures SMB/RPC des postes limitées aux serveurs d'administration (la règle générale reste : SMB entrant bloqué entre postes)
- [ ] Journaux de déploiement conservés

## Dépannage

| Erreur | Cause | Solution |
| --- | --- | --- |
| `Access is denied` | Compte non administrateur local, UAC distant | GPO d'administrateurs locaux, compte de domaine |
| `The network path was not found` | `ADMIN$` inaccessible, pare-feu, nom DNS | Règles SMB/RPC depuis le serveur PDQ, DNS |
| Installation bloquée | Assistant non silencieux | Paramètres silencieux du programme (`/S`, `/quiet`), journal MSI (`/L*v`) |
| Code 1603 | Erreur MSI générique | Journal MSI détaillé, prérequis manquant, version déjà installée |
| Postes nomades jamais atteints | Hors réseau | PDQ Connect (agent) ou [[10-intune-inscription\|Intune]] |
