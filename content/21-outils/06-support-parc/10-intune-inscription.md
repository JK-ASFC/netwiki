---
title: Microsoft Intune — présentation et inscription
description: Microsoft Intune, gestion des terminaux dans le cloud (MDM/MAM) — licences, prérequis (Entra ID, autorité MDM, domaines), types de jonction (Entra ID, hybride, BYOD), inscription automatique, Windows Autopilot (profils, préprovisionnement, ESP), inscription iOS/iPadOS (ADE, certificat APNs), Android Enterprise, macOS, co-gestion avec Configuration Manager, filtres et groupes dynamiques.
tags: [intune, mdm, autopilot, entra id, inscription, co-gestion, terminaux]
icon: laptop
---

**Microsoft Intune** gère depuis le cloud les postes **Windows**, **macOS**, **iOS/iPadOS**, **Android** et Linux (Ubuntu, RHEL) : configuration, conformité, applications, mises à jour, sécurité. Il remplace progressivement les GPO et Configuration Manager pour les postes, en particulier nomades, sans dépendre du réseau interne.

## Prérequis

| Élément | Remarque |
| --- | --- |
| Licences | Intune Plan 1 (inclus dans Microsoft 365 E3/E5, Business Premium, EMS) ; Plan 2 et Suite pour des fonctions avancées |
| **Microsoft Entra ID** | Identités synchronisées (Entra Connect) ou cloud |
| Autorité MDM | Intune (par défaut sur les locataires récents) |
| Enregistrements DNS | `enterpriseenrollment` et `enterpriseregistration` (CNAME) pour le domaine des utilisateurs |
| Groupes | Groupes Entra (statiques ou **dynamiques**) pour cibler stratégies et applications |

## Windows : modes de jonction

| Mode | Usage |
| --- | --- |
| **Joint à Entra ID** | Postes modernes cloud-first : authentification Entra, Intune, accès aux ressources locales via Kerberos cloud / Windows Hello |
| Joint hybride (AD + Entra) | Postes existants du domaine ; dépend du réseau ou du VPN pour la jonction initiale |
| Inscrit (BYOD) | Appareil personnel avec compte professionnel (gestion limitée) |

**Inscription automatique** : *Entra ID → Mobilité (MDM et MAM) → Microsoft Intune* : portée MDM sur un groupe d'utilisateurs ; les postes joints à Entra s'inscrivent automatiquement. Pour les postes hybrides existants : GPO *Activer l'inscription MDM automatique à l'aide des informations d'identification Entra par défaut*.

## Windows Autopilot

**Autopilot** prépare un poste neuf **sans image** : l'utilisateur déballe, se connecte au réseau et s'authentifie ; le poste se joint, s'inscrit, reçoit stratégies et applications.

1. **Enregistrer** les appareils (hachage matériel fourni par le constructeur ou le revendeur, ou collecté par script) :

```powershell
Install-Script -Name Get-WindowsAutopilotInfo -Force
Get-WindowsAutopilotInfo -OutputFile C:\Temp\autopilot.csv      # à importer dans Intune
# ou directement : Get-WindowsAutopilotInfo -Online -GroupTag "Siege"
```

2. **Profil de déploiement** : mode piloté par l'utilisateur (ou *self-deploying* pour les bornes), Entra ID ou hybride, compte utilisateur standard (non administrateur), nom d'ordinateur (`CORP-%SERIAL%`), langue.
3. **Page d'état d'inscription** (ESP) : bloque l'utilisation tant que les applications et stratégies essentielles ne sont pas installées.
4. **Préprovisionnement** (*White Glove*) : l'informatique ou le revendeur installe à l'avance la partie appareil.

Les **Group Tags** et groupes dynamiques (`(device.devicePhysicalIds -any (_ -eq "[OrderID]:Siege"))`) affectent les profils par site ou usage.

## Autres plateformes

| Plateforme | Inscription |
| --- | --- |
| **iOS / iPadOS** | Certificat **APNs** (renouvellement annuel avec le même identifiant Apple !) ; appareils de l'entreprise par **ADE** via Apple Business Manager ; BYOD par l'application Portail d'entreprise ou inscription utilisateur |
| **Android Enterprise** | Liaison au compte Google géré ; profil professionnel (BYOD), entièrement géré, dédié (bornes) |
| **macOS** | ADE (Apple Business Manager) ou inscription par le Portail d'entreprise ; *Platform SSO* |
| Linux | Ubuntu et RHEL : conformité et accès conditionnel |

## Co-gestion

Avec **Configuration Manager** existant, la **co-gestion** bascule progressivement des charges de travail (conformité, mises à jour Windows, applications, configuration) de ConfigMgr vers Intune, appareil par appareil (collections pilotes).

## Filtres et ciblage

- Affecter les stratégies à des **groupes** d'utilisateurs ou d'appareils ; utiliser les **filtres** d'affectation (modèle, OS, propriétés) plutôt que de multiplier les groupes.
- Groupes **pilote**, **anneau 1**, **production** pour tous les changements.

Suite : [[11-intune-strategies-applications|stratégies, conformité, applications et mises à jour]].
