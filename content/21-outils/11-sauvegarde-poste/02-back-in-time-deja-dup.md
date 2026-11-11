---
title: Back In Time et Déjà Dup
description: Sauvegarder les fichiers personnels d'un poste Linux — Back In Time (GPL : instantanés rsync à liens physiques, profils, inclusions et exclusions, planification, destination locale ou SSH, commandes backintime) et Déjà Dup (GNOME, GPL : sauvegardes chiffrées et incrémentales avec duplicity ou restic, destinations locales, réseau et cloud, restauration de fichiers et de dossiers, restauration en ligne de commande).
tags: [back in time, déjà dup, duplicity, restic, rsync, sauvegarde, gnome, linux]
icon: archive
---

Ces deux outils sauvegardent les **données de l'utilisateur** (documents, configuration) vers un autre disque, un NAS ou un serveur. Ils complètent les instantanés système de [[01-timeshift-snapper|Timeshift et Snapper]].

| | Back In Time | Déjà Dup |
| --- | --- | --- |
| Moteur | rsync + liens physiques | duplicity (historique) ; restic dans les versions récentes |
| Format sur la destination | Arborescence de fichiers normale, lisible sans l'outil | Archives (duplicity) ou dépôt restic |
| Chiffrement | Non (sauf destination chiffrée) | **Oui**, par phrase de passe |
| Destinations | Disque local, SSH | Disque local, partage réseau (SMB, SFTP, WebDAV), stockage cloud selon la version |
| Interface | Qt, ligne de commande | GNOME (GTK), très simple |
| Pour qui | Administrateurs qui veulent des copies lisibles directement | Utilisateurs de GNOME, sauvegarde « sans y penser » |

## Back In Time

```bash
sudo apt install backintime-qt     # Debian, Ubuntu (backintime-common pour la ligne de commande seule)
sudo dnf install backintime-qt     # Fedora
```

- Chaque instantané est un **dossier daté** : les fichiers inchangés sont des liens physiques vers l'instantané précédent, ce qui économise l'espace tout en gardant des copies complètes et lisibles.
- **Profils** : plusieurs jeux de dossiers, destinations et planifications (par exemple `/home` vers un disque USB, `/etc` vers un serveur).
- **Inclusions et exclusions** par dossier ou motif (caches, corbeilles, `node_modules`…).
- **Planification** via cron, au branchement d'un disque (udev) ou au démarrage.
- **Conservation** dégressive : tout garder un jour, un par jour pendant une semaine, un par semaine pendant un mois…
- Mode **root** (`backintime-qt_polkit`) pour sauvegarder des fichiers système.

```bash
backintime backup                         # sauvegarde avec le profil par défaut
backintime --profile-id 2 backup
backintime snapshots-list                 # instantanés existants
backintime restore /home/alice/Documents/rapport.odt "" 20261111-100001-123   # "" : emplacement d'origine
backintime check-config
```

Destination SSH : indiquer l'hôte, l'utilisateur et le chemin ; Back In Time utilise une clé SSH sans phrase de passe (ou un agent) et lance rsync à distance.

## Déjà Dup

```bash
sudo apt install deja-dup          # préinstallé sur Ubuntu et Fedora Workstation
flatpak install flathub org.gnome.DejaDup
```

Réglages dans l'application **Sauvegardes** :

| Réglage | Conseil |
| --- | --- |
| Dossiers à sauvegarder | Dossier personnel (par défaut) |
| Dossiers à ignorer | Corbeille, Téléchargements, caches |
| Emplacement | Disque externe, dossier réseau (SFTP, SMB), stockage cloud selon la version |
| Chiffrement | Activer et **conserver la phrase de passe** hors du poste (gestionnaire de mots de passe) |
| Planification | Quotidienne ou hebdomadaire, conservation « au moins six mois » |

```bash
deja-dup --backup                  # lancer une sauvegarde
deja-dup --restore ~/Documents     # restaurer un dossier (interface)
```

> [!IMPORTANT]
> Sans la **phrase de passe**, une sauvegarde chiffrée est irrécupérable. Faites un essai de restauration sur un autre poste avant d'en avoir besoin.

### Restaurer sans Déjà Dup

Les sauvegardes duplicity se restaurent avec l'outil `duplicity`, et les dépôts restic avec `restic`, depuis n'importe quel Linux :

```bash
# duplicity : sauvegarde sur un disque monté
duplicity restore file:///media/alice/Sauvegarde/poste ~/restauration
duplicity restore --path-to-restore Documents/rapport.odt file:///media/alice/Sauvegarde/poste ~/rapport.odt

# restic (versions récentes de Déjà Dup)
restic -r /media/alice/Sauvegarde/poste snapshots
restic -r /media/alice/Sauvegarde/poste restore latest --target ~/restauration
```

## Règle 3-2-1

Trois copies des données, sur deux supports différents, dont une **hors du site** : par exemple le poste, un disque USB (Back In Time ou Déjà Dup) et une copie chiffrée chez un hébergeur ou sur un NAS distant. Les outils de sauvegarde serveur (restic, Borg, Kopia…) sont présentés dans la catégorie Sauvegarde du wiki.

Commandes : [[90-aide-memoire|aide-mémoire]].
