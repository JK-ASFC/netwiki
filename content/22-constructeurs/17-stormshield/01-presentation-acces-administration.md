---
title: Présentation, accès et administration
description: Pare-feu Stormshield Network Security (SNS, ex-NETASQ, gamme SN et EVA virtuels, version 4.x) — interface d'administration web (premier accès, assistants, menus), accès à la CLI (console, SSH, protocole NSRPC, scripts locaux et distants), commandes d'administration de la note technique CLI (aide, accès en écriture, licence, sauvegarde et restauration de la configuration, mise à jour du micrologiciel, SSH, accès à l'interface web), comptes administrateurs et droits, SMC.
tags: [stormshield, sns, netasq, cli, nsrpc, interface web, sauvegarde, smc]
icon: info
---

**Stormshield** (groupe Airbus) conçoit les pare-feu **SNS** (*Stormshield Network Security*), solution française qualifiée par l'ANSSI et très présente dans les administrations, collectivités, hôpitaux et industries. Gamme matérielle **SN** (SN160 à SN6100), industrielle **SNi**, et virtuelle **EVA** (VMware, Hyper-V, KVM, clouds).

Deux moyens d'administration partagent la même configuration :

| Moyen | Usage |
| --- | --- |
| **Interface web d'administration** | Usage quotidien : assistants, filtrage, NAT, VPN, supervision |
| **CLI** (commandes *serverd* / NSRPC) | Scripts, automatisation, déploiement en masse, opérations impossibles ou fastidieuses en graphique |
| **SMC** (*Stormshield Management Center*) | Gestion centralisée d'un parc de pare-feu |

## Interface web

- Premier accès : `https://10.0.0.254/admin` depuis le port *in* (adresse par défaut), compte `admin` (mot de passe défini à l'initialisation).
- Menus principaux : **Tableau de bord**, **Configuration** (Système, Réseau, Objets, Utilisateurs, Politique de sécurité, Protection applicative, VPN, Notifications), **Monitoring** (journaux, supervision, connexions, utilisateurs, VPN), **Audit**.
- Assistants : configuration réseau initiale, VPN IPsec, VPN SSL, authentification.

## Accès à la CLI

La CLI SNS est un jeu de **commandes propriétaires** (commandes *serverd*), transportées par le protocole sécurisé **NSRPC** (*NETASQ Secure Remote Procedure Call*). On y accède :

| Méthode | Remarque |
| --- | --- |
| Localement sur le pare-feu | Console ou SSH, commande `nsrpc` (ex. `nsrpc -c "CONFIG OBJECT LIST" admin@localhost`) |
| **Interface web** | *Configuration → Système → Console CLI* (selon la version) |
| À distance | Exécutables dédiés **nsrpc** pour Windows et Linux |
| Scripts | Fichier texte de commandes exécuté localement ou à distance (SMC peut aussi exécuter des scripts CLI sur un parc) |

Chaque section se termine par une commande **`ACTIVATE`** qui applique les changements (ex. `CONFIG OBJECT ACTIVATE`, `CONFIG FILTER ACTIVATE`).

## Commandes d'administration

| Besoin | Commande |
| --- | --- |
| Aide sur une commande | `<COMMANDE> HELP` (ex. `CONFIG OBJECT HOST HELP`) |
| Obtenir l'accès en écriture (un seul administrateur en écriture à la fois) | `MODIFY ON FORCE` |
| Revenir à la configuration usine | `SYSTEM DEFAULTCONFIG` (ne réinitialise pas le mot de passe `admin`) |
| Importer une licence | Console : `SYSTEM LICENCE UPLOAD < fichier.licence` ; script : `SYSTEM LICENCE UPLOAD $FROM_DATA_FILE("fichier.licence")` |

### Sauvegarde et restauration de la configuration

```sns
CONFIG BACKUP list=all password=MotDePasseSauvegarde > sauvegarde-sns.na
CONFIG RESTORE list=all password=MotDePasseSauvegarde < sauvegarde-sns.na
```

En script, les redirections deviennent `$SAVE_TO_DATA_FILE("sauvegarde-sns.na")` et `$FROM_DATA_FILE("sauvegarde-sns.na")`. Le fichier `.na` protégé par mot de passe se restaure aussi par l'interface web (*Configuration → Système → Maintenance → Sauvegarder / Restaurer*). Les sauvegardes automatiques vers le **cloud Stormshield** ou un serveur sont configurables.

### Mise à jour du micrologiciel

```sns
SYSTEM UPDATE UPLOAD < fwupd-4.x.y-SNS-amd64-M.maj
SYSTEM UPDATE ACTIVATE
```

Interface web : *Configuration → Système → Maintenance → Mise à jour du système*. Le pare-feu dispose d'une **partition de secours** (*backup*) : la mise à jour peut d'abord sauvegarder la partition active. Respecter les chemins de mise à jour indiqués dans les notes de version et suivre les avis de sécurité Stormshield.

### Accès SSH et accès à l'interface web

```sns
CONFIG CONSOLE SSH state=1 userpass=1 port=ssh
CONFIG CONSOLE ACTIVATE
```

```sns
CONFIG CONSOLE SSH state=0
CONFIG CONSOLE ACTIVATE
```

Autoriser une adresse (objet machine, réseau, plage ou `any`) à joindre l'interface d'administration :

```sns
CONFIG WEBADMIN ACCESS ADD RESEAU_ADMIN
CONFIG WEBADMIN ACTIVATE
```

Par défaut, l'administration n'est permise que depuis les réseaux internes protégés ; restreignez-la au **réseau d'administration**, jamais à `any` depuis Internet.

## Administrateurs

*Configuration → Système → Administrateurs* : comptes nominatifs (base LDAP interne ou annuaire AD), **droits** par domaine (lecture, filtrage, VPN, journaux…), double authentification (TOTP intégré dans les versions récentes ou RADIUS), droits sur les **données personnelles** dans les journaux (accès restreint aux identités, conformité RGPD — fonction spécifique de SNS).

## SMC

**SMC** (*Stormshield Management Center*, machine virtuelle) gère un parc : configurations partagées (objets, règles de filtrage/NAT globales et par pare-feu), **topologies VPN** (étoile, maillage) générées automatiquement, déploiement, exécution de **scripts CLI** avec variables par pare-feu, sauvegardes et supervision des connexions. Les pare-feu gérés se connectent à SMC (agent de connexion).

Suite : [[02-objets-reseau-filtrage-nat|objets, réseau, filtrage et NAT en CLI et en graphique]].
