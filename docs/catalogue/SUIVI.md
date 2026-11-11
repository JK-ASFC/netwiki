# Suivi du catalogue des services

Généré par `node scripts/catalogue.mjs` à partir de [catalogue-services.txt](catalogue-services.txt) et du contenu du wiki. Source de vérité : [suivi.json](suivi.json).

| Total | Déjà dans le wiki | Nouvelles fiches | Fiches améliorées | Reste à faire |
| --- | --- | --- | --- | --- |
| 1311 | 191 (15 %) | 883 | 4 | 233 (18 %) |

Méthode de rédaction : [METHODE.md](METHODE.md).

## 1. SYSTEMES D'EXPLOITATION, VIRTUALISATION ET HYPERVISEURS — 51/51

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| Proxmox VE | Virtualisation bare-metal | Debian/Linux | ✅ existant | `13-conteneurs/11-proxmox-ve` |
| XCP-ng | Hyperviseur | Linux | 🆕 fait (lot 48) | `13-conteneurs/15-xcp-ng-xen` |
| KVM | Hyperviseur | Linux | 🆕 fait (lot 48) | `13-conteneurs/14-kvm-qemu-libvirt` |
| QEMU | Emulation et virtualisation | Windows, Linux, macOS | 🆕 fait (lot 48) | `13-conteneurs/14-kvm-qemu-libvirt` |
| VirtualBox | Virtualisation poste de travail | Windows, Linux, macOS | ✅ existant | `13-conteneurs/12-virtualbox` |
| UTM | Virtualisation poste de travail | macOS | 🆕 fait (lot 48) | `13-conteneurs/16-utm` |
| GNOME Boxes | Virtualisation poste de travail | Linux | 🆕 fait (lot 48) | `13-conteneurs/14-kvm-qemu-libvirt` |
| libvirt | Gestion des hyperviseurs | Linux | 🆕 fait (lot 48) | `13-conteneurs/14-kvm-qemu-libvirt` |
| oVirt | Gestion de virtualisation | Linux | 🆕 fait (lot 48) | `13-conteneurs/18-ovirt` |
| OpenStack | Cloud privé IaaS | Linux | 🆕 fait (lot 48) | `13-conteneurs/19-openstack` |
| OpenNebula | Cloud et virtualisation | Linux | 🆕 fait (lot 48) | `13-conteneurs/20-opennebula` |
| Apache CloudStack | Cloud IaaS | Linux | 🆕 fait (lot 48) | `13-conteneurs/21-apache-cloudstack` |
| Incus | Conteneurs système et machines virtuelles | Linux | 🆕 fait (lot 48) | `13-conteneurs/17-incus-lxd-lxc` |
| LXD | Conteneurs système et machines virtuelles | Linux | 🆕 fait (lot 48) | `13-conteneurs/17-incus-lxd-lxc` |
| LXC | Conteneurs système | Linux | 🆕 fait (lot 48) | `13-conteneurs/17-incus-lxd-lxc` |
| Docker Engine | Conteneurs | Windows, Linux, macOS (via Desktop/VM) | ✅ existant | `13-conteneurs/01-docker` |
| Podman | Conteneurs | Windows, Linux, macOS | ✅ existant | `13-conteneurs/02-podman` |
| containerd | Runtime de conteneurs | Linux, Windows | ✅ existant | `13-conteneurs/03-containerd` |
| CRI-O | Runtime Kubernetes | Linux | 🆕 fait (lot 48) | `13-conteneurs/22-runtimes-isoles` |
| Kata Containers | Conteneurs isolés | Linux | 🆕 fait (lot 48) | `13-conteneurs/22-runtimes-isoles` |
| Firecracker | MicroVM | Linux | 🆕 fait (lot 48) | `13-conteneurs/22-runtimes-isoles` |
| bhyve | Hyperviseur | FreeBSD | 🆕 fait (lot 48) | `13-conteneurs/23-bhyve` |
| Xen | Hyperviseur | Linux, BSD | 🆕 fait (lot 48) | `13-conteneurs/15-xcp-ng-xen` |
| Bareos | Sauvegarde serveur | Windows, Linux, macOS | 🆕 fait (lot 49) | `19-sauvegarde/08-bareos` |
| FreeBSD | Système d'exploitation serveur | x86, ARM | 🆕 fait (lot 49) | `24-systemes-exploitation/09-bsd` |
| OpenBSD | Système d'exploitation | x86, ARM | 🆕 fait (lot 49) | `24-systemes-exploitation/09-bsd` |
| NetBSD | Système d'exploitation | x86, ARM | 🆕 fait (lot 49) | `24-systemes-exploitation/09-bsd` |
| Debian | Distribution Linux | PC, serveur, ARM | 🆕 fait (lot 49) | `24-systemes-exploitation/01-debian-ubuntu` |
| Ubuntu Server | Distribution Linux serveur | PC, serveur, ARM | 🆕 fait (lot 49) | `24-systemes-exploitation/01-debian-ubuntu` |
| Rocky Linux | Distribution Linux serveur | PC, serveur | 🆕 fait (lot 49) | `24-systemes-exploitation/02-famille-red-hat` |
| AlmaLinux | Distribution Linux serveur | PC, serveur | 🆕 fait (lot 49) | `24-systemes-exploitation/02-famille-red-hat` |
| Fedora Server | Distribution Linux serveur | PC, serveur | 🆕 fait (lot 49) | `24-systemes-exploitation/02-famille-red-hat` |
| openSUSE Leap | Distribution Linux | PC, serveur | 🆕 fait (lot 49) | `24-systemes-exploitation/03-opensuse` |
| openSUSE Tumbleweed | Distribution Linux | PC, serveur | 🆕 fait (lot 49) | `24-systemes-exploitation/03-opensuse` |
| Arch Linux | Distribution Linux | PC, serveur | 🆕 fait (lot 49) | `24-systemes-exploitation/04-arch-linux` |
| Gentoo | Distribution Linux | PC, serveur | 🆕 fait (lot 49) | `24-systemes-exploitation/05-gentoo` |
| Alpine Linux | Distribution Linux légère | PC, serveur, conteneurs | 🆕 fait (lot 49) | `24-systemes-exploitation/06-alpine-linux` |
| Oracle Linux | Distribution Linux serveur | PC, serveur | 🆕 fait (lot 49) | `24-systemes-exploitation/02-famille-red-hat` |
| CentOS Stream | Distribution Linux serveur | PC, serveur | 🆕 fait (lot 49) | `24-systemes-exploitation/02-famille-red-hat` |
| NixOS | Distribution Linux déclarative | PC, serveur | 🆕 fait (lot 49) | `24-systemes-exploitation/07-nixos` |
| Kali Linux | Distribution sécurité | PC, serveur | 🆕 fait (lot 49) | `24-systemes-exploitation/08-kali-parrot` |
| Parrot OS | Distribution sécurité | PC | 🆕 fait (lot 49) | `24-systemes-exploitation/08-kali-parrot` |
| TrueNAS SCALE | NAS et stockage | Linux x86_64 | 🆕 fait (lot 49) | `09-fichiers-partage/21-truenas-scale` |
| OpenMediaVault | NAS | Linux/Debian | 🆕 fait (lot 49) | `09-fichiers-partage/22-openmediavault` |
| Rockstor | NAS | Linux | 🆕 fait (lot 49) | `09-fichiers-partage/23-rockstor` |
| CasaOS | Plateforme serveur domestique | Linux | 🆕 fait (lot 49) | `31-auto-hebergement/01-plateformes-auto-hebergement` |
| Umbrel | Plateforme serveur personnel | Linux | 🆕 fait (lot 49) | `31-auto-hebergement/01-plateformes-auto-hebergement` |
| YunoHost | Plateforme d'auto-hébergement | Debian | 🆕 fait (lot 49) | `31-auto-hebergement/01-plateformes-auto-hebergement` |
| Runtipi | Plateforme d'applications auto-hébergées | Linux | 🆕 fait (lot 49) | `31-auto-hebergement/01-plateformes-auto-hebergement` |
| DietPi | Distribution légère | Linux, SBC | 🆕 fait (lot 49) | `24-systemes-exploitation/10-raspberry-pi-os-dietpi` |
| Raspberry Pi OS | Distribution Linux | Raspberry Pi | 🆕 fait (lot 49) | `24-systemes-exploitation/10-raspberry-pi-os-dietpi` |

## 2. ANNUAIRE, IDENTITE, AUTHENTIFICATION ET SSO — 30/30

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| OpenLDAP | Annuaire LDAP | Windows, Linux, macOS | ✅ existant | `01-annuaire-identite/02-openldap` |
| 389 Directory Server | Annuaire LDAP | Linux | 🆕 fait (lot 50) | `01-annuaire-identite/12-389-directory-server` |
| FreeIPA | Identité et gestion de domaines Linux | Linux | ✅ existant | `01-annuaire-identite/03-freeipa` |
| Samba | Partage SMB et contrôleur de domaine AD compatible | Windows, Linux, macOS | ✅ existant | `09-fichiers-partage/01-samba` |
| Keycloak | IAM, SSO et fédération | Windows, Linux, macOS | ✅ existant | `01-annuaire-identite/05-keycloak` |
| Authentik | IAM et SSO | Windows, Linux, macOS | 🆕 fait (lot 50) | `01-annuaire-identite/13-authentik` |
| Authelia | Portail d'authentification | Windows, Linux, macOS | ✅ existant | `01-annuaire-identite/06-authelia` |
| Kanidm | Annuaire et identité | Linux, macOS | 🆕 fait (lot 50) | `01-annuaire-identite/14-kanidm` |
| Gluu Flex | IAM et SSO | Linux | 🆕 fait (lot 50) | `01-annuaire-identite/19-plateformes-iam` |
| LemonLDAP::NG | Portail SSO | Linux | 🆕 fait (lot 50) | `01-annuaire-identite/15-lemonldap-ng` |
| Shibboleth | Fédération d'identité | Windows, Linux, macOS | 🆕 fait (lot 50) | `01-annuaire-identite/16-shibboleth` |
| privacyIDEA | Authentification multifacteur | Windows, Linux | 🆕 fait (lot 50) | `01-annuaire-identite/17-privacyidea-linotp` |
| LinOTP | Authentification OTP | Linux | 🆕 fait (lot 50) | `01-annuaire-identite/17-privacyidea-linotp` |
| Keycloak Gatekeeper (archivé) | Proxy d'authentification | Linux | ✅ existant | `01-annuaire-identite/05-keycloak` |
| OAuth2 Proxy | Proxy OAuth2/OIDC | Windows, Linux, macOS | 🆕 fait (lot 50) | `01-annuaire-identite/18-oauth2-proxy-dex` |
| Dex | Fournisseur OIDC | Windows, Linux, macOS | 🆕 fait (lot 50) | `01-annuaire-identite/18-oauth2-proxy-dex` |
| Zitadel | IAM (édition open source) | Windows, Linux, macOS | 🆕 fait (lot 50) | `01-annuaire-identite/19-plateformes-iam` |
| Casdoor | Plateforme IAM | Windows, Linux, macOS | 🆕 fait (lot 50) | `01-annuaire-identite/19-plateformes-iam` |
| Logto | Plateforme IAM | Windows, Linux, macOS | 🆕 fait (lot 50) | `01-annuaire-identite/19-plateformes-iam` |
| Ory Kratos | Gestion des identités | Windows, Linux, macOS | 🆕 fait (lot 50) | `01-annuaire-identite/19-plateformes-iam` |
| Ory Hydra | Serveur OAuth2/OIDC | Windows, Linux, macOS | 🆕 fait (lot 50) | `01-annuaire-identite/19-plateformes-iam` |
| OpenAM | IAM | Linux | 🆕 fait (lot 50) | `01-annuaire-identite/19-plateformes-iam` |
| FreeRADIUS | Serveur RADIUS | Windows, Linux, macOS | ✅ existant | `04-aaa/01-freeradius` |
| PacketFence | NAC et contrôle d'accès réseau | Linux | 🆕 fait (lot 50) | `04-aaa/03-packetfence-opennac` |
| OpenNAC | Contrôle d'accès réseau | Linux | 🆕 fait (lot 50) | `04-aaa/03-packetfence-opennac` |
| Authentification SSH OpenSSH | Accès distant sécurisé | Windows, Linux, macOS | ✅ existant | `08-acces-distant-vpn/01-openssh` |
| SSSD | Intégration identité Linux | Linux | 🆕 fait (lot 50) | `01-annuaire-identite/20-sssd-realmd` |
| realmd | Jointure de domaines | Linux | 🆕 fait (lot 50) | `01-annuaire-identite/20-sssd-realmd` |
| Samba AD DC | Contrôleur de domaine | Linux | ✅ existant | `09-fichiers-partage/01-samba` |
| gopass | Gestionnaire de secrets CLI | Windows, Linux, macOS | 🆕 fait (lot 50) | `01-annuaire-identite/21-gopass` |

## 3. DNS, DHCP, IPAM ET SERVICES RESEAU — 49/49

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| BIND 9 | Serveur DNS | Windows, Linux, macOS | ✅ existant | `02-dns/01-bind9` |
| Knot DNS | Serveur DNS autoritatif | Linux, BSD | 🆕 fait (lot 51) | `02-dns/06-knot-nsd-maradns` |
| PowerDNS Authoritative | Serveur DNS autoritatif | Windows, Linux, macOS | ✅ existant | `02-dns/04-powerdns` |
| PowerDNS Recursor | Résolveur DNS | Windows, Linux, macOS | ✅ existant | `02-dns/04-powerdns` |
| Unbound | Résolveur DNS récursif | Windows, Linux, macOS | ✅ existant | `02-dns/02-unbound` |
| CoreDNS | DNS extensible | Windows, Linux, macOS | 🆕 fait (lot 51) | `02-dns/07-coredns` |
| Technitium DNS Server | DNS récursif et autoritatif | Windows, Linux, macOS | 🆕 fait (lot 51) | `02-dns/08-technitium` |
| dnsmasq | DNS/DHCP léger | Linux, macOS, BSD | ✅ existant | `02-dns/03-dnsmasq` |
| AdGuard Home | DNS filtrant | Windows, Linux, macOS | 🆕 fait (lot 51) | `02-dns/09-dns-filtrants` |
| Pi-hole | DNS filtrant | Linux | 🆕 fait (lot 51) | `02-dns/09-dns-filtrants` |
| Blocky | DNS filtrant | Windows, Linux, macOS | 🆕 fait (lot 51) | `02-dns/09-dns-filtrants` |
| MaraDNS | Serveur DNS | Windows, Linux | 🆕 fait (lot 51) | `02-dns/06-knot-nsd-maradns` |
| NSD | Serveur DNS autoritatif | Linux, BSD | 🆕 fait (lot 51) | `02-dns/06-knot-nsd-maradns` |
| Kea DHCP | Serveur DHCP | Linux, BSD | ✅ existant | `03-dhcp/02-kea` |
| ISC DHCP (fin de vie) | Serveur DHCP historique | Linux, BSD | ✅ existant | `03-dhcp/01-isc-dhcp` |
| Open DHCP Server | Serveur DHCP | Windows | 🆕 fait (lot 51) | `03-dhcp/05-open-dhcp-server` |
| dhcpd | Serveur DHCP | Linux, BSD | ✅ existant | `03-dhcp/01-isc-dhcp` |
| Kea Stork | Supervision DHCP/DNS | Linux | 🆕 fait (lot 51) | `03-dhcp/02-kea` |
| phpIPAM | IPAM | Linux, Windows via stack web | 🆕 fait (lot 51) | `18-infrastructure-systeme/09-phpipam` |
| NetBox | IPAM et DCIM | Linux, Windows via conteneurs | 🆕 fait (lot 51) | `18-infrastructure-systeme/08-netbox-nautobot` |
| Nautobot | IPAM et automatisation réseau | Linux, Windows via conteneurs | 🆕 fait (lot 51) | `18-infrastructure-systeme/08-netbox-nautobot` |
| GestióIP | IPAM | Linux | 🆕 fait (lot 51) | `18-infrastructure-systeme/10-ipam-dcim-alternatives` |
| NIPAP | IPAM | Linux | 🆕 fait (lot 51) | `18-infrastructure-systeme/10-ipam-dcim-alternatives` |
| Ralph | DCIM et gestion d'actifs | Linux | 🆕 fait (lot 51) | `18-infrastructure-systeme/10-ipam-dcim-alternatives` |
| RackTables | Gestion datacenter et IP | Linux | 🆕 fait (lot 51) | `18-infrastructure-systeme/10-ipam-dcim-alternatives` |
| OpenWISP | Gestion réseau | Linux | 🆕 fait (lot 51) | `22-constructeurs/29-openwrt-openwisp` |
| OpenWrt | Firmware routeur | Routeurs, x86 | 🆕 fait (lot 51) | `22-constructeurs/29-openwrt-openwisp` |
| OPNsense | Pare-feu/routeur | FreeBSD | ✅ existant | `22-constructeurs/19-pfsense-opnsense` |
| pfSense CE | Pare-feu/routeur | FreeBSD | ✅ existant | `22-constructeurs/19-pfsense-opnsense` |
| VyOS | Routeur logiciel | Linux | 🆕 fait (lot 51) | `22-constructeurs/28-vyos` |
| IPFire | Pare-feu | Linux | 🆕 fait (lot 51) | `22-constructeurs/30-ipfire-endian` |
| Endian Firewall Community | Pare-feu | Linux | 🆕 fait (lot 51) | `22-constructeurs/30-ipfire-endian` |
| FRRouting | Routage BGP/OSPF | Linux, BSD | 🆕 fait (lot 51) | `22-constructeurs/31-routage-logiciel` |
| BIRD | Routage BGP | Linux, BSD | 🆕 fait (lot 51) | `22-constructeurs/31-routage-logiciel` |
| OpenBGPD | Routage BGP | OpenBSD, Linux | 🆕 fait (lot 51) | `22-constructeurs/31-routage-logiciel` |
| OpenVPN | VPN | Windows, Linux, macOS | ✅ existant | `08-acces-distant-vpn/02-openvpn` |
| WireGuard | VPN | Windows, Linux, macOS | ✅ existant | `08-acces-distant-vpn/03-wireguard` |
| strongSwan | VPN IPsec | Linux, Windows | ✅ existant | `08-acces-distant-vpn/04-strongswan` |
| Tailscale (client open source) | VPN mesh | Windows, Linux, macOS | ✅ existant | `08-acces-distant-vpn/05-tailscale-headscale` |
| Headscale | Contrôle VPN mesh auto-hébergé | Linux, Windows, macOS | ✅ existant | `08-acces-distant-vpn/05-tailscale-headscale` |
| NetBird | VPN mesh | Windows, Linux, macOS | 🆕 fait (lot 51) | `08-acces-distant-vpn/11-netbird-nebula` |
| ZeroTier (client open source) | Réseau overlay | Windows, Linux, macOS | ✅ existant | `08-acces-distant-vpn/06-zerotier` |
| Nebula | Réseau overlay | Windows, Linux, macOS | 🆕 fait (lot 51) | `08-acces-distant-vpn/11-netbird-nebula` |
| SoftEther VPN | VPN multi-protocoles | Windows, Linux, macOS | 🆕 fait (lot 51) | `08-acces-distant-vpn/13-softether-pritunl-mullvad` |
| OpenConnect | Client VPN | Windows, Linux, macOS | 🆕 fait (lot 51) | `08-acces-distant-vpn/12-openconnect-ocserv` |
| ocserv | Serveur VPN | Linux | 🆕 fait (lot 51) | `08-acces-distant-vpn/12-openconnect-ocserv` |
| Pritunl (community) | Serveur VPN | Linux | 🆕 fait (lot 51) | `08-acces-distant-vpn/13-softether-pritunl-mullvad` |
| IPsec-tools | VPN IPsec | BSD, Linux | ✅ existant | `08-acces-distant-vpn/04-strongswan` |
| Mullvad VPN app | Client VPN (composants open source) | Windows, Linux, macOS | 🆕 fait (lot 51) | `08-acces-distant-vpn/13-softether-pritunl-mullvad` |

## 4. PROXY, REVERSE PROXY, LOAD BALANCING ET PASSERELLES — 34/34

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| NGINX | Serveur web et reverse proxy | Windows, Linux, macOS | ✨ amélioré | `05-web/03-nginx` |
| HAProxy | Load balancer et proxy | Linux, BSD | ✅ existant | `07-proxy-cache/01-haproxy` |
| Apache HTTP Server | Serveur web | Windows, Linux, macOS | ✨ amélioré | `05-web/02-apache` |
| Caddy | Serveur web et proxy TLS automatique | Windows, Linux, macOS | ✅ existant | `05-web/04-caddy` |
| Traefik Proxy | Reverse proxy | Windows, Linux, macOS | ✅ existant | `07-proxy-cache/04-traefik` |
| Envoy Proxy | Proxy L7 | Windows, Linux, macOS | 🆕 fait (lot 52) | `07-proxy-cache/07-envoy` |
| Varnish Cache | Cache HTTP | Linux, BSD | ✅ existant | `07-proxy-cache/03-varnish` |
| Squid | Proxy cache | Windows, Linux, macOS | ✅ existant | `07-proxy-cache/02-squid` |
| Tinyproxy | Proxy HTTP léger | Linux, BSD | 🆕 fait (lot 52) | `07-proxy-cache/08-tinyproxy-privoxy` |
| Privoxy | Proxy filtrant | Windows, Linux, macOS | 🆕 fait (lot 52) | `07-proxy-cache/08-tinyproxy-privoxy` |
| mitmproxy | Proxy d'inspection HTTP(S) | Windows, Linux, macOS | 🆕 fait (lot 52) | `07-proxy-cache/09-mitmproxy` |
| Apache Traffic Server | Proxy/cache | Linux, BSD | 🆕 fait (lot 52) | `07-proxy-cache/10-apache-traffic-server` |
| ATS | Proxy/cache | Linux, BSD | 🆕 fait (lot 52) | `07-proxy-cache/10-apache-traffic-server` |
| OpenResty | Plateforme NGINX/Lua | Linux, Windows | 🆕 fait (lot 52) | `05-web/12-openresty` |
| H2O | Serveur web HTTP/2/3 | Linux, macOS | 🆕 fait (lot 52) | `05-web/13-lighttpd-h2o-cherokee` |
| Lighttpd | Serveur web léger | Windows, Linux, macOS | 🆕 fait (lot 52) | `05-web/13-lighttpd-h2o-cherokee` |
| Cherokee | Serveur web | Linux, BSD | 🆕 fait (lot 52) | `05-web/13-lighttpd-h2o-cherokee` |
| Kong Gateway OSS | API gateway | Windows, Linux, macOS | 🆕 fait (lot 52) | `07-proxy-cache/11-kong-apisix` |
| Apache APISIX | API gateway | Windows, Linux, macOS | 🆕 fait (lot 52) | `07-proxy-cache/11-kong-apisix` |
| Tyk Gateway (community) | API gateway | Linux, Windows via conteneur | 🆕 fait (lot 52) | `07-proxy-cache/12-passerelles-api-alternatives` |
| KrakenD Community | API gateway | Windows, Linux, macOS | 🆕 fait (lot 52) | `07-proxy-cache/12-passerelles-api-alternatives` |
| Gravitee APIM Community | Gestion API | Linux, Windows via conteneur | 🆕 fait (lot 52) | `07-proxy-cache/12-passerelles-api-alternatives` |
| Zuul | API gateway | Windows, Linux, macOS | 🆕 fait (lot 52) | `07-proxy-cache/12-passerelles-api-alternatives` |
| Ocelot | API gateway .NET | Windows, Linux, macOS | 🆕 fait (lot 52) | `07-proxy-cache/12-passerelles-api-alternatives` |
| YARP | Reverse proxy .NET | Windows, Linux, macOS | 🆕 fait (lot 52) | `07-proxy-cache/12-passerelles-api-alternatives` |
| HAProxy Data Plane API | API de gestion HAProxy | Linux | ✅ existant | `07-proxy-cache/01-haproxy` |
| Keepalived | Haute disponibilité IP | Linux | 🆕 fait (lot 52) | `07-proxy-cache/13-keepalived-lvs` |
| LVS | Load balancing L4 | Linux | 🆕 fait (lot 52) | `07-proxy-cache/13-keepalived-lvs` |
| Pen | Load balancer | Linux, BSD | 🆕 fait (lot 52) | `07-proxy-cache/13-keepalived-lvs` |
| Balance | Load balancer TCP | Linux, BSD | 🆕 fait (lot 52) | `07-proxy-cache/13-keepalived-lvs` |
| PgBouncer | Pooler PostgreSQL | Windows, Linux, macOS | 🆕 fait (lot 52) | `07-proxy-cache/14-proxys-bases-de-donnees` |
| ProxySQL | Proxy MySQL | Linux | 🆕 fait (lot 52) | `07-proxy-cache/14-proxys-bases-de-donnees` |
| MaxScale (édition communautaire) | Proxy MariaDB | Linux | 🆕 fait (lot 52) | `07-proxy-cache/14-proxys-bases-de-donnees` |
| Odyssey | Pooler PostgreSQL | Linux | 🆕 fait (lot 52) | `07-proxy-cache/14-proxys-bases-de-donnees` |

## 5. SERVEURS WEB, LANGAGES ET RUNTIMES — 41/41

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| PHP | Runtime PHP | Windows, Linux, macOS | ✨ amélioré (lot agent-2026-11-02) | `05-web/05-php-fpm` |
| Node.js | Runtime JavaScript | Windows, Linux, macOS | ✅ existant | `05-web/06-nodejs` |
| Deno | Runtime JavaScript/TypeScript | Windows, Linux, macOS | 🆕 fait (lot agent-2026-11-02) | `05-web/14-deno` |
| Bun | Runtime JavaScript | Windows, Linux, macOS | 🆕 fait (lot 53) | `05-web/15-bun` |
| Python | Langage et runtime | Windows, Linux, macOS | ✅ existant | `05-web/07-python` |
| Ruby | Langage et runtime | Windows, Linux, macOS | ✅ existant | `05-web/08-ruby` |
| Go | Langage et runtime | Windows, Linux, macOS | 🆕 fait (lot 53) | `05-web/16-go` |
| Rust | Langage et toolchain | Windows, Linux, macOS | 🆕 fait (lot 53) | `05-web/17-rust` |
| OpenJDK | Runtime Java | Windows, Linux, macOS | ✅ existant | `05-web/09-openjdk` |
| Eclipse Temurin | Distribution OpenJDK | Windows, Linux, macOS | ✨ amélioré (lot 53) | `05-web/09-openjdk` |
| GraalVM Community Edition | Runtime polyglotte | Windows, Linux, macOS | 🆕 fait (lot 53) | `05-web/09-openjdk` |
| .NET SDK | Runtime et SDK .NET | Windows, Linux, macOS | 🆕 fait (lot 53) | `05-web/18-dotnet-mono` |
| Mono | Runtime .NET historique | Windows, Linux, macOS | 🆕 fait (lot 53) | `05-web/18-dotnet-mono` |
| PowerShell | Shell et automatisation | Windows, Linux, macOS | 🆕 fait (lot 53) | `05-web/19-powershell` |
| Perl | Langage et runtime | Windows, Linux, macOS | 🆕 fait (lot 53) | `05-web/20-perl-lua` |
| Lua | Langage embarqué | Windows, Linux, macOS | 🆕 fait (lot 53) | `05-web/20-perl-lua` |
| Erlang/OTP | Runtime Erlang | Windows, Linux, macOS | 🆕 fait (lot 53) | `05-web/21-erlang-elixir` |
| Elixir | Langage BEAM | Windows, Linux, macOS | 🆕 fait (lot 53) | `05-web/21-erlang-elixir` |
| GCC | Compilateur | Windows, Linux, macOS | 🆕 fait (lot 53) | `30-developpement-api/01-gcc-clang` |
| Clang/LLVM | Compilateur | Windows, Linux, macOS | 🆕 fait (lot 53) | `30-developpement-api/01-gcc-clang` |
| CMake | Build system | Windows, Linux, macOS | 🆕 fait (lot 53) | `30-developpement-api/02-cmake-ninja-meson` |
| Ninja | Build system | Windows, Linux, macOS | 🆕 fait (lot 53) | `30-developpement-api/02-cmake-ninja-meson` |
| Meson | Build system | Windows, Linux, macOS | 🆕 fait (lot 53) | `30-developpement-api/02-cmake-ninja-meson` |
| Apache Tomcat | Serveur Java | Windows, Linux, macOS | ✅ existant | `05-web/10-tomcat` |
| Eclipse Jetty | Serveur Java | Windows, Linux, macOS | 🆕 fait (lot 53) | `05-web/22-serveurs-jakarta-ee` |
| WildFly | Serveur d'applications Java | Windows, Linux, macOS | ✅ existant | `05-web/11-wildfly` |
| Payara Community | Serveur Jakarta EE | Windows, Linux, macOS | 🆕 fait (lot 53) | `05-web/22-serveurs-jakarta-ee` |
| Open Liberty | Serveur Java | Windows, Linux, macOS | 🆕 fait (lot 53) | `05-web/22-serveurs-jakarta-ee` |
| GlassFish | Serveur Jakarta EE | Windows, Linux, macOS | 🆕 fait (lot 53) | `05-web/22-serveurs-jakarta-ee` |
| Jenkins | Automatisation CI/CD | Windows, Linux, macOS | ✅ existant | `14-devops/05-jenkins` |
| Buildbot | Automatisation build | Windows, Linux, macOS | 🆕 fait (lot 53) | `14-devops/08-buildbot-gocd` |
| Concourse CI | CI/CD | Linux, Windows via workers | 🆕 fait (lot 53) | `14-devops/10-concourse` |
| GoCD | CI/CD | Windows, Linux, macOS | 🆕 fait (lot 53) | `14-devops/08-buildbot-gocd` |
| Woodpecker CI | CI/CD | Windows, Linux, macOS | 🆕 fait (lot 53) | `14-devops/09-woodpecker-drone` |
| Drone CI (community) | CI/CD | Linux | 🆕 fait (lot 53) | `14-devops/09-woodpecker-drone` |
| Tekton | Pipelines Kubernetes | Linux | 🆕 fait (lot 53) | `14-devops/11-tekton-argo-workflows` |
| Argo Workflows | Workflows Kubernetes | Linux | 🆕 fait (lot 53) | `14-devops/11-tekton-argo-workflows` |
| Dagger | Pipelines programmables | Windows, Linux, macOS | 🆕 fait (lot 53) | `14-devops/12-dagger-earthly` |
| Earthly | Build reproductibles | Windows, Linux, macOS | 🆕 fait (lot 53) | `14-devops/12-dagger-earthly` |
| Task | Task runner | Windows, Linux, macOS | 🆕 fait (lot 53) | `30-developpement-api/03-task-just` |
| Just | Task runner | Windows, Linux, macOS | 🆕 fait (lot 53) | `30-developpement-api/03-task-just` |

## 6. BASES DE DONNEES SQL ET NOSQL — 64/64

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| PostgreSQL | Base SQL | Windows, Linux, macOS | ✅ existant | `11-bases-de-donnees/02-postgresql` |
| MariaDB Server | Base SQL | Windows, Linux, macOS | ✅ existant | `11-bases-de-donnees/01-mariadb-mysql` |
| MySQL Community Server | Base SQL | Windows, Linux, macOS | ✅ existant | `11-bases-de-donnees/01-mariadb-mysql` |
| SQLite | Base SQL embarquée | Windows, Linux, macOS | ✅ existant | `11-bases-de-donnees/06-sqlite` |
| Firebird | Base SQL | Windows, Linux, macOS | 🆕 fait (lot 54) | `11-bases-de-donnees/10-firebird` |
| DuckDB | Base analytique embarquée | Windows, Linux, macOS | 🆕 fait (lot 54) | `11-bases-de-donnees/11-duckdb` |
| CockroachDB | Base SQL distribuée | Windows, Linux, macOS | 🆕 fait (lot 54) | `11-bases-de-donnees/12-sql-distribue` |
| YugabyteDB | Base SQL distribuée | Linux, macOS | 🆕 fait (lot 54) | `11-bases-de-donnees/12-sql-distribue` |
| TiDB | Base SQL distribuée | Linux | 🆕 fait (lot 54) | `11-bases-de-donnees/12-sql-distribue` |
| Citus | Extension PostgreSQL distribuée | Linux, Windows via PostgreSQL | 🆕 fait (lot 54) | `11-bases-de-donnees/13-extensions-postgresql` |
| TimescaleDB | Base time-series PostgreSQL | Linux, macOS | 🆕 fait (lot 54) | `11-bases-de-donnees/13-extensions-postgresql` |
| QuestDB | Base time-series | Windows, Linux, macOS | 🆕 fait (lot 54) | `11-bases-de-donnees/14-questdb` |
| InfluxDB OSS | Base time-series | Windows, Linux, macOS | ✅ existant | `06-supervision/10-influxdb` |
| Apache Cassandra | Base NoSQL wide-column | Windows, Linux, macOS | 🆕 fait (lot 54) | `11-bases-de-donnees/15-cassandra-scylladb` |
| ScyllaDB | Base NoSQL wide-column | Linux | 🆕 fait (lot 54) | `11-bases-de-donnees/15-cassandra-scylladb` |
| MongoDB Community Server | Base documentaire | Windows, Linux, macOS | ✅ existant | `11-bases-de-donnees/03-mongodb` |
| FerretDB | Compatibilité MongoDB | Linux, Windows, macOS | 🆕 fait (lot 54) | `11-bases-de-donnees/16-bases-documentaires` |
| CouchDB | Base documentaire | Windows, Linux, macOS | ✅ existant | `11-bases-de-donnees/07-couchdb` |
| Couchbase Community | Base NoSQL | Linux, Windows | 🆕 fait (lot 54) | `11-bases-de-donnees/16-bases-documentaires` |
| RavenDB Community | Base documentaire | Windows, Linux, macOS | 🆕 fait (lot 54) | `11-bases-de-donnees/16-bases-documentaires` |
| RethinkDB | Base documentaire temps réel | Linux, macOS | 🆕 fait (lot 54) | `11-bases-de-donnees/16-bases-documentaires` |
| Redis | Base clé-valeur | Windows via WSL/containers, Linux, macOS | ✅ existant | `11-bases-de-donnees/04-redis` |
| Valkey | Base clé-valeur | Windows via WSL/containers, Linux, macOS | ✅ existant | `11-bases-de-donnees/04-redis` |
| KeyDB | Base clé-valeur | Linux, macOS | 🆕 fait (lot 54) | `11-bases-de-donnees/17-keydb-dragonfly` |
| Dragonfly | Base clé-valeur | Linux | 🆕 fait (lot 54) | `11-bases-de-donnees/17-keydb-dragonfly` |
| Memcached | Cache clé-valeur | Windows, Linux, macOS | ✅ existant | `11-bases-de-donnees/05-memcached` |
| etcd | Base clé-valeur distribuée | Windows, Linux, macOS | 🆕 fait (lot 54) | `11-bases-de-donnees/18-etcd-consul` |
| Consul | Store clé-valeur et découverte | Windows, Linux, macOS | 🆕 fait (lot 54) | `11-bases-de-donnees/18-etcd-consul` |
| FoundationDB | Base clé-valeur distribuée | Windows, Linux, macOS | 🆕 fait (lot 54) | `11-bases-de-donnees/19-foundationdb` |
| BadgerDB | Base clé-valeur embarquée | Windows, Linux, macOS | 🆕 fait (lot 54) | `11-bases-de-donnees/20-moteurs-embarques` |
| RocksDB | Moteur clé-valeur embarqué | Windows, Linux, macOS | 🆕 fait (lot 54) | `11-bases-de-donnees/20-moteurs-embarques` |
| LevelDB | Moteur clé-valeur embarqué | Windows, Linux, macOS | 🆕 fait (lot 54) | `11-bases-de-donnees/20-moteurs-embarques` |
| LMDB | Base clé-valeur embarquée | Windows, Linux, macOS | 🆕 fait (lot 54) | `11-bases-de-donnees/20-moteurs-embarques` |
| SurrealDB | Base multi-modèle | Windows, Linux, macOS | 🆕 fait (lot 54) | `11-bases-de-donnees/21-multi-modeles` |
| ArangoDB Community | Base multi-modèle | Windows, Linux, macOS | 🆕 fait (lot 54) | `11-bases-de-donnees/21-multi-modeles` |
| OrientDB | Base graphe/document | Windows, Linux, macOS | 🆕 fait (lot 54) | `11-bases-de-donnees/21-multi-modeles` |
| Neo4j Community | Base graphe | Windows, Linux, macOS | ✅ existant | `11-bases-de-donnees/09-neo4j` |
| Memgraph | Base graphe | Linux, macOS | 🆕 fait (lot 54) | `11-bases-de-donnees/22-bases-graphes` |
| JanusGraph | Base graphe | Windows, Linux, macOS | 🆕 fait (lot 54) | `11-bases-de-donnees/22-bases-graphes` |
| Apache AGE | Extension graphe PostgreSQL | Linux | 🆕 fait (lot 54) | `11-bases-de-donnees/13-extensions-postgresql` |
| Dgraph | Base graphe | Windows, Linux, macOS | 🆕 fait (lot 54) | `11-bases-de-donnees/22-bases-graphes` |
| TerminusDB | Base graphe/document | Windows, Linux, macOS | 🆕 fait (lot 55) | `11-bases-de-donnees/23-terminusdb-xtdb` |
| XTDB | Base bitemporelle | Windows, Linux, macOS | 🆕 fait (lot 55) | `11-bases-de-donnees/23-terminusdb-xtdb` |
| Apache Doris | Entrepôt analytique | Linux | 🆕 fait (lot 55) | `11-bases-de-donnees/25-olap-temps-reel` |
| ClickHouse | Base analytique colonne | Linux, macOS | 🆕 fait (lot 55) | `11-bases-de-donnees/24-clickhouse` |
| Apache Pinot | Base analytique temps réel | Linux | 🆕 fait (lot 55) | `11-bases-de-donnees/25-olap-temps-reel` |
| Apache Druid | Base analytique temps réel | Linux, macOS | 🆕 fait (lot 55) | `11-bases-de-donnees/25-olap-temps-reel` |
| Trino | Moteur SQL distribué | Windows, Linux, macOS | 🆕 fait (lot 55) | `11-bases-de-donnees/26-moteurs-sql-federes` |
| Presto | Moteur SQL distribué | Linux, macOS | 🆕 fait (lot 55) | `11-bases-de-donnees/26-moteurs-sql-federes` |
| Apache Hive | Entrepôt SQL Hadoop | Linux | 🆕 fait (lot 55) | `11-bases-de-donnees/27-ecosysteme-hadoop` |
| Apache HBase | Base NoSQL Hadoop | Linux | 🆕 fait (lot 55) | `11-bases-de-donnees/27-ecosysteme-hadoop` |
| Apache Kudu | Stockage analytique | Linux | 🆕 fait (lot 55) | `11-bases-de-donnees/27-ecosysteme-hadoop` |
| Greenplum Database | Base analytique MPP | Linux | 🆕 fait (lot 55) | `11-bases-de-donnees/28-greenplum-monetdb` |
| MonetDB | Base analytique colonne | Windows, Linux, macOS | 🆕 fait (lot 55) | `11-bases-de-donnees/28-greenplum-monetdb` |
| DuckDB extensions | Extensions analytiques | Windows, Linux, macOS | 🆕 fait (lot 54) | `11-bases-de-donnees/11-duckdb` |
| Apache Drill | Moteur SQL | Linux, macOS | 🆕 fait (lot 55) | `11-bases-de-donnees/26-moteurs-sql-federes` |
| Apache Ignite | Base distribuée en mémoire | Windows, Linux, macOS | 🆕 fait (lot 55) | `11-bases-de-donnees/29-grilles-memoire` |
| Hazelcast | In-memory data grid | Windows, Linux, macOS | 🆕 fait (lot 55) | `11-bases-de-donnees/29-grilles-memoire` |
| Apache Geode | Base distribuée en mémoire | Windows, Linux, macOS | 🆕 fait (lot 55) | `11-bases-de-donnees/29-grilles-memoire` |
| VoltDB Community | Base SQL en mémoire | Linux | 🆕 fait (lot 55) | `11-bases-de-donnees/29-grilles-memoire` |
| H2 Database | Base SQL Java | Windows, Linux, macOS | 🆕 fait (lot 55) | `11-bases-de-donnees/30-bases-java-embarquees` |
| HSQLDB | Base SQL Java | Windows, Linux, macOS | 🆕 fait (lot 55) | `11-bases-de-donnees/30-bases-java-embarquees` |
| Derby | Base SQL Java | Windows, Linux, macOS | 🆕 fait (lot 55) | `11-bases-de-donnees/30-bases-java-embarquees` |
| Realm (community components) | Base embarquée mobile | Windows, macOS, Linux | 🆕 fait (lot 55) | `11-bases-de-donnees/30-bases-java-embarquees` |

## 7. STOCKAGE, NAS, OBJET, FICHIERS ET SAUVEGARDE — 47/47

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| MinIO (community source) | Stockage objet S3 | Linux, Windows via conteneur | ✅ existant | `09-fichiers-partage/07-minio` |
| Ceph | Stockage distribué | Linux | 🆕 fait (lot 56) | `09-fichiers-partage/24-ceph` |
| GlusterFS | Système de fichiers distribué | Linux | 🆕 fait (lot 56) | `09-fichiers-partage/25-glusterfs` |
| Lustre | Système de fichiers parallèle | Linux | 🆕 fait (lot 56) | `09-fichiers-partage/26-lustre-beegfs` |
| BeeGFS | Système de fichiers parallèle | Linux | 🆕 fait (lot 56) | `09-fichiers-partage/26-lustre-beegfs` |
| OpenZFS | Système de fichiers et volumes | Linux, FreeBSD, macOS | 🆕 fait (lot 56) | `09-fichiers-partage/27-openzfs` |
| Btrfs | Système de fichiers | Linux | 🆕 fait (lot 56) | `09-fichiers-partage/28-btrfs-xfs` |
| XFS | Système de fichiers | Linux | 🆕 fait (lot 56) | `09-fichiers-partage/28-btrfs-xfs` |
| LVM2 | Gestion volumes logiques | Linux | 🆕 fait (lot 56) | `09-fichiers-partage/29-lvm-mdadm` |
| mdadm | RAID logiciel | Linux | 🆕 fait (lot 56) | `09-fichiers-partage/29-lvm-mdadm` |
| mergerfs | Fusion de systèmes de fichiers | Linux | 🆕 fait (lot 56) | `09-fichiers-partage/30-mergerfs-snapraid` |
| SnapRAID | Protection de données | Windows, Linux, macOS | 🆕 fait (lot 56) | `09-fichiers-partage/30-mergerfs-snapraid` |
| NFS-Ganesha | Serveur NFS | Linux | ✅ existant | `09-fichiers-partage/02-nfs` |
| OpenAFS | Système de fichiers distribué | Windows, Linux, macOS | 🆕 fait (lot 56) | `09-fichiers-partage/31-openafs` |
| SeaweedFS | Stockage distribué | Windows, Linux, macOS | 🆕 fait (lot 56) | `09-fichiers-partage/32-stockage-objet` |
| Garage | Stockage objet S3 | Linux, macOS | 🆕 fait (lot 56) | `09-fichiers-partage/32-stockage-objet` |
| OpenIO | Stockage objet | Linux | 🆕 fait (lot 56) | `09-fichiers-partage/32-stockage-objet` |
| OpenStack Swift | Stockage objet | Linux | 🆕 fait (lot 56) | `09-fichiers-partage/32-stockage-objet` |
| Rook | Orchestration stockage Kubernetes | Linux | 🆕 fait (lot 56) | `09-fichiers-partage/33-stockage-kubernetes` |
| Longhorn | Stockage persistant Kubernetes | Linux | 🆕 fait (lot 56) | `09-fichiers-partage/33-stockage-kubernetes` |
| OpenEBS | Stockage Kubernetes | Linux | 🆕 fait (lot 56) | `09-fichiers-partage/33-stockage-kubernetes` |
| LINSTOR | Stockage bloc distribué | Linux | 🆕 fait (lot 56) | `09-fichiers-partage/34-drbd-linstor` |
| DRBD | Réplication bloc | Linux | 🆕 fait (lot 56) | `09-fichiers-partage/34-drbd-linstor` |
| Restic | Sauvegarde | Windows, Linux, macOS | ✅ existant | `19-sauvegarde/01-restic` |
| BorgBackup | Sauvegarde dédupliquée | Linux, macOS | ✅ existant | `19-sauvegarde/02-borgbackup` |
| Kopia | Sauvegarde | Windows, Linux, macOS | 🆕 fait (lot 56) | `19-sauvegarde/09-kopia` |
| Duplicati | Sauvegarde | Windows, Linux, macOS | 🆕 fait (lot 56) | `19-sauvegarde/10-duplicati` |
| UrBackup | Sauvegarde client/serveur | Windows, Linux | ✅ existant | `19-sauvegarde/04-urbackup` |
| Bacula Community | Sauvegarde réseau | Windows, Linux, macOS | ✅ existant | `19-sauvegarde/03-bacula` |
| Amanda | Sauvegarde réseau | Linux, Unix | 🆕 fait (lot 56) | `19-sauvegarde/11-amanda` |
| rdiff-backup | Sauvegarde incrémentale | Windows, Linux, macOS | 🆕 fait (lot 56) | `19-sauvegarde/12-rdiff-backup-rsnapshot` |
| rsnapshot | Sauvegarde snapshots | Linux, macOS | 🆕 fait (lot 56) | `19-sauvegarde/12-rdiff-backup-rsnapshot` |
| Rsync | Synchronisation fichiers | Windows, Linux, macOS | 🆕 fait (lot 56) | `09-fichiers-partage/35-rsync-rclone` |
| Rclone | Synchronisation stockage cloud | Windows, Linux, macOS | 🆕 fait (lot 56) | `09-fichiers-partage/35-rsync-rclone` |
| Syncthing | Synchronisation P2P | Windows, Linux, macOS | ✅ existant | `09-fichiers-partage/11-syncthing` |
| Seafile Community | Synchronisation fichiers | Windows, Linux, macOS | ✅ existant | `09-fichiers-partage/10-seafile` |
| Nextcloud | Cloud de fichiers | Windows, Linux, macOS (serveur Linux recommandé) | ✅ existant | `09-fichiers-partage/08-nextcloud` |
| ownCloud Infinite Scale | Cloud de fichiers | Windows, Linux, macOS | ✅ existant | `09-fichiers-partage/09-owncloud` |
| File Browser | Interface web fichiers | Windows, Linux, macOS | 🆕 fait (lot 56) | `09-fichiers-partage/36-interfaces-web-fichiers` |
| SFTPGo | Serveur SFTP/FTP/WebDAV | Windows, Linux, macOS | 🆕 fait (lot 56) | `09-fichiers-partage/36-interfaces-web-fichiers` |
| OpenSSH SFTP | Transfert sécurisé | Windows, Linux, macOS | ✅ existant | `08-acces-distant-vpn/01-openssh` |
| WebDAV (Apache mod_dav) | Partage WebDAV | Windows, Linux, macOS | ✅ existant | `09-fichiers-partage/12-webdav` |
| Pydio Cells | Partage et collaboration fichiers | Linux, Windows via conteneur | 🆕 fait (lot 56) | `09-fichiers-partage/37-partage-collaboration` |
| Cozy Cloud | Cloud personnel | Linux | 🆕 fait (lot 56) | `09-fichiers-partage/37-partage-collaboration` |
| Filestash | Interface multi-stockage | Windows, Linux, macOS | 🆕 fait (lot 56) | `09-fichiers-partage/36-interfaces-web-fichiers` |
| ProjectSend | Partage de fichiers | Linux | 🆕 fait (lot 56) | `09-fichiers-partage/37-partage-collaboration` |
| Pingvin Share | Partage temporaire | Linux, Windows via conteneur | 🆕 fait (lot 56) | `09-fichiers-partage/37-partage-collaboration` |

## 8. CONTENEURS, ORCHESTRATION ET PLATEFORMES CLOUD-NATIVE — 61/61

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| Kubernetes | Orchestration conteneurs | Linux, Windows nodes | ✅ existant | `13-conteneurs/04-kubernetes` |
| K3s | Kubernetes léger | Linux, Windows via WSL/VM | ✅ existant | `13-conteneurs/05-k3s` |
| MicroK8s | Kubernetes léger | Linux, Windows via WSL, macOS | 🆕 fait (lot 57) | `13-conteneurs/24-microk8s-k0s` |
| Minikube | Kubernetes local | Windows, Linux, macOS | ✅ existant | `13-conteneurs/06-minikube` |
| kind | Kubernetes en Docker | Windows, Linux, macOS | ✅ existant | `13-conteneurs/07-kind` |
| k0s | Kubernetes léger | Linux | 🆕 fait (lot 57) | `13-conteneurs/24-microk8s-k0s` |
| Talos Linux | OS Kubernetes | x86, ARM | 🆕 fait (lot 57) | `13-conteneurs/25-talos-linux` |
| RKE2 | Kubernetes durci | Linux | 🆕 fait (lot 57) | `13-conteneurs/26-rke2-rancher` |
| OpenShift OKD | Plateforme Kubernetes | Linux | 🆕 fait (lot 57) | `13-conteneurs/27-openshift-okd` |
| KubeVirt | VM sur Kubernetes | Linux | 🆕 fait (lot 57) | `13-conteneurs/28-kubevirt` |
| Helm | Gestionnaire de packages Kubernetes | Windows, Linux, macOS | 🆕 fait (lot 57) | `13-conteneurs/29-helm-kustomize` |
| Kustomize | Configuration Kubernetes | Windows, Linux, macOS | 🆕 fait (lot 57) | `13-conteneurs/29-helm-kustomize` |
| Argo CD | GitOps Kubernetes | Linux | 🆕 fait (lot 57) | `13-conteneurs/30-gitops-argocd-flux` |
| Flux CD | GitOps Kubernetes | Linux | 🆕 fait (lot 57) | `13-conteneurs/30-gitops-argocd-flux` |
| Rancher | Gestion Kubernetes | Linux, Windows via conteneur | 🆕 fait (lot 57) | `13-conteneurs/26-rke2-rancher` |
| Portainer CE | Gestion conteneurs | Windows, Linux, macOS | ✅ existant | `13-conteneurs/08-portainer` |
| Lens Open Source | IDE Kubernetes | Windows, Linux, macOS | 🆕 fait (lot 57) | `13-conteneurs/31-lens-headlamp-k9s` |
| Headlamp | Dashboard Kubernetes | Windows, Linux, macOS | 🆕 fait (lot 57) | `13-conteneurs/31-lens-headlamp-k9s` |
| K9s | Terminal Kubernetes | Windows, Linux, macOS | 🆕 fait (lot 57) | `13-conteneurs/31-lens-headlamp-k9s` |
| Skaffold | Développement Kubernetes | Windows, Linux, macOS | 🆕 fait (lot 57) | `13-conteneurs/32-developpement-kubernetes` |
| Tilt | Développement Kubernetes | Windows, Linux, macOS | 🆕 fait (lot 57) | `13-conteneurs/32-developpement-kubernetes` |
| Garden | Développement Kubernetes | Windows, Linux, macOS | 🆕 fait (lot 57) | `13-conteneurs/32-developpement-kubernetes` |
| Telepresence | Développement Kubernetes | Windows, Linux, macOS | 🆕 fait (lot 57) | `13-conteneurs/32-developpement-kubernetes` |
| Dapr | Runtime applicatif distribué | Windows, Linux, macOS | 🆕 fait (lot 58) | `13-conteneurs/33-dapr` |
| Knative | Serverless Kubernetes | Linux | 🆕 fait (lot 58) | `13-conteneurs/34-serverless-keda` |
| OpenFaaS | Serverless | Linux, Windows via conteneur | 🆕 fait (lot 58) | `13-conteneurs/34-serverless-keda` |
| Fission | Serverless Kubernetes | Linux | 🆕 fait (lot 58) | `13-conteneurs/34-serverless-keda` |
| KEDA | Autoscaling événementiel | Linux | 🆕 fait (lot 58) | `13-conteneurs/34-serverless-keda` |
| Crossplane | Control plane cloud | Linux | 🆕 fait (lot 58) | `13-conteneurs/35-crossplane-cluster-api` |
| Cluster API | Gestion cycle de vie clusters | Linux | 🆕 fait (lot 58) | `13-conteneurs/35-crossplane-cluster-api` |
| MetalLB | Load balancer Kubernetes | Linux | 🆕 fait (lot 58) | `13-conteneurs/37-ingress-certificats-dns` |
| Cilium | Réseau et sécurité Kubernetes | Linux | 🆕 fait (lot 58) | `13-conteneurs/36-reseau-cni` |
| Calico | Réseau Kubernetes | Linux | 🆕 fait (lot 58) | `13-conteneurs/36-reseau-cni` |
| Flannel | Réseau Kubernetes | Linux | 🆕 fait (lot 58) | `13-conteneurs/36-reseau-cni` |
| Weave Net | Réseau Kubernetes | Linux | 🆕 fait (lot 58) | `13-conteneurs/36-reseau-cni` |
| Multus | Réseaux multiples Kubernetes | Linux | 🆕 fait (lot 58) | `13-conteneurs/36-reseau-cni` |
| Gateway API | API réseau Kubernetes | Linux | 🆕 fait (lot 58) | `13-conteneurs/37-ingress-certificats-dns` |
| Contour | Ingress Kubernetes | Linux | 🆕 fait (lot 58) | `13-conteneurs/37-ingress-certificats-dns` |
| NGINX Ingress Controller | Ingress Kubernetes | Linux | 🆕 fait (lot 58) | `13-conteneurs/37-ingress-certificats-dns` |
| Traefik | Ingress Kubernetes | Windows, Linux, macOS | ✅ existant | `07-proxy-cache/04-traefik` |
| cert-manager | Certificats Kubernetes | Linux | 🆕 fait (lot 58) | `13-conteneurs/37-ingress-certificats-dns` |
| ExternalDNS | DNS Kubernetes | Linux | 🆕 fait (lot 58) | `13-conteneurs/37-ingress-certificats-dns` |
| Velero | Sauvegarde Kubernetes | Linux | 🆕 fait (lot 58) | `13-conteneurs/38-velero-kanister` |
| Kanister | Protection données Kubernetes | Linux | 🆕 fait (lot 58) | `13-conteneurs/38-velero-kanister` |
| Kube-bench | Audit CIS Kubernetes | Linux | 🆕 fait (lot 58) | `13-conteneurs/39-securite-kubernetes` |
| Kubescape | Sécurité Kubernetes | Windows, Linux, macOS | 🆕 fait (lot 58) | `13-conteneurs/39-securite-kubernetes` |
| Trivy | Scanner vulnérabilités | Windows, Linux, macOS | 🆕 fait (lot 58) | `13-conteneurs/39-securite-kubernetes` |
| Falco | Détection runtime | Linux | 🆕 fait (lot 58) | `13-conteneurs/39-securite-kubernetes` |
| Kyverno | Politiques Kubernetes | Linux | 🆕 fait (lot 58) | `13-conteneurs/40-politiques-opa-kyverno` |
| OPA Gatekeeper | Politiques Kubernetes | Linux | 🆕 fait (lot 58) | `13-conteneurs/40-politiques-opa-kyverno` |
| Open Policy Agent | Moteur de politiques | Windows, Linux, macOS | 🆕 fait (lot 58) | `13-conteneurs/40-politiques-opa-kyverno` |
| Buildah | Construction images | Linux, Windows via WSL | 🆕 fait (lot 58) | `13-conteneurs/41-outils-images` |
| Skopeo | Gestion images conteneurs | Linux, macOS | 🆕 fait (lot 58) | `13-conteneurs/41-outils-images` |
| Dive | Analyse images Docker | Windows, Linux, macOS | 🆕 fait (lot 58) | `13-conteneurs/41-outils-images` |
| Hadolint | Lint Dockerfile | Windows, Linux, macOS | 🆕 fait (lot 58) | `13-conteneurs/41-outils-images` |
| Dockle | Audit images conteneurs | Windows, Linux, macOS | 🆕 fait (lot 58) | `13-conteneurs/41-outils-images` |
| Docker Compose | Orchestration locale | Windows, Linux, macOS | ✅ existant | `13-conteneurs/01-docker` |
| Podman Compose | Orchestration locale | Windows, Linux, macOS | ✅ existant | `13-conteneurs/02-podman` |
| Kompose | Conversion Compose/Kubernetes | Windows, Linux, macOS | 🆕 fait (lot 58) | `13-conteneurs/41-outils-images` |
| Packer | Création images machines | Windows, Linux, macOS | 🆕 fait (lot 58) | `13-conteneurs/42-packer-vagrant` |
| Vagrant | Environnements reproductibles | Windows, Linux, macOS | 🆕 fait (lot 58) | `13-conteneurs/42-packer-vagrant` |

## 9. SUPERVISION, METRIQUES, LOGS ET OBSERVABILITE — 64/64

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| Prometheus | Métriques et alertes | Windows, Linux, macOS | ✅ existant | `06-supervision/02-prometheus` |
| Grafana OSS | Dashboards | Windows, Linux, macOS | ✅ existant | `06-supervision/03-grafana` |
| VictoriaMetrics | Base métriques | Windows, Linux, macOS | 🆕 fait (lot 59) | `06-supervision/13-stockage-metriques-long-terme` |
| Thanos | Stockage long terme Prometheus | Linux | 🆕 fait (lot 59) | `06-supervision/13-stockage-metriques-long-terme` |
| Mimir | Stockage métriques | Linux | 🆕 fait (lot 59) | `06-supervision/13-stockage-metriques-long-terme` |
| Cortex | Stockage métriques | Linux | 🆕 fait (lot 59) | `06-supervision/13-stockage-metriques-long-terme` |
| Alertmanager | Gestion alertes | Windows, Linux, macOS | ✅ existant (lot 59) | `06-supervision/02-prometheus` |
| Zabbix | Supervision infrastructure | Windows, Linux, macOS | ✅ existant | `06-supervision/04-zabbix` |
| Icinga 2 | Supervision | Windows, Linux, macOS | ✅ existant | `06-supervision/06-icinga` |
| Nagios Core | Supervision | Linux | ✅ existant | `06-supervision/05-nagios` |
| Checkmk Raw | Supervision | Linux | ✅ existant | `06-supervision/08-checkmk` |
| LibreNMS | Supervision réseau | Linux | 🆕 fait (lot 59) | `06-supervision/14-supervision-reseau-snmp` |
| Observium Community | Supervision réseau | Linux | 🆕 fait (lot 59) | `06-supervision/14-supervision-reseau-snmp` |
| OpenNMS Horizon | Supervision réseau | Linux | 🆕 fait (lot 59) | `06-supervision/14-supervision-reseau-snmp` |
| Netdata | Supervision temps réel | Windows, Linux, macOS | ✅ existant | `06-supervision/07-netdata` |
| Glances | Supervision système | Windows, Linux, macOS | 🆕 fait (lot 59) | `06-supervision/15-glances-cockpit` |
| Cockpit | Administration serveur | Linux | 🆕 fait (lot 59) | `06-supervision/15-glances-cockpit` |
| NetXMS | Supervision réseau | Windows, Linux | 🆕 fait (lot 59) | `06-supervision/14-supervision-reseau-snmp` |
| Centreon Open Source | Supervision | Linux | ✅ existant | `06-supervision/01-centreon` |
| Prometheus Node Exporter | Export métriques système | Windows, Linux, macOS | ✅ existant | `06-supervision/02-prometheus` |
| windows_exporter | Export métriques Windows | Windows | ✅ existant (lot 59) | `06-supervision/02-prometheus` |
| Telegraf | Collecteur métriques | Windows, Linux, macOS | ✅ existant | `06-supervision/09-telegraf` |
| Collectd | Collecteur métriques | Linux, BSD | 🆕 fait (lot 59) | `06-supervision/16-collectd-statsd` |
| StatsD | Collecteur métriques | Windows, Linux, macOS | 🆕 fait (lot 59) | `06-supervision/16-collectd-statsd` |
| OpenTelemetry Collector | Collecteur télémétrie | Windows, Linux, macOS | 🆕 fait (lot 59) | `06-supervision/17-opentelemetry-alloy` |
| Jaeger | Traçage distribué | Windows, Linux, macOS | 🆕 fait (lot 59) | `06-supervision/18-tracage-distribue` |
| Zipkin | Traçage distribué | Windows, Linux, macOS | 🆕 fait (lot 59) | `06-supervision/18-tracage-distribue` |
| Tempo | Backend traces | Linux | 🆕 fait (lot 59) | `06-supervision/18-tracage-distribue` |
| Loki | Agrégation logs | Windows, Linux, macOS | 🆕 fait (lot 59) | `15-journalisation/09-loki-promtail` |
| Promtail (déprécié) | Agent logs historique | Windows, Linux, macOS | 🆕 fait (lot 59) | `15-journalisation/09-loki-promtail` |
| Grafana Alloy | Agent observabilité | Windows, Linux, macOS | 🆕 fait (lot 59) | `06-supervision/17-opentelemetry-alloy` |
| Fluent Bit | Collecteur logs | Windows, Linux, macOS | ✅ existant | `15-journalisation/03-fluent-bit` |
| Fluentd | Collecteur logs | Windows, Linux, macOS | 🆕 fait (lot 59) | `15-journalisation/10-fluentd-vector` |
| Vector | Pipeline observabilité | Windows, Linux, macOS | 🆕 fait (lot 59) | `15-journalisation/10-fluentd-vector` |
| Logstash | Pipeline logs | Windows, Linux, macOS | ✅ existant | `15-journalisation/02-logstash` |
| OpenSearch | Recherche et analytics logs | Windows, Linux, macOS | ✅ existant | `12-recherche-messages/02-opensearch` |
| OpenSearch Dashboards | Visualisation logs | Windows, Linux, macOS | ✅ existant | `12-recherche-messages/02-opensearch` |
| Graylog Open | Gestion logs | Linux | ✅ existant | `15-journalisation/04-graylog` |
| Wazuh | SIEM et XDR | Windows, Linux, macOS | ✅ existant | `15-journalisation/05-wazuh` |
| ELK Stack (Elasticsearch OSS alternatives) | Recherche et logs | Windows, Linux, macOS | 🆕 fait (lot 59) | `15-journalisation/11-recherche-journaux` |
| Quickwit | Recherche logs | Linux, macOS | 🆕 fait (lot 59) | `15-journalisation/11-recherche-journaux` |
| VictoriaLogs | Gestion logs | Windows, Linux, macOS | 🆕 fait (lot 59) | `15-journalisation/11-recherche-journaux` |
| SigNoz | Observabilité full-stack | Linux, Windows via conteneur | 🆕 fait (lot 59) | `06-supervision/19-observabilite-unifiee` |
| HyperDX | Observabilité | Linux, Windows via conteneur | 🆕 fait (lot 59) | `06-supervision/19-observabilite-unifiee` |
| Uptrace | APM et traces | Windows, Linux, macOS | 🆕 fait (lot 59) | `06-supervision/19-observabilite-unifiee` |
| GlitchTip | Suivi erreurs | Linux, Windows via conteneur | 🆕 fait (lot 59) | `06-supervision/20-suivi-erreurs` |
| Sentry self-hosted | Suivi erreurs | Linux | 🆕 fait (lot 59) | `06-supervision/20-suivi-erreurs` |
| Errbit | Suivi erreurs | Linux | 🆕 fait (lot 59) | `06-supervision/20-suivi-erreurs` |
| Uptime Kuma | Surveillance disponibilité | Windows, Linux, macOS | 🆕 fait (lot 60) | `06-supervision/21-disponibilite-pages-statut` |
| Gatus | Surveillance disponibilité | Windows, Linux, macOS | 🆕 fait (lot 60) | `06-supervision/21-disponibilite-pages-statut` |
| Cachet | Page statut | Linux | 🆕 fait (lot 60) | `06-supervision/21-disponibilite-pages-statut` |
| Statping-ng | Page statut | Windows, Linux, macOS | 🆕 fait (lot 60) | `06-supervision/21-disponibilite-pages-statut` |
| Cabot | Supervision et alertes | Linux | 🆕 fait (lot 60) | `06-supervision/21-disponibilite-pages-statut` |
| Healthchecks | Surveillance tâches planifiées | Linux | 🆕 fait (lot 60) | `06-supervision/21-disponibilite-pages-statut` |
| ntopng | Analyse trafic réseau | Windows, Linux, macOS | 🆕 fait (lot 60) | `06-supervision/22-analyse-trafic` |
| iftop | Analyse bande passante | Linux, BSD | 🆕 fait (lot 60) | `06-supervision/22-analyse-trafic` |
| vnStat | Statistiques trafic | Linux, BSD | 🆕 fait (lot 60) | `06-supervision/22-analyse-trafic` |
| Wireshark | Analyse protocoles réseau | Windows, Linux, macOS | ✅ existant | `21-outils/02-reseau-diagnostic/01-wireshark-capture` |
| tshark | Analyse réseau CLI | Windows, Linux, macOS | ✅ existant (lot 60) | `21-outils/02-reseau-diagnostic` |
| tcpdump | Capture réseau | Linux, macOS, BSD | 🆕 fait (lot 60) | `06-supervision/22-analyse-trafic` |
| Nmap | Découverte et audit réseau | Windows, Linux, macOS | ✅ existant | `21-outils/02-reseau-diagnostic/03-nmap` |
| ZMap | Scan réseau Internet | Linux | 🆕 fait (lot 60) | `06-supervision/23-scan-internet` |
| Masscan | Scan réseau | Windows, Linux, macOS | 🆕 fait (lot 60) | `06-supervision/23-scan-internet` |
| Netdata Cloud Agent (agent) | Métriques hôte | Windows, Linux, macOS | ✅ existant | `06-supervision/07-netdata` |

## 10. SECURITE, PARE-FEU, SIEM, SCAN ET PKI — 64/64

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| OSSEC | HIDS | Windows, Linux, macOS | 🆕 fait (lot 60) | `16-securite/12-ossec` |
| Suricata | IDS/IPS réseau | Windows, Linux, macOS | ✅ existant | `16-securite/05-suricata` |
| Zeek | Analyse sécurité réseau | Linux, macOS | ✅ existant | `16-securite/07-zeek` |
| Snort | IDS/IPS | Windows, Linux, macOS | ✅ existant | `16-securite/06-snort` |
| Security Onion | Distribution SOC | Linux | 🆕 fait (lot 60) | `16-securite/13-security-onion` |
| TheHive | Gestion incidents SOC | Linux | 🆕 fait (lot 60) | `16-securite/14-reponse-incident-cti` |
| MISP | Partage renseignements menaces | Linux | 🆕 fait (lot 60) | `16-securite/14-reponse-incident-cti` |
| OpenCTI | Renseignement cyber | Linux | 🆕 fait (lot 60) | `16-securite/14-reponse-incident-cti` |
| Yeti | Threat intelligence | Linux | 🆕 fait (lot 60) | `16-securite/14-reponse-incident-cti` |
| IntelOwl | Analyse fichiers et observables | Linux | 🆕 fait (lot 60) | `16-securite/14-reponse-incident-cti` |
| Velociraptor | DFIR et réponse incident | Windows, Linux, macOS | 🆕 fait (lot 60) | `16-securite/15-velociraptor-grr` |
| GRR Rapid Response | Forensic à distance | Windows, Linux, macOS | 🆕 fait (lot 60) | `16-securite/15-velociraptor-grr` |
| osquery | Instrumentation endpoint | Windows, Linux, macOS | 🆕 fait (lot 60) | `16-securite/16-osquery-fleet` |
| FleetDM | Gestion osquery | Windows, Linux, macOS | 🆕 fait (lot 60) | `16-securite/16-osquery-fleet` |
| Kolide Launcher | Sécurité endpoint | Windows, Linux, macOS | 🆕 fait (lot 60) | `16-securite/16-osquery-fleet` |
| Lynis | Audit sécurité système | Linux, macOS, BSD | ✅ existant | `16-securite/08-lynis` |
| OpenSCAP | Conformité et audit | Linux | 🆕 fait (lot 60) | `16-securite/17-openscap` |
| Greenbone Community Edition | Scanner vulnérabilités | Linux | ✅ existant | `21-outils/02-reseau-diagnostic/08-greenbone-openvas` |
| OpenVAS | Scanner vulnérabilités | Linux | ✅ existant | `21-outils/02-reseau-diagnostic/08-greenbone-openvas` |
| Nuclei | Scanner templates vulnérabilités | Windows, Linux, macOS | 🆕 fait (lot 61) | `16-securite/18-scanners-web` |
| OWASP ZAP | Test sécurité web | Windows, Linux, macOS | ✅ existant | `21-outils/03-cybersecurite/02-owasp-zap` |
| Nikto | Scanner serveur web | Windows, Linux, macOS | 🆕 fait (lot 61) | `16-securite/18-scanners-web` |
| Wapiti | Scanner web | Windows, Linux, macOS | 🆕 fait (lot 61) | `16-securite/18-scanners-web` |
| Arachni | Scanner web | Linux | 🆕 fait (lot 61) | `16-securite/18-scanners-web` |
| sqlmap | Audit injection SQL | Windows, Linux, macOS | 🆕 fait (lot 61) | `16-securite/18-scanners-web` |
| Nmap NSE | Scripts audit réseau | Windows, Linux, macOS | ✅ existant | `21-outils/02-reseau-diagnostic/03-nmap` |
| testssl.sh | Audit TLS | Linux, macOS | 🆕 fait (lot 61) | `16-securite/19-audit-tls` |
| SSLyze | Audit TLS | Windows, Linux, macOS | 🆕 fait (lot 61) | `16-securite/19-audit-tls` |
| Certbot | Gestion certificats ACME | Windows via WSL, Linux, macOS | 🆕 fait (lot 61) | `16-securite/20-acme-certbot` |
| acme.sh | Client ACME | Windows via shell, Linux, macOS | 🆕 fait (lot 61) | `16-securite/20-acme-certbot` |
| step-ca | Autorité de certification | Windows, Linux, macOS | 🆕 fait (lot 61) | `16-securite/21-pki-step-ca-ejbca` |
| Smallstep CLI | PKI et certificats | Windows, Linux, macOS | 🆕 fait (lot 61) | `16-securite/21-pki-step-ca-ejbca` |
| EJBCA Community | Autorité de certification | Linux | 🆕 fait (lot 61) | `16-securite/21-pki-step-ca-ejbca` |
| OpenSSL | Cryptographie et PKI | Windows, Linux, macOS | 🆕 fait (lot 61) | `16-securite/22-openssl-libressl` |
| LibreSSL | Cryptographie | OpenBSD, Linux, macOS | 🆕 fait (lot 61) | `16-securite/22-openssl-libressl` |
| GnuPG | Chiffrement et signature | Windows, Linux, macOS | 🆕 fait (lot 61) | `16-securite/23-gnupg-age` |
| age | Chiffrement fichiers | Windows, Linux, macOS | 🆕 fait (lot 61) | `16-securite/23-gnupg-age` |
| SOPS | Chiffrement secrets config | Windows, Linux, macOS | 🆕 fait (lot 61) | `16-securite/24-sops` |
| Vault (open source core) | Gestion secrets | Windows, Linux, macOS | ✅ existant (lot 61) | `01-annuaire-identite/07-vault` |
| OpenBao | Gestion secrets | Windows, Linux, macOS | 🆕 fait (lot 61) | `16-securite/25-openbao-infisical` |
| Infisical (open source core) | Gestion secrets | Windows, Linux, macOS | 🆕 fait (lot 61) | `16-securite/25-openbao-infisical` |
| Mozilla SOPS | Gestion secrets | Windows, Linux, macOS | 🆕 fait (lot 61) | `16-securite/24-sops` |
| KeePassXC | Gestionnaire mots de passe | Windows, Linux, macOS | ✅ existant | `21-outils/03-cybersecurite/06-keepassxc-bitwarden` |
| KeePass | Gestionnaire mots de passe | Windows | ✅ existant (lot 61) | `21-outils/03-cybersecurite` |
| Bitwarden self-hosted (clients open source) | Gestion mots de passe | Windows, Linux, macOS | ✅ existant | `21-outils/03-cybersecurite/06-keepassxc-bitwarden` |
| Vaultwarden | Serveur compatible Bitwarden | Windows, Linux, macOS | ✅ existant | `01-annuaire-identite/08-vaultwarden` |
| Passbolt Community | Gestion mots de passe équipe | Linux | 🆕 fait (lot 61) | `16-securite/26-passbolt-psono` |
| Psono Community | Gestion mots de passe équipe | Windows, Linux, macOS | 🆕 fait (lot 61) | `16-securite/26-passbolt-psono` |
| Fail2ban | Blocage brute force | Linux, BSD | ✅ existant | `16-securite/01-fail2ban` |
| CrowdSec | Détection et blocage comportemental | Windows, Linux, macOS | ✅ existant | `16-securite/02-crowdsec` |
| sshguard | Protection SSH | Linux, BSD | 🆕 fait (lot 61) | `16-securite/27-pare-feu-linux` |
| Firewalld | Pare-feu dynamique | Linux | 🆕 fait (lot 61) | `16-securite/27-pare-feu-linux` |
| nftables | Pare-feu Linux | Linux | 🆕 fait (lot 61) | `16-securite/27-pare-feu-linux` |
| iptables | Pare-feu Linux historique | Linux | 🆕 fait (lot 61) | `16-securite/27-pare-feu-linux` |
| UFW | Pare-feu simplifié | Linux | 🆕 fait (lot 61) | `16-securite/27-pare-feu-linux` |
| Windows Defender Firewall Tools | Administration pare-feu natif | Windows | ✅ existant (lot 61) | `16-securite/10-pare-feu-windows` |
| ClamAV | Antivirus open source | Windows, Linux, macOS | ✅ existant | `16-securite/04-clamav` |
| YARA | Règles de détection | Windows, Linux, macOS | 🆕 fait (lot 61) | `16-securite/28-yara-rootkits` |
| Chkrootkit | Détection rootkits | Linux | 🆕 fait (lot 61) | `16-securite/28-yara-rootkits` |
| rkhunter | Détection rootkits | Linux | 🆕 fait (lot 61) | `16-securite/28-yara-rootkits` |
| AIDE | Contrôle intégrité fichiers | Linux, Unix | ✅ existant | `16-securite/03-aide` |
| Lynis Enterprise alternatives | Audit système (catégorie) | Linux | ✅ existant | `16-securite/08-lynis` |
| OpenEDR | EDR open source | Windows, Linux | 🆕 fait (lot 61) | `16-securite/29-openedr` |
| XCP-ng Xen Orchestra (community) | Gestion hyperviseur | Linux, Windows, macOS via navigateur | 🆕 fait (lot 48) | `13-conteneurs/15-xcp-ng-xen` |

## 11. AUTOMATISATION, CONFIGURATION ET INFRASTRUCTURE AS CODE — 45/45

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| Ansible | Automatisation configuration | Windows, Linux, macOS (contrôle Linux/macOS) | ✅ existant | `17-automatisation/01-ansible` |
| AWX | Interface Ansible | Linux, Windows via conteneur | 🆕 fait (lot 62) | `17-automatisation/06-awx-semaphore` |
| Semaphore UI | Interface Ansible | Windows, Linux, macOS | 🆕 fait (lot 62) | `17-automatisation/06-awx-semaphore` |
| Rundeck Community | Automatisation opérations | Windows, Linux, macOS | 🆕 fait (lot 62) | `17-automatisation/07-rundeck` |
| Rundeck | Orchestration tâches | Windows, Linux, macOS | 🆕 fait (lot 62) | `17-automatisation/07-rundeck` |
| Salt Project | Automatisation infrastructure | Windows, Linux, macOS | ✅ existant | `17-automatisation/03-salt` |
| Puppet Open Source | Gestion configuration | Windows, Linux, macOS | ✅ existant | `17-automatisation/02-puppet` |
| Chef Infra (community) | Gestion configuration | Windows, Linux, macOS | 🆕 fait (lot 62) | `17-automatisation/08-chef-cfengine` |
| CFEngine | Gestion configuration | Windows, Linux, macOS | 🆕 fait (lot 62) | `17-automatisation/08-chef-cfengine` |
| Terraform | Infrastructure as Code | Windows, Linux, macOS | ✅ existant | `17-automatisation/04-terraform` |
| OpenTofu | Infrastructure as Code | Windows, Linux, macOS | ✅ existant | `17-automatisation/04-terraform` |
| Pulumi | Infrastructure as Code | Windows, Linux, macOS | 🆕 fait (lot 62) | `17-automatisation/09-pulumi` |
| Terragrunt | Orchestration Terraform | Windows, Linux, macOS | 🆕 fait (lot 62) | `17-automatisation/10-terragrunt-terramate` |
| Terramate | Orchestration IaC | Windows, Linux, macOS | 🆕 fait (lot 62) | `17-automatisation/10-terragrunt-terramate` |
| Cloud-init | Initialisation VM | Linux, BSD | 🆕 fait (lot 62) | `17-automatisation/11-cloud-init-ignition` |
| Ignition | Provisioning OS | Linux | 🆕 fait (lot 62) | `17-automatisation/11-cloud-init-ignition` |
| Foreman | Provisioning et gestion serveurs | Linux | 🆕 fait (lot 62) | `17-automatisation/12-foreman-katello` |
| Katello | Gestion contenu et patchs | Linux | 🆕 fait (lot 62) | `17-automatisation/12-foreman-katello` |
| Uyuni | Gestion parc et patchs | Linux | 🆕 fait (lot 62) | `17-automatisation/13-uyuni` |
| Rudder | Configuration et conformité | Windows, Linux | 🆕 fait (lot 62) | `17-automatisation/14-rudder` |
| Rex (R)? | Automatisation distante | Linux, Unix | 🆕 fait (lot 62) | `17-automatisation/15-rex-fabric-invoke` |
| Fabric | Automatisation SSH Python | Windows, Linux, macOS | 🆕 fait (lot 62) | `17-automatisation/15-rex-fabric-invoke` |
| Invoke | Task execution Python | Windows, Linux, macOS | 🆕 fait (lot 62) | `17-automatisation/15-rex-fabric-invoke` |
| Nornir | Automatisation réseau Python | Windows, Linux, macOS | 🆕 fait (lot 62) | `17-automatisation/16-automatisation-reseau-python` |
| Netmiko | Automatisation équipements réseau | Windows, Linux, macOS | 🆕 fait (lot 62) | `17-automatisation/16-automatisation-reseau-python` |
| NAPALM | Automatisation réseau | Windows, Linux, macOS | 🆕 fait (lot 62) | `17-automatisation/16-automatisation-reseau-python` |
| Nornir Salt | Automatisation réseau | Windows, Linux, macOS | 🆕 fait (lot 62) | `17-automatisation/16-automatisation-reseau-python` |
| StackStorm | Automatisation événementielle | Linux | 🆕 fait (lot 62) | `17-automatisation/17-stackstorm` |
| Huginn | Automatisation événementielle | Windows, Linux, macOS | 🆕 fait (lot 63) | `17-automatisation/18-workflows-low-code` |
| n8n (source available/community) | Automatisation workflows | Windows, Linux, macOS | ✅ existant | `21-outils/05-ia-productivite/06-n8n` |
| Node-RED | Automatisation low-code | Windows, Linux, macOS | 🆕 fait (lot 63) | `17-automatisation/18-workflows-low-code` |
| Activepieces (community) | Automatisation workflows | Windows, Linux, macOS | 🆕 fait (lot 63) | `17-automatisation/18-workflows-low-code` |
| Windmill (community) | Automatisation scripts et workflows | Windows, Linux, macOS | 🆕 fait (lot 63) | `17-automatisation/18-workflows-low-code` |
| Kestra | Orchestration workflows | Windows, Linux, macOS | 🆕 fait (lot 63) | `17-automatisation/19-orchestration-donnees` |
| Apache Airflow | Orchestration pipelines | Windows, Linux, macOS | 🆕 fait (lot 63) | `17-automatisation/19-orchestration-donnees` |
| Prefect | Orchestration workflows | Windows, Linux, macOS | 🆕 fait (lot 63) | `17-automatisation/19-orchestration-donnees` |
| Dagster | Orchestration data | Windows, Linux, macOS | 🆕 fait (lot 63) | `17-automatisation/19-orchestration-donnees` |
| Temporal | Orchestration durable | Windows, Linux, macOS | 🆕 fait (lot 63) | `17-automatisation/20-temporal-conductor` |
| Netflix Conductor | Orchestration microservices | Linux, macOS | 🆕 fait (lot 63) | `17-automatisation/20-temporal-conductor` |
| Apache DolphinScheduler | Orchestration tâches | Linux | 🆕 fait (lot 63) | `17-automatisation/19-orchestration-donnees` |
| Molecule | Tests rôles Ansible | Windows, Linux, macOS | 🆕 fait (lot 63) | `17-automatisation/21-tests-infrastructure` |
| Testinfra | Tests infrastructure | Windows, Linux, macOS | 🆕 fait (lot 63) | `17-automatisation/21-tests-infrastructure` |
| InSpec (core open source) | Tests conformité | Windows, Linux, macOS | 🆕 fait (lot 63) | `17-automatisation/21-tests-infrastructure` |
| Serverspec | Tests infrastructure | Linux, macOS | 🆕 fait (lot 63) | `17-automatisation/21-tests-infrastructure` |
| KitchenCI | Tests infrastructure | Windows, Linux, macOS | 🆕 fait (lot 63) | `17-automatisation/21-tests-infrastructure` |

## 12. MESSAGERIE, COLLABORATION, GROUPWARE ET COMMUNICATION — 80/80

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| Matrix Synapse | Serveur messagerie Matrix | Windows, Linux, macOS | 🆕 fait (lot 63) | `10-messagerie/11-matrix` |
| Dendrite | Serveur Matrix | Windows, Linux, macOS | 🆕 fait (lot 63) | `10-messagerie/11-matrix` |
| Conduit | Serveur Matrix léger | Windows, Linux, macOS | 🆕 fait (lot 63) | `10-messagerie/11-matrix` |
| Continuwuity | Serveur Matrix | Linux, macOS | 🆕 fait (lot 63) | `10-messagerie/11-matrix` |
| Element Server Suite (components) | Messagerie Matrix | Windows, Linux, macOS | 🆕 fait (lot 63) | `10-messagerie/11-matrix` |
| Mattermost Team Edition | Chat équipe | Linux, Windows via conteneur | 🆕 fait (lot 64) | `10-messagerie/12-mattermost` |
| Rocket.Chat Community | Chat équipe | Linux, Windows via conteneur | 🆕 fait (lot 64) | `10-messagerie/13-rocketchat` |
| Zulip | Chat équipe | Linux | 🆕 fait (lot 64) | `10-messagerie/14-zulip` |
| XMPP Prosody | Serveur XMPP | Windows, Linux, macOS | 🆕 fait (lot 64) | `10-messagerie/15-xmpp` |
| ejabberd | Serveur XMPP | Windows, Linux, macOS | 🆕 fait (lot 64) | `10-messagerie/15-xmpp` |
| Openfire | Serveur XMPP | Windows, Linux, macOS | 🆕 fait (lot 64) | `10-messagerie/15-xmpp` |
| Snikket | Messagerie XMPP | Linux | 🆕 fait (lot 64) | `10-messagerie/15-xmpp` |
| MongooseIM | Serveur XMPP | Linux | 🆕 fait (lot 64) | `10-messagerie/15-xmpp` |
| Jitsi Meet | Visioconférence | Linux | ✅ existant (lot 64) | `23-telephonie-ip/16-visioconference` |
| Jitsi Videobridge | Serveur média | Linux | ✅ existant (lot 64) | `23-telephonie-ip/16-visioconference` |
| BigBlueButton | Classe virtuelle | Linux | ✅ existant (lot 64) | `23-telephonie-ip/16-visioconference` |
| Galène | Visioconférence | Windows, Linux, macOS | 🆕 fait (lot 64) | `23-telephonie-ip/16-visioconference` |
| Nextcloud Talk | Chat et visioconférence | Linux | ✅ existant | `09-fichiers-partage/08-nextcloud` |
| Element | Client Matrix | Windows, Linux, macOS | ✅ existant (lot 64) | `10-messagerie/11-matrix` |
| Converse.js | Client XMPP web | Windows, Linux, macOS | 🆕 fait (lot 64) | `10-messagerie/15-xmpp` |
| Zammad | Helpdesk | Linux | ✅ existant | `21-outils/06-support-parc/06-zammad` |
| Chatwoot | Support client omnicanal | Linux | 🆕 fait (lot 65) | `21-outils/06-support-parc` |
| FreeScout | Helpdesk email | Linux | 🆕 fait (lot 65) | `21-outils/06-support-parc` |
| osTicket | Ticketing support | Windows, Linux, macOS | 🆕 fait (lot 65) | `21-outils/06-support-parc` |
| GLPI | ITSM et parc informatique | Windows, Linux, macOS | ✅ existant | `21-outils/06-support-parc/04-glpi-installation` |
| iTop | ITSM et CMDB | Windows, Linux, macOS | 🆕 fait (lot 65) | `21-outils/06-support-parc` |
| OTOBO | ITSM | Linux | 🆕 fait (lot 65) | `21-outils/06-support-parc` |
| Znuny | ITSM | Linux | 🆕 fait (lot 65) | `21-outils/06-support-parc` |
| Request Tracker | Ticketing | Linux, Unix | 🆕 fait (lot 65) | `21-outils/06-support-parc` |
| UVdesk Community | Helpdesk | Linux | 🆕 fait (lot 65) | `21-outils/06-support-parc` |
| Faveo Helpdesk Community | Helpdesk | Linux | 🆕 fait (lot 65) | `21-outils/06-support-parc` |
| OpenProject | Gestion projet | Linux | 🆕 fait (lot 66) | `10-messagerie/16-gestion-projet` |
| Taiga | Gestion projet agile | Linux | 🆕 fait (lot 66) | `10-messagerie/16-gestion-projet` |
| Plane (community) | Gestion projet | Linux, Windows via conteneur | 🆕 fait (lot 66) | `10-messagerie/16-gestion-projet` |
| Leantime | Gestion projet | Linux | 🆕 fait (lot 66) | `10-messagerie/16-gestion-projet` |
| Redmine | Gestion projet | Windows, Linux, macOS | 🆕 fait (lot 66) | `10-messagerie/16-gestion-projet` |
| Trac | Gestion projet et wiki | Windows, Linux, macOS | 🆕 fait (lot 66) | `10-messagerie/16-gestion-projet` |
| Phabricator (archivé) | Collaboration développement | Linux | 🆕 fait (lot 66) | `10-messagerie/16-gestion-projet` |
| Tuleap Community | ALM et projet | Linux | 🆕 fait (lot 66) | `10-messagerie/16-gestion-projet` |
| Kanboard | Kanban | Linux | 🆕 fait (lot 66) | `10-messagerie/16-gestion-projet` |
| Wekan | Kanban | Windows, Linux, macOS | 🆕 fait (lot 66) | `10-messagerie/16-gestion-projet` |
| Focalboard (archivé) | Gestion projet | Windows, Linux, macOS | 🆕 fait (lot 66) | `10-messagerie/16-gestion-projet` |
| Vikunja | Tâches et projets | Windows, Linux, macOS | 🆕 fait (lot 66) | `10-messagerie/16-gestion-projet` |
| AppFlowy | Espace de travail | Windows, Linux, macOS | 🆕 fait (lot 67) | `10-messagerie/17-wikis` |
| AFFiNE | Espace de travail | Windows, Linux, macOS | 🆕 fait (lot 67) | `10-messagerie/17-wikis` |
| Outline | Wiki collaboratif | Linux | 🆕 fait (lot 67) | `10-messagerie/17-wikis` |
| BookStack | Wiki documentaire | Linux | ✅ existant | `21-outils/05-ia-productivite/09-bookstack` |
| Wiki.js | Wiki | Windows, Linux, macOS | 🆕 fait (lot 67) | `10-messagerie/17-wikis` |
| XWiki | Wiki | Windows, Linux, macOS | 🆕 fait (lot 67) | `10-messagerie/17-wikis` |
| DokuWiki | Wiki | Windows, Linux, macOS | 🆕 fait (lot 67) | `10-messagerie/17-wikis` |
| MediaWiki | Wiki | Windows, Linux, macOS | 🆕 fait (lot 67) | `10-messagerie/17-wikis` |
| TWiki | Wiki | Windows, Linux, macOS | 🆕 fait (lot 67) | `10-messagerie/17-wikis` |
| MoinMoin | Wiki | Windows, Linux, macOS | 🆕 fait (lot 67) | `10-messagerie/17-wikis` |
| Gollum | Wiki Git | Windows, Linux, macOS | 🆕 fait (lot 67) | `10-messagerie/17-wikis` |
| HedgeDoc | Édition Markdown collaborative | Linux | 🆕 fait (lot 68) | `10-messagerie/18-edition-collaborative` |
| Etherpad | Édition collaborative | Windows, Linux, macOS | 🆕 fait (lot 68) | `10-messagerie/18-edition-collaborative` |
| CryptPad | Suite collaborative chiffrée | Linux | 🆕 fait (lot 68) | `10-messagerie/18-edition-collaborative` |
| ownCloud | Suite collaborative | Linux | ✅ existant | `09-fichiers-partage/09-owncloud` |
| SOGo | Groupware | Linux | 🆕 fait (lot 68) | `10-messagerie/19-groupware-agendas` |
| Kopano Core Community | Groupware | Linux | 🆕 fait (lot 68) | `10-messagerie/19-groupware-agendas` |
| Cal.com (core open source) | Planification rendez-vous | Linux, Windows via conteneur | 🆕 fait (lot 68) | `10-messagerie/19-groupware-agendas` |
| Radicale | Serveur CalDAV/CardDAV | Windows, Linux, macOS | ✅ existant | `10-messagerie/08-radicale` |
| Baïkal | Serveur CalDAV/CardDAV | Linux | 🆕 fait (lot 68) | `10-messagerie/19-groupware-agendas` |
| DAViCal | Serveur CalDAV | Linux | 🆕 fait (lot 68) | `10-messagerie/19-groupware-agendas` |
| Mailu | Suite serveur mail | Linux | 🆕 fait (lot 69) | `10-messagerie/20-suites-messagerie` |
| Mailcow | Suite serveur mail | Linux | 🆕 fait (lot 69) | `10-messagerie/20-suites-messagerie` |
| docker-mailserver | Serveur mail | Linux | 🆕 fait (lot 69) | `10-messagerie/20-suites-messagerie` |
| Modoboa | Suite serveur mail | Linux | 🆕 fait (lot 69) | `10-messagerie/20-suites-messagerie` |
| iRedMail (open source edition) | Suite serveur mail | Linux, BSD | 🆕 fait (lot 69) | `10-messagerie/20-suites-messagerie` |
| Postfix | MTA SMTP | Windows via ports, Linux, macOS | ✅ existant | `10-messagerie/01-postfix` |
| Exim | MTA SMTP | Linux, Unix | ✅ existant | `10-messagerie/03-exim` |
| OpenSMTPD | MTA SMTP | OpenBSD, Linux | 🆕 fait (lot 69) | `10-messagerie/22-opensmtpd` |
| Dovecot | Serveur IMAP/POP3 | Linux, Unix | ✅ existant | `10-messagerie/02-dovecot` |
| Rspamd | Filtrage spam | Linux | ✅ existant | `10-messagerie/04-rspamd` |
| SpamAssassin | Filtrage spam | Windows, Linux, macOS | ✅ existant | `10-messagerie/05-spamassassin` |
| Amavis | Filtrage email | Linux | 🆕 fait (lot 69) | `10-messagerie/05-spamassassin` |
| Roundcube | Webmail | Windows, Linux, macOS | 🆕 fait (lot 69) | `10-messagerie/21-webmail` |
| SnappyMail | Webmail | Windows, Linux, macOS | 🆕 fait (lot 69) | `10-messagerie/21-webmail` |
| SquirrelMail | Webmail historique | Linux | 🆕 fait (lot 69) | `10-messagerie/21-webmail` |
| RainLoop (abandonné) | Webmail historique | Linux | 🆕 fait (lot 69) | `10-messagerie/21-webmail` |

## 13. WEB, CMS, E-COMMERCE ET PORTAILS — 64/64

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| WordPress | CMS | Windows, Linux, macOS | 🆕 fait (lot 70) | `25-web-cms-portails/01-wordpress` |
| Drupal | CMS | Windows, Linux, macOS | 🆕 fait (lot 70) | `25-web-cms-portails/02-drupal-joomla` |
| Joomla | CMS | Windows, Linux, macOS | 🆕 fait (lot 70) | `25-web-cms-portails/02-drupal-joomla` |
| Ghost | CMS/blog | Windows, Linux, macOS | 🆕 fait (lot 70) | `25-web-cms-portails/04-ghost-grav-october` |
| Grav | CMS flat-file | Windows, Linux, macOS | 🆕 fait (lot 70) | `25-web-cms-portails/04-ghost-grav-october` |
| ClassicPress | CMS | Windows, Linux, macOS | 🆕 fait (lot 70) | `25-web-cms-portails/01-wordpress` |
| TYPO3 | CMS entreprise | Windows, Linux, macOS | 🆕 fait (lot 70) | `25-web-cms-portails/03-typo3-contao` |
| Contao | CMS | Windows, Linux, macOS | 🆕 fait (lot 70) | `25-web-cms-portails/03-typo3-contao` |
| October CMS (community) | CMS Laravel | Windows, Linux, macOS | 🆕 fait (lot 70) | `25-web-cms-portails/04-ghost-grav-october` |
| Strapi | CMS headless | Windows, Linux, macOS | 🆕 fait (lot 71) | `25-web-cms-portails/05-cms-headless-python` |
| Directus | CMS headless | Windows, Linux, macOS | 🆕 fait (lot 71) | `25-web-cms-portails/05-cms-headless-python` |
| Payload CMS | CMS headless | Windows, Linux, macOS | 🆕 fait (lot 71) | `25-web-cms-portails/05-cms-headless-python` |
| KeystoneJS | CMS headless | Windows, Linux, macOS | 🆕 fait (lot 71) | `25-web-cms-portails/05-cms-headless-python` |
| Sanity Studio (source available) | CMS headless | Windows, Linux, macOS | 🆕 fait (lot 71) | `25-web-cms-portails/05-cms-headless-python` |
| Wagtail | CMS Django | Windows, Linux, macOS | 🆕 fait (lot 71) | `25-web-cms-portails/05-cms-headless-python` |
| Mezzanine | CMS Django | Windows, Linux, macOS | 🆕 fait (lot 71) | `25-web-cms-portails/05-cms-headless-python` |
| Plone | CMS Python | Windows, Linux, macOS | 🆕 fait (lot 71) | `25-web-cms-portails/05-cms-headless-python` |
| Zope | Serveur applicatif | Windows, Linux, macOS | 🆕 fait (lot 71) | `25-web-cms-portails/05-cms-headless-python` |
| Liferay Community Edition | Portail | Windows, Linux, macOS | 🆕 fait (lot 72) | `25-web-cms-portails/06-portails-ged` |
| Jahia (community components) | CMS | Linux | 🆕 fait (lot 72) | `25-web-cms-portails/06-portails-ged` |
| eXo Platform (community) | Portail collaboratif | Linux | 🆕 fait (lot 72) | `25-web-cms-portails/06-portails-ged` |
| Alfresco Community | ECM | Linux, Windows | 🆕 fait (lot 72) | `25-web-cms-portails/06-portails-ged` |
| Nuxeo (community legacy) | ECM | Linux | 🆕 fait (lot 72) | `25-web-cms-portails/06-portails-ged` |
| Moodle | LMS | Windows, Linux, macOS | 🆕 fait (lot 72) | `25-web-cms-portails/07-lms` |
| Canvas LMS (open source) | LMS | Linux | 🆕 fait (lot 72) | `25-web-cms-portails/07-lms` |
| Chamilo | LMS | Windows, Linux, macOS | 🆕 fait (lot 72) | `25-web-cms-portails/07-lms` |
| ILIAS | LMS | Windows, Linux, macOS | 🆕 fait (lot 72) | `25-web-cms-portails/07-lms` |
| Open edX | LMS | Linux | 🆕 fait (lot 72) | `25-web-cms-portails/07-lms` |
| Frappe Framework | Framework ERP | Windows, Linux, macOS | 🆕 fait (lot 73) | `25-web-cms-portails/08-erp` |
| ERPNext | ERP | Linux | 🆕 fait (lot 73) | `25-web-cms-portails/08-erp` |
| Odoo Community | ERP/CRM | Windows, Linux, macOS | 🆕 fait (lot 73) | `25-web-cms-portails/08-erp` |
| Tryton | ERP | Windows, Linux, macOS | 🆕 fait (lot 73) | `25-web-cms-portails/08-erp` |
| Dolibarr | ERP/CRM | Windows, Linux, macOS | 🆕 fait (lot 73) | `25-web-cms-portails/08-erp` |
| iDempiere | ERP | Windows, Linux, macOS | 🆕 fait (lot 73) | `25-web-cms-portails/08-erp` |
| metasfresh | ERP | Linux | 🆕 fait (lot 73) | `25-web-cms-portails/08-erp` |
| Apache OFBiz | ERP | Windows, Linux, macOS | 🆕 fait (lot 73) | `25-web-cms-portails/08-erp` |
| ERP5 | ERP | Linux | 🆕 fait (lot 73) | `25-web-cms-portails/08-erp` |
| FrontAccounting | Comptabilité/ERP | Windows, Linux, macOS | 🆕 fait (lot 73) | `25-web-cms-portails/08-erp` |
| Invoice Ninja (community) | Facturation | Linux | 🆕 fait (lot 74) | `25-web-cms-portails/09-facturation-temps` |
| Akaunting (community) | Comptabilité | Linux | 🆕 fait (lot 74) | `25-web-cms-portails/09-facturation-temps` |
| Kimai | Suivi temps et facturation | Windows, Linux, macOS | 🆕 fait (lot 74) | `25-web-cms-portails/09-facturation-temps` |
| Crater (archivé) | Facturation | Linux | 🆕 fait (lot 74) | `25-web-cms-portails/09-facturation-temps` |
| OpenCart | E-commerce | Windows, Linux, macOS | 🆕 fait (lot 74) | `25-web-cms-portails/10-ecommerce` |
| PrestaShop | E-commerce | Windows, Linux, macOS | 🆕 fait (lot 74) | `25-web-cms-portails/10-ecommerce` |
| Magento Open Source | E-commerce | Linux | 🆕 fait (lot 74) | `25-web-cms-portails/10-ecommerce` |
| WooCommerce | E-commerce WordPress | Windows, Linux, macOS | 🆕 fait (lot 74) | `25-web-cms-portails/10-ecommerce` |
| Saleor | E-commerce headless | Windows, Linux, macOS | 🆕 fait (lot 75) | `25-web-cms-portails/10-ecommerce` |
| Medusa | E-commerce headless | Windows, Linux, macOS | 🆕 fait (lot 75) | `25-web-cms-portails/10-ecommerce` |
| Sylius | E-commerce Symfony | Windows, Linux, macOS | 🆕 fait (lot 75) | `25-web-cms-portails/10-ecommerce` |
| Shopware Community | E-commerce | Windows, Linux, macOS | 🆕 fait (lot 75) | `25-web-cms-portails/10-ecommerce` |
| Bagisto | E-commerce Laravel | Windows, Linux, macOS | 🆕 fait (lot 75) | `25-web-cms-portails/10-ecommerce` |
| Spree Commerce | E-commerce Ruby | Windows, Linux, macOS | 🆕 fait (lot 75) | `25-web-cms-portails/10-ecommerce` |
| Reaction Commerce (archivé) | E-commerce | Linux | 🆕 fait (lot 75) | `25-web-cms-portails/10-ecommerce` |
| Vendure | E-commerce headless | Windows, Linux, macOS | 🆕 fait (lot 75) | `25-web-cms-portails/10-ecommerce` |
| Solidus | E-commerce Ruby | Windows, Linux, macOS | 🆕 fait (lot 75) | `25-web-cms-portails/10-ecommerce` |
| Open Source POS (OSPOS) | Caisse POS | Windows, Linux, macOS | 🆕 fait (lot 76) | `25-web-cms-portails/11-caisse-inventaire` |
| uniCenta oPOS | Caisse POS | Windows, Linux, macOS | 🆕 fait (lot 76) | `25-web-cms-portails/11-caisse-inventaire` |
| Floreant POS | Caisse POS | Windows, Linux, macOS | 🆕 fait (lot 76) | `25-web-cms-portails/11-caisse-inventaire` |
| ERPNext POS | Caisse POS | Linux | 🆕 fait (lot 76) | `25-web-cms-portails/11-caisse-inventaire` |
| OpenBoxes | Gestion stocks | Linux | 🆕 fait (lot 76) | `25-web-cms-portails/11-caisse-inventaire` |
| Inventree | Gestion inventaire | Windows, Linux, macOS | 🆕 fait (lot 76) | `25-web-cms-portails/11-caisse-inventaire` |
| Snipe-IT | Gestion actifs | Linux | 🆕 fait (lot 76) | `25-web-cms-portails/11-caisse-inventaire` |
| OCS Inventory NG | Inventaire IT | Windows, Linux, macOS | ✅ existant | `21-outils/06-support-parc/07-ocs-inventory` |
| FusionInventory | Inventaire IT (ancien) | Windows, Linux | 🆕 fait (lot 76) | `25-web-cms-portails/11-caisse-inventaire` |

## 14. DEVOPS, DEPOTS DE CODE, REGISTRY ET QUALITE — 56/56

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| Git | Gestion versions | Windows, Linux, macOS | ✅ existant | `14-devops/01-git` |
| Gitea | Forge Git | Windows, Linux, macOS | ✅ existant | `14-devops/03-gitea` |
| Forgejo | Forge Git | Windows, Linux, macOS | ✅ existant | `14-devops/04-forgejo` |
| GitLab Community Edition | Forge DevOps | Linux | ✅ existant | `14-devops/02-gitlab` |
| Gogs | Forge Git | Windows, Linux, macOS | 🆕 fait (lot 77) | `14-devops/13-forges-revue-vcs` |
| OneDev | Forge DevOps | Windows, Linux, macOS | 🆕 fait (lot 77) | `14-devops/13-forges-revue-vcs` |
| SourceHut | Forge de développement | Linux | 🆕 fait (lot 77) | `14-devops/13-forges-revue-vcs` |
| Pagure | Forge Git | Linux | 🆕 fait (lot 77) | `14-devops/13-forges-revue-vcs` |
| Phorge | Forge développement | Linux | ✅ existant (lot 77) | `10-messagerie/16-gestion-projet` |
| Gerrit Code Review | Revue de code | Windows, Linux, macOS | 🆕 fait (lot 77) | `14-devops/13-forges-revue-vcs` |
| Review Board | Revue de code | Windows, Linux, macOS | 🆕 fait (lot 77) | `14-devops/13-forges-revue-vcs` |
| RhodeCode Community | Forge Git | Linux | 🆕 fait (lot 77) | `14-devops/13-forges-revue-vcs` |
| Fossil SCM | Gestion versions | Windows, Linux, macOS | 🆕 fait (lot 77) | `14-devops/13-forges-revue-vcs` |
| Mercurial | Gestion versions | Windows, Linux, macOS | 🆕 fait (lot 77) | `14-devops/13-forges-revue-vcs` |
| Subversion Apache | Gestion versions | Windows, Linux, macOS | 🆕 fait (lot 77) | `14-devops/13-forges-revue-vcs` |
| Harbor | Registry OCI | Linux | 🆕 fait (lot 78) | `14-devops/14-registres-artefacts` |
| Distribution Registry | Registry Docker | Windows, Linux, macOS | 🆕 fait (lot 78) | `14-devops/14-registres-artefacts` |
| Zot | Registry OCI | Windows, Linux, macOS | 🆕 fait (lot 78) | `14-devops/14-registres-artefacts` |
| Nexus Repository OSS | Gestion dépôts artefacts | Windows, Linux, macOS | 🆕 fait (lot 78) | `14-devops/14-registres-artefacts` |
| JFrog Artifactory OSS (legacy) | Gestion artefacts | Linux | 🆕 fait (lot 78) | `14-devops/14-registres-artefacts` |
| Verdaccio | Registry npm | Windows, Linux, macOS | 🆕 fait (lot 78) | `14-devops/14-registres-artefacts` |
| SonarQube Community Build | Qualité code | Windows, Linux, macOS | ✅ existant | `14-devops/07-sonarqube` |
| SonarLint | Analyse IDE | Windows, Linux, macOS | 🆕 fait (lot 78) | `14-devops/15-analyse-code` |
| Semgrep CE | Analyse statique | Windows, Linux, macOS | 🆕 fait (lot 78) | `14-devops/15-analyse-code` |
| CodeQL CLI (license restrictions) | Analyse code | Windows, Linux, macOS | 🆕 fait (lot 78) | `14-devops/15-analyse-code` |
| PMD | Analyse statique | Windows, Linux, macOS | 🆕 fait (lot 78) | `14-devops/15-analyse-code` |
| Checkstyle | Analyse Java | Windows, Linux, macOS | 🆕 fait (lot 78) | `14-devops/15-analyse-code` |
| SpotBugs | Analyse Java | Windows, Linux, macOS | 🆕 fait (lot 78) | `14-devops/15-analyse-code` |
| ESLint | Analyse JavaScript | Windows, Linux, macOS | 🆕 fait (lot 78) | `14-devops/15-analyse-code` |
| Prettier | Formatage code | Windows, Linux, macOS | 🆕 fait (lot 78) | `14-devops/15-analyse-code` |
| Ruff | Lint Python | Windows, Linux, macOS | 🆕 fait (lot 79) | `14-devops/15-analyse-code` |
| Pylint | Lint Python | Windows, Linux, macOS | 🆕 fait (lot 79) | `14-devops/15-analyse-code` |
| Mypy | Types Python | Windows, Linux, macOS | 🆕 fait (lot 79) | `14-devops/15-analyse-code` |
| Bandit | Sécurité Python | Windows, Linux, macOS | 🆕 fait (lot 79) | `14-devops/15-analyse-code` |
| Grype | Scan vulnérabilités | Windows, Linux, macOS | 🆕 fait (lot 79) | `14-devops/16-chaine-approvisionnement` |
| Syft | SBOM | Windows, Linux, macOS | 🆕 fait (lot 79) | `14-devops/16-chaine-approvisionnement` |
| Cosign | Signature artefacts | Windows, Linux, macOS | 🆕 fait (lot 79) | `14-devops/16-chaine-approvisionnement` |
| in-toto | Chaîne approvisionnement | Windows, Linux, macOS | 🆕 fait (lot 79) | `14-devops/16-chaine-approvisionnement` |
| Tekton Chains | Signature pipelines | Linux | 🆕 fait (lot 79) | `14-devops/16-chaine-approvisionnement` |
| Renovate | Mise à jour dépendances | Windows, Linux, macOS | 🆕 fait (lot 80) | `14-devops/17-dependances-modernisation` |
| Dependabot (service GitHub) | Mise à jour dépendances | Cloud | 🆕 fait (lot 80) | `14-devops/17-dependances-modernisation` |
| Mend Renovate CLI | Mise à jour dépendances | Windows, Linux, macOS | 🆕 fait (lot 80) | `14-devops/17-dependances-modernisation` |
| OpenRewrite | Modernisation code | Windows, Linux, macOS | 🆕 fait (lot 80) | `14-devops/17-dependances-modernisation` |
| Allure Report | Rapports tests | Windows, Linux, macOS | 🆕 fait (lot 80) | `14-devops/18-tests` |
| ReportPortal | Rapports tests | Linux | 🆕 fait (lot 80) | `14-devops/18-tests` |
| Sonobuoy | Tests Kubernetes | Windows, Linux, macOS | 🆕 fait (lot 80) | `14-devops/18-tests` |
| k6 | Tests de charge | Windows, Linux, macOS | 🆕 fait (lot 81) | `14-devops/18-tests` |
| Apache JMeter | Tests de charge | Windows, Linux, macOS | 🆕 fait (lot 81) | `14-devops/18-tests` |
| Locust | Tests de charge | Windows, Linux, macOS | 🆕 fait (lot 81) | `14-devops/18-tests` |
| Gatling (core) | Tests de charge | Windows, Linux, macOS | 🆕 fait (lot 81) | `14-devops/18-tests` |
| Vegeta | Tests HTTP | Windows, Linux, macOS | 🆕 fait (lot 81) | `14-devops/18-tests` |
| wrk | Tests HTTP | Linux, macOS | 🆕 fait (lot 81) | `14-devops/18-tests` |
| hey | Tests HTTP | Windows, Linux, macOS | 🆕 fait (lot 81) | `14-devops/18-tests` |
| Siege | Tests HTTP | Windows, Linux, macOS | 🆕 fait (lot 81) | `14-devops/18-tests` |
| OWASP Juice Shop | Application de test sécurité | Windows, Linux, macOS | 🆕 fait (lot 80) | `14-devops/18-tests` |
| WebGoat | Application de test sécurité | Windows, Linux, macOS | 🆕 fait (lot 80) | `14-devops/18-tests` |

## 15. SERVICES WINDOWS, GESTION PARC ET OUTILS D'ADMINISTRATION — 41/41

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| OpenSSH for Windows | Serveur/client SSH | Windows | ✅ existant | `08-acces-distant-vpn/01-openssh` |
| PowerShell 7 | Shell et scripts | Windows, Linux, macOS | ✅ existant (lot 82) | `05-web/19-powershell` |
| Windows Terminal | Terminal | Windows | 🆕 fait (lot 82) | `26-gestion-parc/01-outils-windows` |
| WinGet CLI | Gestion paquets Windows | Windows | 🆕 fait (lot 82) | `26-gestion-parc/01-outils-windows` |
| Chocolatey (community edition) | Gestion paquets Windows | Windows | 🆕 fait (lot 82) | `26-gestion-parc/01-outils-windows` |
| Scoop | Gestion paquets Windows | Windows | 🆕 fait (lot 82) | `26-gestion-parc/01-outils-windows` |
| NSSM | Gestion services Windows | Windows | 🆕 fait (lot 82) | `26-gestion-parc/01-outils-windows` |
| WinSW | Wrapper services Windows | Windows | 🆕 fait (lot 82) | `26-gestion-parc/01-outils-windows` |
| RDPY | Outils RDP Python | Windows, Linux, macOS | 🆕 fait (lot 83) | `26-gestion-parc/02-bureau-distant` |
| FreeRDP | Client/serveur RDP | Windows, Linux, macOS | 🆕 fait (lot 83) | `26-gestion-parc/02-bureau-distant` |
| Apache Guacamole | Passerelle RDP/VNC/SSH | Windows, Linux, macOS (serveur Linux) | 🆕 fait (lot 83) | `26-gestion-parc/02-bureau-distant` |
| MeshCentral | Gestion et téléassistance | Windows, Linux, macOS | ✅ existant | `21-outils/06-support-parc/03-meshcentral` |
| RustDesk Server | Relais bureau distant | Windows, Linux, macOS | ✅ existant | `21-outils/06-support-parc/02-rustdesk` |
| Remmina | Client bureau distant | Linux | 🆕 fait (lot 83) | `26-gestion-parc/02-bureau-distant` |
| TigerVNC | Serveur/client VNC | Windows, Linux, macOS | 🆕 fait (lot 83) | `26-gestion-parc/02-bureau-distant` |
| TightVNC | Serveur/client VNC | Windows, Linux | 🆕 fait (lot 83) | `26-gestion-parc/02-bureau-distant` |
| UltraVNC | Serveur/client VNC | Windows | 🆕 fait (lot 83) | `26-gestion-parc/02-bureau-distant` |
| xrdp | Serveur RDP Linux | Linux | 🆕 fait (lot 83) | `26-gestion-parc/02-bureau-distant` |
| X2Go | Bureau distant | Linux, Windows client | 🆕 fait (lot 83) | `26-gestion-parc/02-bureau-distant` |
| FreeIPA client | Intégration identité | Linux | ✅ existant | `01-annuaire-identite/03-freeipa` |
| Winbind | Intégration AD | Windows, Linux | ✅ existant (lot 84) | `09-fichiers-partage/01-samba` |
| WSL | Sous-système Linux | Windows | 🆕 fait (lot 82) | `26-gestion-parc/01-outils-windows` |
| Cygwin | Environnement Unix | Windows | 🆕 fait (lot 82) | `26-gestion-parc/01-outils-windows` |
| MSYS2 | Environnement Unix et outils | Windows | 🆕 fait (lot 82) | `26-gestion-parc/01-outils-windows` |
| Git for Windows | Git et shell | Windows | 🆕 fait (lot 82) | `26-gestion-parc/01-outils-windows` |
| Rufus (open source) | Création supports boot | Windows | 🆕 fait (lot 84) | `26-gestion-parc/03-supports-deploiement` |
| Ventoy | Création supports multiboot | Windows, Linux | 🆕 fait (lot 84) | `26-gestion-parc/03-supports-deploiement` |
| Clonezilla | Clonage système | Windows, Linux, macOS | ✅ existant | `21-outils/07-disques-recuperation/02-clonezilla` |
| FOG Project | Déploiement images | Linux, Windows clients | 🆕 fait (lot 84) | `26-gestion-parc/03-supports-deploiement` |
| opsi | Déploiement logiciel | Linux server, Windows clients | 🆕 fait (lot 84) | `26-gestion-parc/03-supports-deploiement` |
| WAPT Community | Déploiement logiciel | Windows, Linux server | 🆕 fait (lot 84) | `26-gestion-parc/03-supports-deploiement` |
| Open-AudIT | Inventaire réseau | Windows, Linux, macOS | 🆕 fait (lot 84) | `26-gestion-parc/04-inventaire-rmm` |
| GLPI Agent | Inventaire agent | Windows, Linux, macOS | ✅ existant | `21-outils/06-support-parc/04-glpi-installation` |
| Win32-OpenSSH | SSH Windows | Windows | 🆕 fait (lot 82) | `26-gestion-parc/01-outils-windows` |
| RPort | Gestion distante | Windows, Linux, macOS | 🆕 fait (lot 84) | `26-gestion-parc/04-inventaire-rmm` |
| Tactical RMM | RMM et téléassistance | Windows, Linux, macOS | 🆕 fait (lot 84) | `26-gestion-parc/04-inventaire-rmm` |
| Remotely | Téléassistance | Windows, Linux, macOS | 🆕 fait (lot 84) | `26-gestion-parc/04-inventaire-rmm` |
| Actiona | Automatisation GUI | Windows, Linux | 🆕 fait (lot 84) | `26-gestion-parc/05-automatisation-poste` |
| AutoHotkey | Automatisation Windows | Windows | 🆕 fait (lot 84) | `26-gestion-parc/05-automatisation-poste` |
| AutoIt | Automatisation Windows | Windows | 🆕 fait (lot 84) | `26-gestion-parc/05-automatisation-poste` |
| PowerToys | Utilitaires Windows | Windows | 🆕 fait (lot 82) | `26-gestion-parc/01-outils-windows` |

## 16. SERVICES MACOS, LINUX DESKTOP ET OUTILS MULTIPLATEFORMES — 67/67

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| Homebrew | Gestionnaire paquets | macOS, Linux | 🆕 fait (lot 85) | `21-outils/08-gestionnaires-paquets` |
| MacPorts | Gestionnaire paquets | macOS | 🆕 fait (lot 85) | `21-outils/08-gestionnaires-paquets` |
| Nix | Gestionnaire paquets reproductible | Windows, Linux, macOS | 🆕 fait (lot 85) | `21-outils/08-gestionnaires-paquets` |
| GNU Guix | Gestionnaire paquets | Linux | 🆕 fait (lot 85) | `21-outils/08-gestionnaires-paquets` |
| Flatpak | Applications sandbox | Linux | 🆕 fait (lot 85) | `21-outils/08-gestionnaires-paquets` |
| Snapd | Gestionnaire paquets | Linux | 🆕 fait (lot 85) | `21-outils/08-gestionnaires-paquets` |
| AppImage | Format applications portables | Linux | 🆕 fait (lot 85) | `21-outils/08-gestionnaires-paquets` |
| Apt | Gestionnaire paquets | Debian/Ubuntu | ✅ existant (lot 85) | `24-systemes-exploitation/01-debian-ubuntu` |
| DNF | Gestionnaire paquets | Fedora/RHEL-like | ✅ existant (lot 85) | `24-systemes-exploitation/02-famille-red-hat` |
| YUM | Gestionnaire paquets historique | CentOS/RHEL | ✅ existant (lot 85) | `24-systemes-exploitation/02-famille-red-hat` |
| Zypper | Gestionnaire paquets | openSUSE/SLES | ✅ existant (lot 85) | `24-systemes-exploitation/03-opensuse` |
| Pacman | Gestionnaire paquets | Arch Linux | ✅ existant (lot 85) | `24-systemes-exploitation/04-arch-linux` |
| APK | Gestionnaire paquets | Alpine Linux | ✅ existant (lot 85) | `24-systemes-exploitation/06-alpine-linux` |
| Portage | Gestionnaire paquets | Gentoo | ✅ existant (lot 85) | `24-systemes-exploitation/05-gentoo` |
| OpenRC | Init et services | Linux, BSD | 🆕 fait (lot 86) | `21-outils/09-init-processus` |
| systemd | Init et services | Linux | 🆕 fait (lot 86) | `21-outils/09-init-processus` |
| runit | Init et services | Linux, BSD | 🆕 fait (lot 86) | `21-outils/09-init-processus` |
| s6 | Suite supervision services | Linux, BSD | 🆕 fait (lot 86) | `21-outils/09-init-processus` |
| Supervisord | Gestion processus | Windows, Linux, macOS | 🆕 fait (lot 86) | `21-outils/09-init-processus` |
| Monit | Supervision processus | Linux, BSD | 🆕 fait (lot 86) | `21-outils/09-init-processus` |
| PM2 | Gestion processus Node.js | Windows, Linux, macOS | 🆕 fait (lot 86) | `21-outils/09-init-processus` |
| forever | Gestion processus Node.js | Windows, Linux, macOS | 🆕 fait (lot 86) | `21-outils/09-init-processus` |
| circus | Gestion processus | Windows, Linux, macOS | 🆕 fait (lot 86) | `21-outils/09-init-processus` |
| GNU Screen | Multiplexeur terminal | Linux, macOS | 🆕 fait (lot 87) | `21-outils/10-shells-terminal` |
| tmux | Multiplexeur terminal | Windows, Linux, macOS | 🆕 fait (lot 87) | `21-outils/10-shells-terminal` |
| Zellij | Multiplexeur terminal | Windows, Linux, macOS | 🆕 fait (lot 87) | `21-outils/10-shells-terminal` |
| Fish shell | Shell | Windows, Linux, macOS | 🆕 fait (lot 87) | `21-outils/10-shells-terminal` |
| Zsh | Shell | Windows, Linux, macOS | 🆕 fait (lot 87) | `21-outils/10-shells-terminal` |
| Bash | Shell | Windows, Linux, macOS | 🆕 fait (lot 87) | `21-outils/10-shells-terminal` |
| nushell | Shell | Windows, Linux, macOS | 🆕 fait (lot 87) | `21-outils/10-shells-terminal` |
| Starship | Invite shell | Windows, Linux, macOS | 🆕 fait (lot 87) | `21-outils/10-shells-terminal` |
| Oh My Zsh | Configuration Zsh | Linux, macOS | 🆕 fait (lot 87) | `21-outils/10-shells-terminal` |
| chezmoi | Gestion dotfiles | Windows, Linux, macOS | 🆕 fait (lot 87) | `21-outils/10-shells-terminal` |
| GNU Stow | Gestion dotfiles | Linux, macOS | 🆕 fait (lot 87) | `21-outils/10-shells-terminal` |
| Ansible Pull | Configuration poste | Windows, Linux, macOS | ✅ existant | `17-automatisation/01-ansible` |
| Timeshift | Snapshots système | Linux | 🆕 fait (lot 88) | `21-outils/11-sauvegarde-poste` |
| Snapper | Snapshots système | Linux | 🆕 fait (lot 88) | `21-outils/11-sauvegarde-poste` |
| Back In Time | Sauvegarde poste | Linux | 🆕 fait (lot 88) | `21-outils/11-sauvegarde-poste` |
| Déjà Dup | Sauvegarde poste | Linux | 🆕 fait (lot 88) | `21-outils/11-sauvegarde-poste` |
| KDE Connect | Intégration appareils | Windows, Linux, macOS | 🆕 fait (lot 89) | `21-outils/12-partage-appareils` |
| Barrier | Partage clavier/souris | Windows, Linux, macOS | 🆕 fait (lot 89) | `21-outils/12-partage-appareils` |
| Input Leap | Partage clavier/souris | Windows, Linux, macOS | 🆕 fait (lot 89) | `21-outils/12-partage-appareils` |
| Synergy Core (open source legacy) | Partage clavier/souris | Windows, Linux, macOS | 🆕 fait (lot 89) | `21-outils/12-partage-appareils` |
| LocalSend | Transfert fichiers local | Windows, Linux, macOS | 🆕 fait (lot 89) | `21-outils/12-partage-appareils` |
| KDE Plasma | Environnement bureau | Linux, BSD | 🆕 fait (lot 90) | `21-outils/13-environnements-bureau` |
| GNOME | Environnement bureau | Linux, BSD | 🆕 fait (lot 90) | `21-outils/13-environnements-bureau` |
| XFCE | Environnement bureau | Linux, BSD | 🆕 fait (lot 90) | `21-outils/13-environnements-bureau` |
| MATE | Environnement bureau | Linux, BSD | 🆕 fait (lot 90) | `21-outils/13-environnements-bureau` |
| Cinnamon | Environnement bureau | Linux | 🆕 fait (lot 90) | `21-outils/13-environnements-bureau` |
| LXQt | Environnement bureau | Linux | 🆕 fait (lot 90) | `21-outils/13-environnements-bureau` |
| COSMIC | Environnement bureau | Linux | 🆕 fait (lot 90) | `21-outils/13-environnements-bureau` |
| Xfce Terminal | Terminal graphique | Linux | 🆕 fait (lot 91) | `21-outils/14-terminaux-graphiques` |
| Alacritty | Terminal graphique | Windows, Linux, macOS | 🆕 fait (lot 91) | `21-outils/14-terminaux-graphiques` |
| WezTerm | Terminal graphique | Windows, Linux, macOS | 🆕 fait (lot 91) | `21-outils/14-terminaux-graphiques` |
| Kitty | Terminal graphique | Linux, macOS | 🆕 fait (lot 91) | `21-outils/14-terminaux-graphiques` |
| Ghostty | Terminal graphique | Linux, macOS | 🆕 fait (lot 91) | `21-outils/14-terminaux-graphiques` |
| Neovim | Éditeur terminal | Windows, Linux, macOS | 🆕 fait (lot 92) | `21-outils/15-editeurs-texte` |
| Vim | Éditeur texte | Windows, Linux, macOS | 🆕 fait (lot 92) | `21-outils/15-editeurs-texte` |
| Emacs | Éditeur texte | Windows, Linux, macOS | 🆕 fait (lot 92) | `21-outils/15-editeurs-texte` |
| Geany | IDE léger | Windows, Linux, macOS | 🆕 fait (lot 92) | `21-outils/15-editeurs-texte` |
| VSCodium | Éditeur code | Windows, Linux, macOS | 🆕 fait (lot 93) | `21-outils/04-developpement` |
| Eclipse IDE | IDE | Windows, Linux, macOS | ✅ existant | `21-outils/04-developpement/04-eclipse` |
| Apache NetBeans | IDE | Windows, Linux, macOS | 🆕 fait (lot 93) | `21-outils/04-developpement` |
| Qt Creator | IDE | Windows, Linux, macOS | 🆕 fait (lot 93) | `21-outils/04-developpement` |
| Code::Blocks | IDE | Windows, Linux, macOS | 🆕 fait (lot 93) | `21-outils/04-developpement` |
| Kate | Éditeur texte | Linux, Windows | 🆕 fait (lot 92) | `21-outils/15-editeurs-texte` |
| Notepad++ | Éditeur texte | Windows | ✅ existant | `21-outils/04-developpement/05-notepad-plus-plus` |

## 17. STREAMING, MEDIA, AUDIO, VIDEO ET TRANSCODAGE — 49/49

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| Jellyfin | Serveur média | Windows, Linux, macOS | ✅ existant | `20-multimedia-services/01-jellyfin` |
| Navidrome | Serveur musique | Windows, Linux, macOS | ✅ existant | `20-multimedia-services/03-navidrome` |
| Ampache | Serveur musique | Windows, Linux, macOS | 🆕 fait (lot 94) | `20-multimedia-services/08-serveurs-musique` |
| LMS (Lyrion Music Server) | Serveur musique | Windows, Linux, macOS | 🆕 fait (lot 94) | `20-multimedia-services/08-serveurs-musique` |
| Mopidy | Serveur musique | Windows, Linux, macOS | 🆕 fait (lot 94) | `20-multimedia-services/08-serveurs-musique` |
| Airsonic-Advanced | Serveur musique | Windows, Linux, macOS | 🆕 fait (lot 94) | `20-multimedia-services/08-serveurs-musique` |
| Funkwhale | Plateforme audio | Linux | 🆕 fait (lot 94) | `20-multimedia-services/08-serveurs-musique` |
| AzuraCast | Radio web | Linux | 🆕 fait (lot 95) | `20-multimedia-services/09-radio-video` |
| LibreTime | Radio web | Linux | 🆕 fait (lot 95) | `20-multimedia-services/09-radio-video` |
| Icecast | Streaming audio | Windows, Linux, macOS | ✅ existant | `20-multimedia-services/04-icecast` |
| Owncast | Streaming vidéo live | Windows, Linux, macOS | 🆕 fait (lot 95) | `20-multimedia-services/09-radio-video` |
| PeerTube | Plateforme vidéo | Linux | 🆕 fait (lot 95) | `20-multimedia-services/09-radio-video` |
| MediaCMS | Plateforme vidéo | Linux | 🆕 fait (lot 95) | `20-multimedia-services/09-radio-video` |
| Ant Media Community (license check) | Streaming vidéo | Linux | 🆕 fait (lot 96) | `20-multimedia-services/10-serveurs-streaming` |
| OvenMediaEngine | Streaming vidéo | Linux | 🆕 fait (lot 96) | `20-multimedia-services/10-serveurs-streaming` |
| SRS | Serveur streaming | Linux, Windows, macOS | 🆕 fait (lot 96) | `20-multimedia-services/10-serveurs-streaming` |
| Nginx RTMP Module | Streaming RTMP | Linux | ✅ existant | `20-multimedia-services/05-nginx-rtmp` |
| Red5 Open Source | Serveur streaming | Windows, Linux, macOS | 🆕 fait (lot 96) | `20-multimedia-services/10-serveurs-streaming` |
| Janus WebRTC Server | Serveur WebRTC | Linux | 🆕 fait (lot 97) | `20-multimedia-services/11-webrtc` |
| mediasoup | SFU WebRTC | Windows, Linux, macOS | 🆕 fait (lot 97) | `20-multimedia-services/11-webrtc` |
| LiveKit | Serveur WebRTC | Windows, Linux, macOS | 🆕 fait (lot 97) | `20-multimedia-services/11-webrtc` |
| Pion WebRTC | Bibliothèque WebRTC | Windows, Linux, macOS | 🆕 fait (lot 97) | `20-multimedia-services/11-webrtc` |
| Kurento | Serveur média WebRTC | Linux | 🆕 fait (lot 97) | `20-multimedia-services/11-webrtc` |
| FFmpeg | Traitement audio/vidéo | Windows, Linux, macOS | 🆕 fait (lot 98) | `20-multimedia-services/12-traitement-video` |
| HandBrake | Transcodage vidéo | Windows, Linux, macOS | 🆕 fait (lot 98) | `20-multimedia-services/12-traitement-video` |
| GStreamer | Framework multimédia | Windows, Linux, macOS | 🆕 fait (lot 98) | `20-multimedia-services/12-traitement-video` |
| OBS Studio | Capture et streaming | Windows, Linux, macOS | 🆕 fait (lot 99) | `20-multimedia-services/13-capture-lecture` |
| VLC | Lecteur média | Windows, Linux, macOS | 🆕 fait (lot 99) | `20-multimedia-services/13-capture-lecture` |
| MPV | Lecteur média | Windows, Linux, macOS | 🆕 fait (lot 99) | `20-multimedia-services/13-capture-lecture` |
| Kodi | Media center | Windows, Linux, macOS | 🆕 fait (lot 99) | `20-multimedia-services/13-capture-lecture` |
| Shaka Packager | Packaging vidéo | Windows, Linux, macOS | 🆕 fait (lot 100) | `20-multimedia-services/14-packaging-transcodage-auto` |
| Bento4 | Packaging MP4 | Windows, Linux, macOS | 🆕 fait (lot 100) | `20-multimedia-services/14-packaging-transcodage-auto` |
| MediaMTX | Serveur RTSP/RTMP/WebRTC | Windows, Linux, macOS | 🆕 fait (lot 96) | `20-multimedia-services/10-serveurs-streaming` |
| Restreamer | Streaming et retransmission | Windows, Linux, macOS | 🆕 fait (lot 96) | `20-multimedia-services/10-serveurs-streaming` |
| Tdarr (community) | Automatisation transcodage | Windows, Linux, macOS | 🆕 fait (lot 100) | `20-multimedia-services/14-packaging-transcodage-auto` |
| Unmanic | Automatisation médias | Windows, Linux, macOS | 🆕 fait (lot 100) | `20-multimedia-services/14-packaging-transcodage-auto` |
| FileFlows | Traitement médias | Windows, Linux, macOS | 🆕 fait (lot 100) | `20-multimedia-services/14-packaging-transcodage-auto` |
| Bazarr | Sous-titres | Windows, Linux, macOS | 🆕 fait (lot 101) | `20-multimedia-services/15-gestion-medias-arr` |
| Sonarr | Gestion séries | Windows, Linux, macOS | 🆕 fait (lot 101) | `20-multimedia-services/15-gestion-medias-arr` |
| Radarr | Gestion films | Windows, Linux, macOS | 🆕 fait (lot 101) | `20-multimedia-services/15-gestion-medias-arr` |
| Lidarr | Gestion musique | Windows, Linux, macOS | 🆕 fait (lot 101) | `20-multimedia-services/15-gestion-medias-arr` |
| Readarr | Gestion livres | Windows, Linux, macOS | 🆕 fait (lot 101) | `20-multimedia-services/15-gestion-medias-arr` |
| Prowlarr | Gestion indexeurs | Windows, Linux, macOS | 🆕 fait (lot 101) | `20-multimedia-services/15-gestion-medias-arr` |
| Jackett | Proxy indexeurs | Windows, Linux, macOS | 🆕 fait (lot 101) | `20-multimedia-services/15-gestion-medias-arr` |
| qBittorrent | Client BitTorrent | Windows, Linux, macOS | ✅ existant | `20-multimedia-services/06-bittorrent/02-qbittorrent` |
| Transmission | Client BitTorrent | Windows, Linux, macOS | ✅ existant | `20-multimedia-services/06-bittorrent/01-transmission` |
| Deluge | Client BitTorrent | Windows, Linux, macOS | ✅ existant | `20-multimedia-services/06-bittorrent/03-deluge` |
| aria2 | Téléchargement multi-protocole | Windows, Linux, macOS | 🆕 fait (lot 102) | `20-multimedia-services/16-telechargement` |
| yt-dlp | Téléchargement médias | Windows, Linux, macOS | 🆕 fait (lot 102) | `20-multimedia-services/16-telechargement` |

## 18. DNS WEB, EMAIL, ANTI-SPAM ET OUTILS DE COMMUNICATION — 31/31

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| PostfixAdmin | Administration Postfix | Linux | 🆕 fait (lot 103) | `10-messagerie/01-postfix/10-postfixadmin` |
| Mailpit | Test SMTP local | Windows, Linux, macOS | ✅ existant | `10-messagerie/07-mailpit` |
| MailHog | Test SMTP local | Windows, Linux, macOS | 🆕 fait (lot 104) | `10-messagerie/07-mailpit` |
| smtp4dev | Test SMTP local | Windows, Linux, macOS | 🆕 fait (lot 104) | `10-messagerie/07-mailpit` |
| Haraka | Serveur SMTP Node.js | Windows, Linux, macOS | 🆕 fait (lot 103) | `10-messagerie/23-plateformes-envoi` |
| Postal | Plateforme envoi email | Linux | 🆕 fait (lot 103) | `10-messagerie/23-plateformes-envoi` |
| Listmonk | Newsletters | Windows, Linux, macOS | 🆕 fait (lot 106) | `10-messagerie/25-listes-newsletters` |
| Mautic | Marketing automation | Windows, Linux, macOS | 🆕 fait (lot 106) | `10-messagerie/25-listes-newsletters` |
| phpList | Newsletters | Windows, Linux, macOS | 🆕 fait (lot 106) | `10-messagerie/25-listes-newsletters` |
| Sympa | Listes de diffusion | Linux | 🆕 fait (lot 106) | `10-messagerie/25-listes-newsletters` |
| Mailman 3 | Listes de diffusion | Linux | ✅ existant | `10-messagerie/06-mailman` |
| Mailman 2 (legacy) | Listes de diffusion | Linux | 🆕 fait (lot 106) | `10-messagerie/06-mailman` |
| OpenDKIM | Signature DKIM | Linux | 🆕 fait (lot 105) | `10-messagerie/24-authentification-mail` |
| OpenDMARC | Validation DMARC | Linux | 🆕 fait (lot 105) | `10-messagerie/24-authentification-mail` |
| Postgrey | Greylisting SMTP | Linux | 🆕 fait (lot 105) | `10-messagerie/24-authentification-mail` |
| policyd-spf | Validation SPF | Linux | 🆕 fait (lot 105) | `10-messagerie/24-authentification-mail` |
| OpenARC | Validation ARC | Linux | 🆕 fait (lot 105) | `10-messagerie/24-authentification-mail` |
| SoGo Connector | Connecteur groupware | Windows, Linux, macOS | 🆕 fait (lot 107) | `10-messagerie/26-clients-messagerie` |
| Nextcloud Calendar | Calendrier | Linux | ✅ existant | `09-fichiers-partage/08-nextcloud` |
| Nextcloud Contacts | Contacts | Linux | ✅ existant | `09-fichiers-partage/08-nextcloud` |
| DAVx5 (client open source) | Synchronisation CalDAV/CardDAV | Android | 🆕 fait (lot 107) | `10-messagerie/26-clients-messagerie` |
| Evolution | Client mail/groupware | Linux | 🆕 fait (lot 107) | `10-messagerie/26-clients-messagerie` |
| Thunderbird | Client mail | Windows, Linux, macOS | 🆕 fait (lot 107) | `10-messagerie/26-clients-messagerie` |
| KMail | Client mail | Linux | 🆕 fait (lot 107) | `10-messagerie/26-clients-messagerie` |
| Claws Mail | Client mail | Windows, Linux, macOS | 🆕 fait (lot 107) | `10-messagerie/26-clients-messagerie` |
| Mutt | Client mail terminal | Linux, macOS | 🆕 fait (lot 108) | `10-messagerie/27-courrier-terminal` |
| NeoMutt | Client mail terminal | Linux, macOS | 🆕 fait (lot 108) | `10-messagerie/27-courrier-terminal` |
| aerc | Client mail terminal | Windows, Linux, macOS | 🆕 fait (lot 108) | `10-messagerie/27-courrier-terminal` |
| getmail6 | Récupération mail | Linux, macOS | 🆕 fait (lot 108) | `10-messagerie/27-courrier-terminal` |
| Fetchmail | Récupération mail | Windows, Linux, macOS | 🆕 fait (lot 108) | `10-messagerie/27-courrier-terminal` |
| OfflineIMAP | Synchronisation mail | Linux, macOS | 🆕 fait (lot 108) | `10-messagerie/27-courrier-terminal` |

## 19. DATA, BIG DATA, MESSAGE BROKERS ET STREAMING — 55/55

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| Apache Kafka | Streaming événements | Windows, Linux, macOS | ✅ existant | `12-recherche-messages/04-kafka` |
| Redpanda (community source) | Streaming Kafka-compatible | Linux | 🆕 fait (lot 110) | `12-recherche-messages/09-nats-nsq-zeromq-redpanda` |
| Apache Pulsar | Messaging et streaming | Windows, Linux, macOS | 🆕 fait (lot 109) | `12-recherche-messages/08-activemq-rocketmq-pulsar` |
| RabbitMQ | Message broker | Windows, Linux, macOS | ✅ existant | `12-recherche-messages/03-rabbitmq` |
| ActiveMQ Classic | Message broker | Windows, Linux, macOS | 🆕 fait (lot 109) | `12-recherche-messages/08-activemq-rocketmq-pulsar` |
| ActiveMQ Artemis | Message broker | Windows, Linux, macOS | 🆕 fait (lot 109) | `12-recherche-messages/08-activemq-rocketmq-pulsar` |
| Apache RocketMQ | Message broker | Windows, Linux, macOS | 🆕 fait (lot 109) | `12-recherche-messages/08-activemq-rocketmq-pulsar` |
| NATS | Message broker | Windows, Linux, macOS | 🆕 fait (lot 110) | `12-recherche-messages/09-nats-nsq-zeromq-redpanda` |
| Mosquitto | Broker MQTT | Windows, Linux, macOS | ✅ existant | `12-recherche-messages/05-mosquitto` |
| EMQX (community) | Broker MQTT | Windows, Linux, macOS | ✅ existant | `12-recherche-messages/06-emqx` |
| VerneMQ | Broker MQTT | Linux | 🆕 fait (lot 111) | `12-recherche-messages/10-courtiers-mqtt` |
| NanoMQ | Broker MQTT | Windows, Linux, macOS | 🆕 fait (lot 111) | `12-recherche-messages/10-courtiers-mqtt` |
| HiveMQ CE | Broker MQTT | Windows, Linux, macOS | 🆕 fait (lot 111) | `12-recherche-messages/10-courtiers-mqtt` |
| ZeroMQ | Messaging bibliothèque | Windows, Linux, macOS | 🆕 fait (lot 110) | `12-recherche-messages/09-nats-nsq-zeromq-redpanda` |
| NSQ | Message broker | Windows, Linux, macOS | 🆕 fait (lot 110) | `12-recherche-messages/09-nats-nsq-zeromq-redpanda` |
| Beanstalkd | Queue de tâches | Linux, macOS | 🆕 fait (lot 112) | `12-recherche-messages/11-files-de-taches` |
| Gearman | Queue de tâches | Windows, Linux, macOS | 🆕 fait (lot 112) | `12-recherche-messages/11-files-de-taches` |
| Celery | Queue de tâches Python | Windows, Linux, macOS | 🆕 fait (lot 112) | `12-recherche-messages/11-files-de-taches` |
| Dramatiq | Queue de tâches Python | Windows, Linux, macOS | 🆕 fait (lot 112) | `12-recherche-messages/11-files-de-taches` |
| RQ | Queue de tâches Python | Windows, Linux, macOS | 🆕 fait (lot 112) | `12-recherche-messages/11-files-de-taches` |
| BullMQ | Queue de tâches Node.js | Windows, Linux, macOS | 🆕 fait (lot 112) | `12-recherche-messages/11-files-de-taches` |
| pg-boss | Queue PostgreSQL | Windows, Linux, macOS | 🆕 fait (lot 112) | `12-recherche-messages/11-files-de-taches` |
| Graphile Worker | Queue PostgreSQL | Windows, Linux, macOS | 🆕 fait (lot 112) | `12-recherche-messages/11-files-de-taches` |
| Apache Flink | Traitement streaming | Windows, Linux, macOS | 🆕 fait (lot 113) | `28-data-analytique/01-traitement-flux-lots` |
| Apache Spark | Traitement distribué | Windows, Linux, macOS | 🆕 fait (lot 113) | `28-data-analytique/01-traitement-flux-lots` |
| Apache Beam | Traitement data | Windows, Linux, macOS | 🆕 fait (lot 113) | `28-data-analytique/01-traitement-flux-lots` |
| Apache Samza | Traitement streaming | Linux | 🆕 fait (lot 113) | `28-data-analytique/01-traitement-flux-lots` |
| Apache Storm | Traitement streaming | Linux | 🆕 fait (lot 113) | `28-data-analytique/01-traitement-flux-lots` |
| Apache NiFi | Flux de données | Windows, Linux, macOS | 🆕 fait (lot 114) | `28-data-analytique/02-integration-donnees` |
| Apache SeaTunnel | Intégration données | Windows, Linux, macOS | 🆕 fait (lot 114) | `28-data-analytique/02-integration-donnees` |
| Airbyte (community) | ELT | Windows, Linux, macOS | 🆕 fait (lot 114) | `28-data-analytique/02-integration-donnees` |
| Meltano | ELT | Windows, Linux, macOS | 🆕 fait (lot 114) | `28-data-analytique/02-integration-donnees` |
| Singer taps | Connecteurs ELT | Windows, Linux, macOS | 🆕 fait (lot 114) | `28-data-analytique/02-integration-donnees` |
| Debezium | CDC | Windows, Linux, macOS | 🆕 fait (lot 115) | `28-data-analytique/03-cdc-connecteurs` |
| Kafka Connect | Connecteurs streaming | Windows, Linux, macOS | 🆕 fait (lot 115) | `28-data-analytique/03-cdc-connecteurs` |
| Benthos / Redpanda Connect | Pipeline données | Windows, Linux, macOS | 🆕 fait (lot 115) | `28-data-analytique/03-cdc-connecteurs` |
| Flink CDC | CDC streaming | Linux | 🆕 fait (lot 115) | `28-data-analytique/03-cdc-connecteurs` |
| Apache Hudi | Lakehouse | Linux | 🆕 fait (lot 116) | `28-data-analytique/04-lac-donnees` |
| Apache Iceberg | Format table lakehouse | Windows, Linux, macOS | 🆕 fait (lot 116) | `28-data-analytique/04-lac-donnees` |
| Delta Lake | Lakehouse | Windows, Linux, macOS | 🆕 fait (lot 116) | `28-data-analytique/04-lac-donnees` |
| Project Nessie | Catalogue lakehouse | Windows, Linux, macOS | 🆕 fait (lot 116) | `28-data-analytique/04-lac-donnees` |
| Apache Atlas | Gouvernance données | Linux | 🆕 fait (lot 117) | `28-data-analytique/05-catalogues-metadonnees` |
| OpenMetadata | Catalogue et gouvernance | Linux, Windows via conteneur | 🆕 fait (lot 117) | `28-data-analytique/05-catalogues-metadonnees` |
| DataHub | Catalogue données | Linux | 🆕 fait (lot 117) | `28-data-analytique/05-catalogues-metadonnees` |
| Amundsen | Catalogue données | Linux | 🆕 fait (lot 117) | `28-data-analytique/05-catalogues-metadonnees` |
| dbt Core | Transformation SQL | Windows, Linux, macOS | 🆕 fait (lot 118) | `28-data-analytique/06-transformation` |
| SQLMesh | Transformation SQL | Windows, Linux, macOS | 🆕 fait (lot 118) | `28-data-analytique/06-transformation` |
| Polars | DataFrame | Windows, Linux, macOS | 🆕 fait (lot 118) | `28-data-analytique/06-transformation` |
| Apache Arrow | Format et moteur colonne | Windows, Linux, macOS | 🆕 fait (lot 118) | `28-data-analytique/06-transformation` |
| JupyterHub | Plateforme notebooks | Windows, Linux, macOS | 🆕 fait (lot 119) | `28-data-analytique/07-science-donnees` |
| JupyterLab | Notebooks | Windows, Linux, macOS | ✅ existant | `21-outils/05-ia-productivite/05-jupyterlab` |
| MLflow | Cycle de vie ML | Windows, Linux, macOS | 🆕 fait (lot 119) | `28-data-analytique/07-science-donnees` |
| DVC | Versionnement données | Windows, Linux, macOS | 🆕 fait (lot 119) | `28-data-analytique/07-science-donnees` |
| LakeFS | Versionnement data lake | Windows, Linux, macOS | 🆕 fait (lot 116) | `28-data-analytique/04-lac-donnees` |
| Pachyderm | Pipelines données | Linux | 🆕 fait (lot 119) | `28-data-analytique/07-science-donnees` |

## 20. IA, MACHINE LEARNING ET INFERENCE AUTO-HEBERGEE — 57/57

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| Ollama | Exécution LLM locale | Windows, Linux, macOS | ✅ existant | `21-outils/05-ia-productivite/04-ollama-open-webui` |
| llama.cpp | Inference LLM | Windows, Linux, macOS | 🆕 fait (lot 120) | `29-ia-machine-learning/01-inference-locale` |
| LocalAI | API IA locale | Windows, Linux, macOS | 🆕 fait (lot 120) | `29-ia-machine-learning/01-inference-locale` |
| vLLM | Serveur inference LLM | Linux | 🆕 fait (lot 121) | `29-ia-machine-learning/02-serveurs-inference` |
| Text Generation Inference | Serveur inference LLM | Linux | 🆕 fait (lot 121) | `29-ia-machine-learning/02-serveurs-inference` |
| Hugging Face Transformers | Bibliothèque ML | Windows, Linux, macOS | 🆕 fait (lot 121) | `29-ia-machine-learning/02-serveurs-inference` |
| Hugging Face TGI | Inference LLM | Linux | 🆕 fait (lot 121) | `29-ia-machine-learning/02-serveurs-inference` |
| Open WebUI | Interface LLM auto-hébergée | Windows, Linux, macOS | ✅ existant | `21-outils/05-ia-productivite/04-ollama-open-webui` |
| LibreChat | Interface chat IA | Windows, Linux, macOS | 🆕 fait (lot 122) | `29-ia-machine-learning/03-interfaces-chat` |
| AnythingLLM | Espace de travail LLM | Windows, Linux, macOS | 🆕 fait (lot 122) | `29-ia-machine-learning/03-interfaces-chat` |
| Dify | Plateforme applications IA | Windows, Linux, macOS | 🆕 fait (lot 124) | `29-ia-machine-learning/05-constructeurs-applications` |
| Flowise | Constructeur flux LLM | Windows, Linux, macOS | 🆕 fait (lot 124) | `29-ia-machine-learning/05-constructeurs-applications` |
| Langflow | Constructeur flux IA | Windows, Linux, macOS | 🆕 fait (lot 124) | `29-ia-machine-learning/05-constructeurs-applications` |
| LangChain | Framework LLM | Windows, Linux, macOS | 🆕 fait (lot 125) | `29-ia-machine-learning/06-frameworks-rag` |
| LlamaIndex | Framework RAG | Windows, Linux, macOS | 🆕 fait (lot 125) | `29-ia-machine-learning/06-frameworks-rag` |
| Haystack | Framework recherche/RAG | Windows, Linux, macOS | 🆕 fait (lot 125) | `29-ia-machine-learning/06-frameworks-rag` |
| RAGFlow | Moteur RAG | Linux | 🆕 fait (lot 125) | `29-ia-machine-learning/06-frameworks-rag` |
| Quivr | Base de connaissance IA | Linux, Windows via conteneur | 🆕 fait (lot 125) | `29-ia-machine-learning/06-frameworks-rag` |
| Khoj | Assistant personnel IA | Windows, Linux, macOS | 🆕 fait (lot 123) | `29-ia-machine-learning/04-applications-locales` |
| PrivateGPT | RAG local | Windows, Linux, macOS | 🆕 fait (lot 123) | `29-ia-machine-learning/04-applications-locales` |
| GPT4All | LLM local | Windows, Linux, macOS | 🆕 fait (lot 123) | `29-ia-machine-learning/04-applications-locales` |
| Jan | LLM local | Windows, Linux, macOS | 🆕 fait (lot 123) | `29-ia-machine-learning/04-applications-locales` |
| KoboldCpp | Inference LLM | Windows, Linux, macOS | 🆕 fait (lot 120) | `29-ia-machine-learning/01-inference-locale` |
| text-generation-webui | Interface inference LLM | Windows, Linux, macOS | 🆕 fait (lot 122) | `29-ia-machine-learning/03-interfaces-chat` |
| SillyTavern | Interface chat LLM | Windows, Linux, macOS | 🆕 fait (lot 122) | `29-ia-machine-learning/03-interfaces-chat` |
| ComfyUI | Génération image par nœuds | Windows, Linux, macOS | 🆕 fait (lot 126) | `29-ia-machine-learning/07-generation-images` |
| AUTOMATIC1111 Stable Diffusion WebUI | Génération image | Windows, Linux, macOS | 🆕 fait (lot 126) | `29-ia-machine-learning/07-generation-images` |
| InvokeAI | Génération image | Windows, Linux, macOS | 🆕 fait (lot 126) | `29-ia-machine-learning/07-generation-images` |
| Fooocus | Génération image | Windows, Linux, macOS | 🆕 fait (lot 126) | `29-ia-machine-learning/07-generation-images` |
| OpenCV | Vision par ordinateur | Windows, Linux, macOS | 🆕 fait (lot 127) | `29-ia-machine-learning/08-frameworks-ml` |
| PyTorch | Framework ML | Windows, Linux, macOS | 🆕 fait (lot 127) | `29-ia-machine-learning/08-frameworks-ml` |
| TensorFlow | Framework ML | Windows, Linux, macOS | 🆕 fait (lot 127) | `29-ia-machine-learning/08-frameworks-ml` |
| JAX | Framework ML | Windows, Linux, macOS | 🆕 fait (lot 127) | `29-ia-machine-learning/08-frameworks-ml` |
| scikit-learn | Machine learning | Windows, Linux, macOS | 🆕 fait (lot 128) | `29-ia-machine-learning/09-ml-classique-inference` |
| XGBoost | Machine learning | Windows, Linux, macOS | 🆕 fait (lot 128) | `29-ia-machine-learning/09-ml-classique-inference` |
| LightGBM | Machine learning | Windows, Linux, macOS | 🆕 fait (lot 128) | `29-ia-machine-learning/09-ml-classique-inference` |
| CatBoost | Machine learning | Windows, Linux, macOS | 🆕 fait (lot 128) | `29-ia-machine-learning/09-ml-classique-inference` |
| ONNX Runtime | Inference ML | Windows, Linux, macOS | 🆕 fait (lot 128) | `29-ia-machine-learning/09-ml-classique-inference` |
| OpenVINO | Inference accélérée | Windows, Linux, macOS | 🆕 fait (lot 128) | `29-ia-machine-learning/09-ml-classique-inference` |
| BentoML | Déploiement modèles | Windows, Linux, macOS | 🆕 fait (lot 129) | `29-ia-machine-learning/10-mlops-serving` |
| KServe | Serving modèles Kubernetes | Linux | 🆕 fait (lot 129) | `29-ia-machine-learning/10-mlops-serving` |
| Seldon Core | Serving modèles | Linux | 🆕 fait (lot 129) | `29-ia-machine-learning/10-mlops-serving` |
| Ray | Calcul distribué/IA | Windows, Linux, macOS | 🆕 fait (lot 129) | `29-ia-machine-learning/10-mlops-serving` |
| Kubeflow | Plateforme ML Kubernetes | Linux | 🆕 fait (lot 129) | `29-ia-machine-learning/10-mlops-serving` |
| ClearML | MLOps | Windows, Linux, macOS | 🆕 fait (lot 130) | `29-ia-machine-learning/11-experiences-annotation` |
| Aim | Suivi expériences ML | Windows, Linux, macOS | 🆕 fait (lot 130) | `29-ia-machine-learning/11-experiences-annotation` |
| Label Studio | Annotation données | Windows, Linux, macOS | 🆕 fait (lot 130) | `29-ia-machine-learning/11-experiences-annotation` |
| CVAT | Annotation vision | Windows, Linux, macOS | 🆕 fait (lot 130) | `29-ia-machine-learning/11-experiences-annotation` |
| FiftyOne | Gestion datasets vision | Windows, Linux, macOS | 🆕 fait (lot 130) | `29-ia-machine-learning/11-experiences-annotation` |
| Whisper.cpp | Transcription locale | Windows, Linux, macOS | 🆕 fait (lot 131) | `29-ia-machine-learning/12-audio-voix` |
| faster-whisper | Transcription audio | Windows, Linux, macOS | 🆕 fait (lot 131) | `29-ia-machine-learning/12-audio-voix` |
| Whisper | Reconnaissance vocale | Windows, Linux, macOS | 🆕 fait (lot 131) | `29-ia-machine-learning/12-audio-voix` |
| Piper | Synthèse vocale | Windows, Linux, macOS | 🆕 fait (lot 131) | `29-ia-machine-learning/12-audio-voix` |
| Coqui TTS | Synthèse vocale | Windows, Linux, macOS | 🆕 fait (lot 131) | `29-ia-machine-learning/12-audio-voix` |
| Kokoro TTS (open weights) | Synthèse vocale (licence modèle à vérifier) | Windows, Linux, macOS | 🆕 fait (lot 131) | `29-ia-machine-learning/12-audio-voix` |
| RVC Project | Conversion voix | Windows, Linux, macOS | 🆕 fait (lot 131) | `29-ia-machine-learning/12-audio-voix` |
| Mimic 3 | Synthèse vocale | Linux | 🆕 fait (lot 131) | `29-ia-machine-learning/12-audio-voix` |

## 21. DOCUMENTATION, RECHERCHE, GED ET CONNAISSANCE — 18/48

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| Paperless-ngx | GED et archivage | Windows, Linux, macOS | 🆕 fait (lot 132) | `32-documentation-ged/01-ged-legere` |
| Mayan EDMS | GED | Linux | 🆕 fait (lot 132) | `32-documentation-ged/01-ged-legere` |
| Teedy | GED | Windows, Linux, macOS | 🆕 fait (lot 132) | `32-documentation-ged/01-ged-legere` |
| OpenKM Community | GED | Windows, Linux | 🆕 fait (lot 133) | `32-documentation-ged/02-ged-entreprise` |
| LogicalDOC Community | GED | Windows, Linux | 🆕 fait (lot 133) | `32-documentation-ged/02-ged-entreprise` |
| SeedDMS | GED | Windows, Linux, macOS | 🆕 fait (lot 133) | `32-documentation-ged/02-ged-entreprise` |
| Docspell | GED | Windows, Linux, macOS | 🆕 fait (lot 132) | `32-documentation-ged/01-ged-legere` |
| Documenso | Signature électronique | Windows, Linux, macOS | 🆕 fait (lot 134) | `32-documentation-ged/03-signature-pdf` |
| OpenSign | Signature électronique | Linux | 🆕 fait (lot 134) | `32-documentation-ged/03-signature-pdf` |
| LibreSign | Signature électronique Nextcloud | Linux | 🆕 fait (lot 134) | `32-documentation-ged/03-signature-pdf` |
| Stirling-PDF | Outils PDF web | Windows, Linux, macOS | 🆕 fait (lot 134) | `32-documentation-ged/03-signature-pdf` |
| Gotenberg | Conversion documents API | Windows, Linux, macOS | 🆕 fait (lot 134) | `32-documentation-ged/03-signature-pdf` |
| ONLYOFFICE Docs Community | Suite bureautique serveur | Windows, Linux | 🆕 fait (lot 135) | `32-documentation-ged/04-bureautique` |
| Collabora Online Development Edition | Suite bureautique web | Linux | 🆕 fait (lot 135) | `32-documentation-ged/04-bureautique` |
| LibreOffice | Suite bureautique | Windows, Linux, macOS | 🆕 fait (lot 135) | `32-documentation-ged/04-bureautique` |
| Apache OpenOffice | Suite bureautique | Windows, Linux, macOS | 🆕 fait (lot 135) | `32-documentation-ged/04-bureautique` |
| TriliumNext Notes | Base de connaissances | Windows, Linux, macOS | ⏳ à faire | → `29-documentation-ged` |
| Joplin Server | Synchronisation notes | Windows, Linux, macOS | ✅ existant | `10-messagerie/09-joplin-server` |
| Memos | Notes auto-hébergées | Windows, Linux, macOS | ⏳ à faire | → `29-documentation-ged` |
| SilverBullet | Base de connaissance Markdown | Windows, Linux, macOS | ⏳ à faire | → `29-documentation-ged` |
| Logseq | Notes et graphe | Windows, Linux, macOS | ⏳ à faire | → `29-documentation-ged` |
| SiYuan | Base de connaissances | Windows, Linux, macOS | ⏳ à faire | → `29-documentation-ged` |
| Documize Community | Documentation | Linux | ⏳ à faire | → `29-documentation-ged` |
| Read the Docs (community stack) | Documentation technique | Windows, Linux, macOS | ⏳ à faire | → `29-documentation-ged` |
| MkDocs | Documentation statique | Windows, Linux, macOS | ⏳ à faire | → `29-documentation-ged` |
| Material for MkDocs | Thème documentation | Windows, Linux, macOS | ⏳ à faire | → `29-documentation-ged` |
| Docusaurus | Documentation statique | Windows, Linux, macOS | ⏳ à faire | → `29-documentation-ged` |
| VitePress | Documentation statique | Windows, Linux, macOS | ⏳ à faire | → `29-documentation-ged` |
| Sphinx | Documentation Python | Windows, Linux, macOS | ⏳ à faire | → `29-documentation-ged` |
| Antora | Documentation technique | Windows, Linux, macOS | ⏳ à faire | → `29-documentation-ged` |
| Bookdown | Publication docs | Windows, Linux, macOS | ⏳ à faire | → `29-documentation-ged` |
| Hugo | Générateur site statique | Windows, Linux, macOS | ⏳ à faire | → `29-documentation-ged` |
| Jekyll | Générateur site statique | Windows, Linux, macOS | ⏳ à faire | → `29-documentation-ged` |
| Zola | Générateur site statique | Windows, Linux, macOS | ⏳ à faire | → `29-documentation-ged` |
| Astro | Framework web statique | Windows, Linux, macOS | ⏳ à faire | → `29-documentation-ged` |
| Quartz | Publication notes | Windows, Linux, macOS | ⏳ à faire | → `29-documentation-ged` |
| Meilisearch | Moteur recherche | Windows, Linux, macOS | ⏳ à faire | → `12-recherche-messages` |
| Typesense | Moteur recherche | Windows, Linux, macOS | ⏳ à faire | → `12-recherche-messages` |
| Sonic | Moteur recherche | Linux | ⏳ à faire | → `12-recherche-messages` |
| Apache Solr | Moteur recherche | Windows, Linux, macOS | ⏳ à faire | → `12-recherche-messages` |
| Elasticsearch (license changed) | Moteur recherche (licence non OSI selon version) | Windows, Linux, macOS | ✅ existant | `12-recherche-messages/01-elasticsearch` |
| Manticore Search | Moteur recherche | Windows, Linux, macOS | ⏳ à faire | → `12-recherche-messages` |
| ZincSearch | Moteur recherche | Windows, Linux, macOS | ⏳ à faire | → `12-recherche-messages` |
| Tantivy | Bibliothèque recherche | Windows, Linux, macOS | ⏳ à faire | → `12-recherche-messages` |
| Whoogle | Métamoteur recherche privé | Windows, Linux, macOS | ⏳ à faire | → `12-recherche-messages` |
| SearXNG | Métamoteur recherche | Windows, Linux, macOS | ⏳ à faire | → `12-recherche-messages` |
| 4get | Métamoteur recherche | Windows, Linux, macOS | ⏳ à faire | → `12-recherche-messages` |
| LibreX | Métamoteur recherche | Linux | ⏳ à faire | → `12-recherche-messages` |

## 22. RESEAU, ACCES DISTANT, TRANSFERT ET OUTILS DIAGNOSTIC — 4/50

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| OpenSSH | SSH client/serveur | Windows, Linux, macOS | ✅ existant | `08-acces-distant-vpn/01-openssh` |
| Dropbear SSH | Serveur SSH léger | Linux, embedded | ⏳ à faire | → `08-acces-distant-vpn` |
| TinySSH | Serveur SSH minimal | Linux | ⏳ à faire | → `08-acces-distant-vpn` |
| Mosh | Terminal distant | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| Eternal Terminal | Terminal distant | Linux, macOS | ⏳ à faire | → `21-outils` |
| tmate | Partage terminal | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| GNU inetutils | Utilitaires réseau | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| socat | Relais sockets | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| ncat | Outil réseau | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| netcat-openbsd | Outil réseau | Linux, BSD | ⏳ à faire | → `21-outils` |
| iperf3 | Mesure débit réseau | Windows, Linux, macOS | ✅ existant | `21-outils/02-reseau-diagnostic/05-iperf3` |
| mtr | Diagnostic réseau | Windows, Linux, macOS | ✅ existant | `21-outils/02-reseau-diagnostic/06-dig-mtr-curl` |
| traceroute | Diagnostic réseau | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| fping | Ping multi-hôtes | Linux, BSD | ⏳ à faire | → `21-outils` |
| arp-scan | Découverte LAN | Linux | ⏳ à faire | → `21-outils` |
| arping | Diagnostic ARP | Linux | ⏳ à faire | → `21-outils` |
| Ettercap | Analyse réseau | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| Bettercap | Analyse réseau | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| MITMf (archivé) | Outils réseau anciens | Linux | ⏳ à faire | → `21-outils` |
| Aircrack-ng | Audit Wi-Fi | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| Kismet | Détection réseau sans fil | Linux, macOS | ⏳ à faire | → `21-outils` |
| hostapd | Point d'accès Wi-Fi | Linux | ⏳ à faire | → `21-outils` |
| wpa_supplicant | Client Wi-Fi | Linux, Windows | ⏳ à faire | → `21-outils` |
| iw | Outils Wi-Fi | Linux | ⏳ à faire | → `21-outils` |
| iwctl/iwd | Gestion Wi-Fi | Linux | ⏳ à faire | → `21-outils` |
| NetworkManager | Gestion réseau | Linux | ⏳ à faire | → `21-outils` |
| systemd-networkd | Gestion réseau | Linux | ⏳ à faire | → `21-outils` |
| ConnMan | Gestion réseau | Linux | ⏳ à faire | → `21-outils` |
| Open vSwitch | Switch virtuel | Linux, Windows | ⏳ à faire | → `21-outils` |
| FRR | Routage dynamique | Linux, BSD | 🆕 fait (lot 51) | `22-constructeurs/31-routage-logiciel` |
| iperf2 | Mesure réseau | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| OpenSpeedTest | Test débit web | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| LibreSpeed | Test débit web | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| Speedtest Tracker | Historique tests débit | Linux | ⏳ à faire | → `21-outils` |
| Smokeping | Latence réseau | Linux | ⏳ à faire | → `21-outils` |
| Blackbox Exporter | Sondes réseau Prometheus | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| Fping exporter | Sonde ping | Linux | ⏳ à faire | → `21-outils` |
| Netdisco | Découverte réseau | Linux | ⏳ à faire | → `21-outils` |
| Oxidized | Sauvegarde configuration réseau | Linux | ⏳ à faire | → `21-outils` |
| RANCID | Sauvegarde configuration réseau | Linux, Unix | ⏳ à faire | → `21-outils` |
| Batfish | Validation configuration réseau | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| Containerlab | Laboratoire réseau | Linux | ⏳ à faire | → `21-outils` |
| Kathara | Laboratoire réseau | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| GNS3 | Simulation réseau | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| CORE Network Emulator | Émulation réseau | Linux | ⏳ à faire | → `21-outils` |
| ns-3 | Simulation réseau | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| Mininet | Émulation réseau SDN | Linux | ⏳ à faire | → `21-outils` |
| OpenDaylight | Contrôleur SDN | Linux | ⏳ à faire | → `21-outils` |
| ONOS | Contrôleur SDN | Linux | ⏳ à faire | → `21-outils` |
| Ryu SDN Framework | Contrôleur SDN | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |

## 23. GESTION MATERIEL, INVENTAIRE, IMPRESSION ET SERVICES DIVERS — 2/41

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| FusionInventory Agent | Inventaire agent | Windows, Linux, macOS | ⏳ à faire | → `26-gestion-parc` |
| i-doit Open | CMDB | Linux | ⏳ à faire | → `26-gestion-parc` |
| CMDBuild | CMDB | Windows, Linux | ⏳ à faire | → `26-gestion-parc` |
| PartKeepr (archivé) | Inventaire composants | Linux | ⏳ à faire | → `26-gestion-parc` |
| Grocy | Gestion inventaire | Windows, Linux, macOS | ⏳ à faire | → `26-gestion-parc` |
| Homebox | Inventaire domestique | Windows, Linux, macOS | ⏳ à faire | → `26-gestion-parc` |
| ERPNext Stock | Gestion stocks | Linux | ⏳ à faire | → `26-gestion-parc` |
| OpenWMS | Gestion entrepôt | Windows, Linux | ⏳ à faire | → `26-gestion-parc` |
| OpenLMIS | Logistique | Linux | ⏳ à faire | → `26-gestion-parc` |
| CUPS | Serveur impression | Linux, macOS | ✅ existant | `18-infrastructure-systeme/03-impression` |
| IPP Everywhere | Impression réseau | Linux, macOS | ⏳ à faire | → `26-gestion-parc` |
| Samba print services | Partage imprimantes | Windows, Linux | ✅ existant | `09-fichiers-partage/01-samba` |
| OctoPrint | Serveur impression 3D | Windows, Linux, macOS | ⏳ à faire | → `26-gestion-parc` |
| Klipper | Firmware impression 3D | Linux, SBC | ⏳ à faire | → `26-gestion-parc` |
| Moonraker | API impression 3D | Linux | ⏳ à faire | → `26-gestion-parc` |
| Mainsail | Interface impression 3D | Linux | ⏳ à faire | → `26-gestion-parc` |
| Fluidd | Interface impression 3D | Linux | ⏳ à faire | → `26-gestion-parc` |
| Home Assistant | Domotique | Windows, Linux, macOS | ⏳ à faire | → `26-gestion-parc` |
| openHAB | Domotique | Windows, Linux, macOS | ⏳ à faire | → `26-gestion-parc` |
| Domoticz | Domotique | Windows, Linux, macOS | ⏳ à faire | → `26-gestion-parc` |
| ThingsBoard Community | Plateforme IoT | Windows, Linux, macOS | ⏳ à faire | → `26-gestion-parc` |
| Mainflux | Plateforme IoT | Linux | ⏳ à faire | → `26-gestion-parc` |
| Kaa IoT (community) | Plateforme IoT | Linux | ⏳ à faire | → `26-gestion-parc` |
| Eclipse Mosquitto | Broker IoT MQTT | Windows, Linux, macOS | ⏳ à faire | → `26-gestion-parc` |
| Eclipse Kura | Passerelle IoT | Linux | ⏳ à faire | → `26-gestion-parc` |
| ChirpStack | Serveur LoRaWAN | Linux | ⏳ à faire | → `26-gestion-parc` |
| The Things Network Stack | Serveur LoRaWAN | Linux | ⏳ à faire | → `26-gestion-parc` |
| ThingsBoard Gateway | Passerelle IoT | Windows, Linux, macOS | ⏳ à faire | → `26-gestion-parc` |
| Zigbee2MQTT | Passerelle Zigbee | Windows, Linux, macOS | ⏳ à faire | → `26-gestion-parc` |
| Z-Wave JS UI | Passerelle Z-Wave | Windows, Linux, macOS | ⏳ à faire | → `26-gestion-parc` |
| ESPHome | Firmware IoT | Windows, Linux, macOS | ⏳ à faire | → `26-gestion-parc` |
| Tasmota | Firmware IoT | ESP | ⏳ à faire | → `26-gestion-parc` |
| OpenMQTTGateway | Passerelle IoT | ESP | ⏳ à faire | → `26-gestion-parc` |
| Frigate | NVR détection objets | Linux | ⏳ à faire | → `26-gestion-parc` |
| ZoneMinder | Vidéosurveillance | Linux | ⏳ à faire | → `26-gestion-parc` |
| Shinobi | NVR vidéosurveillance | Linux, Windows via conteneur | ⏳ à faire | → `26-gestion-parc` |
| Motion | Détection mouvement | Linux | ⏳ à faire | → `26-gestion-parc` |
| motionEye (legacy) | Interface vidéosurveillance | Linux | ⏳ à faire | → `26-gestion-parc` |
| Kerberos.io | Vidéosurveillance | Linux | ⏳ à faire | → `26-gestion-parc` |
| Scrypted | Passerelle caméra | Windows, Linux, macOS | ⏳ à faire | → `26-gestion-parc` |
| go2rtc | Relais flux caméra | Windows, Linux, macOS | ⏳ à faire | → `26-gestion-parc` |

## 24. OUTILS DE DEVELOPPEMENT, API ET TESTS — 3/62

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| Insomnia (license check) | Client API | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| Bruno | Client API | Windows, Linux, macOS | ✅ existant | `21-outils/02-reseau-diagnostic/07-postman-bruno` |
| Hoppscotch | Client API web | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| HTTPie | Client HTTP | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| curl | Client HTTP | Windows, Linux, macOS | ✅ existant | `21-outils/02-reseau-diagnostic/06-dig-mtr-curl` |
| wget | Téléchargement HTTP | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| xh | Client HTTP | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| Swagger UI | Documentation API | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| Swagger Editor | Édition OpenAPI | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| Redoc | Documentation API | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| Scalar | Documentation API | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| Stoplight Elements | Documentation API | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| Prism | Mock serveur API | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| WireMock | Mock HTTP | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| MockServer | Mock API | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| Hoverfly | Simulation API | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| Mountebank | Mock multi-protocoles | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| Pact | Tests contractuels | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| Schemathesis | Tests API | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| Dredd | Tests API | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| Hurl | Tests HTTP | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| Newman | Runner Postman collections | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| Apache Bench | Tests HTTP | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| wrk2 | Tests HTTP | Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| Autocannon | Tests HTTP | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| oha | Tests HTTP | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| Playwright | Tests navigateur | Windows, Linux, macOS | ✅ existant | `21-outils/04-developpement/09-playwright` |
| Selenium | Automatisation navigateur | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| Cypress | Tests navigateur | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| WebdriverIO | Tests navigateur | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| Puppeteer | Automatisation navigateur | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| Robot Framework | Automatisation tests | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| pytest | Tests Python | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| JUnit | Tests Java | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| TestNG | Tests Java | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| NUnit | Tests .NET | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| xUnit.net | Tests .NET | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| MSTest | Tests .NET | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| Cucumber | Tests BDD | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| Behave | Tests BDD Python | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| Ginkgo | Tests Go | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| Go test | Tests Go | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| cargo test | Tests Rust | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| Vitest | Tests JavaScript | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| Jest | Tests JavaScript | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| Mocha | Tests JavaScript | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| AVA | Tests JavaScript | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| PHPUnit | Tests PHP | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| Pest PHP | Tests PHP | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| Rspec | Tests Ruby | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| Minitest | Tests Ruby | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| Gitleaks | Détection secrets Git | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| detect-secrets | Détection secrets | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| TruffleHog OSS | Détection secrets | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| Checkov | Analyse IaC | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| KICS | Analyse IaC | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| Terrascan | Analyse IaC | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| TFLint | Lint Terraform | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| Actionlint | Lint GitHub Actions | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| ShellCheck | Lint shell | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| shfmt | Formatage shell | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |
| EditorConfig | Conventions code | Windows, Linux, macOS | ⏳ à faire | → `30-developpement-api` |

## 25. SERVICES DE PLATEFORME, PORTAILS ET OUTILS AUTO-HEBERGES — 1/60

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| Coolify | Plateforme déploiement PaaS | Linux | ⏳ à faire | → `31-auto-hebergement` |
| Dokku | PaaS léger | Linux | ⏳ à faire | → `31-auto-hebergement` |
| CapRover | PaaS | Linux | ⏳ à faire | → `31-auto-hebergement` |
| HomelabOS | Déploiement services homelab | Linux | ⏳ à faire | → `31-auto-hebergement` |
| Ansible-NAS | Déploiement NAS | Linux | ⏳ à faire | → `31-auto-hebergement` |
| Sandstorm | Plateforme applications | Linux | ⏳ à faire | → `31-auto-hebergement` |
| FreedomBox | Serveur personnel | Debian | ⏳ à faire | → `31-auto-hebergement` |
| HestiaCP | Panneau hébergement | Linux | ⏳ à faire | → `31-auto-hebergement` |
| CyberPanel (open source components) | Panneau hébergement | Linux | ⏳ à faire | → `31-auto-hebergement` |
| ISPConfig | Panneau hébergement | Linux | ⏳ à faire | → `31-auto-hebergement` |
| Virtualmin GPL | Panneau hébergement | Linux | ⏳ à faire | → `31-auto-hebergement` |
| Webmin | Administration serveur | Linux, Unix | ⏳ à faire | → `31-auto-hebergement` |
| Ajenti | Administration serveur | Linux | ⏳ à faire | → `31-auto-hebergement` |
| Froxlor | Panneau hébergement | Linux | ⏳ à faire | → `31-auto-hebergement` |
| Virtualmin | Panneau hébergement | Linux | ⏳ à faire | → `31-auto-hebergement` |
| Yacht | Gestion Docker | Linux | ⏳ à faire | → `31-auto-hebergement` |
| Dockge | Gestion Compose | Linux, Windows via conteneur | ⏳ à faire | → `31-auto-hebergement` |
| Komodo | Gestion déploiements conteneurs | Linux | ⏳ à faire | → `31-auto-hebergement` |
| Homepage | Dashboard serveur | Windows, Linux, macOS | ⏳ à faire | → `31-auto-hebergement` |
| Homarr | Dashboard serveur | Windows, Linux, macOS | ⏳ à faire | → `31-auto-hebergement` |
| Dashy | Dashboard serveur | Windows, Linux, macOS | ⏳ à faire | → `31-auto-hebergement` |
| Heimdall | Dashboard applications | Linux, Windows via conteneur | ⏳ à faire | → `31-auto-hebergement` |
| Flame | Dashboard applications | Windows, Linux, macOS | ⏳ à faire | → `31-auto-hebergement` |
| Organizr | Dashboard applications | Windows, Linux, macOS | ⏳ à faire | → `31-auto-hebergement` |
| Glance | Dashboard | Windows, Linux, macOS | ⏳ à faire | → `31-auto-hebergement` |
| Homer | Dashboard | Windows, Linux, macOS | ⏳ à faire | → `31-auto-hebergement` |
| Fenrus | Dashboard | Windows, Linux, macOS | ⏳ à faire | → `31-auto-hebergement` |
| DashMachine | Dashboard | Linux | ⏳ à faire | → `31-auto-hebergement` |
| SUI | Dashboard auto-hébergement | Windows, Linux, macOS | ⏳ à faire | → `31-auto-hebergement` |
| OliveTin | Exécution commandes contrôlée | Windows, Linux, macOS | ⏳ à faire | → `31-auto-hebergement` |
| Ansible Semaphore | Interface Ansible | Windows, Linux, macOS | ⏳ à faire | → `31-auto-hebergement` |
| NocoDB | Base no-code | Windows, Linux, macOS | ⏳ à faire | → `31-auto-hebergement` |
| Baserow | Base no-code | Windows, Linux, macOS | ⏳ à faire | → `31-auto-hebergement` |
| Grist | Tableur/base de données | Windows, Linux, macOS | ⏳ à faire | → `31-auto-hebergement` |
| Appsmith | Applications internes | Windows, Linux, macOS | ⏳ à faire | → `31-auto-hebergement` |
| Budibase | Applications internes | Windows, Linux, macOS | ⏳ à faire | → `31-auto-hebergement` |
| ToolJet | Applications internes | Windows, Linux, macOS | ⏳ à faire | → `31-auto-hebergement` |
| Supabase (self-hosted) | Backend-as-a-Service | Windows, Linux, macOS | ⏳ à faire | → `31-auto-hebergement` |
| Appwrite | Backend-as-a-Service | Windows, Linux, macOS | ⏳ à faire | → `31-auto-hebergement` |
| PocketBase | Backend léger | Windows, Linux, macOS | ⏳ à faire | → `31-auto-hebergement` |
| Parse Server | Backend-as-a-Service | Windows, Linux, macOS | ⏳ à faire | → `31-auto-hebergement` |
| Hasura GraphQL Engine | API GraphQL | Windows, Linux, macOS | ⏳ à faire | → `31-auto-hebergement` |
| PostgREST | API REST PostgreSQL | Windows, Linux, macOS | ⏳ à faire | → `31-auto-hebergement` |
| PostGraphile | API GraphQL PostgreSQL | Windows, Linux, macOS | ⏳ à faire | → `31-auto-hebergement` |
| Metabase | BI et dashboards | Windows, Linux, macOS | ⏳ à faire | → `31-auto-hebergement` |
| Apache Superset | BI | Windows, Linux, macOS | ⏳ à faire | → `31-auto-hebergement` |
| Redash | BI | Linux | ⏳ à faire | → `31-auto-hebergement` |
| Lightdash | BI dbt | Windows, Linux, macOS | ⏳ à faire | → `31-auto-hebergement` |
| Evidence | BI-as-code | Windows, Linux, macOS | ⏳ à faire | → `31-auto-hebergement` |
| Grafana | Dashboards | Windows, Linux, macOS | ✅ existant | `06-supervision/03-grafana` |
| Kibana (license check) | Dashboards recherche | Windows, Linux, macOS | ⏳ à faire | → `31-auto-hebergement` |
| OpenObserve | Observabilité et analytics | Windows, Linux, macOS | ⏳ à faire | → `31-auto-hebergement` |
| Linkding | Gestion favoris | Windows, Linux, macOS | ⏳ à faire | → `31-auto-hebergement` |
| Shiori | Gestion favoris | Windows, Linux, macOS | ⏳ à faire | → `31-auto-hebergement` |
| Wallabag | Lecture différée | Windows, Linux, macOS | ⏳ à faire | → `31-auto-hebergement` |
| ArchiveBox | Archivage web | Windows, Linux, macOS | ⏳ à faire | → `31-auto-hebergement` |
| Readeck | Lecture différée | Windows, Linux, macOS | ⏳ à faire | → `31-auto-hebergement` |
| Changedetection.io | Surveillance pages web | Windows, Linux, macOS | ⏳ à faire | → `31-auto-hebergement` |
| Hoarder (Karakeep) | Signets et archivage | Windows, Linux, macOS | ⏳ à faire | → `31-auto-hebergement` |
| Linkwarden | Gestion liens | Windows, Linux, macOS | ⏳ à faire | → `31-auto-hebergement` |

