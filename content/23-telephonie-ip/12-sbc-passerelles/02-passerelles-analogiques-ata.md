---
title: Passerelles analogiques, ATA et fin du réseau cuivre
description: Raccorder les équipements analogiques à la téléphonie IP — passerelles FXS/FXO et ATA (Grandstream HT, Cisco ATA, AudioCodes MediaPack, Patton SmartNode), configuration type d'un ATA, fax (T.38, G.711 pass-through), lignes d'ascenseur, alarmes et téléassistance, impact de la fermeture du réseau cuivre en France et solutions de remplacement.
tags: [ata, fxs, fxo, passerelle, fax, t.38, cuivre, analogique]
icon: plug
---

## FXS, FXO et ATA

| Terme | Sens | Exemple |
| --- | --- | --- |
| **FXS** (*Foreign eXchange Station*) | Port qui **fournit** la tonalité : on y branche un téléphone analogique, un fax | Port d'un ATA |
| **FXO** (*Foreign eXchange Office*) | Port qui **reçoit** une ligne analogique (de l'opérateur ou d'un ancien PBX) | Raccorder une ligne RTC à un IPBX |
| **ATA** (*Analog Telephone Adapter*) | Petit boîtier SIP avec 1 à 4 ports FXS | Grandstream HT801/HT802/HT814, Cisco ATA 191/192 |
| Passerelle multi-ports | 8 à plusieurs centaines de FXS/FXO | AudioCodes MediaPack MP-1288, Patton SmartNode, Grandstream GXW |

## Configuration type d'un ATA

Interface web de l'ATA (adresse par DHCP, voir le menu vocal en composant `***` sur le téléphone pour certains modèles) :

| Paramètre | Valeur |
| --- | --- |
| Serveur SIP | Adresse/FQDN de l'IPBX, port, transport |
| Compte | Identifiant et mot de passe SIP (compte dédié par port) |
| Codecs | **G.711 A-law** en priorité (fax, modems, alarmes) |
| DTMF | RFC 4733 |
| Fax | **T.38** si l'IPBX et l'opérateur le supportent, sinon G.711 *pass-through* avec suppression de l'annulation d'écho et du VAD |
| Provisionnement | URL du serveur de configuration (option DHCP 66), mot de passe d'administration changé |
| Sécurité | Interface web limitée au LAN, micrologiciel à jour |

## Fax sur IP

Le fax supporte mal la compression, la gigue et les pertes : utilisez **T.38** de bout en bout (ATA → IPBX → opérateur) ou G.711 sans VAD, avec un réseau sans pertes. Les solutions de **fax dématérialisé** (fax-to-mail, services en ligne) sont souvent plus fiables que le transport du fax sur IP.

## Fin du réseau cuivre (France)

L'opérateur historique ferme progressivement le **réseau cuivre** (arrêt de la commercialisation puis fermeture technique par lots de communes, jusqu'à 2030) :

| Équipement | Risque | Solution |
| --- | --- | --- |
| Lignes analogiques de l'IPBX | Coupure | Trunk SIP sur fibre (avec secours) |
| **Ascenseurs** (téléalarme) | Obligation réglementaire de liaison permanente | Boîtiers GSM/4G dédiés ou passerelles certifiées |
| Alarmes intrusion, télésurveillance | Transmetteurs RTC muets | Transmetteurs IP/4G, double voie |
| Téléassistance, TPE, compteurs | Communication impossible | Modèles IP ou 4G |
| Fax | — | Fax T.38 ou dématérialisé |

Recensez **toutes** les lignes analogiques (factures opérateur) bien avant la date de fermeture de chaque site.

Voir aussi les [[01-sbc|SBC]] et les [[13-postes-provisionnement/01-postes-ip-provisionnement|postes IP]].
