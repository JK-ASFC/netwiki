---
title: Mitel MiVoice — administration pas à pas
description: Tâches d'administration courantes sur les IPBX Mitel — MiVoice 5000 (Web Admin, MiVoice 5000 Manager), MiVoice Business (System Administration Tool, Mitel Standard Linux, MBG), MiVoice Office 400 (WebAdmin) : créer un utilisateur et son poste, droits et catégories, renvois, groupements et files, standard automatique, trunks SIP, annuaire, messagerie, sauvegardes, mise à jour, supervision et sécurité.
tags: [mitel, mivoice 5000, mivoice business, mivoice office 400, administration, toip]
icon: headset
---

Cette page complète [[27-mitel/02-plateformes-administration|les plateformes Mitel]] et [[27-mitel/01-reseau-telephonie-ip|le réseau pour la téléphonie Mitel]] par les **tâches quotidiennes** d'un administrateur. Les intitulés exacts des menus varient selon la plateforme et la version : la logique reste la même.

## Où administrer ?

| Plateforme | Outil principal | Accès |
| --- | --- | --- |
| **MiVoice 5000** | **Web Admin** (un site) ; **MiVoice 5000 Manager** (multisite) | Navigateur, HTTPS sur l'adresse du serveur |
| **MiVoice Business** | **System Administration Tool** (ESM), *Group Administration Tool* | `https://<mivb>/` (ESM) |
| Serveurs Mitel Standard Linux (MiVB virtuel, MBG, MiCollab) | **server-manager** | `https://<serveur>/server-manager` |
| **MiVoice Office 400** | **WebAdmin** | `https://<adresse>/` |
| **MX-ONE** | Provisioning Manager, Service Node Manager | Navigateur |

## Créer un utilisateur et son poste

| Étape | Points d'attention |
| --- | --- |
| 1. Numéro (annuaire interne) | Respecter le plan de numérotation, vérifier qu'il est libre |
| 2. Type de poste | SIP (6800/6900), MiNet (MiVB), DECT, softphone, analogique |
| 3. Identification du poste | Adresse **MAC** (provisionnement automatique) ou identifiant/mot de passe SIP |
| 4. Nom affiché, langue | Apparaît sur les postes et dans l'annuaire |
| 5. **Catégorie / classe de service** | Droits d'appel (interne, local, national, international), fonctions autorisées |
| 6. Messagerie vocale | Création de la boîte, code initial, notification par courriel |
| 7. Licences | Licence utilisateur/poste disponible |
| 8. Test | Enregistrement du poste, appel interne, appel sortant, appel entrant par SDA |

## Accueil et distribution des appels

| Fonction | Usage |
| --- | --- |
| SDA (numéros directs) | Associer un numéro opérateur à un utilisateur ou un groupe |
| Groupements / *hunt groups* | Distribution vers plusieurs postes (simultanée, cyclique, linéaire) |
| Files (ACD) | Attente avec annonces et musique, agents qui se connectent/déconnectent |
| Standard automatique / SVI | Menus vocaux (« tapez 1… »), annonces enregistrées |
| Horaires et calendriers | Modes jour/nuit, jours fériés, débordement vers la messagerie ou une astreinte |
| Renvois | Immédiat, sur occupation, sur non-réponse ; restreindre les renvois vers l'extérieur |

## Trunks SIP

Paramètres à obtenir de l'opérateur : domaine/proxy, identifiants, format des numéros (E.164 ou national), codecs, nombre de canaux, SDA. Sur MiVoice Business, les trunks passent généralement par la **MiVoice Border Gateway** ; sur MiVoice 5000, par une passerelle SIP interne ou un SBC. Testez systématiquement les **numéros d'urgence** et la présentation du numéro.

## Exploitation

| Tâche | Bonne pratique |
| --- | --- |
| Sauvegardes | Planifiées vers un serveur distant ; restaurer régulièrement sur une maquette |
| Mises à jour | Suivre les versions et les avis de sécurité Mitel, mettre à jour aussi les **micrologiciels des postes** |
| Annuaire | Synchronisation LDAP/AD plutôt que saisie manuelle |
| Supervision | Alarmes (SNMP, syslog), **Mitel Performance Analytics** pour la qualité de voix |
| Taxation | Export des tickets (SMDR/CDR) vers l'outil de taxation |
| Documentation | Plan de numérotation, catégories, routes, comptes d'administration |

## Sécurité

- [ ] Comptes d'administration nominatifs, mots de passe par défaut changés (système, postes, messagerie)
- [ ] Interfaces d'administration accessibles uniquement depuis le réseau d'administration
- [ ] International et surtaxés interdits par défaut ; renvois externes et rappel depuis la messagerie (DISA) contrôlés
- [ ] Chiffrement SIP TLS/SRTP ou MiNet sécurisé
- [ ] MBG/SBC à jour, seule passerelle exposée
- [ ] Revue mensuelle des CDR (appels nocturnes, internationaux)

Pour d'autres IPBX et la comparaison des solutions, voir [[11-autres-ipbx/01-panorama-ipbx|autres IPBX du marché]].
