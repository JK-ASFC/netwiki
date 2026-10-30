---
title: Authentification des administrateurs d'équipements
description: Centraliser les connexions SSH/console/web des administrateurs réseau avec RADIUS — attributs de privilège par constructeur (Cisco IOS, NX-OS, Juniper, Fortinet, Palo Alto, Aruba/HPE, MikroTik), groupes AD, comptes de secours locaux et traçabilité.
tags: [freeradius, administration, device admin, cisco, juniper, fortinet, palo alto, privilèges]
icon: user-cog
---

## Objectif

Les administrateurs se connectent aux commutateurs, routeurs et pare-feu avec **leur compte AD** ; le niveau de droits dépend de leur **groupe** ; chaque connexion est journalisée. Un compte local de secours reste utilisable si RADIUS est injoignable.

> [!NOTE]
> **TACACS+** reste préférable quand on veut autoriser ou journaliser **commande par commande** (Cisco ISE, tac_plus-ng). RADIUS suffit pour l'authentification et l'attribution d'un niveau de privilège ou d'un profil.

## Serveur virtuel dédié

Séparer l'administration des équipements de l'accès réseau (802.1X) évite les mélanges de politiques :

```radius clients.conf
client equipements-admin {
    ipaddr = 10.0.1.0/24
    secret = "Secret-Administration-Equipements"
    shortname = admin-reseau
    virtual_server = admin-equipements
}
```

```radius sites-available/admin-equipements
server admin-equipements {
    authorize {
        filter_username
        preprocess
        -ldap
        if (notfound) { reject }
        if (User-Password) {
            update control { &Auth-Type := ldap }
        }
    }
    authenticate {
        Auth-Type LDAP { ldap }
        mschap
    }
    post-auth {
        corp_admin_privileges        # politique ci-dessous
        linelog_admin                # journal dédié
        Post-Auth-Type REJECT {
            linelog_admin
            attr_filter.access_reject
        }
    }
}
```

## Attributs par constructeur

### Politique unique selon le groupe AD et le type d'équipement

```radius policy.d/admin-equipements
corp_admin_privileges {
    # Lecture seule par défaut
    if (LDAP-Group == "GG-Reseau-Admins") {
        update control { &Tmp-String-0 := "admin" }
    }
    elsif (LDAP-Group == "GG-Reseau-Lecture") {
        update control { &Tmp-String-0 := "lecture" }
    }
    else {
        reject
    }

    switch "%{Client-Shortname}" {
        case "fw-fortigate" {
            update reply {
                &Fortinet-Group-Name := "%{control:Tmp-String-0}"
            }
        }
        case "fw-paloalto" {
            update reply {
                &PaloAlto-Admin-Role := "%{control:Tmp-String-0}"
            }
        }
        case {
            # Cisco IOS / IOS-XE (et nombreux équipements compatibles)
            if (&control:Tmp-String-0 == "admin") {
                update reply {
                    &Service-Type := NAS-Prompt-User
                    &Cisco-AVPair := "shell:priv-lvl=15"
                }
            }
            else {
                update reply {
                    &Service-Type := NAS-Prompt-User
                    &Cisco-AVPair := "shell:priv-lvl=1"
                }
            }
        }
    }
}
```

### Tableau de référence

| Constructeur | Attribut | Valeurs |
| --- | --- | --- |
| **Cisco IOS / IOS-XE** | `Cisco-AVPair = "shell:priv-lvl=N"` (+ `Service-Type = NAS-Prompt-User`) | 15 = enable, 1 = utilisateur |
| **Cisco NX-OS** | `Cisco-AVPair = "shell:roles=\"network-admin\""` | `network-admin`, `network-operator`, rôles personnalisés |
| **Cisco ASA** | `Service-Type` | `Administrative-User` (6) / `NAS-Prompt-User` (7) ; `Login` refusé avec `aaa authorization exec authentication-server` |
| **Cisco WLC (AireOS)** | `Service-Type` | `Administrative-User` = lecture/écriture, `NAS-Prompt-User` = lecture |
| **Juniper Junos** | `Juniper-Local-User-Name` | Nom d'un **utilisateur modèle** local (`super-user-local`, `read-only-local`) |
| **Fortinet FortiGate** | `Fortinet-Group-Name` (+ `Fortinet-Access-Profile`) | Nom de groupe/profil défini sur le FortiGate |
| **Palo Alto** | `PaloAlto-Admin-Role` | Rôle d'administration (`superuser`, rôle personnalisé) |
| **HPE / Aruba ProCurve, ArubaOS-Switch** | `Service-Type` | `Administrative-User` = manager, `NAS-Prompt-User` = operator |
| **Aruba CX** | `Aruba-Admin-Role` (VSA Aruba) | `administrators`, `operators`, `auditors` — vérifier selon la version d'AOS-CX |
| **MikroTik RouterOS** | `Mikrotik-Group` | `full`, `write`, `read` |
| **Linux (pam_radius)** | — | Authentification seule ; droits via groupes locaux / sudo |

> [!TIP]
> Si un attribut n'est pas reconnu au démarrage (`Unknown attribute`), le dictionnaire du constructeur n'est pas inclus : vérifiez `/usr/share/freeradius/dictionary` (ligne `$INCLUDE dictionary.paloalto`…) ou ajoutez la définition dans le fichier `dictionary` local.

## Configuration des équipements

### Cisco IOS / IOS-XE

```cisco
aaa new-model
radius server ADMIN-1
 address ipv4 10.0.10.31 auth-port 1812 acct-port 1813
 key 0 Secret-Administration-Equipements
radius server ADMIN-2
 address ipv4 10.0.10.32 auth-port 1812 acct-port 1813
 key 0 Secret-Administration-Equipements
aaa group server radius RAD-ADMIN
 server name ADMIN-1
 server name ADMIN-2
 ip radius source-interface Vlan10
!
! Compte de secours (utilisé seulement si RADIUS ne répond pas)
username secours privilege 15 algorithm-type scrypt secret Un-Mot-De-Passe-Coffre
!
aaa authentication login ADMIN group RAD-ADMIN local
aaa authorization exec ADMIN group RAD-ADMIN local if-authenticated
aaa accounting exec ADMIN start-stop group RAD-ADMIN
aaa accounting commands 15 ADMIN start-stop group RAD-ADMIN
!
line con 0
 login authentication ADMIN
 authorization exec ADMIN
line vty 0 15
 login authentication ADMIN
 authorization exec ADMIN
 accounting exec ADMIN
 transport input ssh
!
ip http authentication aaa login-authentication ADMIN
ip http authentication aaa exec-authorization ADMIN
```

> [!CAUTION]
> Testez dans une **seconde session SSH** sans fermer la première avant d'enregistrer (`write memory`). Une erreur d'AAA peut vous enfermer hors de l'équipement. Prévoyez `reload in 10` avant les changements à distance.

```cisco
test aaa group RAD-ADMIN alice Mot2Passe! new-code
show aaa servers
```

### Juniper Junos

```text
set system radius-server 10.0.10.31 secret "Secret-Administration-Equipements" source-address 10.0.1.5
set system radius-server 10.0.10.32 secret "Secret-Administration-Equipements" source-address 10.0.1.5
set system authentication-order [ radius password ]
set system login user super-user-local class super-user
set system login user read-only-local class read-only
set system accounting events [ login change-log interactive-commands ]
set system accounting destination radius
```

### Fortinet FortiGate

```text
config user radius
    edit "RAD-ADMIN"
        set server "10.0.10.31"
        set secondary-server "10.0.10.32"
        set secret Secret-Administration-Equipements
        set auth-type auto
    next
end
config user group
    edit "admin"
        set member "RAD-ADMIN"
        config match
            edit 1
                set server-name "RAD-ADMIN"
                set group-name "admin"
            next
        end
    next
end
config system admin
    edit "radius-admins"
        set remote-auth enable
        set accprofile "super_admin"
        set wildcard enable
        set remote-group "admin"
    next
end
```

## Traçabilité

```radius mods-available/linelog (instance)
linelog linelog_admin {
    filename = ${logdir}/admin-equipements.log
    format = "%t %{Client-Shortname} (%{Packet-Src-IP-Address}) user=%{User-Name} from=%{Calling-Station-Id} result=%{reply:Packet-Type} priv=%{reply:Cisco-AVPair}"
}
```

Envoyez ce journal (et l'accounting des commandes) vers le SIEM : il répond aux exigences d'audit (qui s'est connecté où, quand, avec quels droits).

## Bonnes pratiques

- Groupes AD dédiés (`GG-Reseau-Admins`, `GG-Reseau-Lecture`), revue trimestrielle des membres.
- MFA : proxy RADIUS vers un fournisseur MFA (Duo Authentication Proxy, privacyIDEA via `rlm_rest`, Entra ID NPS extension) — voir [[10-accounting-proxy-realms]].
- Comptes de secours locaux uniques par équipement, stockés dans un coffre, alertes à chaque utilisation.
- Secrets RADIUS distincts pour l'administration et pour l'accès réseau.
- Réseau d'administration dédié (VRF / VLAN de management) pour les flux RADIUS et SSH.
