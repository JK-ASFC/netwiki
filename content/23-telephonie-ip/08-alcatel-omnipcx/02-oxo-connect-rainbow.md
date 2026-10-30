---
title: ALE OXO Connect et Rainbow
description: La téléphonie ALE pour les PME et le cloud — OXO Connect (IPBX jusqu'à quelques centaines d'utilisateurs, administration web WBM et OMC, postes, trunks SIP, accueil, messagerie), mise en réseau, Rainbow (communications unifiées cloud d'ALE, applications Windows, macOS, Linux web, Android, iOS, Rainbow Hub pour la téléphonie cloud), administration, sécurité et dépannage.
tags: [alcatel, ale, oxo connect, rainbow, wbm, omc, pme, cloud]
icon: building-2
---

## OXO Connect

**OXO Connect** (successeur de l'OmniPCX Office) est l'IPBX d'ALE pour les PME : un châssis (Compact, Small, Medium, Large) ou une version virtualisée *OXO Connect Evolution*, avec postes numériques, IP (8008, 8018, 8028s, ALE-xx), DECT et SIP.

### Administration

| Outil | Usage |
| --- | --- |
| **WBM** (*Web-Based Management*) | Interface web embarquée pour l'installation et la gestion courante (`https://<adresse-oxo>`) |
| **OMC** (*OXO Management Console*) | Client Windows complet pour toute la configuration (installateurs) |
| Easy / Expert views | Niveaux de détail de la gestion |
| Applications utilisateur | Paramètres personnels via le poste ou Rainbow |

### Configuration type

| Étape | Où (WBM/OMC) |
| --- | --- |
| Plan de numérotation | Numéros internes, préfixe de sortie, numéros d'urgence |
| Utilisateurs et postes | Création, association aux postes (adresse MAC pour les postes IP), droits (catégories) |
| Trunks SIP | Compte opérateur (passerelle SIP, enregistrement, codecs), SDA |
| Accueil | Messagerie vocale intégrée, standard automatique (menus), annonces, horaires (jour/nuit) |
| Groupements | Groupes d'appel, interception |
| Réseau | Adresse IP, VLAN voix, DHCP (interne ou externe), QoS |

### Bonnes pratiques

- Mots de passe d'installation et d'administration changés, accès distant limité (VPN, accès de maintenance ALE contrôlé).
- Restrictions d'appels internationaux et surtaxés par catégorie, contrôle des renvois externes (fraude).
- Sauvegarde de la configuration (WBM/OMC) avant chaque modification majeure et mise à jour.

## Rainbow

**Rainbow** est la plateforme de communications unifiées d'ALE dans le cloud (hébergement en Europe) :

| Fonction | Détail |
| --- | --- |
| Messagerie, présence, partage de fichiers | Entre utilisateurs de l'entreprise et invités |
| Audio/visioconférence | Réunions, partage d'écran |
| **Téléphonie** | Connexion à un OXE/OXO existant (Rainbow Edge/connecteur) ou téléphonie 100 % cloud (**Rainbow Hub**) |
| Applications | Windows, macOS, web (Linux), Android, iOS, intégrations Microsoft Teams et Outlook |
| API (CPaaS) | SDK pour intégrer messagerie, appels et vidéo dans des applications métiers |

### Administration

Console d'administration web Rainbow (rôle administrateur d'entreprise) : utilisateurs (import CSV, synchronisation AD/Entra ID via le connecteur), licences, politiques de sécurité (mots de passe, SSO SAML/OIDC, MFA), connexion aux systèmes téléphoniques, rapports.

## Dépannage

| Symptôme | Piste |
| --- | --- |
| Poste IP ne s'enregistre pas sur l'OXO | VLAN voix, DHCP, adresse de l'OXO, licence de poste IP disponible |
| Trunk SIP inactif | Identifiants, pare-feu/ALG, DNS de l'opérateur |
| Rainbow ne passe pas les appels | Connecteur Rainbow (état, certificats), licences téléphoniques, flux sortants vers le cloud ALE autorisés |
| Qualité dégradée en télétravail | Réseau domestique, Wi-Fi, préférer le client Rainbow avec casque filaire |

Voir aussi [[01-omnipcx-enterprise|OmniPCX Enterprise]] et [[09-alcatel-lucent-enterprise/01-omniswitch-cli|commutateurs OmniSwitch]].
