---
title: TACACS+ sur les équipements Cisco
description: Configurer TACACS+ sur Cisco IOS / IOS XE (serveurs nommés, groupe, VRF de gestion, authentification, enable, autorisation exec et commandes, comptabilité, console, secours local), NX-OS (rôles shell:roles), IOS XR (task groups) et ASA, avec les commandes de vérification et de test.
tags: [tacacs+, cisco, ios, ios xe, nx-os, ios xr, asa, aaa, configuration]
icon: router
---

Ces configurations supposent deux serveurs TACACS+ (`10.0.1.10` et `10.0.2.10`) joignables depuis le réseau de gestion. Le profil renvoyé par le serveur est décrit dans [[04-tacacs/06-tac-plus-ng|tac_plus-ng]] ou [[04-tacacs/07-tac-plus-shrubbery|tac_plus]].

> [!WARNING]
> **Gardez une session ouverte** pendant toute la mise en place, et testez la connexion depuis une seconde session avant de fermer la première. Une erreur dans l'autorisation des commandes peut vous empêcher de corriger la configuration. Conservez un **compte local de secours** et l'accès console.

## Cisco IOS et IOS XE

### Serveurs et groupe

```cisco
aaa new-model
!
tacacs server TACACS-1
 address ipv4 10.0.1.10
 key 0 Cle-Campus-Longue-Et-Aleatoire-42
 timeout 5
 single-connection
tacacs server TACACS-2
 address ipv4 10.0.2.10
 key 0 Cle-Campus-Longue-Et-Aleatoire-42
 timeout 5
 single-connection
!
aaa group server tacacs+ TACACS
 server name TACACS-1
 server name TACACS-2
 ip vrf forwarding Mgmt-vrf                 ! si la gestion est dans une VRF
 ip tacacs source-interface GigabitEthernet0/0
!
! Compte local de secours (utilisé seulement si aucun serveur ne répond)
username secours privilege 15 algorithm-type scrypt secret Mot-De-Passe-De-Secours-Long
enable algorithm-type scrypt secret Enable-De-Secours-Long
```

| Option | Rôle |
| --- | --- |
| `single-connection` | Une seule connexion TCP pour toutes les sessions : indispensable quand chaque commande est autorisée |
| `timeout 5` | Délai avant de passer au serveur suivant |
| `ip tacacs source-interface` | Adresse source des requêtes : doit correspondre à l'adresse déclarée sur le serveur |
| `key 0 …` | Clé en clair à la saisie ; avec `service password-encryption`, elle s'affiche ensuite en type 7, ou en type 6 avec `password encryption aes` |

Sur les anciennes versions d'IOS, la syntaxe est `tacacs-server host 10.0.1.10 key …` puis `server 10.0.1.10` dans le groupe.

### Authentification

```cisco
aaa authentication login default group TACACS local
aaa authentication login CONSOLE local            ! optionnel : console toujours locale
aaa authentication enable default group TACACS enable
!
line con 0
 login authentication CONSOLE
line vty 0 15
 login authentication default
 transport input ssh
```

`group TACACS local` : le compte local n'est essayé que si **aucun serveur ne répond**. Un refus du serveur (mauvais mot de passe) ne bascule pas sur le compte local.

### Autorisation

```cisco
! Ouverture du shell : le serveur renvoie priv-lvl
aaa authorization exec default group TACACS local if-authenticated
!
! Chaque commande des niveaux 1 et 15 est soumise au serveur
aaa authorization commands 1 default group TACACS local if-authenticated
aaa authorization commands 15 default group TACACS local if-authenticated
!
! Soumettre aussi les commandes du mode configuration
aaa authorization config-commands
!
! Appliquer l'autorisation sur la console (désactivée par défaut)
aaa authorization console
```

| Méthode | Comportement |
| --- | --- |
| `group TACACS` | Le serveur décide |
| `local` | Si aucun serveur ne répond, les droits du compte local s'appliquent |
| `if-authenticated` | Si aucun serveur ne répond, tout utilisateur déjà authentifié est autorisé (à réserver au dernier recours) |
| `none` | Tout est autorisé sans vérification (à éviter) |

> [!TIP]
> `aaa authorization console` impose TACACS+ aussi sur la console. Ne l'ajoutez qu'après avoir validé la configuration sur les lignes vty, et gardez une méthode de secours `local` sur la console.

### Comptabilité

```cisco
aaa accounting exec default start-stop group TACACS          ! ouverture / fermeture de session
aaa accounting commands 1 default start-stop group TACACS    ! commandes de niveau 1
aaa accounting commands 15 default start-stop group TACACS   ! commandes de niveau 15
aaa accounting connection default start-stop group TACACS    ! connexions sortantes (ssh, telnet depuis l'équipement)
aaa accounting system default start-stop group TACACS        ! redémarrages
aaa accounting update newinfo
```

### Niveaux de privilège personnalisés

Pour un rôle intermédiaire sans autoriser chaque commande sur le serveur, on peut déplacer des commandes vers un niveau donné et faire renvoyer ce niveau par TACACS+ :

```cisco
privilege exec level 7 show running-config
privilege exec level 7 clear counters
privilege configure level 7 interface
privilege interface level 7 shutdown
privilege interface level 7 description
```

Le serveur renvoie alors `priv-lvl=7` aux techniciens. L'autorisation commande par commande sur le serveur reste plus souple et mieux journalisée (voir [[04-tacacs/10-politiques-autorisation|Politiques d'autorisation]]).

### Vérifier

```cisco
show tacacs                         ! état et statistiques par serveur
show aaa servers                    ! état (UP/DEAD), requêtes, temps de réponse
show aaa method-lists all
show privilege                      ! niveau de la session courante
test aaa group TACACS alice MotDePasse new-code
debug tacacs
debug aaa authentication
debug aaa authorization
debug aaa accounting
```

## Cisco NX-OS

```nxos
feature tacacs+
!
tacacs-server host 10.0.1.10 key 0 Cle-Datacenter-Differente-Et-Longue-77
tacacs-server host 10.0.2.10 key 0 Cle-Datacenter-Differente-Et-Longue-77
tacacs-server timeout 5
!
aaa group server tacacs+ TACACS
  server 10.0.1.10
  server 10.0.2.10
  deadtime 10
  use-vrf management
  source-interface mgmt0
!
aaa authentication login default group TACACS
aaa authentication login console local
aaa authentication login error-enable
aaa authorization commands default group TACACS local
aaa authorization config-commands default group TACACS local
aaa accounting default group TACACS
```

- Le rôle est renvoyé par l'attribut **`shell:roles`** : `shell:roles="network-admin"`, `shell:roles="network-operator"`, ou plusieurs rôles séparés par des espaces. Rendez-le facultatif si le même profil sert des équipements IOS.
- Sans `local` dans la méthode, un serveur injoignable bloque toute connexion : NX-OS bascule sur le local seulement si tous les serveurs sont injoignables, et seulement si `local` est indiqué.
- `aaa authentication login error-enable` affiche le motif d'échec à l'écran, utile pendant la mise en place.

```nxos
show tacacs-server
show tacacs-server groups
show aaa authentication
show aaa authorization
show user-account
test aaa group TACACS alice MotDePasse
```

## Cisco IOS XR

```text
tacacs source-interface MgmtEth0/RP0/CPU0/0 vrf MGMT
tacacs-server host 10.0.1.10 port 49
 key 7 <cle-chiffree>
 single-connection
tacacs-server host 10.0.2.10 port 49
 key 7 <cle-chiffree>
 single-connection
!
aaa group server tacacs+ TACACS
 vrf MGMT
 server 10.0.1.10
 server 10.0.2.10
!
aaa authentication login default group TACACS local
aaa authorization exec default group TACACS local
aaa authorization commands default group TACACS none
aaa accounting exec default start-stop group TACACS
aaa accounting commands default start-stop group TACACS
!
line default
 login authentication default
 authorization exec default
 authorization commands default
 accounting exec default
 accounting commands default
```

IOS XR ne connaît pas les niveaux de privilège : les droits viennent des **task groups** et **user groups**. Le serveur renvoie l'attribut `task`, par exemple `task="#root-system"` (groupe d'utilisateurs prédéfini, préfixé par `#`) ou `task="rwx:bgp,r:interface,#operator"`.

```text
show tacacs
show aaa usergroup
show user tasks
```

## Cisco ASA

```text
aaa-server TACACS protocol tacacs+
aaa-server TACACS (management) host 10.0.1.10
 key Cle-Pare-Feu-Longue-Et-Aleatoire
aaa-server TACACS (management) host 10.0.2.10
 key Cle-Pare-Feu-Longue-Et-Aleatoire
!
aaa authentication ssh console TACACS LOCAL
aaa authentication enable console TACACS LOCAL
aaa authentication http console TACACS LOCAL      ! ASDM
aaa authentication serial console LOCAL
aaa authorization command TACACS LOCAL
aaa authorization exec authentication-server
aaa accounting command TACACS
aaa accounting ssh console TACACS
aaa accounting enable console TACACS
```

```text
test aaa-server authentication TACACS host 10.0.1.10 username alice password MotDePasse
show aaa-server TACACS
```

> [!NOTE]
> `aaa authorization command` sur ASA exige que le serveur autorise aussi les commandes passées par ASDM : prévoyez-les dans le profil, sinon ASDM devient inutilisable.

## Cisco ISE comme serveur

Avec ISE (licence *Device Administration*), la même logique se configure dans l'interface :

| Notion générique | Dans ISE |
| --- | --- |
| Équipements et clé | *Network Devices* (onglet TACACS+ Authentication Settings) |
| Profil (priv-lvl, rôles) | *TACACS Profiles* (Shell Profile) |
| Liste de commandes | *TACACS Command Sets* |
| Règles | *Device Admin Policy Sets* (authentification puis autorisation selon les groupes AD et le type d'équipement) |
| Journaux | *Operations → TACACS → Live Logs* |
