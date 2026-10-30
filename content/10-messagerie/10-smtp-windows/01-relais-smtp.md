---
title: Relais SMTP Windows (IIS 6)
description: Fonctionnalité Serveur SMTP de Windows Server — statut (déprécié, administration par la console IIS 6), cas d'usage (relais d'envoi pour applications, scanners et serveurs), installation, restrictions de relais et de connexion, hôte actif vers Microsoft 365 ou Postfix, TLS et authentification sortante, répertoire Pickup, journaux, supervision, alternatives modernes (Postfix, connecteurs Microsoft 365, services SMTP) et dépannage.
tags: [smtp, windows server, relais, iis 6, smart host, microsoft 365, messagerie]
icon: send
---

La fonctionnalité **Serveur SMTP** de Windows Server sert de **relais d'envoi** interne : des applications, copieurs, onduleurs, serveurs de supervision envoient leurs courriels au relais local, qui les transmet à la messagerie de l'entreprise (Microsoft 365, Exchange, Postfix). Elle ne fait **pas** de boîtes aux lettres.

> [!WARNING]
> Ce service est **déprécié** depuis Windows Server 2012 : il s'administre toujours avec l'ancienne console **IIS 6**, n'évolue plus et sa disponibilité dans les nouvelles versions de Windows Server n'est pas garantie. Pour un nouveau relais, préférez [[01-postfix/01-presentation|Postfix]] (relais Linux très robuste) ou les connecteurs de Microsoft 365. Cette page sert à exploiter et sécuriser l'existant, puis à le migrer.

## Installation

```powershell
Install-WindowsFeature SMTP-Server -IncludeManagementTools        # installe aussi la console IIS 6 (Web-Lgcy-Mgmt-Console)
Set-Service SMTPSVC -StartupType Automatic; Start-Service SMTPSVC
# Console : Gestionnaire des services Internet (IIS) 6.0 → [SMTP Virtual Server #1] → Propriétés
```

## Configuration du serveur virtuel SMTP

| Onglet | Réglage recommandé |
| --- | --- |
| Général | Adresse IP d'écoute précise ; journalisation activée (format W3C étendu) |
| **Accès → Connexion** | Seuls les ordinateurs listés (sous-réseaux des serveurs et copieurs autorisés) |
| **Accès → Relais** | *Seuls les ordinateurs de la liste ci-dessous* : les mêmes adresses ; **jamais** « tous sauf la liste » (relais ouvert) |
| Accès → Authentification | Anonyme pour les équipements internes listés ; ou authentification intégrée Windows pour les applications capables |
| Accès → Communication sécurisée | Certificat pour TLS entrant (facultatif en interne) |
| Messages | Taille maximale, nombre de destinataires, répertoire *Badmail* |
| **Remise → Avancé** | **Hôte actif** (*smart host*) : `relais.corp.exemple.fr` ou le point de terminaison Microsoft 365 ; nom de domaine complet du serveur |
| Remise → Sécurité sortante | **Chiffrement TLS** ; authentification de base vers l'hôte actif si exigée |

Vers **Microsoft 365**, la méthode recommandée est un **connecteur entrant** Exchange Online qui accepte le relais depuis l'**adresse IP publique** de l'entreprise (ou un certificat), avec l'hôte actif `<domaine>-<tld>.mail.protection.outlook.com` sur le port 25 et TLS — plutôt que l'authentification SMTP par compte (désactivée progressivement par Microsoft).

## Répertoire Pickup

Une application peut déposer un fichier `.eml` dans `C:\inetpub\mailroot\Pickup` : le service l'envoie immédiatement. Les messages en échec vont dans `Badmail`, la file d'attente est dans `Queue`.

```powershell
# Test d'envoi par le relais
Send-MailMessage -SmtpServer srv-relais-01 -From "supervision@corp.exemple.fr" -To "exploitation@corp.exemple.fr" -Subject "Test relais" -Body "Test"
# (cmdlet obsolète mais présente ; alternative : client SMTP du langage applicatif)
Get-ChildItem C:\inetpub\mailroot\Queue, C:\inetpub\mailroot\Badmail
```

## Journaux et supervision

- Journaux : `C:\Windows\System32\LogFiles\SmtpSvc1\` (connexions, commandes, codes de retour).
- Superviser : service `SMTPSVC` démarré, nombre de fichiers dans `Queue` et `Badmail`, test d'envoi périodique bout en bout (message reçu dans une boîte de contrôle).

## Sécurité

- [ ] Relais **restreint** aux adresses connues ; un relais ouvert est exploité en quelques heures par les spammeurs (et place l'adresse IP publique sur les listes noires)
- [ ] Port 25 du relais filtré : seuls les serveurs émetteurs y accèdent
- [ ] TLS vers l'hôte actif ; SPF/DKIM/DMARC du domaine émetteur cohérents avec le chemin d'envoi
- [ ] Adresses d'expédition contrôlées (pas d'usurpation d'adresses internes par n'importe quel émetteur)

## Migration

1. Inventorier les émetteurs (journaux SMTP : adresses IP sources, expéditeurs).
2. Monter le nouveau relais (Postfix avec `mynetworks` limité et relais vers l'hôte actif, voir [[01-postfix/01-presentation|Postfix]]).
3. Basculer l'**alias DNS** (`smtp-relais.corp.exemple.fr`) utilisé par les applications, puis vérifier qu'aucune source ne contacte plus l'ancien relais.

## Dépannage

| Symptôme | Cause | Solution |
| --- | --- | --- |
| `550 5.7.1 Unable to relay` | Émetteur absent de la liste de relais | Ajouter l'adresse de l'émetteur |
| Messages bloqués dans `Queue` | Hôte actif injoignable, TLS, authentification | Journaux, test `Test-NetConnection relais -Port 25`, paramètres de remise |
| Messages dans `Badmail` | Adresse invalide, message mal formé | Contenu du fichier `.BAD` |
| Courriels classés en indésirables chez les destinataires | SPF/DMARC non alignés | Envoyer via la messagerie de l'entreprise (hôte actif) plutôt que directement |
