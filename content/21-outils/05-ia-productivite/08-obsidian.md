---
title: Obsidian
description: Obsidian, application de prise de notes Markdown locale — coffres (dossiers de fichiers Markdown), liens internes et rétroliens, graphe, modèles, propriétés et requêtes, extensions communautaires (risques et sélection), synchronisation (Obsidian Sync, Git, Syncthing, partage réseau), usages pour l'administrateur (journal d'interventions, procédures, notes d'incidents), chiffrement et sauvegarde, licence.
tags: [obsidian, notes, markdown, base de connaissances, synchronisation, git]
icon: notebook
---

**Obsidian** organise des notes en **Markdown** stockées comme de simples fichiers dans un dossier (*coffre*). Sa force : les **liens** entre notes (`[[Note]]`), le graphe des relations, des modèles et une vaste bibliothèque d'extensions. Gratuit, y compris en entreprise (licence commerciale facultative depuis 2025), application propriétaire (format ouvert : les fichiers restent lisibles sans Obsidian).

Il complète un wiki d'équipe comme celui-ci ou [[09-bookstack|BookStack]] : notes **personnelles** ou de travail en cours, journal d'interventions, brouillons de procédures.

## Installation

```powershell
winget install Obsidian.Obsidian
```

macOS (`brew install --cask obsidian`), Linux (AppImage, Flatpak, `.deb`), iOS et Android.

## Organisation

```text Exemple de coffre d'administrateur
Coffre-Infra/
├── 00-Boîte de réception/
├── Journal/2026-10-29.md            (note quotidienne : interventions, appels, décisions)
├── Incidents/2026-10-14 Panne DHCP siège.md
├── Équipements/sw-coeur-paris.md     (propriétés : site, modèle, version, contrat)
├── Procédures/Remplacement d'un commutateur d'accès.md
├── Modèles/Incident.md
└── Pièces jointes/
```

| Fonction | Usage |
| --- | --- |
| Liens `[[...]]` et **rétroliens** | Relier un incident à l'équipement, à la procédure, au fournisseur |
| **Propriétés** (en-tête YAML) | Métadonnées : `site`, `statut`, `date`, `criticité` |
| **Bases** (requêtes sur les propriétés) / extension Dataview | Tableaux dynamiques : incidents ouverts, équipements par site |
| Modèles | Trame identique pour chaque incident ou intervention |
| Canvas | Schémas et tableaux blancs |
| Recherche | Plein texte, opérateurs (`path:`, `tag:`) |

```markdown Modèles/Incident.md
---
type: incident
date: {{date}}
statut: ouvert
gravite:
equipements: []
---
## Chronologie
## Impact
## Cause
## Actions correctives
## Leçons retenues
```

## Extensions

Les **extensions communautaires** (Dataview, Templater, Excalidraw, Git, Calendar…) ont accès à **tout le coffre et au système** (elles exécutent du code). Gardez le *mode restreint* activé par défaut, n'installez que des extensions largement utilisées et maintenues, et limitez leur nombre — surtout sur un coffre contenant des informations sensibles.

## Synchronisation et sauvegarde

| Méthode | Remarques |
| --- | --- |
| **Obsidian Sync** (payant) | Chiffrement de bout en bout, historique des versions, mobiles |
| **Git** (extension Obsidian Git) | Historique complet, revue ; mobile moins simple |
| [[11-syncthing/01-presentation-installation\|Syncthing]] | Pair à pair, sans cloud |
| Nextcloud, partage réseau, OneDrive | Simple ; attention aux conflits si deux appareils modifient en même temps |

Sauvegardez le dossier du coffre comme tout dossier de données ([[01-restic/01-presentation-installation|restic]]).

## Sécurité

- [ ] Pas de mots de passe ni de secrets dans les notes : un **gestionnaire de mots de passe** ([[03-cybersecurite/06-keepassxc-bitwarden|KeePassXC / Bitwarden]]) avec un lien vers l'entrée
- [ ] Coffre sur un disque **chiffré** (BitLocker, FileVault, LUKS) ; verrouillage de l'appareil mobile
- [ ] Données professionnelles : respecter la politique de l'entreprise sur le stockage et la synchronisation
