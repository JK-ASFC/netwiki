---
title: DAVx5 et SOGo Connector
description: Synchroniser agendas et contacts CalDAV/CardDAV sur les postes et téléphones — DAVx5 (Android, GPL : comptes, découverte automatique, synchronisation dans les applications natives, tâches avec jtx Board ou Tasks.org, WebDAV, déploiement géré par MDM) et SOGo Connector (module Thunderbird pour SOGo, intégration automatique des comptes) ; adresses des serveurs courants (Nextcloud, SOGo, Radicale, Baïkal), iOS et macOS natifs.
tags: [davx5, sogo connector, caldav, carddav, android, thunderbird, sogo, nextcloud, mdm]
icon: mail
---

**CalDAV** (agendas, tâches) et **CardDAV** (contacts) sont les protocoles ouverts pour synchroniser ces données avec un serveur (Nextcloud, SOGo, Radicale, Baïkal…). iOS, macOS et Thunderbird les gèrent nativement ; **Android** a besoin de **DAVx5**.

## DAVx5 (Android)

**DAVx5** (licence GPL) ajoute des comptes CalDAV/CardDAV à Android : agendas et contacts apparaissent dans les **applications natives** (Agenda, Contacts) et dans toute application qui les utilise.

- Installation : **F-Droid** (gratuit) ou Google Play (payant, finance le projet).
- *Ajouter un compte → Connexion avec une URL et un nom d'utilisateur* : saisir l'adresse du serveur ; DAVx5 découvre les agendas et carnets d'adresses (`/.well-known/caldav`, `/.well-known/carddav`).
- Choisir les agendas et carnets à synchroniser, l'intervalle et le type de réseau (Wi-Fi seulement…).
- **Tâches** : avec **jtx Board** ou **Tasks.org** installés, les listes de tâches CalDAV (VTODO) sont synchronisées.
- **WebDAV** : monter un dossier distant dans le gestionnaire de fichiers d'Android.

| Serveur | Adresse à saisir |
| --- | --- |
| Nextcloud | `https://cloud.exemple.fr/remote.php/dav` |
| SOGo | `https://mail.exemple.fr/SOGo/dav` |
| Radicale | `https://dav.exemple.fr/` |
| Baïkal | `https://dav.exemple.fr/dav.php` |

### Déploiement en entreprise

**Managed DAVx5** (version pour les organisations) se configure par **MDM** (Android Enterprise, configuration gérée) : adresse du serveur, nom d'utilisateur repris de l'identité de l'appareil, options verrouillées. L'utilisateur n'a plus qu'à saisir son mot de passe.

Dépannage : *Paramètres → Déboguer → Afficher les infos de débogage* (journal détaillé à transmettre au support) ; vérifier que l'économiseur de batterie n'empêche pas la synchronisation en arrière-plan.

## SOGo Connector (Thunderbird)

**SOGo Connector** (et **SOGo Integrator**) sont des modules complémentaires de Thunderbird fournis par l'éditeur de SOGo (voir la page SOGo du wiki) :

| Module | Rôle |
| --- | --- |
| SOGo Connector | Carnets d'adresses CardDAV avec listes de distribution, synchronisation des contacts et agendas avec SOGo |
| SOGo Integrator | Version « intégrée » : crée automatiquement comptes, agendas et carnets de l'utilisateur, déploie des réglages et des modules depuis le serveur |

Ils sont publiés pour des versions précises de Thunderbird : vérifier la compatibilité avant chaque mise à jour majeure du client. Depuis que Thunderbird gère nativement CalDAV et CardDAV, ces modules ne sont utiles que pour leurs fonctions propres à SOGo (listes de distribution, configuration centralisée).

## iOS et macOS

Pas d'application à installer : *Réglages → Agenda / Contacts → Comptes → Ajouter un compte → Autre → Compte CalDAV / CardDAV*. En entreprise, un **profil de configuration** (MDM) crée les comptes automatiquement.

Voir aussi : [[01-thunderbird|Thunderbird]] et les pages Radicale, SOGo et Nextcloud du wiki. Commandes : [[90-aide-memoire|aide-mémoire]].
