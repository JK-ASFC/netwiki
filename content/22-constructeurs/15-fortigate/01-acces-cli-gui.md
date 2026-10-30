---
title: Accès, CLI FortiOS et interface graphique
description: Prise en main d'un FortiGate — accès (console 9600 8N1, interface web HTTPS, SSH, adresse par défaut), structure de la CLI FortiOS (config, edit, set, unset, next, end, show, get, diagnose, execute), configuration initiale sécurisée (administrateurs, profils d'accès, hôtes de confiance, ports d'administration, NTP, DNS), interfaces, VLAN et zones, VDOM, correspondance entre l'interface graphique et la CLI, sauvegarde et mise à jour.
tags: [fortinet, fortigate, fortios, cli, gui, interfaces, vdom, administration]
icon: terminal
---

Le **FortiGate** (Fortinet) est l'un des pare-feu les plus répandus : pare-feu à états, NGFW (applications, IPS, filtrage web), VPN, SD-WAN et routage. Tout se configure indifféremment par l'**interface graphique** (GUI) ou la **CLI FortiOS**, qui partagent la même configuration.

## Accès

| Accès | Paramètres |
| --- | --- |
| Console | Câble RJ45/USB, **9600 bauds, 8N1** |
| Interface web | `https://192.168.1.99` (port `mgmt` ou `port1`/`internal` selon le modèle) sur un équipement neuf ; identifiant `admin` sans mot de passe → changement imposé |
| SSH | Après activation sur l'interface (`set allowaccess ssh`) |
| CLI dans la GUI | Icône *CLI Console* en haut à droite de l'interface web |

## Structure de la CLI

```fortios
# entrer dans une table de configuration
config system interface
    # créer ou modifier une entrée (edit 0 = prochain identifiant libre)
    edit "port1"
        set ip 203.0.113.2 255.255.255.248
        set allowaccess ping
        # remettre un champ à sa valeur par défaut
        unset alias
    # enregistrer l'entrée, rester dans la table
    next
# enregistrer et sortir (abort : sortir sans enregistrer)
end
```

| Commande | Rôle |
| --- | --- |
| `show` / `show full-configuration` | Configuration (différences avec le défaut / complète) |
| `get` | Valeurs, y compris dynamiques (adresse PPPoE) |
| `diagnose` (`diag`) | Diagnostic et débogage |
| `execute` (`exec`) | Actions : ping, sauvegarde, redémarrage, mise à jour |
| `tree` | Arborescence des commandes de la section |
| `show \| grep -f <texte>` | Trouver où un élément est utilisé (`-i` : insensible à la casse) |

Commandes de base : `get system status` (version, numéro de série, licences), `get system performance status` (CPU, mémoire, sessions), `get system arp`, `execute ping 8.8.8.8`, `execute traceroute`, `execute ssh admin@10.0.0.2`, `execute reboot`.

## Configuration initiale sécurisée

```fortios
config system global
    set hostname "FGT-PARIS"
    set timezone "Europe/Paris"
    set admintimeout 10
    # port HTTPS d'administration (443 libéré pour le VPN SSL)
    set admin-sport 8443
    set admin-ssh-port 22
    set admin-lockout-threshold 3
    set admin-lockout-duration 300
    set strong-crypto enable
    set pre-login-banner enable
end
config system admin
    edit "jdupont"
        set accprofile "super_admin"
        set password MotDePasseAdminTresLong
        # hôtes de confiance : seules ces sources peuvent se connecter
        set trusthost1 10.0.99.0 255.255.255.0
        # ou email, ou FortiToken
        set two-factor fortitoken-cloud
    next
end
config system ntp
    set ntpsync enable
    set type custom
    config ntpserver
        edit 1
            set server "10.0.10.123"
        next
    end
end
config system dns
    set primary 10.0.10.53
    set secondary 10.0.10.54
end
```

Remplacez le compte `admin` par des comptes **nominatifs** (ou authentification RADIUS/LDAP/SAML pour les administrateurs) et limitez chaque compte par **hôtes de confiance** et **profil d'accès** (lecture seule pour la supervision).

## Interfaces, VLAN, zones

```fortios
config system interface
    edit "port1"
        set alias "WAN1"
        set mode static
        set ip 203.0.113.2 255.255.255.248
        # PAS d'https/ssh sur le WAN
        set allowaccess ping
        set role wan
    next
    edit "port2"
        set alias "LAN"
        set ip 10.0.10.254 255.255.255.0
        set allowaccess ping https ssh
        set role lan
    next
    edit "VLAN20"
        set vdom "root"
        set interface "port2"
        set vlanid 20
        set ip 10.0.20.254 255.255.255.0
        set allowaccess ping
        set role lan
    next
end
config system zone
    edit "ZONE-UTILISATEURS"
        set interface "VLAN20" "VLAN21"
        set intrazone deny
    next
end
show system interface
get system interface physical
# vitesse, erreurs, statistiques d'une interface
diagnose hardware deviceinfo nic port1
```

Interface graphique : *Network → Interfaces* (création de VLAN, adressage, accès administratifs, DHCP), *Network → Zones* (selon la version).

## VDOM

Les **VDOM** (*Virtual Domains*) découpent un FortiGate en plusieurs pare-feu logiques (multi-locataires, séparation d'administration). Activation : `config system global` → `set vdom-mode multi-vdom`. Les commandes se lancent alors dans le contexte `config vdom` → `edit root` ou `config global`.

## Correspondance GUI ↔ CLI

| Interface graphique | CLI |
| --- | --- |
| *System → Settings* | `config system global` |
| *System → Administrators* | `config system admin` |
| *Network → Interfaces* | `config system interface` |
| *Network → Static Routes* | `config router static` |
| *Policy & Objects → Addresses* | `config firewall address` |
| *Policy & Objects → Firewall Policy* | `config firewall policy` |
| *VPN → IPsec Tunnels* | `config vpn ipsec phase1-interface` / `phase2-interface` |
| *Security Profiles* | `config antivirus profile`, `config webfilter profile`, `config ips sensor`, `config application list` |
| *Log & Report* | `config log …`, `execute log display` |

## Sauvegarde et mise à jour

```fortios
# ou tftp, usb, sftp selon la version
execute backup config ftp FGT-PARIS.conf 10.0.98.30 utilisateur MotDePasse
execute backup full-config …
# (redémarre)
execute restore config tftp FGT-PARIS.conf 10.0.98.30
# partitions et images
diagnose sys flash list
# choisir l'image au prochain démarrage
execute setnextreboot <partition>
# erreurs d'interprétation de la configuration après une mise à jour (doit être vide)
diagnose debug config-error-log read
```

Mises à jour : respecter le **chemin de mise à jour** recommandé (outil *Upgrade Path* de Fortinet) en passant par les versions intermédiaires, sauvegarder avant, lire les notes de version. Interface graphique : *System → Firmware & Registration*. Une **réinitialisation usine** : `execute factoryreset` (ou `factoryreset2` qui conserve la configuration réseau).

Suite : [[02-politiques-nat-vpn|politiques, NAT, profils de sécurité et VPN]].
