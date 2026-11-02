---
title: Présentation, installation et utilisation
description: Gestionnaires de mots de passe d'équipe auto-hébergés — Passbolt Community Edition (AGPL, PHP : chiffrement OpenPGP de bout en bout, extension de navigateur obligatoire, partage par utilisateur et groupe, dossiers, API et CLI go-passbolt, application mobile, installation par paquets Debian/Ubuntu/RHEL ou Docker, comptes administrateurs, sauvegarde des clés serveur) et Psono Community Edition (Apache 2.0 : chiffrement côté client, partages, secrets typés, extension et applications, Docker), comparaison avec Bitwarden/Vaultwarden et KeePassXC, et procédures de récupération.
tags: [passbolt, psono, mots de passe, équipe, openpgp, auto-hébergement]
icon: info
---

Pour partager les mots de passe d'infrastructure entre administrateurs (comptes de service, équipements, consoles), un **gestionnaire d'équipe** auto-hébergé évite les fichiers partagés et trace les accès. Alternatives : [[08-vaultwarden/01-presentation-installation|Vaultwarden]] (compatible Bitwarden) et [[03-cybersecurite/06-keepassxc-bitwarden|KeePassXC]] (fichier local).

| | **Passbolt CE** | **Psono CE** | Vaultwarden |
| --- | --- | --- | --- |
| Licence | AGPL (éditions Pro payantes) | Apache 2.0 (Enterprise payante) | AGPL |
| Chiffrement | OpenPGP de bout en bout (clé par utilisateur) | Côté client (NaCl) | Côté client (protocole Bitwarden) |
| Accès | **Extension de navigateur** + mobile | Web, extension, mobile | Applications Bitwarden |
| Points forts | Partage par groupe très fin, audit | Secrets typés, partages imbriqués | Écosystème Bitwarden complet |

## Passbolt CE

```bash
# Debian/Ubuntu : script de configuration du dépôt (passbolt-repo-setup) puis
sudo apt install passbolt-ce-server        # assistant : MariaDB, NGINX, certificat ; puis https://passbolt.corp.exemple.fr
sudo su -s /bin/bash -c "/usr/share/php/passbolt/bin/cake passbolt register_user -u admin@corp.exemple.fr -f Admin -l Infra -r admin" www-data
```

Docker : image `passbolt/passbolt` avec MariaDB. Sauvegarder la **base** et la **clé GPG du serveur** (`/etc/passbolt/gpg/`). Chaque utilisateur doit conserver son **kit de récupération** (clé privée) ; l'édition Pro ajoute la récupération de compte organisationnelle.

## Psono CE

```bash
# Docker Compose officiel : psono-combo (serveur + client web) avec PostgreSQL ; configuration settings.yaml (clés générées par la commande fournie)
docker compose up -d
```

## Bonnes pratiques

- Authentification forte (2FA TOTP ou clé matérielle), comptes nominatifs, groupes par équipe.
- Procédure **bris de glace** : accès d'urgence documenté et testé (coffre hors ligne pour les secrets les plus critiques).
- Révoquer et **changer** les secrets partagés au départ d'un administrateur.

<!-- CAPTURE: Passbolt — liste des mots de passe et partage par groupe | _assets/passbolt-liste.png -->
<!-- CAPTURE: Psono — coffre et dossiers partagés | _assets/psono-coffre.png -->

Commandes : [[90-aide-memoire|aide-mémoire]].
