---
title: Politiques d'autorisation TACACS+
description: Concevoir les droits d'administration avec TACACS+ — matrice des rôles (lecture, technicien, NOC, administrateur, audit, automatisation), niveaux de privilège ou listes de commandes, commandes dangereuses à interdire, restrictions par type d'équipement et par origine, comptes de service, secours local et procédure « bris de glace ».
tags: [tacacs+, autorisation, rôles, privilèges, commandes, rbac, bonnes pratiques]
icon: list-checks
---

TACACS+ permet de décider **commande par commande**. Encore faut-il définir une politique claire, que l'équipe comprend et que le serveur applique de façon identique sur tous les équipements.

## Matrice des rôles

| Rôle | Droits | Implémentation typique |
| --- | --- | --- |
| **Lecture** (support, astreinte niveau 1) | `show`, `ping`, `traceroute` ; aucune modification | `priv-lvl=1` + liste de commandes autorisées |
| **Technicien** | Lecture + actions sur les ports d'accès : `shutdown`/`no shutdown`, VLAN d'accès, description | `priv-lvl=15` + liste blanche de commandes de configuration d'interface |
| **NOC** | Tout sauf les actions destructrices ou de sécurité | `priv-lvl=15` + liste noire (reload, effacement, AAA, crypto) |
| **Administrateur** | Tout | `priv-lvl=15`, toutes commandes autorisées (mais journalisées) |
| **Audit** | Lecture de la configuration complète, y compris `show running-config` | `priv-lvl=15` + seulement `show` |
| **Automatisation** (Ansible, Oxidized, NetBox) | Selon l'outil : sauvegarde = lecture seule, déploiement = configuration | Compte de service dédié, limité aux adresses des serveurs d'automatisation |

> [!TIP]
> Créez les rôles comme **groupes AD** (`tacacs-lecture`, `tacacs-noc`, `tacacs-admins`…) : l'arrivée ou le départ d'un administrateur se gère dans l'annuaire, sans toucher au serveur TACACS+.

## Niveau de privilège ou liste de commandes ?

| Approche | Avantages | Inconvénients |
| --- | --- | --- |
| **Niveau de privilège seul** (`priv-lvl`) | Simple, fonctionne même si le serveur tombe en cours de session | Grossier : 0, 1 ou 15 en pratique ; niveaux intermédiaires à configurer sur chaque équipement |
| **Autorisation par commande** | Précis, centralisé, chaque refus est journalisé | Une requête par commande (charge, latence) ; dépend de la disponibilité du serveur |
| **Mixte** (recommandé) | Niveau 15 pour les rôles de confiance, listes de commandes pour les rôles limités | Deux mécanismes à comprendre |

## Commandes à protéger

Commandes à **interdire** aux rôles limités (et à surveiller pour les administrateurs) :

| Catégorie | Exemples (IOS / IOS XE) |
| --- | --- |
| Redémarrage | `reload`, `reload in`, `reload at` |
| Effacement | `write erase`, `erase startup-config`, `erase nvram:`, `delete`, `format` |
| Sécurité de l'accès | `aaa …`, `no aaa …`, `tacacs server …`, `username …`, `enable secret`, `line vty …` |
| Cryptographie | `crypto key zeroize`, `crypto pki …` |
| Gestion | `no ip ssh`, `no snmp-server`, `no logging` |
| Images et démarrage | `boot system`, `install …`, `upgrade` |
| Débogage lourd | `debug all`, `debug ip packet` sans ACL |

Équivalents Junos : `request system reboot`, `request system zeroize`, `request system software add`, modifications sous `system login` et `system authentication-order`.

## Exemple : rôle technicien sur tac_plus-ng

```tacplus
profile technicien {
    script {
        if (service == shell) {
            if (cmd == "") { set priv-lvl = 15 permit }

            # Lecture
            if (cmd =~ /^show /) {
                if (cmd =~ /^show running-config/) deny     # la configuration complète reste réservée
                permit
            }
            if (cmd =~ /^(ping|traceroute|terminal length|exit|end) /) permit

            # Configuration limitée aux interfaces d'accès
            if (cmd =~ /^configure terminal/) permit
            if (cmd =~ /^interface (GigabitEthernet|TenGigabitEthernet)[0-9\/]+ /) permit
            if (cmd =~ /^(no )?shutdown /) permit
            if (cmd =~ /^description /) permit
            if (cmd =~ /^switchport access vlan [0-9]+ /) permit

            deny
        }
    }
}
```

Testez chaque règle avec un compte de test et vérifiez le journal d'autorisation : la commande exacte transmise par l'équipement (abréviations développées, `<cr>` final) conditionne l'expression régulière.

> [!NOTE]
> Les équipements Cisco transmettent la commande **développée** (`show running-config`) même si l'administrateur tape `sh run`. Écrivez les règles sur la forme complète.

## Restrictions par équipement et par origine

- **Par type d'équipement** : déclarez des groupes `device` (cœur, accès, pare-feu, datacenter) et conditionnez les règles. Un technicien peut agir sur les commutateurs d'accès mais seulement lire le cœur.
- **Par adresse de l'administrateur** : n'accepter les rôles élevés que depuis le bastion ou le réseau d'administration (`acl` dans tac_plus, condition sur l'adresse cliente dans tac_plus-ng).
- **Par horaire** : certains serveurs (ISE, ClearPass, tac_plus-ng) permettent de limiter un rôle aux heures ouvrées, par exemple pour un prestataire.

## Comptes de service

Les outils d'automatisation ont besoin d'un compte TACACS+ :

| Outil | Droits nécessaires |
| --- | --- |
| Sauvegarde de configuration (Oxidized, RANCID) | `show running-config`, `show version`, `terminal length 0` |
| Supervision par CLI | Commandes `show` ciblées |
| Déploiement (Ansible, Nornir, NetBox) | Configuration complète, éventuellement `write memory` |

- Un compte **par outil**, jamais un compte personnel.
- Restreint aux **adresses des serveurs** d'automatisation.
- Mot de passe long, stocké dans un coffre (Vault, gestionnaire de secrets), renouvelé.

## Secours local et « bris de glace »

TACACS+ devient un point critique : si les serveurs sont injoignables, plus personne ne peut administrer le réseau. Prévoyez :

1. **Méthode de secours `local`** derrière TACACS+ dans chaque liste (authentification, exec, commandes), active seulement si aucun serveur ne répond.
2. **Un seul compte local** par équipement, au mot de passe unique et long, stocké dans un coffre avec procédure d'ouverture tracée (« bris de glace »).
3. **Console** : accès local garanti (méthode `local` propre à la console), éventuellement via un serveur de console hors bande.
4. **Rotation** du mot de passe de secours après chaque utilisation.
5. **Alerte** à chaque connexion avec le compte de secours (journal syslog de l'équipement).
