---
title: Réservations, classes et options avancées
description: Réservations par adresse MAC ou identifiant, classes et sous-classes, pools avec allow/deny, filtrage des inconnus, PXE BIOS/UEFI et iPXE, option 43 pour contrôleurs Wi-Fi, option 150/66 pour la téléphonie, option 82, expressions conditionnelles et événements on commit.
tags: [isc-dhcp, réservation, classes, pxe, uefi, ipxe, option 43, option 82, voip, wifi]
icon: sliders-horizontal
---

## Réservations (adresses fixes)

```dhcpd
host srv-impression {
    hardware ethernet 00:50:56:aa:bb:01;
    fixed-address 10.0.40.10;
    option host-name "srv-impression";
}

# Par identifiant client (option 61), utile quand la MAC change (VM, cartes multiples)
host nas01 {
    option dhcp-client-identifier "\001\000\021\042\063\104\125";
    fixed-address 10.0.40.11;
}

# Adresse résolue par DNS au démarrage du service
host proxy01 {
    hardware ethernet 00:50:56:aa:bb:03;
    fixed-address proxy01.exemple.fr;
}
```

> [!NOTE]
> Une adresse fixe doit être **hors des plages `range`** mais dans un `subnet` déclaré. Le nom `host xxx` doit être unique dans tout le fichier, même si la MAC est la même dans deux sous-réseaux (`host pc1-vlan40`, `host pc1-vlan50`).

## Classes

Une **classe** regroupe des clients selon une expression sur la requête (MAC, options envoyées, relais…).

```dhcpd
# Par constructeur (préfixe OUI de la MAC)
class "telephones-yealink" {
    match if substring (hardware, 1, 3) = 80:5e:c0;
}

# Par vendor-class-identifier (option 60)
class "postes-windows" {
    match if substring (option vendor-class-identifier, 0, 4) = "MSFT";
}
class "imprimantes-hp" {
    match if substring (option vendor-class-identifier, 0, 10) = "Hewlett-Pa";
}

# Clients PXE
class "pxe" {
    match if substring (option vendor-class-identifier, 0, 9) = "PXEClient";
}
```

### Sous-classes (listes de MAC)

Plus performant qu'une longue liste de `host` quand on veut juste **autoriser** des équipements :

```dhcpd
class "autorises" {
    match hardware;
}
subclass "autorises" 1:3c:52:82:aa:bb:cc;     # 1 = type Ethernet, puis la MAC
subclass "autorises" 1:3c:52:82:aa:bb:cd;
include "/etc/dhcp/autorises-generes.conf";   # liste générée depuis l'inventaire
```

### Limiter le nombre de baux par classe

```dhcpd
class "par-port" {
    match option agent.circuit-id;    # un bail par port de switch (voir option 82)
    lease limit 2;
}
```

## Pools : plages réservées à certaines classes

```dhcpd
subnet 10.0.40.0 netmask 255.255.255.0 {
    option routers 10.0.40.1;

    # Équipements connus (déclarés en host ou en sous-classe)
    pool {
        range 10.0.40.100 10.0.40.199;
        allow members of "autorises";
        allow known-clients;
    }
    # Inconnus : petite plage de quarantaine avec DNS restreint
    pool {
        range 10.0.40.240 10.0.40.249;
        allow unknown-clients;
        option domain-name-servers 10.0.10.250;
        default-lease-time 600;
    }
}
```

| Instruction de pool | Effet |
| --- | --- |
| `allow members of "classe"` | Seuls les membres de la classe |
| `deny members of "classe"` | Tous sauf la classe |
| `allow known-clients` | Clients ayant une déclaration `host` |
| `allow unknown-clients` / `deny unknown-clients` | Clients sans déclaration `host` |
| `allow dynamic bootp clients` | Clients BOOTP |
| `deny all clients` | Pool désactivé |

> [!WARNING]
> Dans un même pool, ne mélangez pas `allow` et `deny` de façon ambiguë : dès qu'un `allow` est présent, **tout ce qui n'est pas explicitement autorisé est refusé**.

## PXE : démarrage réseau BIOS et UEFI

```dhcpd
option arch code 93 = unsigned integer 16;      # architecture du client (RFC 4578)

subnet 10.0.70.0 netmask 255.255.255.0 {
    range 10.0.70.100 10.0.70.200;
    option routers 10.0.70.1;

    class "pxe-clients" {
        match if substring (option vendor-class-identifier, 0, 9) = "PXEClient";
        next-server 10.0.70.5;                  # serveur TFTP (champ siaddr)

        if option arch = 00:07 or option arch = 00:09 {
            filename "efi64/syslinux.efi";       # UEFI x64
        } elsif option arch = 00:0b {
            filename "efi-arm64/grubaa64.efi";   # UEFI ARM64
        } else {
            filename "bios/pxelinux.0";          # BIOS hérité (arch 00:00)
        }
    }
}
```

| `arch` (option 93) | Plateforme |
| --- | --- |
| `00:00` | BIOS x86 |
| `00:06` | UEFI IA32 |
| `00:07` / `00:09` | UEFI x64 (BC) |
| `00:0a` / `00:0b` | UEFI ARM 32 / 64 bits |
| `00:10` | UEFI HTTP Boot x64 |

### Chaînage iPXE

Le micrologiciel PXE charge iPXE par TFTP ; iPXE refait une requête DHCP en s'identifiant (`user-class "iPXE"`) et reçoit alors un script HTTP :

```dhcpd
if exists user-class and option user-class = "iPXE" {
    filename "http://deploy.exemple.fr/boot.ipxe";
} elsif option arch = 00:07 or option arch = 00:09 {
    filename "ipxe.efi";
} else {
    filename "undionly.kpxe";
}
next-server 10.0.70.5;
```

> [!TIP]
> Avec **WDS / MECM (SCCM)**, on préfère généralement configurer les relais (`ip helper-address`) vers le serveur PXE plutôt que les options 66/67, qui ne gèrent pas proprement le double BIOS/UEFI.

## Option 43 : contrôleurs Wi-Fi

Les points d'accès légers découvrent leur contrôleur grâce à des **options encapsulées** dans l'option 43, envoyées uniquement quand l'équipement s'annonce avec la bonne option 60.

```dhcpd
# Cisco (CAPWAP) : sous-option 241 = liste des IP de WLC
option space Cisco_LWAPP_AP;
option Cisco_LWAPP_AP.server-address code 241 = array of ip-address;

class "cisco-ap" {
    match if substring (option vendor-class-identifier, 0, 8) = "Cisco AP";
    vendor-option-space Cisco_LWAPP_AP;
    option Cisco_LWAPP_AP.server-address 10.0.80.10, 10.0.80.11;
}

# Aruba (ArubaOS) : option 43 = adresse du contrôleur en texte
class "aruba-ap" {
    match if substring (option vendor-class-identifier, 0, 11) = "ArubaInstan" or
             substring (option vendor-class-identifier, 0, 8) = "ArubaAP";
    option vendor-encapsulated-options "10.0.80.20";
}

# Ubiquiti UniFi : sous-option 1 = IP du contrôleur
option space ubnt;
option ubnt.unifi-address code 1 = ip-address;
class "ubiquiti" {
    match if substring (option vendor-class-identifier, 0, 4) = "ubnt";
    vendor-option-space ubnt;
    option ubnt.unifi-address 10.0.80.30;
}
```

## Téléphonie IP

```dhcpd
option voip-tftp-server code 150 = array of ip-address;   # Cisco

subnet 10.0.60.0 netmask 255.255.255.0 {
    range 10.0.60.50 10.0.60.250;
    option routers 10.0.60.1;
    option voip-tftp-server 10.0.60.5, 10.0.60.6;          # téléphones Cisco
    option tftp-server-name "http://prov.exemple.fr/";     # option 66 : Yealink, Polycom, Snom…
    option ntp-servers 10.0.10.123;
    option time-offset 3600;
}
```

Pour placer automatiquement le téléphone dans le **VLAN voix**, la méthode recommandée est **LLDP-MED** (ou CDP) sur le commutateur ; certaines marques acceptent aussi une option propriétaire (ex. Avaya option 242, Mitel option 43/125).

## Option 82 (Relay Agent Information)

Le relais (commutateur avec DHCP snooping) ajoute le **circuit-id** (VLAN + port) et le **remote-id** (identifiant du commutateur). Le serveur peut s'en servir pour attribuer une adresse **par port** ou tracer l'origine d'un bail.

```dhcpd
# Garder les informations du relais dans le bail (visible dans dhcpd.leases)
stash-agent-options true;

# Journaliser l'origine de chaque bail
on commit {
    if exists agent.circuit-id {
        log(info, concat("Bail ", binary-to-ascii(10, 8, ".", leased-address),
                         " circuit-id=", binary-to-ascii(16, 8, ":", option agent.circuit-id),
                         " remote-id=", binary-to-ascii(16, 8, ":", option agent.remote-id)));
    }
}

# Adresse fixe pour un port précis (borne, caméra) — valeur selon le format du constructeur
class "porte-entree" {
    match if option agent.circuit-id = 00:04:00:28:01:05;    # VLAN 40, module 1, port 5 (format Cisco)
}
subnet 10.0.90.0 netmask 255.255.255.0 {
    pool {
        range 10.0.90.50 10.0.90.50;
        allow members of "porte-entree";
    }
}
```

## Expressions conditionnelles

```dhcpd
if substring (option vendor-class-identifier, 0, 4) = "MSFT" {
    option netbios-node-type 8;
} elsif option dhcp-user-class = "kiosque" {
    default-lease-time 1800;
}

# Envoyer une option même si le client ne l'a pas demandée (Parameter Request List)
option dhcp-parameter-request-list = concat(option dhcp-parameter-request-list, 2a);   # forcer l'option 42 (NTP)
```

## Déclencher des actions : on commit / release / expiry

```dhcpd
on commit {
    set ip  = binary-to-ascii(10, 8, ".", leased-address);
    set mac = binary-to-ascii(16, 8, ":", substring(hardware, 1, 6));
    execute("/usr/local/sbin/dhcp-hook.sh", "commit", ip, mac);
}
on release {
    set ip = binary-to-ascii(10, 8, ".", leased-address);
    execute("/usr/local/sbin/dhcp-hook.sh", "release", ip);
}
on expiry {
    set ip = binary-to-ascii(10, 8, ".", leased-address);
    execute("/usr/local/sbin/dhcp-hook.sh", "expiry", ip);
}
```

> [!CAUTION]
> `execute()` est **synchrone** : le serveur attend la fin du script avant de répondre au client. Le script doit être très rapide (écrire dans une file, lancer une tâche en arrière-plan avec `&`), sinon les performances s'effondrent. Le script s'exécute avec l'utilisateur du service (`dhcpd`).
