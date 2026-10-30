---
title: Préparer le réseau pour la téléphonie IP Mitel
description: Concevoir et configurer le réseau d'accueil d'une téléphonie Mitel (MiVoice Business, MiVoice 5000, MX-ONE, MiVoice Office 400) — familles de postes (SIP 6800/6900, MiNet, DECT), VLAN voix, PoE, découverte par LLDP-MED ou options DHCP (66, 43, 125), QoS (DSCP 46, 802.1p), ports de signalisation et de média, configuration des commutateurs Cisco, Aruba AOS-CX et HPE Comware, pare-feu et ALG SIP, passerelle MiVoice Border Gateway, et dépannage des problèmes de voix.
tags: [mitel, voip, vlan voix, lldp-med, dhcp, qos, poe, sip]
icon: network
---

**Mitel** (qui a absorbé Aastra en 2014, puis Unify en 2023) est très présent en France avec **MiVoice 5000** (héritier d'Aastra 5000) et **MiVoice Business** (MiVB, ex-3300 ICP), à côté de **MX-ONE**, **MiVoice Office 400** et **MiVoice Connect**. Quel que soit l'autocommutateur, la qualité de la voix dépend d'abord du **réseau** : VLAN dédié, alimentation PoE, découverte automatique et QoS de bout en bout.

## Familles de postes

| Famille | Protocole | Remarques |
| --- | --- | --- |
| **6800 / 6900** (6865i, 6867i, 6869i, 6920, 6930, 6940…) | **SIP** | Universels : MiVoice 5000, MX-ONE, MiVoice Office 400, MiVB (en SIP ou en MiNet sur certains modèles 6900) ; configuration par fichiers (`aastra.cfg`, `<MAC>.cfg`) servis en HTTP(S)/TFTP |
| 5300 / 6900 en mode MiNet | **MiNet** (propriétaire Mitel) | MiVoice Business |
| DECT (SIP-DECT, bornes RFP) | SIP + DECT | Gestion par l'OMM (*OpenMobility Manager*) |
| Softphones (MiCollab, application mobile) | SIP | Accès distant via MiVoice Border Gateway |

Le **RCS** (*Redirect and Configuration Service*) de Mitel permet le déploiement sans contact : au premier démarrage, le poste SIP interroge le service cloud de redirection qui lui indique le serveur de configuration de l'entreprise.

## VLAN voix et PoE

| Élément | Recommandation |
| --- | --- |
| VLAN voix | VLAN dédié (ex. 40), sous-réseau dédié, étiqueté sur le port d'accès ; VLAN données non étiqueté pour le PC chaîné derrière le poste |
| PoE | 802.3af (classe 1 à 3) pour la plupart des postes, 802.3at pour les modèles avec module d'extension ou écran couleur ; vérifier le **budget PoE** du commutateur et l'onduleur |
| Découverte | **LLDP-MED** (TLV *Network Policy* : VLAN, priorité 802.1p, DSCP) — la méthode la plus simple et la plus fiable |
| Repli | Options DHCP (le poste démarre dans le VLAN natif, lit le VLAN voix dans l'option, puis redémarre dans ce VLAN) |

## Options DHCP

| Option | Usage |
| --- | --- |
| 66 | Serveur de configuration des postes SIP (`http://`, `https://` ou `tftp://` suivi de l'adresse) |
| 43 ou **125** | Chaîne d'informations Mitel pour les postes MiNet (et VLAN voix), par exemple `id:ipphone.mitel.com;call_srv=10.0.40.10;vlan=40;l2p=6;dscp=46` |
| 42, 2 / 101 | Serveur NTP et fuseau horaire |
| 6, 15 | DNS (indispensable si la configuration utilise des noms) |

La syntaxe exacte de la chaîne d'options (MiNet) et les paramètres reconnus dépendent du système et de la version : reportez-vous au guide d'ingénierie Mitel. Sous Windows Server, l'option 125 se déclare comme option personnalisée (voir [[03-dhcp-windows/01-presentation-installation|DHCP Windows Server]]) ; avec Kea ou ISC DHCP, en option de fournisseur.

## QoS

| Trafic | DSCP | 802.1p |
| --- | --- | --- |
| Voix (RTP) | **46 (EF)** | 6 (valeur Mitel par défaut) ou 5 |
| Signalisation (SIP, MiNet) | 24 (CS3) ou 26 (AF31) selon le système | 3 |
| Vidéo | 34 (AF41) | 4 |

Sur les commutateurs d'accès, faites **confiance au marquage DSCP** des postes (ou reclassez-le) et appliquez une file prioritaire ; sur le WAN, réservez la bande passante (≈ 100 kbit/s par appel en G.711 avec les en-têtes, ≈ 30 kbit/s en G.729).

## Ports réseau usuels

| Flux | Ports |
| --- | --- |
| SIP | UDP/TCP 5060, **TLS 5061** |
| MiNet | TCP 6800 (et 6801/6802 pour MiNet sécurisé) |
| RTP / SRTP | Plage UDP propre à chaque système (à relever dans sa documentation) |
| Provisionnement | HTTP(S) 80/443, TFTP 69 |

## Exemples de configuration des commutateurs

```cisco
interface GigabitEthernet1/0/12
 description Poste Mitel bureau 12
 switchport mode access
 switchport access vlan 20
 switchport voice vlan 40
 spanning-tree portfast
 power inline auto
```

Sur Cisco, `switchport voice vlan` est annoncé automatiquement par CDP et LLDP-MED (`lldp run` à activer globalement). Voir [[04-cisco-commutateurs/01-vlan-trunk-stp|commutateurs Cisco]].

```aoscx
vlan 40
    name VOIX
    voice
interface 1/1/12
    no shutdown
    vlan trunk native 20
    vlan trunk allowed 20,40
    qos trust dscp
```

Sur AOS-CX, le drapeau `voice` du VLAN le fait annoncer par LLDP-MED ([[07-aruba/02-aos-cx-cli|Aruba AOS-CX]]).

```comware
vlan 40
 name VOIX
 quit
interface GigabitEthernet1/0/12
 port link-type hybrid
 port hybrid vlan 20 untagged
 port hybrid vlan 40 tagged
 port hybrid pvid vlan 20
 voice-vlan 40 enable
 lldp tlv-enable med-tlv network-policy 40
 qos trust dscp
```

(Comware : voir [[06-hpe-comware/01-cli-comware|HPE Comware]] ; les options exactes de `voice-vlan` et de LLDP-MED varient selon la version.)

## Pare-feu, NAT et accès distant

- **Désactivez l'ALG SIP** des pare-feu et routeurs (FortiGate, Zyxel, box opérateur…) qui réécrit souvent mal les messages SIP et provoque audio unidirectionnel et pertes d'enregistrement.
- Les postes distants (télétravail) et les **trunks SIP** opérateur passent par la **MiVoice Border Gateway** (MBG), qui fait office de SBC et de proxy pour les postes MiNet et SIP.
- Chiffrez la signalisation (SIP TLS, MiNet sécurisé) et le média (**SRTP**) dès que les postes et le système le permettent.

## Dépannage

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Poste bloqué en « DHCP » ou redémarrages en boucle | VLAN voix non étiqueté sur le port, pas d'étendue DHCP dans le VLAN voix | Vérifier LLDP-MED (`show lldp neighbors detail`), l'étendue et le relais DHCP |
| Poste qui ne s'enregistre pas | Mauvaise adresse de serveur (option 66/125), DNS, certificat (TLS) | Journal du poste (interface web du poste), capture sur le port |
| **Audio unidirectionnel** | ALG SIP, NAT, route ou règle de pare-feu manquante pour le RTP | Désactiver l'ALG, ouvrir la plage RTP, vérifier le routage retour |
| Voix hachée, écho | Gigue et pertes (congestion, duplex, Wi-Fi) | QoS de bout en bout, compteurs d'erreurs, statistiques RTP du poste |
| Poste qui s'éteint | Budget PoE dépassé | `show power inline`, répartir ou renforcer l'alimentation |

Pour l'analyse, une capture sur un port miroir ouverte dans [[02-reseau-diagnostic/02-wireshark-analyse|Wireshark]] (*Téléphonie → Appels VoIP*, *Flux RTP*) révèle immédiatement les problèmes de signalisation et de qualité. Suite : [[02-plateformes-administration|plateformes et outils d'administration Mitel]].
