---
title: Evolution, KMail et Claws Mail
description: Trois clients de messagerie pour Linux — Evolution (GNOME : courrier, agenda, contacts, tâches ; Exchange via EWS et Microsoft 365, comptes en ligne GNOME, CalDAV/CardDAV, sauvegarde), KMail et Kontact (KDE : Akonadi, filtres puissants, chiffrement, akonadictl) et Claws Mail (léger et rapide, greffons, profils multiples) ; comparaison avec Thunderbird.
tags: [evolution, kmail, kontact, akonadi, claws mail, client mail, linux, exchange, ews]
icon: mail
---

| | Evolution | KMail (Kontact) | Claws Mail |
| --- | --- | --- | --- |
| Bureau | GNOME (GTK) | KDE (Qt) | Indépendant (GTK) |
| Fonctions | Courrier, agenda, contacts, tâches, notes | Suite Kontact : courrier, agenda, contacts, notes, flux | Courrier (agenda et flux par greffons) |
| Exchange | **EWS** (Exchange sur site), **Microsoft 365** | EWS (ressource Akonadi) | Non |
| Points forts | Groupware le plus complet sous Linux | Filtres et chiffrement très poussés | Très léger, rapide sur de grosses boîtes |
| Plates-formes | Linux | Linux (Windows en développement) | Linux, Windows, macOS |

## Evolution

```bash
sudo apt install evolution evolution-ews     # evolution-ews : Exchange Web Services et Microsoft 365
sudo dnf install evolution evolution-ews
flatpak install flathub org.gnome.Evolution
```

- **Comptes en ligne GNOME** (*Paramètres → Comptes en ligne*) : Google, Microsoft 365, Nextcloud ; Evolution les reprend automatiquement.
- **Exchange** : *Nouveau compte → Type de serveur Exchange Web Services*, adresse `https://mail.exemple.fr/EWS/Exchange.asmx` (découverte automatique possible) ; *Microsoft 365* pour Exchange Online (OAuth2).
- **CalDAV / CardDAV** : *Nouveau → Agenda / Carnet d'adresses → CalDAV / CardDAV* (Nextcloud, SOGo, Radicale).
- **Sauvegarde** : *Fichier → Sauvegarder les données d'Evolution* (archive de tous les comptes, réglages et données locales), restauration dans le même menu.

```bash
evolution --force-shutdown          # arrêter tous les processus d'arrière-plan (evolution-data-server)
```

## KMail et Kontact

```bash
sudo apt install kontact kmail ; sudo dnf install kontact kmail
```

KMail s'appuie sur **Akonadi**, un service qui stocke et indexe courrier, agendas et contacts pour toutes les applications KDE.

- **Filtres** très complets (en-têtes, corps, scripts externes, filtres Sieve gérés sur le serveur via KSieve).
- **Chiffrement** OpenPGP et S/MIME intégrés (via Kleopatra).
- Ressources : IMAP, POP, maildir local, EWS, Google, CalDAV/CardDAV, DAV groupware.

```bash
akonadictl status          # état des agents et de la base
akonadictl restart
akonadictl fsck            # vérifier et réparer la base
akonadiconsole             # console de diagnostic (paquet akonadiconsole)
```

## Claws Mail

```bash
sudo apt install claws-mail claws-mail-plugins ; winget install ClawsMail.ClawsMail
```

- Interface classique, très rapide même avec des centaines de milliers de messages.
- Comptes multiples avec profils, modèles, filtres et dossiers de recherche.
- **Greffons** : PGP/MIME, S/MIME, anti-spam (Bogofilter, SpamAssassin), agenda vCalendar, RSS, aperçu HTML (Fancy).
- Bon choix pour un poste ancien ou un serveur de bureau à distance.

## Quel client choisir ?

| Situation | Choix |
| --- | --- |
| Poste multiplateforme, entreprise | [[01-thunderbird\|Thunderbird]] (stratégies, autoconfig) |
| GNOME avec Exchange sur site | Evolution + EWS |
| KDE, filtres et chiffrement poussés | KMail |
| Machine modeste, simplicité | Claws Mail |
| Terminal, serveur SSH | Voir les clients en terminal du wiki (Mutt, NeoMutt, aerc) |

Voir aussi : [[03-davx5-sogo-connector|DAVx5 et SOGo Connector]]. Commandes : [[90-aide-memoire|aide-mémoire]].
