---
title: TACACS+ sur les autres constructeurs et Linux
description: Configurer TACACS+ sur Juniper Junos (comptes modèles, local-user-name, allow/deny-commands), Arista EOS, Aruba AOS-CX et AOS-S, HPE Comware (HWTACACS), Huawei VRP, Fortinet FortiGate, Palo Alto PAN-OS, F5, SONiC et Cumulus, et sur les serveurs Linux avec pam_tacplus et libnss_tacplus.
tags: [tacacs+, juniper, arista, aruba, hpe, comware, hwtacacs, huawei, fortinet, palo alto, linux, pam]
icon: network
---

Les exemples utilisent deux serveurs (`10.0.1.10`, `10.0.2.10`) et un réseau de gestion. Gardez toujours une session ouverte et un compte local de secours pendant la mise en place (voir [[04-tacacs/08-equipements-cisco|Équipements Cisco]] pour la logique générale).

## Juniper Junos

```junos
set system tacplus-server 10.0.1.10 secret "Cle-Longue-Et-Aleatoire" source-address 10.0.0.11 single-connection timeout 5
set system tacplus-server 10.0.2.10 secret "Cle-Longue-Et-Aleatoire" source-address 10.0.0.11 single-connection timeout 5
set system authentication-order [ tacplus password ]

# Comptes modèles : TACACS+ indique lequel utiliser via local-user-name
set system login user remote class read-only            # modèle par défaut
set system login user super class super-user
set system login user operateur class operator

# Journaliser connexions, changements et commandes
set system accounting events [ login change-log interactive-commands ]
set system accounting destination tacplus
```

- Junos ne crée pas les utilisateurs à la volée : il associe l'utilisateur TACACS+ à un **compte modèle local** (sans mot de passe). Le serveur renvoie `local-user-name=super` dans le service **`junos-exec`** ; sans cet attribut, le modèle `remote` s'applique.
- Le serveur peut affiner les droits avec `allow-commands`, `deny-commands`, `allow-configuration` et `deny-configuration` (expressions régulières).
- Avec `authentication-order [ tacplus password ]`, le mot de passe local est essayé **aussi après un refus** du serveur, pas seulement s'il est injoignable : limitez les comptes locaux à un seul compte de secours au mot de passe fort.

```junos
show configuration system tacplus-server
show system users                       # utilisateur TACACS+ et compte modèle associé
show log messages | match -i tacplus
```

Profil côté tac_plus-ng :

```tacplus
if (service == junos-exec) {
    set local-user-name = operateur
    set deny-commands = "^(request system (reboot|halt|power-off)|clear)"
    permit
}
```

## Arista EOS

```text
ip tacacs vrf MGMT source-interface Management1
tacacs-server host 10.0.1.10 vrf MGMT key 0 Cle-Longue-Et-Aleatoire
tacacs-server host 10.0.2.10 vrf MGMT key 0 Cle-Longue-Et-Aleatoire
!
aaa group server tacacs+ TACACS
   server 10.0.1.10 vrf MGMT
   server 10.0.2.10 vrf MGMT
!
aaa authentication login default group TACACS local
aaa authentication enable default group TACACS local
aaa authorization exec default group TACACS local
aaa authorization commands all default group TACACS local
aaa accounting exec default start-stop group TACACS
aaa accounting commands all default start-stop group TACACS
!
username secours privilege 15 role network-admin secret sha512 <hachage>
```

```text
show tacacs
show aaa sessions
show aaa counters
```

EOS accepte `priv-lvl` ; un rôle EOS peut aussi être attribué selon le niveau (`aaa authorization` et `role`). Voir aussi la page [[25-arista/01-eos-cloudvision|Arista EOS]].

## Aruba AOS-CX

```text
tacacs-server host 10.0.1.10 key plaintext Cle-Longue-Et-Aleatoire vrf mgmt
tacacs-server host 10.0.2.10 key plaintext Cle-Longue-Et-Aleatoire vrf mgmt
aaa group server tacacs TACACS
    server 10.0.1.10 vrf mgmt
    server 10.0.2.10 vrf mgmt
aaa authentication login default group TACACS local
aaa authorization commands default group TACACS none
aaa accounting all default start-stop group TACACS
```

Le niveau `priv-lvl=15` donne le rôle `administrators`, `priv-lvl=1` le rôle `operators`. `show tacacs-server detail` et `show aaa authentication` vérifient l'état.

## HPE / Aruba AOS-S (ProCurve)

```text
tacacs-server host 10.0.1.10 key Cle-Longue-Et-Aleatoire
tacacs-server host 10.0.2.10 key Cle-Longue-Et-Aleatoire
aaa authentication ssh login tacacs local
aaa authentication ssh enable tacacs local
aaa authentication console login local
aaa authorization commands tacacs
aaa accounting commands stop-only tacacs
aaa accounting exec start-stop tacacs
```

## HPE Comware (HWTACACS)

Comware appelle le protocole **HWTACACS** : c'est TACACS+ compatible, avec la même trame et le même port.

```text
hwtacacs scheme TACACS
 primary authentication 10.0.1.10
 secondary authentication 10.0.2.10
 primary authorization 10.0.1.10
 secondary authorization 10.0.2.10
 primary accounting 10.0.1.10
 secondary accounting 10.0.2.10
 key authentication simple Cle-Longue-Et-Aleatoire
 key authorization simple Cle-Longue-Et-Aleatoire
 key accounting simple Cle-Longue-Et-Aleatoire
 user-name-format without-domain
 nas-ip 10.0.0.21
#
domain system
 authentication login hwtacacs-scheme TACACS local
 authorization login hwtacacs-scheme TACACS local
 accounting login hwtacacs-scheme TACACS local
 authorization command hwtacacs-scheme TACACS local
 accounting command hwtacacs-scheme TACACS
#
line vty 0 63
 authentication-mode scheme
 command authorization
 command accounting
```

`user-name-format without-domain` retire le suffixe `@system` du nom envoyé. Le rôle vient du niveau renvoyé (`priv-lvl=15` donne `level-15`) ou d'un attribut de rôle selon la version. Vérification : `display hwtacacs scheme TACACS`, `display domain`. Voir aussi [[06-hpe-comware/01-cli-comware|HPE Comware]].

## Huawei VRP

```text
hwtacacs-server template TACACS
 hwtacacs-server authentication 10.0.1.10
 hwtacacs-server authentication 10.0.2.10 secondary
 hwtacacs-server authorization 10.0.1.10
 hwtacacs-server authorization 10.0.2.10 secondary
 hwtacacs-server accounting 10.0.1.10
 hwtacacs-server accounting 10.0.2.10 secondary
 hwtacacs-server shared-key cipher Cle-Longue-Et-Aleatoire
#
aaa
 authentication-scheme AUTH-TAC
  authentication-mode hwtacacs local
 authorization-scheme AUTZ-TAC
  authorization-mode hwtacacs local
  authorization-cmd 3 hwtacacs local
 accounting-scheme ACCT-TAC
  accounting-mode hwtacacs
 recording-scheme REC-TAC
  recording-mode hwtacacs TACACS
 cmd recording-scheme REC-TAC
 domain default_admin
  authentication-scheme AUTH-TAC
  authorization-scheme AUTZ-TAC
  accounting-scheme ACCT-TAC
  hwtacacs-server TACACS
#
user-interface vty 0 4
 authentication-mode aaa
 protocol inbound ssh
```

`authorization-cmd 3` soumet au serveur les commandes de niveau 3 (gestion). Vérification : `display hwtacacs-server template TACACS`, `test-aaa alice MotDePasse hwtacacs-template TACACS`.

## Fortinet FortiGate

```text
config user tacacs+
    edit "TACACS"
        set server "10.0.1.10"
        set secondary-server "10.0.2.10"
        set key Cle-Longue-Et-Aleatoire
        set authen-type ascii
        set authorization enable
    next
end
config user group
    edit "TACACS-Admins"
        set member "TACACS"
    next
end
config system admin
    edit "tacacs-admins"
        set remote-auth enable
        set wildcard enable
        set remote-group "TACACS-Admins"
        set accprofile "prof_admin"          # profil par défaut
        set accprofile-override enable       # le serveur peut imposer un autre profil
        set vdom "root"
    next
end
```

Avec `accprofile-override`, le serveur renvoie le profil dans le service **`fortigate`** : `admin_prof=super_admin`. Test : `diagnose test authserver tacacs+ TACACS alice MotDePasse`.

## Palo Alto PAN-OS

Dans l'interface web :

1. **Device → Server Profiles → TACACS+** : ajouter les deux serveurs, la clé, cocher *Use single connection for all authentication*, choisir le protocole (PAP ou CHAP).
2. **Device → Authentication Profile** : type *TACACS+*, profil de serveurs précédent, liste d'autorisation (*Allow List* : `all` ou groupes).
3. **Device → Setup → Management → Authentication Settings** : sélectionner ce profil pour l'administration.
4. **Device → Admin Roles** : créer les rôles ; le serveur renvoie dans le service **`PaloAlto`** l'attribut `PaloAlto-Admin-Role=<nom du rôle>` (et éventuellement `PaloAlto-Admin-Access-Domain`).

Les commandes et changements de configuration sont journalisés localement (*Monitor → Logs → Configuration*) ; la comptabilité TACACS+ s'active dans le profil de serveurs selon la version.

Voir aussi [[18-palo-alto/01-acces-cli-webui|Palo Alto]].

## F5 BIG-IP

**System → Users → Authentication** : type *Remote – TACACS+*, serveurs, clé, service `ppp` et protocole `ip` par défaut. Le rôle et la partition sont renvoyés par les attributs `F5-LTM-User-Role`, `F5-LTM-User-Partition` et `F5-LTM-User-Shell`.

## Systèmes réseau sous Linux (SONiC, Cumulus)

```bash
# SONiC
sudo config tacacs add 10.0.1.10 --key Cle-Longue-Et-Aleatoire --timeout 5 --priority 1
sudo config tacacs add 10.0.2.10 --key Cle-Longue-Et-Aleatoire --timeout 5 --priority 2
sudo config aaa authentication login tacacs+ local
show tacacs
```

Cumulus Linux (NVUE) propose `nv set system aaa tacacs …` : ces systèmes reposent sur `pam_tacplus` et `libnss_tacplus` décrits ci-dessous.

## Serveurs Linux : pam_tacplus et libnss_tacplus

Pour que les connexions SSH d'un serveur Linux passent par TACACS+ :

| Composant | Rôle |
| --- | --- |
| `pam_tacplus` | Module PAM : authentification, autorisation (`service=shell`) et comptabilité des sessions |
| `libnss_tacplus` | Module NSS : fait exister l'utilisateur (UID, répertoire, shell) en l'associant à un compte local modèle selon son niveau |

```bash
# Debian / Ubuntu (paquet libpam-tacplus) ; sinon compiler github.com/kravietz/pam_tacplus
sudo apt install libpam-tacplus
```

```text /etc/pam.d/sshd
# À ajouter avant la ligne @include common-auth
auth    [success=done new_authtok_reqd=done default=ignore auth_err=die] pam_tacplus.so server=10.0.1.10 server=10.0.2.10 secret=Cle-Longue-Et-Aleatoire timeout=5 login=login
account [success=done new_authtok_reqd=done default=ignore] pam_tacplus.so server=10.0.1.10 server=10.0.2.10 secret=Cle-Longue-Et-Aleatoire service=shell protocol=ssh
session optional pam_tacplus.so server=10.0.1.10 server=10.0.2.10 secret=Cle-Longue-Et-Aleatoire service=shell protocol=ssh
```

- L'utilisateur doit exister pour le système : soit créé localement (sans mot de passe), soit fourni par `libnss_tacplus` qui l'associe à des comptes modèles (`tacacs0` à `tacacs15` selon le niveau).
- Le mot de passe en clair dans le fichier PAM : protégez-le (`chmod 600`) ou utilisez le fichier de configuration séparé si votre version le permet.
- Gardez une **session root ouverte** et un compte local avec clé SSH tant que la configuration n'est pas validée.

## Équipements sans TACACS+

Certains systèmes ne gèrent que RADIUS (par exemple MikroTik RouterOS, beaucoup de bornes et d'équipements grand public). Utilisez alors RADIUS pour l'administration, voir [[01-freeradius/09-administration-equipements|administration des équipements avec RADIUS]].
