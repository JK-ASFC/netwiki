---
title: Termius
description: Termius, client SSH, Mosh, Telnet et SFTP multiplateforme (Windows, macOS, Linux, iOS, Android) — hôtes, groupes et étiquettes, identités et clés, trousseau chiffré synchronisé, rebonds, redirections de ports, extraits de commandes, coffres d'équipe et partage, sécurité (chiffrement de bout en bout, clés matérielles, données dans le cloud) et bonnes pratiques en entreprise.
tags: [termius, ssh, sftp, mosh, multiplateforme, mobile, coffre]
icon: terminal
---

**Termius** est un client SSH commercial (offre gratuite limitée, abonnements Pro et Équipe) disponible sur **tous les systèmes**, mobiles compris : pratique pour intervenir depuis une tablette ou un téléphone pendant une astreinte, et pour partager un carnet d'hôtes au sein d'une équipe.

## Fonctions

| Fonction | Description |
| --- | --- |
| Hôtes, groupes, étiquettes | Inventaire des serveurs et équipements, paramètres hérités par groupe |
| **Identités** | Nom d'utilisateur + mot de passe ou clé, réutilisables entre hôtes |
| Clés | Génération Ed25519/RSA, import de clés existantes, clés **FIDO2** (matérielles) selon la plateforme |
| Trousseau synchronisé | Hôtes, identités et clés synchronisés (chiffrés de bout en bout) entre appareils |
| Rebond | *Host chaining* : connexion via un ou plusieurs bastions |
| Redirections | Locales, distantes, dynamiques (SOCKS) |
| **Snippets** | Extraits de commandes réutilisables, exécutables sur plusieurs hôtes |
| SFTP | Transferts par glisser-déposer entre local et distant ou entre deux hôtes |
| Mosh | Sessions résistantes aux changements de réseau (mobile) |
| Équipes | Coffres partagés, droits par membre (offres payantes) |

## Installation

```powershell
winget install Termius.Termius          # Windows
```

macOS : App Store ou site officiel ; Linux : paquet `.deb`, Snap ou AppImage ; mobiles : magasins d'applications. Un compte Termius est nécessaire pour la synchronisation.

## Bonnes pratiques

- Organiser les hôtes par **site** et **rôle** (groupes) avec des identités distinctes par niveau de privilège ; importer depuis `~/.ssh/config` ou un fichier CSV.
- Utiliser des **clés** (idéalement matérielles) plutôt que des mots de passe ; activer la **double authentification** du compte Termius.
- Pour les accès privilégiés, passer par le **bastion** de l'entreprise (traçabilité) plutôt que des connexions directes.
- Ne pas laisser le téléphone déverrouillé avec des sessions ouvertes ; verrouillage de l'application par code ou biométrie.

## Sécurité en entreprise

| Question | Point d'attention |
| --- | --- |
| Où sont les données ? | Le trousseau est stocké chez l'éditeur, chiffré de bout en bout (clé dérivée du mot de passe du compte) : vérifiez l'acceptabilité au regard de votre politique |
| Qui accède aux coffres d'équipe ? | Droits par membre, retrait immédiat lors d'un départ (et rotation des secrets partagés) |
| Journalisation | Termius ne remplace pas l'enregistrement des sessions d'un bastion |
| Alternative sans cloud | Désactiver la synchronisation (usage local), ou utiliser des clients locaux ([[01-putty\|PuTTY]], Windows Terminal, OpenSSH) avec un gestionnaire de mots de passe interne |

Voir aussi [[01-openssh/05-tunnels-bastion|tunnels et bastion SSH]].
