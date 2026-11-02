---
title: Présentation, installation et utilisation
description: Duplicati — sauvegarde chiffrée (AES-256), incrémentale et dédupliquée avec interface web (LGPL/MIT) : stockages (dossier local, SMB, SFTP, S3 et compatibles, OneDrive, Google Drive, Dropbox, WebDAV, B2, Azure), installation (Windows MSI ou service, Linux .deb/.rpm, macOS, Docker), interface sur le port 8200 et protection par mot de passe, création d'une tâche (source, filtres, destination, planification, rétention intelligente), restauration, ligne de commande duplicati-cli, exports de configuration, vérification et précautions.
tags: [duplicati, sauvegarde, chiffrement, interface web, onedrive, s3]
icon: info
---

**Duplicati** sauvegarde des fichiers de postes et de petits serveurs vers un stockage **cloud** ou réseau, avec chiffrement côté client et une **interface web** accessible aux non-spécialistes. Il découpe les données en blocs dédupliqués stockés dans des archives (volumes de 50 Mo par défaut).

## Installation

| Système | Méthode |
| --- | --- |
| Windows | MSI depuis duplicati.com (option service Windows pour sauvegarder sans session ouverte) |
| Debian/Ubuntu | Paquet `.deb` (`sudo apt install ./duplicati-*.deb`), service `duplicati` |
| RHEL/Fedora | Paquet `.rpm` |
| macOS | Paquet `.dmg` |
| Docker | `lscr.io/linuxserver/duplicati` ou `duplicati/duplicati` |

Interface : `http://localhost:8200`. Définissez immédiatement un **mot de passe** d'interface (*Paramètres*) ; ne l'exposez pas sur le réseau sans reverse proxy authentifié.

## Créer une sauvegarde

1. **Général** : nom, **phrase de chiffrement** (à conserver hors de la machine — sans elle, aucune restauration).
2. **Destination** : type (S3 compatible, SFTP, OneDrive…), chemin, identifiants, *Tester la connexion*.
3. **Source** : dossiers, filtres (exclure caches, fichiers temporaires).
4. **Planification** : quotidienne à heure fixe.
5. **Options** : taille des volumes, **rétention intelligente** (une par jour sur 7 jours, une par semaine sur 4 semaines, une par mois sur 12 mois).

Exportez la configuration de chaque tâche (*Exporter → Fichier*, en incluant ou non les mots de passe) pour pouvoir la recréer après une perte de la machine.

## Ligne de commande

```bash
duplicati-cli backup "s3://sauv-duplicati/poste-01?s3-server-name=minio.corp.exemple.fr&auth-username=ACCES&auth-password=SECRET" /home/jk \
  --passphrase="$PHRASE" --retention-policy="7D:1D,4W:1W,12M:1M"
duplicati-cli list "s3://…" --passphrase="$PHRASE"
duplicati-cli restore "s3://…" "*/Documents/rapport.odt" --restore-path=/tmp/restaure --passphrase="$PHRASE"
duplicati-cli test "s3://…" 5 --passphrase="$PHRASE"         # vérifier 5 volumes
```

<!-- CAPTURE: Duplicati — tableau des sauvegardes (accueil de l'interface web) | _assets/duplicati-accueil.png -->
<!-- CAPTURE: Duplicati — assistant de création, étape Destination | _assets/duplicati-destination.png -->
<!-- CAPTURE: Duplicati — restauration de fichiers | _assets/duplicati-restauration.png -->

> [!NOTE]
> La base locale de Duplicati (SQLite) accélère les opérations ; si elle est perdue ou corrompue, *Réparer* la reconstruit depuis la destination (long sur de gros volumes).

Commandes : [[90-aide-memoire|aide-mémoire]].
