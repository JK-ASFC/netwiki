---
title: Couches 1 et 2 — Physique et Liaison
description: Diagnostic des couches basses OSI — couche 1 Physique (câble cuivre RJ45, fibre monomode/multimode, Wi-Fi 802.11, Bluetooth, transceivers SFP/QSFP, DSL/FTTx) et couche 2 Liaison (Ethernet et MAC, VLAN 802.1Q, ARP, STP/RSTP, LACP, 802.1X/NAC) ; symptômes courants (lien down, uplink qui ne monte pas, APIPA 169.254, conflit d'IP, Wi-Fi connecté mais rien ne passe) et commandes de diagnostic.
tags: [osi, couche physique, couche liaison, ethernet, vlan, arp, stp, 802.1x, wifi, diagnostic]
icon: layers
---

## Couche 1 — Physique

**Rôle** : transporter les **bits bruts** (0/1) sur le support. Aucun logiciel, que du signal. Côté infrastructure : liaisons cuivre et fibre entre baies, cordons de brassage, **uplinks** entre switches, état des **transceivers SFP/SFP+**, débit négocié (1 / 10 / 25 Gb/s).

### Technologies et supports

| Support | Points clés |
| --- | --- |
| **Câble cuivre RJ45** | Cat5e = 1 Gb/s / 100 m · Cat6 = 10 Gb/s / 55 m · Cat6a = 10 Gb/s / 100 m. Paire coupée ou connecteur mal serti = lien mort |
| **Fibre optique** | Monomode (jaune) = longue portée (km) · Multimode (orange/aqua) = ≤ ~500 m. Sensible à la poussière et aux courbures |
| **Wi-Fi 802.11 a/b/g/n/ac/ax** | Qualité selon le signal (distance, obstacles, interférences). Wi-Fi 6 (ax) = OFDMA + MU-MIMO. Signal < 40 % = probablement physique |
| **Bluetooth 4.x/5.x** | Radio 2,4 GHz (interférences possibles avec le Wi-Fi 2,4 GHz) ; périphériques HID, audio |
| **Transceivers SFP/SFP+/QSFP** | Modules enfichables ; doivent être compatibles (équipement + type de fibre LC). Contrôler les niveaux optiques **DOM/DDM** (Rx/Tx en dBm) |
| **DSL / SONET / FTTx** | Accès opérateur ; FTTH via PON (splitter 1:32), signal ONT optimal entre −15 et −20 dBm |

### Symptômes → action

| Symptôme | Cause | Action |
| --- | --- | --- |
| **Lien « down »** (port sans connexion) | Lien physique absent | LED aux deux extrémités (hôte + switch), autre cordon, autre port |
| **Uplink inter-switch qui ne monte pas** | SFP incompatible/défectueux, fibre inversée (Tx↔Rx), brin endommagé | LED des deux côtés, permuter le module, niveaux optiques |
| **Couverture Wi-Fi dégradée** | Densité d'AP insuffisante, canal saturé, interférences 2,4 GHz | Analyser le spectre et la carte de couverture |

```bash
# Windows
Get-NetAdapter                         # Status = Disconnected
netsh wlan show interfaces             # champ Signal %
# Linux
ip link show                           # state DOWN / NO-CARRIER
iw dev wlan0 link                      # signal en dBm
```

> [!NOTE]
> Interface **Disconnected / `NO-CARRIER`** : inutile de toucher à la configuration IP, le problème est en couche 1. Un lien qui « flappe » (monte/descend en boucle) trahit souvent un module optique en fin de vie ou une soudure fibre douteuse.

## Couche 2 — Liaison de données

**Rôle** : transférer des **trames** entre deux nœuds voisins du même réseau local, gérer les **adresses MAC** et détecter les erreurs bit. Côté infrastructure : ports de switch (access / trunk) et VLAN, agrégation LACP, authentification 802.1X / NAC, anti-boucle STP/RSTP.

### Technologies et protocoles

| Techno | Points clés |
| --- | --- |
| **Ethernet (802.3)** | MAC unique 48 bits (`AA:BB:CC:DD:EE:FF`). Trame : Préambule · SFD · MAC dst · MAC src · EtherType · Données · FCS |
| **VLAN (802.1Q)** | Tag 4 octets, VLAN ID 1–4094. Port *access* = un seul VLAN ; port *trunk* = plusieurs VLAN tagués |
| **ARP** | Charnière L2/L3 : traduit IP → MAC. Requête broadcast, réponse unicast. Cache pollué → conflit |
| **STP / RSTP / MSTP** | Anti-boucles (empêche les *broadcast storms*). RSTP converge en ~1–2 s vs ~30–50 s. MSTP = une instance par groupe de VLAN |
| **LACP / PAgP** | Agrégation de liens (EtherChannel) ; côté poste : *bonding* NIC Linux (`bond0`) |
| **802.1X / NAC** | Authentification au port via RADIUS/EAP (souvent certificat machine) avant d'obtenir une IP. WPA2/WPA3-Enterprise en Wi-Fi |

### Symptômes → action

| Symptôme | Cause | Action |
| --- | --- | --- |
| **169.254.x.x (APIPA)** — branché sans IP | Mauvais VLAN sur le port, ou 802.1X qui refuse (certificat NAC expiré), DHCP sur un autre VLAN | Config du port switch, renouveler le certificat machine |
| **« Une autre machine utilise votre adresse IP »** | Conflit d'adresse / cache ARP pollué | Inspecter et vider le cache ARP |
| **Wi-Fi « connecté » mais rien ne passe** | Associé à l'AP (L1) mais échec d'authentification (WPA-Enterprise, certificat) | Oublier le réseau, reconnecter, vérifier le certificat |

```bash
arp -a                                 # correspondances IP <-> MAC
Get-NetNeighbor                        # PowerShell
netsh interface ip delete arpcache     # vider le cache ARP (Windows)
netsh wlan show interfaces             # champ State = "authenticating" / erreur 802.1X -> couche 2
```

> [!NOTE]
> Mauvais VLAN sur le port = poste isolé même si le câble est parfait. « Connecté » au Wi-Fi ne signifie pas « authentifié » : lire le champ **State** exactement.

> [!WARNING]
> **Côté cyber** — 802.1X est un contrôle de sécurité : un poste sans certificat valide est **volontairement** isolé (VLAN de quarantaine). Ne jamais le contourner sans autorisation.

Suite : [[04-couche-3-reseau|Couche 3 — Réseau]]. Commandes : [[90-aide-memoire|aide-mémoire]].
