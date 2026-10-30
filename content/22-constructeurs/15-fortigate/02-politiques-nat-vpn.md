---
title: Politiques, NAT, profils de sécurité et VPN
description: Configurer la sécurité d'un FortiGate — objets (adresses, groupes, services, FQDN, ISDB), politiques de pare-feu (ordre, NAT de sortie, inspection en mode flux ou proxy), IP pools et VIP (publication de serveurs), profils de sécurité (antivirus, filtrage web, contrôle applicatif, IPS, inspection SSL), authentification des utilisateurs (FSSO, RADIUS, LDAP), VPN IPsec site à site et accès distant avec FortiClient, équivalents CLI et GUI.
tags: [fortinet, fortigate, politiques, nat, vip, profils de sécurité, ipsec, forticlient]
icon: shield
---

## Objets

```fortios
config firewall address
    edit "NET-LAN"
        set subnet 10.0.0.0 255.0.0.0
    next
    edit "SRV-WEB"
        set subnet 10.0.30.10 255.255.255.255
    next
    edit "FQDN-MAJ-EDITEUR"
        set type fqdn
        set fqdn "update.editeur.example"
    next
end
config firewall addrgrp
    edit "GRP-ADMINS"
        set member "NET-ADMIN" "PC-SUPERVISION"
    next
end
config firewall service custom
    edit "TCP-8443"
        set tcp-portrange 8443
    next
end
```

Les objets **ISDB** (*Internet Service Database*) représentent des services Internet connus (Microsoft 365, sites de mise à jour…) pour les règles et le SD-WAN.

## Politiques de pare-feu

```fortios
config firewall policy
    edit 0
        set name "LAN-VERS-INTERNET"
        set srcintf "ZONE-UTILISATEURS"
        set dstintf "port1"
        set srcaddr "NET-LAN"
        set dstaddr "all"
        set action accept
        set schedule "always"
        set service "ALL"
        # NAT de sortie sur l'adresse de l'interface
        set nat enable
        set utm-status enable
        set ssl-ssh-profile "certificate-inspection"
        set av-profile "default"
        set webfilter-profile "default"
        set application-list "default"
        set ips-sensor "default"
        set logtraffic all
    next
end
```

| Point | Règle |
| --- | --- |
| Ordre | Première correspondance de haut en bas ; `move 12 before 3` pour réordonner (GUI : glisser-déposer) |
| Refus implicite | Dernière règle « Implicit Deny » (activer la journalisation des refus pour le diagnostic) |
| NAT | Activée par politique (central NAT en option : *System → Feature Visibility*) |
| Inspection | Mode **flux** (performant) ou **proxy** (plus de fonctions) par politique |
| Identifiant | Chaque politique a un ID (visible dans les journaux : `policyid`) |

## Publication de serveurs (VIP) et IP pools

```fortios
config firewall vip
    edit "VIP-WEB-HTTPS"
        set extip 203.0.113.5
        set extintf "port1"
        set portforward enable
        set mappedip "10.0.30.10"
        set extport 443
        set mappedport 443
    next
end
config firewall policy
    edit 0
        set name "INTERNET-VERS-WEB"
        set srcintf "port1"
        set dstintf "port3"
        set srcaddr "all"
        set dstaddr "VIP-WEB-HTTPS"
        set action accept
        set schedule "always"
        set service "HTTPS"
        set ips-sensor "protect_http_server"
        set logtraffic all
    next
end
config firewall ippool
    edit "POOL-SORTIE-SRV"
        set startip 203.0.113.6
        set endip 203.0.113.6
    next
end
```

Une politique qui utilise un **IP pool** (`set ippool enable`, `set poolname "POOL-SORTIE-SRV"`) fait sortir le trafic avec une adresse publique dédiée.

## Profils de sécurité

| Profil | Rôle | Prérequis |
| --- | --- | --- |
| **Inspection SSL/SSH** | `certificate-inspection` (SNI, certificat) ou `deep-inspection` (déchiffrement, certificat d'AC déployé sur les postes) | Pour une inspection complète : AC interne de confiance, exclusions (banques, santé) |
| Antivirus | Analyse des fichiers | Licence FortiGuard |
| Filtrage web | Catégories d'URL, listes | Licence |
| Contrôle applicatif | Applications (par signatures) | Licence (base de signatures) |
| IPS | Prévention d'intrusions | Licence |
| DNS Filter, DLP, Video Filter… | Selon la version et les licences | |

```fortios
# forcer la mise à jour des bases FortiGuard
execute update-now
# versions des moteurs et bases
diagnose autoupdate versions
# connectivité aux serveurs de classification
diagnose debug rating
```

## Authentification des utilisateurs

- **FSSO** (*Fortinet Single Sign-On*) : agent sur les contrôleurs de domaine (ou interrogation des journaux) pour associer adresses IP et utilisateurs AD ; politiques par groupe d'utilisateurs.
- Serveurs **LDAP**/**RADIUS**/**SAML** : *User & Authentication → LDAP Servers / RADIUS Servers / Single Sign-On*.
- `diagnose debug application fnbamd -1` + `diagnose debug enable` pour déboguer l'authentification.

## VPN IPsec site à site

```fortios
config vpn ipsec phase1-interface
    edit "VPN-LYON"
        set interface "port1"
        set ike-version 2
        set peertype any
        set net-device disable
        set proposal aes256gcm-prfsha384
        set dhgrp 20 19
        set remote-gw 198.51.100.20
        set psksecret CleTresLongueEtAleatoire
        set dpd on-idle
    next
end
config vpn ipsec phase2-interface
    edit "VPN-LYON-P2"
        set phase1name "VPN-LYON"
        set proposal aes256gcm
        set dhgrp 20 19
        set src-subnet 10.0.0.0 255.255.0.0
        set dst-subnet 10.60.0.0 255.255.0.0
    next
end
config router static
    edit 0
        set dst 10.60.0.0 255.255.0.0
        set device "VPN-LYON"
    next
end
```

Puis deux politiques (LAN → `VPN-LYON` et `VPN-LYON` → LAN), **sans NAT**. L'assistant *VPN → IPsec Wizard* génère tout cela (y compris vers un équipement Cisco, Palo Alto, Stormshield…).

## VPN d'accès distant

| Type | Remarques |
| --- | --- |
| **IPsec IKEv2** avec FortiClient | Méthode recommandée par Fortinet ; authentification par certificat et/ou utilisateur + MFA (FortiToken, SAML) |
| VPN SSL (mode tunnel) | Historiquement très utilisé ; Fortinet le **retire progressivement** des versions récentes de FortiOS au profit d'IPsec — vérifier la version |
| ZTNA | Accès par application via FortiClient EMS |

Les VPN SSL FortiGate ont fait l'objet de **vulnérabilités critiques massivement exploitées** (2019, 2022, 2023, 2024) : mises à jour immédiates, MFA obligatoire, désactivation si non utilisé.

Suite : [[03-ha-diagnostic-depannage|haute disponibilité, diagnostic et dépannage]].
