---
title: AnyDesk et TeamViewer
description: Outils commerciaux de prise en main à distance — fonctionnement (identifiant, serveurs relais de l'éditeur), licences, déploiement en entreprise (MSI personnalisés, politiques, configuration verrouillée), accès sans surveillance et mots de passe, double authentification, listes d'accès, journaux, risques (arnaques au support technique, compromission d'éditeur, usage par des attaquants), filtrage réseau si non autorisés, alternatives auto-hébergées.
tags: [anydesk, teamviewer, prise en main à distance, support, sécurité, déploiement]
icon: monitor
---

**AnyDesk** et **TeamViewer** permettent de prendre le contrôle d'un poste ou d'un serveur à distance via les **serveurs relais** de l'éditeur : pas de VPN ni d'ouverture de port, ce qui les rend très pratiques pour le support… et très prisés des attaquants.

| Critère | AnyDesk | TeamViewer |
| --- | --- | --- |
| Connexion | Identifiant AnyDesk + acceptation ou mot de passe | Identifiant TeamViewer + acceptation ou mot de passe |
| Gestion centralisée | *my.anydesk* (carnet d'adresses, licences, MSI personnalisés) ; version sur site (*On-Premises*) | Console de gestion (stratégies, groupes, appareils), **TeamViewer Tensor** (entreprise : SSO, journaux, accès conditionnel) |
| Plateformes | Windows, macOS, Linux, mobiles | Windows, macOS, Linux, mobiles, IoT |
| Usage privé gratuit | Oui, détection d'usage commercial | Oui, détection d'usage commercial |

## Déploiement en entreprise

- **Installateurs personnalisés** (MSI) générés depuis la console : paramètres imposés (accès sans surveillance désactivé ou contrôlé, fonctions autorisées, liste d'accès), rattachement automatique au compte de l'entreprise.
- **Stratégies** gérées centralement (TeamViewer : *Policies* ; AnyDesk : configuration personnalisée) pour empêcher l'utilisateur de modifier les réglages de sécurité.
- Version **QuickSupport** / module « client » sans installation pour une assistance ponctuelle (l'utilisateur lit son identifiant et accepte).

## Sécurité

| Mesure | Détail |
| --- | --- |
| **Double authentification** sur les comptes des techniciens | Obligatoire |
| Accès sans surveillance | Seulement si nécessaire (serveurs, bornes), avec mot de passe fort et unique **et** liste d'accès (seuls les comptes de l'entreprise peuvent se connecter) |
| **Liste d'accès / liste blanche** | N'accepter que les connexions des identifiants ou comptes de l'organisation |
| Acceptation explicite | Pour les postes utilisateurs : l'utilisateur doit accepter et voit la session |
| Journaux | Journaux de connexion et enregistrement de sessions (selon licence) envoyés au SIEM |
| Mises à jour | Versions récentes ; suivre les avis de sécurité |

> [!WARNING]
> **Risques connus** : arnaques au « faux support technique » (l'escroc fait installer AnyDesk/TeamViewer à la victime), usage par des groupes de rançongiciels pour garder un accès, compromissions d'éditeurs (AnyDesk a révoqué ses certificats de signature et réinitialisé les mots de passe des comptes après une intrusion en 2024 ; TeamViewer a signalé une intrusion dans son réseau d'entreprise la même année). Sensibilisez les utilisateurs : **aucun** technicien légitime ne demande d'installer un outil de prise en main à la suite d'un appel non sollicité.

## Contrôler l'usage

- Si un outil n'est **pas autorisé** : bloquer ses domaines et son installation (contrôle d'applications **AppLocker / WDAC**, EDR, proxy/DNS filtrant) et détecter son exécution (règles SIEM sur les processus `AnyDesk.exe`, `TeamViewer.exe`).
- Si un outil est **autorisé** : imposer la version d'entreprise (rattachée au compte de l'organisation) et bloquer les versions grand public.

## Alternatives

| Outil | Points forts |
| --- | --- |
| [[02-rustdesk\|RustDesk]] | Libre, serveurs auto-hébergés |
| [[03-meshcentral\|MeshCentral]] | Libre, gestion de parc à distance via le web |
| Assistance rapide (Windows) / Remote Help (Intune) | Intégré à Windows / à Intune, authentification Entra ID |
| RDP via passerelle, SSH | Administration des serveurs : voir [[08-rds/02-deploiement-passerelle\|passerelle RD]] |
