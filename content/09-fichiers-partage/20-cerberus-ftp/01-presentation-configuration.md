---
title: Présentation, configuration et sécurité
description: Cerberus FTP Server, serveur de transfert de fichiers commercial pour Windows — éditions et fonctions (FTP, FTPS, SFTP, HTTPS avec client web, partage de fichiers), installation, écoutes et certificats, authentification Active Directory/LDAP et utilisateurs natifs, répertoires virtuels et droits, règles d'événements et automatisation, protections (DDoS, verrouillage, liste d'adresses), haute disponibilité, journaux et bonnes pratiques de transfert de fichiers géré.
tags: [cerberus ftp, sftp, ftps, https, windows, active directory, transfert de fichiers]
icon: folder-lock
---

**Cerberus FTP Server** (Cerberus LLC, commercial) est un serveur de **transfert de fichiers géré** pour Windows : FTP, **FTPS**, **SFTP** et **HTTPS** (client web pour les utilisateurs sans logiciel), avec authentification Active Directory, règles d'automatisation et rapports. Il comble ce que [[19-filezilla-server/01-installation-configuration|FileZilla Server]] ne fait pas (SFTP, web, AD, automatisation) sans aller jusqu'aux grandes plateformes MFT.

| Édition (selon l'éditeur) | Fonctions principales |
| --- | --- |
| Standard | FTP/FTPS, utilisateurs natifs |
| Professional | + SFTP, HTTPS/client web, AD/LDAP |
| Enterprise | + règles d'événements avancées, partage de fichiers sécurisé, haute disponibilité, intégrations |

Vérifiez la grille actuelle de l'éditeur avant achat.

## Installation et écoutes

Installateur Windows (service `Cerberus FTP Server`), console d'administration locale et **interface web d'administration** (HTTPS, port configurable). Configuration :

| Écoute | Port courant | Recommandation |
| --- | --- | --- |
| FTP + TLS explicite | 21 | Exiger TLS (refuser le FTP en clair) |
| FTPS implicite | 990 | Clients anciens seulement |
| **SFTP** | 22 (ou autre si OpenSSH est présent) | Préférer SFTP pour les nouveaux partenaires |
| **HTTPS** (client web) | 443 | Certificat public, utilisateurs occasionnels |

Certificats : certificat d'entreprise ou public importé (PFX), clés d'hôte SSH (RSA 3072+/Ed25519) dont l'empreinte est communiquée aux partenaires. Plage de ports **passifs** déclarée et ouverte au pare-feu (comme pour tout FTPS).

## Utilisateurs et droits

| Source | Usage |
| --- | --- |
| Utilisateurs **natifs** Cerberus | Partenaires externes (comptes dédiés, mots de passe ou clés SSH) |
| **Active Directory / LDAP** | Employés : groupes AD associés à des modèles de droits |
| Clés publiques SSH | Authentification forte des partenaires automatisés (scripts) |
| MFA / authentification à deux facteurs | Pour le client web selon l'édition |

**Répertoires virtuels** : chaque utilisateur ou groupe voit une arborescence virtuelle reliée à des dossiers réels (lecture, écriture, suppression, création, renommage par répertoire). Isolation stricte : un partenaire ne voit que son dossier.

## Règles d'événements

Déclencheurs (fichier déposé, connexion, échec, horaire) → actions : **courriel** de notification, exécution d'un programme ou d'un script PowerShell, déplacement ou copie vers un partage interne, envoi vers un autre serveur. Exemple : un fichier déposé par le partenaire dans `/entrant` est analysé par l'antivirus, déplacé vers `\\srv-app-01\Imports`, puis l'équipe applicative est notifiée.

## Sécurité

- [ ] Serveur en **DMZ** ; fichiers transférés vers l'interne par une règle (flux sortant de la DMZ contrôlé) plutôt que d'exposer des partages internes
- [ ] FTP en clair désactivé ; TLS 1.2+ ; SFTP avec algorithmes modernes
- [ ] Protections intégrées : verrouillage après échecs, détection d'attaques par force brute/DDoS, listes d'adresses autorisées par utilisateur
- [ ] Comptes de partenaires avec date d'expiration, revue périodique
- [ ] Analyse antivirus des fichiers déposés ([[04-clamav/01-presentation-installation|ClamAV]] ou antivirus du serveur)
- [ ] Mises à jour du produit (les serveurs de transfert exposés sont des cibles privilégiées : en 2023, la faille de MOVEit Transfer a touché des centaines d'organisations)

## Exploitation

| Élément | Remarque |
| --- | --- |
| Journaux | Connexions, transferts, erreurs ; export syslog vers le SIEM |
| Rapports | Volumes par utilisateur, transferts échoués |
| Haute disponibilité | Configuration partagée entre deux serveurs derrière un répartiteur (édition Enterprise) |
| Sauvegarde | Fichiers de configuration (`%ProgramData%\Cerberus LLC\Cerberus FTP Server`), certificats, clés d'hôte |

## Dépannage

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Partenaire SFTP refusé | Algorithmes incompatibles, empreinte d'hôte changée | Liste d'algorithmes, communiquer l'empreinte |
| Liste de répertoire en échec (FTPS) | Ports passifs | Plage passive ouverte, adresse publique annoncée |
| Utilisateurs AD refusés | Compte de liaison LDAP, groupe non associé | Test LDAP dans la console, correspondance des groupes |
| Règle non déclenchée | Condition, droits du compte de service sur la destination | Journal des règles, compte du service |
