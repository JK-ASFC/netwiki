---
title: Aide-mémoire TACACS / TACACS+
description: L'essentiel de TACACS, XTACACS et TACACS+ sur une page — ports, versions, codes des paquets, attributs courants, configuration minimale Cisco, NX-OS, Junos, Arista, Comware, serveurs tac_plus-ng et tac_plus, commandes de test et de débogage.
tags: [tacacs+, tacacs, aide-mémoire, cisco, junos, tac_plus-ng, tac_plus]
icon: book-open
---

## Protocoles

| | TACACS | XTACACS | TACACS+ | TACACS+ TLS |
| --- | --- | --- | --- | --- |
| Référence | RFC 1492 | RFC 1492 | RFC 8907 | RFC 9887 |
| Transport | UDP 49 | UDP 49 | **TCP 49** | **TCP 300** |
| Protection | Aucune | Aucune | Masquage MD5 + clé | TLS 1.3 |
| AAA | Authentification | A + comptabilité partielle | A, A, A séparés | Idem |
| Statut | Obsolète | Obsolète | Courant | Récent |

## Codes TACACS+

| Champ | Valeurs |
| --- | --- |
| Version | `0xc0` (majeure 12, mineure 0) ; `0xc1` pour PAP/CHAP/MS-CHAP |
| Type | `1` authentification · `2` autorisation · `3` comptabilité |
| Flags | `0x01` non masqué · `0x04` single-connection |
| Authen. action | `1` LOGIN · `2` CHPASS · `4` SENDAUTH |
| Authen. type | `1` ASCII · `2` PAP · `3` CHAP · `5` MS-CHAP · `6` MS-CHAPv2 |
| Authen. service | `1` LOGIN · `2` ENABLE · `3` PPP |
| Authen. statut | `1` PASS · `2` FAIL · `3` GETDATA · `4` GETUSER · `5` GETPASS · `6` RESTART · `7` ERROR · `0x21` FOLLOW |
| Author. statut | `1` PASS_ADD · `2` PASS_REPL · `0x10` FAIL · `0x11` ERROR · `0x21` FOLLOW |
| Acct. flags | `0x02` START · `0x04` STOP · `0x08` WATCHDOG |
| Acct. statut | `1` SUCCESS · `2` ERROR · `0x21` FOLLOW |

## Attributs courants

| Équipement | Service | Attribut |
| --- | --- | --- |
| Cisco IOS / IOS XE, Arista, Aruba | `shell` | `priv-lvl=15` |
| Cisco NX-OS | `shell` | `shell:roles="network-admin"` |
| Cisco IOS XR | `shell` | `task="#root-system"` |
| Juniper | `junos-exec` | `local-user-name=super`, `allow-commands`, `deny-commands` |
| FortiGate | `fortigate` | `admin_prof=super_admin` |
| Palo Alto | `PaloAlto` | `PaloAlto-Admin-Role=…` |
| Commande | `shell` | `cmd=show`, `cmd-arg=running-config`, `cmd-arg=<cr>` |

`attribut=valeur` est obligatoire, `attribut*valeur` est facultatif.

## Cisco IOS / IOS XE minimal

```cisco
aaa new-model
tacacs server TACACS-1
 address ipv4 10.0.1.10
 key 0 Cle-Longue
 single-connection
aaa group server tacacs+ TACACS
 server name TACACS-1
 ip tacacs source-interface Loopback0
username secours privilege 15 algorithm-type scrypt secret Secours-Long
aaa authentication login default group TACACS local
aaa authentication enable default group TACACS enable
aaa authorization exec default group TACACS local if-authenticated
aaa authorization commands 15 default group TACACS local if-authenticated
aaa authorization config-commands
aaa accounting exec default start-stop group TACACS
aaa accounting commands 15 default start-stop group TACACS
```

## Autres équipements

```text
NX-OS   feature tacacs+ ; tacacs-server host 10.0.1.10 key 0 Cle
        aaa group server tacacs+ TACACS / server 10.0.1.10 / use-vrf management
        aaa authentication login default group TACACS ; aaa accounting default group TACACS
Junos   set system tacplus-server 10.0.1.10 secret Cle single-connection
        set system authentication-order [ tacplus password ]
        set system login user super class super-user
        set system accounting events [ login change-log interactive-commands ] destination tacplus
Arista  tacacs-server host 10.0.1.10 vrf MGMT key 0 Cle
        aaa authentication login default group TACACS local
        aaa authorization commands all default group TACACS local
Comware hwtacacs scheme TACACS ; primary authentication 10.0.1.10 ; key authentication simple Cle
        domain system ; authentication login hwtacacs-scheme TACACS local
```

## tac_plus-ng minimal

```tacplus
id = spawnd { listen = { port = 49 } background = no }
id = tac_plus-ng {
    log acctlog { destination = /var/log/tac_plus-ng/acct-%Y%m%d.log }
    accounting log = acctlog
    device lan { address = 10.0.0.0/8 key = "Cle-Longue" }
    profile admin { script { if (service == shell) { if (cmd == "") { set priv-lvl = 15 permit } permit } } }
    group admins
    user alice { password login = crypt $6$… member = admins }
    ruleset { rule { script { if (member == admins) { profile = admin permit } } } }
}
```

## tac_plus (Shrubbery) minimal

```tacplus
key = "Cle-Longue"
accounting file = /var/log/tac_plus/acct.log
group = admins { default service = permit  service = exec { priv-lvl = 15 } }
user = alice { member = admins  login = PAM }
```

## Tests et débogage

| Où | Commande |
| --- | --- |
| Serveur tac_plus-ng | `tac_plus-ng -P /usr/local/etc/tac_plus-ng.cfg` (syntaxe) |
| Serveur tac_plus | `tac_plus -P -C /etc/tac_plus.conf` ; `tac_plus -G -d 24 -C …` |
| Poste de test | `tacacs_client -H 10.0.1.10 -k Cle -u alice authenticate` |
| Cisco IOS | `show aaa servers` · `test aaa group TACACS alice MotDePasse new-code` · `debug tacacs` |
| NX-OS | `show tacacs-server` · `test aaa group TACACS alice MotDePasse` |
| ASA | `test aaa-server authentication TACACS host 10.0.1.10 username alice password …` |
| FortiGate | `diagnose test authserver tacacs+ TACACS alice MotDePasse` |
| Réseau | `tcpdump -ni any 'tcp port 49'` · Wireshark filtre `tacplus` + clé |

## Règles d'or

1. Garder une session ouverte et un compte local de secours pendant les changements.
2. `local` en dernière méthode partout, surtout sur la console.
3. Une clé longue par groupe d'équipements, réseau de gestion isolé, TLS dès que possible.
4. Deux serveurs, configuration en Git, journaux centralisés.
5. Rôles par groupes d'annuaire, règles écrites sur les commandes développées.
