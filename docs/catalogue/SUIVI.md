# Suivi du catalogue des services

Généré par `node scripts/catalogue.mjs` à partir de [catalogue-services.txt](catalogue-services.txt) et du contenu du wiki. Source de vérité : [suivi.json](suivi.json).

| Total | Déjà dans le wiki | Nouvelles fiches | Fiches améliorées | Reste à faire |
| --- | --- | --- | --- | --- |
| 1311 | 172 (13 %) | 19 | 0 | 1120 (85 %) |

Méthode de rédaction : [METHODE.md](METHODE.md).

## 1. SYSTEMES D'EXPLOITATION, VIRTUALISATION ET HYPERVISEURS — 23/51

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
| Bareos | Sauvegarde serveur | Windows, Linux, macOS | ⏳ à faire | → `19-sauvegarde` |
| FreeBSD | Système d'exploitation serveur | x86, ARM | ⏳ à faire | → `24-systemes-exploitation` |
| OpenBSD | Système d'exploitation | x86, ARM | ⏳ à faire | → `24-systemes-exploitation` |
| NetBSD | Système d'exploitation | x86, ARM | ⏳ à faire | → `24-systemes-exploitation` |
| Debian | Distribution Linux | PC, serveur, ARM | ⏳ à faire | → `24-systemes-exploitation` |
| Ubuntu Server | Distribution Linux serveur | PC, serveur, ARM | ⏳ à faire | → `24-systemes-exploitation` |
| Rocky Linux | Distribution Linux serveur | PC, serveur | ⏳ à faire | → `24-systemes-exploitation` |
| AlmaLinux | Distribution Linux serveur | PC, serveur | ⏳ à faire | → `24-systemes-exploitation` |
| Fedora Server | Distribution Linux serveur | PC, serveur | ⏳ à faire | → `24-systemes-exploitation` |
| openSUSE Leap | Distribution Linux | PC, serveur | ⏳ à faire | → `24-systemes-exploitation` |
| openSUSE Tumbleweed | Distribution Linux | PC, serveur | ⏳ à faire | → `24-systemes-exploitation` |
| Arch Linux | Distribution Linux | PC, serveur | ⏳ à faire | → `24-systemes-exploitation` |
| Gentoo | Distribution Linux | PC, serveur | ⏳ à faire | → `24-systemes-exploitation` |
| Alpine Linux | Distribution Linux légère | PC, serveur, conteneurs | ⏳ à faire | → `24-systemes-exploitation` |
| Oracle Linux | Distribution Linux serveur | PC, serveur | ⏳ à faire | → `24-systemes-exploitation` |
| CentOS Stream | Distribution Linux serveur | PC, serveur | ⏳ à faire | → `24-systemes-exploitation` |
| NixOS | Distribution Linux déclarative | PC, serveur | ⏳ à faire | → `24-systemes-exploitation` |
| Kali Linux | Distribution sécurité | PC, serveur | ⏳ à faire | → `24-systemes-exploitation` |
| Parrot OS | Distribution sécurité | PC | ⏳ à faire | → `24-systemes-exploitation` |
| TrueNAS SCALE | NAS et stockage | Linux x86_64 | ⏳ à faire | → `09-fichiers-partage` |
| OpenMediaVault | NAS | Linux/Debian | ⏳ à faire | → `09-fichiers-partage` |
| Rockstor | NAS | Linux | ⏳ à faire | → `09-fichiers-partage` |
| CasaOS | Plateforme serveur domestique | Linux | ⏳ à faire | → `24-systemes-exploitation` |
| Umbrel | Plateforme serveur personnel | Linux | ⏳ à faire | → `24-systemes-exploitation` |
| YunoHost | Plateforme d'auto-hébergement | Debian | ⏳ à faire | → `24-systemes-exploitation` |
| Runtipi | Plateforme d'applications auto-hébergées | Linux | ⏳ à faire | → `24-systemes-exploitation` |
| DietPi | Distribution légère | Linux, SBC | ⏳ à faire | → `24-systemes-exploitation` |
| Raspberry Pi OS | Distribution Linux | Raspberry Pi | ⏳ à faire | → `24-systemes-exploitation` |

## 2. ANNUAIRE, IDENTITE, AUTHENTIFICATION ET SSO — 8/30

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| OpenLDAP | Annuaire LDAP | Windows, Linux, macOS | ✅ existant | `01-annuaire-identite/02-openldap` |
| 389 Directory Server | Annuaire LDAP | Linux | ⏳ à faire | → `01-annuaire-identite` |
| FreeIPA | Identité et gestion de domaines Linux | Linux | ✅ existant | `01-annuaire-identite/03-freeipa` |
| Samba | Partage SMB et contrôleur de domaine AD compatible | Windows, Linux, macOS | ✅ existant | `09-fichiers-partage/01-samba` |
| Keycloak | IAM, SSO et fédération | Windows, Linux, macOS | ✅ existant | `01-annuaire-identite/05-keycloak` |
| Authentik | IAM et SSO | Windows, Linux, macOS | ⏳ à faire | → `01-annuaire-identite` |
| Authelia | Portail d'authentification | Windows, Linux, macOS | ✅ existant | `01-annuaire-identite/06-authelia` |
| Kanidm | Annuaire et identité | Linux, macOS | ⏳ à faire | → `01-annuaire-identite` |
| Gluu Flex | IAM et SSO | Linux | ⏳ à faire | → `01-annuaire-identite` |
| LemonLDAP::NG | Portail SSO | Linux | ⏳ à faire | → `01-annuaire-identite` |
| Shibboleth | Fédération d'identité | Windows, Linux, macOS | ⏳ à faire | → `01-annuaire-identite` |
| privacyIDEA | Authentification multifacteur | Windows, Linux | ⏳ à faire | → `01-annuaire-identite` |
| LinOTP | Authentification OTP | Linux | ⏳ à faire | → `04-aaa` |
| Keycloak Gatekeeper (archivé) | Proxy d'authentification | Linux | ✅ existant | `01-annuaire-identite/05-keycloak` |
| OAuth2 Proxy | Proxy OAuth2/OIDC | Windows, Linux, macOS | ⏳ à faire | → `01-annuaire-identite` |
| Dex | Fournisseur OIDC | Windows, Linux, macOS | ⏳ à faire | → `01-annuaire-identite` |
| Zitadel | IAM (édition open source) | Windows, Linux, macOS | ⏳ à faire | → `01-annuaire-identite` |
| Casdoor | Plateforme IAM | Windows, Linux, macOS | ⏳ à faire | → `01-annuaire-identite` |
| Logto | Plateforme IAM | Windows, Linux, macOS | ⏳ à faire | → `01-annuaire-identite` |
| Ory Kratos | Gestion des identités | Windows, Linux, macOS | ⏳ à faire | → `01-annuaire-identite` |
| Ory Hydra | Serveur OAuth2/OIDC | Windows, Linux, macOS | ⏳ à faire | → `01-annuaire-identite` |
| OpenAM | IAM | Linux | ⏳ à faire | → `01-annuaire-identite` |
| FreeRADIUS | Serveur RADIUS | Windows, Linux, macOS | ✅ existant | `04-aaa/01-freeradius` |
| PacketFence | NAC et contrôle d'accès réseau | Linux | ⏳ à faire | → `01-annuaire-identite` |
| OpenNAC | Contrôle d'accès réseau | Linux | ⏳ à faire | → `01-annuaire-identite` |
| Authentification SSH OpenSSH | Accès distant sécurisé | Windows, Linux, macOS | ⏳ à faire | → `01-annuaire-identite` |
| SSSD | Intégration identité Linux | Linux | ⏳ à faire | → `01-annuaire-identite` |
| realmd | Jointure de domaines | Linux | ⏳ à faire | → `01-annuaire-identite` |
| Samba AD DC | Contrôleur de domaine | Linux | ✅ existant | `09-fichiers-partage/01-samba` |
| gopass | Gestionnaire de secrets CLI | Windows, Linux, macOS | ⏳ à faire | → `01-annuaire-identite` |

## 3. DNS, DHCP, IPAM ET SERVICES RESEAU — 17/49

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| BIND 9 | Serveur DNS | Windows, Linux, macOS | ✅ existant | `02-dns/01-bind9` |
| Knot DNS | Serveur DNS autoritatif | Linux, BSD | ⏳ à faire | → `02-dns` |
| PowerDNS Authoritative | Serveur DNS autoritatif | Windows, Linux, macOS | ✅ existant | `02-dns/04-powerdns` |
| PowerDNS Recursor | Résolveur DNS | Windows, Linux, macOS | ✅ existant | `02-dns/04-powerdns` |
| Unbound | Résolveur DNS récursif | Windows, Linux, macOS | ✅ existant | `02-dns/02-unbound` |
| CoreDNS | DNS extensible | Windows, Linux, macOS | ⏳ à faire | → `02-dns` |
| Technitium DNS Server | DNS récursif et autoritatif | Windows, Linux, macOS | ⏳ à faire | → `02-dns` |
| dnsmasq | DNS/DHCP léger | Linux, macOS, BSD | ✅ existant | `02-dns/03-dnsmasq` |
| AdGuard Home | DNS filtrant | Windows, Linux, macOS | ⏳ à faire | → `02-dns` |
| Pi-hole | DNS filtrant | Linux | ⏳ à faire | → `02-dns` |
| Blocky | DNS filtrant | Windows, Linux, macOS | ⏳ à faire | → `02-dns` |
| MaraDNS | Serveur DNS | Windows, Linux | ⏳ à faire | → `02-dns` |
| NSD | Serveur DNS autoritatif | Linux, BSD | ⏳ à faire | → `02-dns` |
| Kea DHCP | Serveur DHCP | Linux, BSD | ✅ existant | `03-dhcp/02-kea` |
| ISC DHCP (fin de vie) | Serveur DHCP historique | Linux, BSD | ✅ existant | `03-dhcp/01-isc-dhcp` |
| Open DHCP Server | Serveur DHCP | Windows | ⏳ à faire | → `03-dhcp` |
| dhcpd | Serveur DHCP | Linux, BSD | ✅ existant | `03-dhcp/01-isc-dhcp` |
| Kea Stork | Supervision DHCP/DNS | Linux | ⏳ à faire | → `03-dhcp` |
| phpIPAM | IPAM | Linux, Windows via stack web | ⏳ à faire | → `18-infrastructure-systeme` |
| NetBox | IPAM et DCIM | Linux, Windows via conteneurs | ⏳ à faire | → `18-infrastructure-systeme` |
| Nautobot | IPAM et automatisation réseau | Linux, Windows via conteneurs | ⏳ à faire | → `18-infrastructure-systeme` |
| GestióIP | IPAM | Linux | ⏳ à faire | → `18-infrastructure-systeme` |
| NIPAP | IPAM | Linux | ⏳ à faire | → `18-infrastructure-systeme` |
| Ralph | DCIM et gestion d'actifs | Linux | ⏳ à faire | → `18-infrastructure-systeme` |
| RackTables | Gestion datacenter et IP | Linux | ⏳ à faire | → `18-infrastructure-systeme` |
| OpenWISP | Gestion réseau | Linux | ⏳ à faire | → `18-infrastructure-systeme` |
| OpenWrt | Firmware routeur | Routeurs, x86 | ⏳ à faire | → `18-infrastructure-systeme` |
| OPNsense | Pare-feu/routeur | FreeBSD | ✅ existant | `22-constructeurs/19-pfsense-opnsense` |
| pfSense CE | Pare-feu/routeur | FreeBSD | ✅ existant | `22-constructeurs/19-pfsense-opnsense` |
| VyOS | Routeur logiciel | Linux | ⏳ à faire | → `18-infrastructure-systeme` |
| IPFire | Pare-feu | Linux | ⏳ à faire | → `18-infrastructure-systeme` |
| Endian Firewall Community | Pare-feu | Linux | ⏳ à faire | → `18-infrastructure-systeme` |
| FRRouting | Routage BGP/OSPF | Linux, BSD | ⏳ à faire | → `18-infrastructure-systeme` |
| BIRD | Routage BGP | Linux, BSD | ⏳ à faire | → `18-infrastructure-systeme` |
| OpenBGPD | Routage BGP | OpenBSD, Linux | ⏳ à faire | → `18-infrastructure-systeme` |
| OpenVPN | VPN | Windows, Linux, macOS | ✅ existant | `08-acces-distant-vpn/02-openvpn` |
| WireGuard | VPN | Windows, Linux, macOS | ✅ existant | `08-acces-distant-vpn/03-wireguard` |
| strongSwan | VPN IPsec | Linux, Windows | ✅ existant | `08-acces-distant-vpn/04-strongswan` |
| Tailscale (client open source) | VPN mesh | Windows, Linux, macOS | ✅ existant | `08-acces-distant-vpn/05-tailscale-headscale` |
| Headscale | Contrôle VPN mesh auto-hébergé | Linux, Windows, macOS | ✅ existant | `08-acces-distant-vpn/05-tailscale-headscale` |
| NetBird | VPN mesh | Windows, Linux, macOS | ⏳ à faire | → `18-infrastructure-systeme` |
| ZeroTier (client open source) | Réseau overlay | Windows, Linux, macOS | ✅ existant | `08-acces-distant-vpn/06-zerotier` |
| Nebula | Réseau overlay | Windows, Linux, macOS | ⏳ à faire | → `18-infrastructure-systeme` |
| SoftEther VPN | VPN multi-protocoles | Windows, Linux, macOS | ⏳ à faire | → `18-infrastructure-systeme` |
| OpenConnect | Client VPN | Windows, Linux, macOS | ⏳ à faire | → `18-infrastructure-systeme` |
| ocserv | Serveur VPN | Linux | ⏳ à faire | → `18-infrastructure-systeme` |
| Pritunl (community) | Serveur VPN | Linux | ⏳ à faire | → `18-infrastructure-systeme` |
| IPsec-tools | VPN IPsec | BSD, Linux | ✅ existant | `08-acces-distant-vpn/04-strongswan` |
| Mullvad VPN app | Client VPN (composants open source) | Windows, Linux, macOS | ⏳ à faire | → `18-infrastructure-systeme` |

## 4. PROXY, REVERSE PROXY, LOAD BALANCING ET PASSERELLES — 8/34

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| NGINX | Serveur web et reverse proxy | Windows, Linux, macOS | ✅ existant | `05-web/03-nginx` |
| HAProxy | Load balancer et proxy | Linux, BSD | ✅ existant | `07-proxy-cache/01-haproxy` |
| Apache HTTP Server | Serveur web | Windows, Linux, macOS | ✅ existant | `05-web/02-apache` |
| Caddy | Serveur web et proxy TLS automatique | Windows, Linux, macOS | ✅ existant | `05-web/04-caddy` |
| Traefik Proxy | Reverse proxy | Windows, Linux, macOS | ✅ existant | `07-proxy-cache/04-traefik` |
| Envoy Proxy | Proxy L7 | Windows, Linux, macOS | ⏳ à faire | → `07-proxy-cache` |
| Varnish Cache | Cache HTTP | Linux, BSD | ✅ existant | `07-proxy-cache/03-varnish` |
| Squid | Proxy cache | Windows, Linux, macOS | ✅ existant | `07-proxy-cache/02-squid` |
| Tinyproxy | Proxy HTTP léger | Linux, BSD | ⏳ à faire | → `07-proxy-cache` |
| Privoxy | Proxy filtrant | Windows, Linux, macOS | ⏳ à faire | → `07-proxy-cache` |
| mitmproxy | Proxy d'inspection HTTP(S) | Windows, Linux, macOS | ⏳ à faire | → `07-proxy-cache` |
| Apache Traffic Server | Proxy/cache | Linux, BSD | ⏳ à faire | → `07-proxy-cache` |
| ATS | Proxy/cache | Linux, BSD | ⏳ à faire | → `07-proxy-cache` |
| OpenResty | Plateforme NGINX/Lua | Linux, Windows | ⏳ à faire | → `07-proxy-cache` |
| H2O | Serveur web HTTP/2/3 | Linux, macOS | ⏳ à faire | → `07-proxy-cache` |
| Lighttpd | Serveur web léger | Windows, Linux, macOS | ⏳ à faire | → `07-proxy-cache` |
| Cherokee | Serveur web | Linux, BSD | ⏳ à faire | → `07-proxy-cache` |
| Kong Gateway OSS | API gateway | Windows, Linux, macOS | ⏳ à faire | → `07-proxy-cache` |
| Apache APISIX | API gateway | Windows, Linux, macOS | ⏳ à faire | → `07-proxy-cache` |
| Tyk Gateway (community) | API gateway | Linux, Windows via conteneur | ⏳ à faire | → `07-proxy-cache` |
| KrakenD Community | API gateway | Windows, Linux, macOS | ⏳ à faire | → `07-proxy-cache` |
| Gravitee APIM Community | Gestion API | Linux, Windows via conteneur | ⏳ à faire | → `07-proxy-cache` |
| Zuul | API gateway | Windows, Linux, macOS | ⏳ à faire | → `07-proxy-cache` |
| Ocelot | API gateway .NET | Windows, Linux, macOS | ⏳ à faire | → `07-proxy-cache` |
| YARP | Reverse proxy .NET | Windows, Linux, macOS | ⏳ à faire | → `07-proxy-cache` |
| HAProxy Data Plane API | API de gestion HAProxy | Linux | ✅ existant | `07-proxy-cache/01-haproxy` |
| Keepalived | Haute disponibilité IP | Linux | ⏳ à faire | → `07-proxy-cache` |
| LVS | Load balancing L4 | Linux | ⏳ à faire | → `07-proxy-cache` |
| Pen | Load balancer | Linux, BSD | ⏳ à faire | → `07-proxy-cache` |
| Balance | Load balancer TCP | Linux, BSD | ⏳ à faire | → `07-proxy-cache` |
| PgBouncer | Pooler PostgreSQL | Windows, Linux, macOS | ⏳ à faire | → `07-proxy-cache` |
| ProxySQL | Proxy MySQL | Linux | ⏳ à faire | → `07-proxy-cache` |
| MaxScale (édition communautaire) | Proxy MariaDB | Linux | ⏳ à faire | → `07-proxy-cache` |
| Odyssey | Pooler PostgreSQL | Linux | ⏳ à faire | → `07-proxy-cache` |

## 5. SERVEURS WEB, LANGAGES ET RUNTIMES — 7/41

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| PHP | Runtime PHP | Windows, Linux, macOS | ⏳ à faire | → `05-web` |
| Node.js | Runtime JavaScript | Windows, Linux, macOS | ✅ existant | `05-web/06-nodejs` |
| Deno | Runtime JavaScript/TypeScript | Windows, Linux, macOS | ⏳ à faire | → `05-web` |
| Bun | Runtime JavaScript | Windows, Linux, macOS | ⏳ à faire | → `05-web` |
| Python | Langage et runtime | Windows, Linux, macOS | ✅ existant | `05-web/07-python` |
| Ruby | Langage et runtime | Windows, Linux, macOS | ✅ existant | `05-web/08-ruby` |
| Go | Langage et runtime | Windows, Linux, macOS | ⏳ à faire | → `05-web` |
| Rust | Langage et toolchain | Windows, Linux, macOS | ⏳ à faire | → `05-web` |
| OpenJDK | Runtime Java | Windows, Linux, macOS | ✅ existant | `05-web/09-openjdk` |
| Eclipse Temurin | Distribution OpenJDK | Windows, Linux, macOS | ⏳ à faire | → `05-web` |
| GraalVM Community Edition | Runtime polyglotte | Windows, Linux, macOS | ⏳ à faire | → `05-web` |
| .NET SDK | Runtime et SDK .NET | Windows, Linux, macOS | ⏳ à faire | → `05-web` |
| Mono | Runtime .NET historique | Windows, Linux, macOS | ⏳ à faire | → `05-web` |
| PowerShell | Shell et automatisation | Windows, Linux, macOS | ⏳ à faire | → `05-web` |
| Perl | Langage et runtime | Windows, Linux, macOS | ⏳ à faire | → `05-web` |
| Lua | Langage embarqué | Windows, Linux, macOS | ⏳ à faire | → `05-web` |
| Erlang/OTP | Runtime Erlang | Windows, Linux, macOS | ⏳ à faire | → `05-web` |
| Elixir | Langage BEAM | Windows, Linux, macOS | ⏳ à faire | → `05-web` |
| GCC | Compilateur | Windows, Linux, macOS | ⏳ à faire | → `05-web` |
| Clang/LLVM | Compilateur | Windows, Linux, macOS | ⏳ à faire | → `05-web` |
| CMake | Build system | Windows, Linux, macOS | ⏳ à faire | → `05-web` |
| Ninja | Build system | Windows, Linux, macOS | ⏳ à faire | → `05-web` |
| Meson | Build system | Windows, Linux, macOS | ⏳ à faire | → `05-web` |
| Apache Tomcat | Serveur Java | Windows, Linux, macOS | ✅ existant | `05-web/10-tomcat` |
| Eclipse Jetty | Serveur Java | Windows, Linux, macOS | ⏳ à faire | → `05-web` |
| WildFly | Serveur d'applications Java | Windows, Linux, macOS | ✅ existant | `05-web/11-wildfly` |
| Payara Community | Serveur Jakarta EE | Windows, Linux, macOS | ⏳ à faire | → `05-web` |
| Open Liberty | Serveur Java | Windows, Linux, macOS | ⏳ à faire | → `05-web` |
| GlassFish | Serveur Jakarta EE | Windows, Linux, macOS | ⏳ à faire | → `05-web` |
| Jenkins | Automatisation CI/CD | Windows, Linux, macOS | ✅ existant | `14-devops/05-jenkins` |
| Buildbot | Automatisation build | Windows, Linux, macOS | ⏳ à faire | → `05-web` |
| Concourse CI | CI/CD | Linux, Windows via workers | ⏳ à faire | → `05-web` |
| GoCD | CI/CD | Windows, Linux, macOS | ⏳ à faire | → `05-web` |
| Woodpecker CI | CI/CD | Windows, Linux, macOS | ⏳ à faire | → `05-web` |
| Drone CI (community) | CI/CD | Linux | ⏳ à faire | → `05-web` |
| Tekton | Pipelines Kubernetes | Linux | ⏳ à faire | → `05-web` |
| Argo Workflows | Workflows Kubernetes | Linux | ⏳ à faire | → `05-web` |
| Dagger | Pipelines programmables | Windows, Linux, macOS | ⏳ à faire | → `05-web` |
| Earthly | Build reproductibles | Windows, Linux, macOS | ⏳ à faire | → `05-web` |
| Task | Task runner | Windows, Linux, macOS | ⏳ à faire | → `05-web` |
| Just | Task runner | Windows, Linux, macOS | ⏳ à faire | → `05-web` |

## 6. BASES DE DONNEES SQL ET NOSQL — 11/64

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| PostgreSQL | Base SQL | Windows, Linux, macOS | ✅ existant | `11-bases-de-donnees/02-postgresql` |
| MariaDB Server | Base SQL | Windows, Linux, macOS | ✅ existant | `11-bases-de-donnees/01-mariadb-mysql` |
| MySQL Community Server | Base SQL | Windows, Linux, macOS | ✅ existant | `11-bases-de-donnees/01-mariadb-mysql` |
| SQLite | Base SQL embarquée | Windows, Linux, macOS | ✅ existant | `11-bases-de-donnees/06-sqlite` |
| Firebird | Base SQL | Windows, Linux, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| DuckDB | Base analytique embarquée | Windows, Linux, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| CockroachDB | Base SQL distribuée | Windows, Linux, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| YugabyteDB | Base SQL distribuée | Linux, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| TiDB | Base SQL distribuée | Linux | ⏳ à faire | → `11-bases-de-donnees` |
| Citus | Extension PostgreSQL distribuée | Linux, Windows via PostgreSQL | ⏳ à faire | → `11-bases-de-donnees` |
| TimescaleDB | Base time-series PostgreSQL | Linux, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| QuestDB | Base time-series | Windows, Linux, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| InfluxDB OSS | Base time-series | Windows, Linux, macOS | ✅ existant | `06-supervision/10-influxdb` |
| Apache Cassandra | Base NoSQL wide-column | Windows, Linux, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| ScyllaDB | Base NoSQL wide-column | Linux | ⏳ à faire | → `11-bases-de-donnees` |
| MongoDB Community Server | Base documentaire | Windows, Linux, macOS | ✅ existant | `11-bases-de-donnees/03-mongodb` |
| FerretDB | Compatibilité MongoDB | Linux, Windows, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| CouchDB | Base documentaire | Windows, Linux, macOS | ✅ existant | `11-bases-de-donnees/07-couchdb` |
| Couchbase Community | Base NoSQL | Linux, Windows | ⏳ à faire | → `11-bases-de-donnees` |
| RavenDB Community | Base documentaire | Windows, Linux, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| RethinkDB | Base documentaire temps réel | Linux, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| Redis | Base clé-valeur | Windows via WSL/containers, Linux, macOS | ✅ existant | `11-bases-de-donnees/04-redis` |
| Valkey | Base clé-valeur | Windows via WSL/containers, Linux, macOS | ✅ existant | `11-bases-de-donnees/04-redis` |
| KeyDB | Base clé-valeur | Linux, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| Dragonfly | Base clé-valeur | Linux | ⏳ à faire | → `11-bases-de-donnees` |
| Memcached | Cache clé-valeur | Windows, Linux, macOS | ✅ existant | `11-bases-de-donnees/05-memcached` |
| etcd | Base clé-valeur distribuée | Windows, Linux, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| Consul | Store clé-valeur et découverte | Windows, Linux, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| FoundationDB | Base clé-valeur distribuée | Windows, Linux, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| BadgerDB | Base clé-valeur embarquée | Windows, Linux, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| RocksDB | Moteur clé-valeur embarqué | Windows, Linux, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| LevelDB | Moteur clé-valeur embarqué | Windows, Linux, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| LMDB | Base clé-valeur embarquée | Windows, Linux, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| SurrealDB | Base multi-modèle | Windows, Linux, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| ArangoDB Community | Base multi-modèle | Windows, Linux, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| OrientDB | Base graphe/document | Windows, Linux, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| Neo4j Community | Base graphe | Windows, Linux, macOS | ✅ existant | `11-bases-de-donnees/09-neo4j` |
| Memgraph | Base graphe | Linux, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| JanusGraph | Base graphe | Windows, Linux, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| Apache AGE | Extension graphe PostgreSQL | Linux | ⏳ à faire | → `11-bases-de-donnees` |
| Dgraph | Base graphe | Windows, Linux, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| TerminusDB | Base graphe/document | Windows, Linux, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| XTDB | Base bitemporelle | Windows, Linux, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| Apache Doris | Entrepôt analytique | Linux | ⏳ à faire | → `11-bases-de-donnees` |
| ClickHouse | Base analytique colonne | Linux, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| Apache Pinot | Base analytique temps réel | Linux | ⏳ à faire | → `11-bases-de-donnees` |
| Apache Druid | Base analytique temps réel | Linux, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| Trino | Moteur SQL distribué | Windows, Linux, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| Presto | Moteur SQL distribué | Linux, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| Apache Hive | Entrepôt SQL Hadoop | Linux | ⏳ à faire | → `11-bases-de-donnees` |
| Apache HBase | Base NoSQL Hadoop | Linux | ⏳ à faire | → `11-bases-de-donnees` |
| Apache Kudu | Stockage analytique | Linux | ⏳ à faire | → `11-bases-de-donnees` |
| Greenplum Database | Base analytique MPP | Linux | ⏳ à faire | → `11-bases-de-donnees` |
| MonetDB | Base analytique colonne | Windows, Linux, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| DuckDB extensions | Extensions analytiques | Windows, Linux, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| Apache Drill | Moteur SQL | Linux, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| Apache Ignite | Base distribuée en mémoire | Windows, Linux, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| Hazelcast | In-memory data grid | Windows, Linux, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| Apache Geode | Base distribuée en mémoire | Windows, Linux, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| VoltDB Community | Base SQL en mémoire | Linux | ⏳ à faire | → `11-bases-de-donnees` |
| H2 Database | Base SQL Java | Windows, Linux, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| HSQLDB | Base SQL Java | Windows, Linux, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| Derby | Base SQL Java | Windows, Linux, macOS | ⏳ à faire | → `11-bases-de-donnees` |
| Realm (community components) | Base embarquée mobile | Windows, macOS, Linux | ⏳ à faire | → `11-bases-de-donnees` |

## 7. STOCKAGE, NAS, OBJET, FICHIERS ET SAUVEGARDE — 12/47

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| MinIO (community source) | Stockage objet S3 | Linux, Windows via conteneur | ✅ existant | `09-fichiers-partage/07-minio` |
| Ceph | Stockage distribué | Linux | ⏳ à faire | → `09-fichiers-partage` |
| GlusterFS | Système de fichiers distribué | Linux | ⏳ à faire | → `09-fichiers-partage` |
| Lustre | Système de fichiers parallèle | Linux | ⏳ à faire | → `09-fichiers-partage` |
| BeeGFS | Système de fichiers parallèle | Linux | ⏳ à faire | → `09-fichiers-partage` |
| OpenZFS | Système de fichiers et volumes | Linux, FreeBSD, macOS | ⏳ à faire | → `09-fichiers-partage` |
| Btrfs | Système de fichiers | Linux | ⏳ à faire | → `09-fichiers-partage` |
| XFS | Système de fichiers | Linux | ⏳ à faire | → `09-fichiers-partage` |
| LVM2 | Gestion volumes logiques | Linux | ⏳ à faire | → `09-fichiers-partage` |
| mdadm | RAID logiciel | Linux | ⏳ à faire | → `09-fichiers-partage` |
| mergerfs | Fusion de systèmes de fichiers | Linux | ⏳ à faire | → `09-fichiers-partage` |
| SnapRAID | Protection de données | Windows, Linux, macOS | ⏳ à faire | → `09-fichiers-partage` |
| NFS-Ganesha | Serveur NFS | Linux | ✅ existant | `09-fichiers-partage/02-nfs` |
| OpenAFS | Système de fichiers distribué | Windows, Linux, macOS | ⏳ à faire | → `09-fichiers-partage` |
| SeaweedFS | Stockage distribué | Windows, Linux, macOS | ⏳ à faire | → `09-fichiers-partage` |
| Garage | Stockage objet S3 | Linux, macOS | ⏳ à faire | → `09-fichiers-partage` |
| OpenIO | Stockage objet | Linux | ⏳ à faire | → `09-fichiers-partage` |
| OpenStack Swift | Stockage objet | Linux | ⏳ à faire | → `09-fichiers-partage` |
| Rook | Orchestration stockage Kubernetes | Linux | ⏳ à faire | → `09-fichiers-partage` |
| Longhorn | Stockage persistant Kubernetes | Linux | ⏳ à faire | → `09-fichiers-partage` |
| OpenEBS | Stockage Kubernetes | Linux | ⏳ à faire | → `09-fichiers-partage` |
| LINSTOR | Stockage bloc distribué | Linux | ⏳ à faire | → `09-fichiers-partage` |
| DRBD | Réplication bloc | Linux | ⏳ à faire | → `19-sauvegarde` |
| Restic | Sauvegarde | Windows, Linux, macOS | ✅ existant | `19-sauvegarde/01-restic` |
| BorgBackup | Sauvegarde dédupliquée | Linux, macOS | ✅ existant | `19-sauvegarde/02-borgbackup` |
| Kopia | Sauvegarde | Windows, Linux, macOS | ⏳ à faire | → `19-sauvegarde` |
| Duplicati | Sauvegarde | Windows, Linux, macOS | ⏳ à faire | → `19-sauvegarde` |
| UrBackup | Sauvegarde client/serveur | Windows, Linux | ✅ existant | `19-sauvegarde/04-urbackup` |
| Bacula Community | Sauvegarde réseau | Windows, Linux, macOS | ✅ existant | `19-sauvegarde/03-bacula` |
| Amanda | Sauvegarde réseau | Linux, Unix | ⏳ à faire | → `19-sauvegarde` |
| rdiff-backup | Sauvegarde incrémentale | Windows, Linux, macOS | ⏳ à faire | → `19-sauvegarde` |
| rsnapshot | Sauvegarde snapshots | Linux, macOS | ⏳ à faire | → `19-sauvegarde` |
| Rsync | Synchronisation fichiers | Windows, Linux, macOS | ⏳ à faire | → `09-fichiers-partage` |
| Rclone | Synchronisation stockage cloud | Windows, Linux, macOS | ⏳ à faire | → `09-fichiers-partage` |
| Syncthing | Synchronisation P2P | Windows, Linux, macOS | ✅ existant | `09-fichiers-partage/11-syncthing` |
| Seafile Community | Synchronisation fichiers | Windows, Linux, macOS | ✅ existant | `09-fichiers-partage/10-seafile` |
| Nextcloud | Cloud de fichiers | Windows, Linux, macOS (serveur Linux recommandé) | ✅ existant | `09-fichiers-partage/08-nextcloud` |
| ownCloud Infinite Scale | Cloud de fichiers | Windows, Linux, macOS | ✅ existant | `09-fichiers-partage/09-owncloud` |
| File Browser | Interface web fichiers | Windows, Linux, macOS | ⏳ à faire | → `09-fichiers-partage` |
| SFTPGo | Serveur SFTP/FTP/WebDAV | Windows, Linux, macOS | ⏳ à faire | → `09-fichiers-partage` |
| OpenSSH SFTP | Transfert sécurisé | Windows, Linux, macOS | ✅ existant | `08-acces-distant-vpn/01-openssh` |
| WebDAV (Apache mod_dav) | Partage WebDAV | Windows, Linux, macOS | ✅ existant | `09-fichiers-partage/12-webdav` |
| Pydio Cells | Partage et collaboration fichiers | Linux, Windows via conteneur | ⏳ à faire | → `09-fichiers-partage` |
| Cozy Cloud | Cloud personnel | Linux | ⏳ à faire | → `09-fichiers-partage` |
| Filestash | Interface multi-stockage | Windows, Linux, macOS | ⏳ à faire | → `09-fichiers-partage` |
| ProjectSend | Partage de fichiers | Linux | ⏳ à faire | → `09-fichiers-partage` |
| Pingvin Share | Partage temporaire | Linux, Windows via conteneur | ⏳ à faire | → `09-fichiers-partage` |

## 8. CONTENEURS, ORCHESTRATION ET PLATEFORMES CLOUD-NATIVE — 8/61

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| Kubernetes | Orchestration conteneurs | Linux, Windows nodes | ✅ existant | `13-conteneurs/04-kubernetes` |
| K3s | Kubernetes léger | Linux, Windows via WSL/VM | ✅ existant | `13-conteneurs/05-k3s` |
| MicroK8s | Kubernetes léger | Linux, Windows via WSL, macOS | ⏳ à faire | → `13-conteneurs` |
| Minikube | Kubernetes local | Windows, Linux, macOS | ✅ existant | `13-conteneurs/06-minikube` |
| kind | Kubernetes en Docker | Windows, Linux, macOS | ✅ existant | `13-conteneurs/07-kind` |
| k0s | Kubernetes léger | Linux | ⏳ à faire | → `13-conteneurs` |
| Talos Linux | OS Kubernetes | x86, ARM | ⏳ à faire | → `13-conteneurs` |
| RKE2 | Kubernetes durci | Linux | ⏳ à faire | → `13-conteneurs` |
| OpenShift OKD | Plateforme Kubernetes | Linux | ⏳ à faire | → `13-conteneurs` |
| KubeVirt | VM sur Kubernetes | Linux | ⏳ à faire | → `13-conteneurs` |
| Helm | Gestionnaire de packages Kubernetes | Windows, Linux, macOS | ⏳ à faire | → `13-conteneurs` |
| Kustomize | Configuration Kubernetes | Windows, Linux, macOS | ⏳ à faire | → `13-conteneurs` |
| Argo CD | GitOps Kubernetes | Linux | ⏳ à faire | → `13-conteneurs` |
| Flux CD | GitOps Kubernetes | Linux | ⏳ à faire | → `13-conteneurs` |
| Rancher | Gestion Kubernetes | Linux, Windows via conteneur | ⏳ à faire | → `13-conteneurs` |
| Portainer CE | Gestion conteneurs | Windows, Linux, macOS | ✅ existant | `13-conteneurs/08-portainer` |
| Lens Open Source | IDE Kubernetes | Windows, Linux, macOS | ⏳ à faire | → `13-conteneurs` |
| Headlamp | Dashboard Kubernetes | Windows, Linux, macOS | ⏳ à faire | → `13-conteneurs` |
| K9s | Terminal Kubernetes | Windows, Linux, macOS | ⏳ à faire | → `13-conteneurs` |
| Skaffold | Développement Kubernetes | Windows, Linux, macOS | ⏳ à faire | → `13-conteneurs` |
| Tilt | Développement Kubernetes | Windows, Linux, macOS | ⏳ à faire | → `13-conteneurs` |
| Garden | Développement Kubernetes | Windows, Linux, macOS | ⏳ à faire | → `13-conteneurs` |
| Telepresence | Développement Kubernetes | Windows, Linux, macOS | ⏳ à faire | → `13-conteneurs` |
| Dapr | Runtime applicatif distribué | Windows, Linux, macOS | ⏳ à faire | → `13-conteneurs` |
| Knative | Serverless Kubernetes | Linux | ⏳ à faire | → `13-conteneurs` |
| OpenFaaS | Serverless | Linux, Windows via conteneur | ⏳ à faire | → `13-conteneurs` |
| Fission | Serverless Kubernetes | Linux | ⏳ à faire | → `13-conteneurs` |
| KEDA | Autoscaling événementiel | Linux | ⏳ à faire | → `13-conteneurs` |
| Crossplane | Control plane cloud | Linux | ⏳ à faire | → `13-conteneurs` |
| Cluster API | Gestion cycle de vie clusters | Linux | ⏳ à faire | → `13-conteneurs` |
| MetalLB | Load balancer Kubernetes | Linux | ⏳ à faire | → `13-conteneurs` |
| Cilium | Réseau et sécurité Kubernetes | Linux | ⏳ à faire | → `13-conteneurs` |
| Calico | Réseau Kubernetes | Linux | ⏳ à faire | → `13-conteneurs` |
| Flannel | Réseau Kubernetes | Linux | ⏳ à faire | → `13-conteneurs` |
| Weave Net | Réseau Kubernetes | Linux | ⏳ à faire | → `13-conteneurs` |
| Multus | Réseaux multiples Kubernetes | Linux | ⏳ à faire | → `13-conteneurs` |
| Gateway API | API réseau Kubernetes | Linux | ⏳ à faire | → `13-conteneurs` |
| Contour | Ingress Kubernetes | Linux | ⏳ à faire | → `13-conteneurs` |
| NGINX Ingress Controller | Ingress Kubernetes | Linux | ⏳ à faire | → `13-conteneurs` |
| Traefik | Ingress Kubernetes | Windows, Linux, macOS | ✅ existant | `07-proxy-cache/04-traefik` |
| cert-manager | Certificats Kubernetes | Linux | ⏳ à faire | → `13-conteneurs` |
| ExternalDNS | DNS Kubernetes | Linux | ⏳ à faire | → `13-conteneurs` |
| Velero | Sauvegarde Kubernetes | Linux | ⏳ à faire | → `13-conteneurs` |
| Kanister | Protection données Kubernetes | Linux | ⏳ à faire | → `13-conteneurs` |
| Kube-bench | Audit CIS Kubernetes | Linux | ⏳ à faire | → `13-conteneurs` |
| Kubescape | Sécurité Kubernetes | Windows, Linux, macOS | ⏳ à faire | → `13-conteneurs` |
| Trivy | Scanner vulnérabilités | Windows, Linux, macOS | ⏳ à faire | → `13-conteneurs` |
| Falco | Détection runtime | Linux | ⏳ à faire | → `13-conteneurs` |
| Kyverno | Politiques Kubernetes | Linux | ⏳ à faire | → `13-conteneurs` |
| OPA Gatekeeper | Politiques Kubernetes | Linux | ⏳ à faire | → `13-conteneurs` |
| Open Policy Agent | Moteur de politiques | Windows, Linux, macOS | ⏳ à faire | → `13-conteneurs` |
| Buildah | Construction images | Linux, Windows via WSL | ⏳ à faire | → `13-conteneurs` |
| Skopeo | Gestion images conteneurs | Linux, macOS | ⏳ à faire | → `13-conteneurs` |
| Dive | Analyse images Docker | Windows, Linux, macOS | ⏳ à faire | → `13-conteneurs` |
| Hadolint | Lint Dockerfile | Windows, Linux, macOS | ⏳ à faire | → `13-conteneurs` |
| Dockle | Audit images conteneurs | Windows, Linux, macOS | ⏳ à faire | → `13-conteneurs` |
| Docker Compose | Orchestration locale | Windows, Linux, macOS | ✅ existant | `13-conteneurs/01-docker` |
| Podman Compose | Orchestration locale | Windows, Linux, macOS | ✅ existant | `13-conteneurs/02-podman` |
| Kompose | Conversion Compose/Kubernetes | Windows, Linux, macOS | ⏳ à faire | → `13-conteneurs` |
| Packer | Création images machines | Windows, Linux, macOS | ⏳ à faire | → `13-conteneurs` |
| Vagrant | Environnements reproductibles | Windows, Linux, macOS | ⏳ à faire | → `13-conteneurs` |

## 9. SUPERVISION, METRIQUES, LOGS ET OBSERVABILITE — 19/64

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| Prometheus | Métriques et alertes | Windows, Linux, macOS | ✅ existant | `06-supervision/02-prometheus` |
| Grafana OSS | Dashboards | Windows, Linux, macOS | ✅ existant | `06-supervision/03-grafana` |
| VictoriaMetrics | Base métriques | Windows, Linux, macOS | ⏳ à faire | → `06-supervision` |
| Thanos | Stockage long terme Prometheus | Linux | ⏳ à faire | → `06-supervision` |
| Mimir | Stockage métriques | Linux | ⏳ à faire | → `06-supervision` |
| Cortex | Stockage métriques | Linux | ⏳ à faire | → `06-supervision` |
| Alertmanager | Gestion alertes | Windows, Linux, macOS | ⏳ à faire | → `06-supervision` |
| Zabbix | Supervision infrastructure | Windows, Linux, macOS | ✅ existant | `06-supervision/04-zabbix` |
| Icinga 2 | Supervision | Windows, Linux, macOS | ✅ existant | `06-supervision/06-icinga` |
| Nagios Core | Supervision | Linux | ✅ existant | `06-supervision/05-nagios` |
| Checkmk Raw | Supervision | Linux | ✅ existant | `06-supervision/08-checkmk` |
| LibreNMS | Supervision réseau | Linux | ⏳ à faire | → `06-supervision` |
| Observium Community | Supervision réseau | Linux | ⏳ à faire | → `06-supervision` |
| OpenNMS Horizon | Supervision réseau | Linux | ⏳ à faire | → `06-supervision` |
| Netdata | Supervision temps réel | Windows, Linux, macOS | ✅ existant | `06-supervision/07-netdata` |
| Glances | Supervision système | Windows, Linux, macOS | ⏳ à faire | → `06-supervision` |
| Cockpit | Administration serveur | Linux | ⏳ à faire | → `06-supervision` |
| NetXMS | Supervision réseau | Windows, Linux | ⏳ à faire | → `06-supervision` |
| Centreon Open Source | Supervision | Linux | ✅ existant | `06-supervision/01-centreon` |
| Prometheus Node Exporter | Export métriques système | Windows, Linux, macOS | ✅ existant | `06-supervision/02-prometheus` |
| windows_exporter | Export métriques Windows | Windows | ⏳ à faire | → `06-supervision` |
| Telegraf | Collecteur métriques | Windows, Linux, macOS | ✅ existant | `06-supervision/09-telegraf` |
| Collectd | Collecteur métriques | Linux, BSD | ⏳ à faire | → `06-supervision` |
| StatsD | Collecteur métriques | Windows, Linux, macOS | ⏳ à faire | → `06-supervision` |
| OpenTelemetry Collector | Collecteur télémétrie | Windows, Linux, macOS | ⏳ à faire | → `06-supervision` |
| Jaeger | Traçage distribué | Windows, Linux, macOS | ⏳ à faire | → `06-supervision` |
| Zipkin | Traçage distribué | Windows, Linux, macOS | ⏳ à faire | → `06-supervision` |
| Tempo | Backend traces | Linux | ⏳ à faire | → `06-supervision` |
| Loki | Agrégation logs | Windows, Linux, macOS | ⏳ à faire | → `15-journalisation` |
| Promtail (déprécié) | Agent logs historique | Windows, Linux, macOS | ⏳ à faire | → `15-journalisation` |
| Grafana Alloy | Agent observabilité | Windows, Linux, macOS | ⏳ à faire | → `06-supervision` |
| Fluent Bit | Collecteur logs | Windows, Linux, macOS | ✅ existant | `15-journalisation/03-fluent-bit` |
| Fluentd | Collecteur logs | Windows, Linux, macOS | ⏳ à faire | → `15-journalisation` |
| Vector | Pipeline observabilité | Windows, Linux, macOS | ⏳ à faire | → `06-supervision` |
| Logstash | Pipeline logs | Windows, Linux, macOS | ✅ existant | `15-journalisation/02-logstash` |
| OpenSearch | Recherche et analytics logs | Windows, Linux, macOS | ✅ existant | `12-recherche-messages/02-opensearch` |
| OpenSearch Dashboards | Visualisation logs | Windows, Linux, macOS | ✅ existant | `12-recherche-messages/02-opensearch` |
| Graylog Open | Gestion logs | Linux | ✅ existant | `15-journalisation/04-graylog` |
| Wazuh | SIEM et XDR | Windows, Linux, macOS | ✅ existant | `15-journalisation/05-wazuh` |
| ELK Stack (Elasticsearch OSS alternatives) | Recherche et logs | Windows, Linux, macOS | ⏳ à faire | → `15-journalisation` |
| Quickwit | Recherche logs | Linux, macOS | ⏳ à faire | → `15-journalisation` |
| VictoriaLogs | Gestion logs | Windows, Linux, macOS | ⏳ à faire | → `15-journalisation` |
| SigNoz | Observabilité full-stack | Linux, Windows via conteneur | ⏳ à faire | → `06-supervision` |
| HyperDX | Observabilité | Linux, Windows via conteneur | ⏳ à faire | → `06-supervision` |
| Uptrace | APM et traces | Windows, Linux, macOS | ⏳ à faire | → `06-supervision` |
| GlitchTip | Suivi erreurs | Linux, Windows via conteneur | ⏳ à faire | → `06-supervision` |
| Sentry self-hosted | Suivi erreurs | Linux | ⏳ à faire | → `06-supervision` |
| Errbit | Suivi erreurs | Linux | ⏳ à faire | → `06-supervision` |
| Uptime Kuma | Surveillance disponibilité | Windows, Linux, macOS | ⏳ à faire | → `06-supervision` |
| Gatus | Surveillance disponibilité | Windows, Linux, macOS | ⏳ à faire | → `06-supervision` |
| Cachet | Page statut | Linux | ⏳ à faire | → `06-supervision` |
| Statping-ng | Page statut | Windows, Linux, macOS | ⏳ à faire | → `06-supervision` |
| Cabot | Supervision et alertes | Linux | ⏳ à faire | → `06-supervision` |
| Healthchecks | Surveillance tâches planifiées | Linux | ⏳ à faire | → `06-supervision` |
| ntopng | Analyse trafic réseau | Windows, Linux, macOS | ⏳ à faire | → `06-supervision` |
| iftop | Analyse bande passante | Linux, BSD | ⏳ à faire | → `06-supervision` |
| vnStat | Statistiques trafic | Linux, BSD | ⏳ à faire | → `06-supervision` |
| Wireshark | Analyse protocoles réseau | Windows, Linux, macOS | ✅ existant | `21-outils/02-reseau-diagnostic/01-wireshark-capture` |
| tshark | Analyse réseau CLI | Windows, Linux, macOS | ⏳ à faire | → `06-supervision` |
| tcpdump | Capture réseau | Linux, macOS, BSD | ⏳ à faire | → `06-supervision` |
| Nmap | Découverte et audit réseau | Windows, Linux, macOS | ✅ existant | `21-outils/02-reseau-diagnostic/03-nmap` |
| ZMap | Scan réseau Internet | Linux | ⏳ à faire | → `06-supervision` |
| Masscan | Scan réseau | Windows, Linux, macOS | ⏳ à faire | → `06-supervision` |
| Netdata Cloud Agent (agent) | Métriques hôte | Windows, Linux, macOS | ✅ existant | `06-supervision/07-netdata` |

## 10. SECURITE, PARE-FEU, SIEM, SCAN ET PKI — 17/64

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| OSSEC | HIDS | Windows, Linux, macOS | ⏳ à faire | → `16-securite` |
| Suricata | IDS/IPS réseau | Windows, Linux, macOS | ✅ existant | `16-securite/05-suricata` |
| Zeek | Analyse sécurité réseau | Linux, macOS | ✅ existant | `16-securite/07-zeek` |
| Snort | IDS/IPS | Windows, Linux, macOS | ✅ existant | `16-securite/06-snort` |
| Security Onion | Distribution SOC | Linux | ⏳ à faire | → `16-securite` |
| TheHive | Gestion incidents SOC | Linux | ⏳ à faire | → `16-securite` |
| MISP | Partage renseignements menaces | Linux | ⏳ à faire | → `16-securite` |
| OpenCTI | Renseignement cyber | Linux | ⏳ à faire | → `16-securite` |
| Yeti | Threat intelligence | Linux | ⏳ à faire | → `16-securite` |
| IntelOwl | Analyse fichiers et observables | Linux | ⏳ à faire | → `16-securite` |
| Velociraptor | DFIR et réponse incident | Windows, Linux, macOS | ⏳ à faire | → `16-securite` |
| GRR Rapid Response | Forensic à distance | Windows, Linux, macOS | ⏳ à faire | → `16-securite` |
| osquery | Instrumentation endpoint | Windows, Linux, macOS | ⏳ à faire | → `16-securite` |
| FleetDM | Gestion osquery | Windows, Linux, macOS | ⏳ à faire | → `16-securite` |
| Kolide Launcher | Sécurité endpoint | Windows, Linux, macOS | ⏳ à faire | → `16-securite` |
| Lynis | Audit sécurité système | Linux, macOS, BSD | ✅ existant | `16-securite/08-lynis` |
| OpenSCAP | Conformité et audit | Linux | ⏳ à faire | → `16-securite` |
| Greenbone Community Edition | Scanner vulnérabilités | Linux | ✅ existant | `21-outils/02-reseau-diagnostic/08-greenbone-openvas` |
| OpenVAS | Scanner vulnérabilités | Linux | ✅ existant | `21-outils/02-reseau-diagnostic/08-greenbone-openvas` |
| Nuclei | Scanner templates vulnérabilités | Windows, Linux, macOS | ⏳ à faire | → `16-securite` |
| OWASP ZAP | Test sécurité web | Windows, Linux, macOS | ✅ existant | `21-outils/03-cybersecurite/02-owasp-zap` |
| Nikto | Scanner serveur web | Windows, Linux, macOS | ⏳ à faire | → `16-securite` |
| Wapiti | Scanner web | Windows, Linux, macOS | ⏳ à faire | → `16-securite` |
| Arachni | Scanner web | Linux | ⏳ à faire | → `16-securite` |
| sqlmap | Audit injection SQL | Windows, Linux, macOS | ⏳ à faire | → `16-securite` |
| Nmap NSE | Scripts audit réseau | Windows, Linux, macOS | ✅ existant | `21-outils/02-reseau-diagnostic/03-nmap` |
| testssl.sh | Audit TLS | Linux, macOS | ⏳ à faire | → `16-securite` |
| SSLyze | Audit TLS | Windows, Linux, macOS | ⏳ à faire | → `16-securite` |
| Certbot | Gestion certificats ACME | Windows via WSL, Linux, macOS | ⏳ à faire | → `16-securite` |
| acme.sh | Client ACME | Windows via shell, Linux, macOS | ⏳ à faire | → `16-securite` |
| step-ca | Autorité de certification | Windows, Linux, macOS | ⏳ à faire | → `16-securite` |
| Smallstep CLI | PKI et certificats | Windows, Linux, macOS | ⏳ à faire | → `16-securite` |
| EJBCA Community | Autorité de certification | Linux | ⏳ à faire | → `16-securite` |
| OpenSSL | Cryptographie et PKI | Windows, Linux, macOS | ⏳ à faire | → `16-securite` |
| LibreSSL | Cryptographie | OpenBSD, Linux, macOS | ⏳ à faire | → `16-securite` |
| GnuPG | Chiffrement et signature | Windows, Linux, macOS | ⏳ à faire | → `16-securite` |
| age | Chiffrement fichiers | Windows, Linux, macOS | ⏳ à faire | → `16-securite` |
| SOPS | Chiffrement secrets config | Windows, Linux, macOS | ⏳ à faire | → `16-securite` |
| Vault (open source core) | Gestion secrets | Windows, Linux, macOS | ⏳ à faire | → `16-securite` |
| OpenBao | Gestion secrets | Windows, Linux, macOS | ⏳ à faire | → `16-securite` |
| Infisical (open source core) | Gestion secrets | Windows, Linux, macOS | ⏳ à faire | → `16-securite` |
| Mozilla SOPS | Gestion secrets | Windows, Linux, macOS | ⏳ à faire | → `16-securite` |
| KeePassXC | Gestionnaire mots de passe | Windows, Linux, macOS | ✅ existant | `21-outils/03-cybersecurite/06-keepassxc-bitwarden` |
| KeePass | Gestionnaire mots de passe | Windows | ⏳ à faire | → `16-securite` |
| Bitwarden self-hosted (clients open source) | Gestion mots de passe | Windows, Linux, macOS | ✅ existant | `21-outils/03-cybersecurite/06-keepassxc-bitwarden` |
| Vaultwarden | Serveur compatible Bitwarden | Windows, Linux, macOS | ✅ existant | `01-annuaire-identite/08-vaultwarden` |
| Passbolt Community | Gestion mots de passe équipe | Linux | ⏳ à faire | → `16-securite` |
| Psono Community | Gestion mots de passe équipe | Windows, Linux, macOS | ⏳ à faire | → `16-securite` |
| Fail2ban | Blocage brute force | Linux, BSD | ✅ existant | `16-securite/01-fail2ban` |
| CrowdSec | Détection et blocage comportemental | Windows, Linux, macOS | ✅ existant | `16-securite/02-crowdsec` |
| sshguard | Protection SSH | Linux, BSD | ⏳ à faire | → `16-securite` |
| Firewalld | Pare-feu dynamique | Linux | ⏳ à faire | → `16-securite` |
| nftables | Pare-feu Linux | Linux | ⏳ à faire | → `16-securite` |
| iptables | Pare-feu Linux historique | Linux | ⏳ à faire | → `16-securite` |
| UFW | Pare-feu simplifié | Linux | ⏳ à faire | → `16-securite` |
| Windows Defender Firewall Tools | Administration pare-feu natif | Windows | ⏳ à faire | → `16-securite` |
| ClamAV | Antivirus open source | Windows, Linux, macOS | ✅ existant | `16-securite/04-clamav` |
| YARA | Règles de détection | Windows, Linux, macOS | ⏳ à faire | → `16-securite` |
| Chkrootkit | Détection rootkits | Linux | ⏳ à faire | → `16-securite` |
| rkhunter | Détection rootkits | Linux | ⏳ à faire | → `16-securite` |
| AIDE | Contrôle intégrité fichiers | Linux, Unix | ✅ existant | `16-securite/03-aide` |
| Lynis Enterprise alternatives | Audit système (catégorie) | Linux | ✅ existant | `16-securite/08-lynis` |
| OpenEDR | EDR open source | Windows, Linux | ⏳ à faire | → `16-securite` |
| XCP-ng Xen Orchestra (community) | Gestion hyperviseur | Linux, Windows, macOS via navigateur | 🆕 fait (lot 48) | `13-conteneurs/15-xcp-ng-xen` |

## 11. AUTOMATISATION, CONFIGURATION ET INFRASTRUCTURE AS CODE — 6/45

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| Ansible | Automatisation configuration | Windows, Linux, macOS (contrôle Linux/macOS) | ✅ existant | `17-automatisation/01-ansible` |
| AWX | Interface Ansible | Linux, Windows via conteneur | ⏳ à faire | → `17-automatisation` |
| Semaphore UI | Interface Ansible | Windows, Linux, macOS | ⏳ à faire | → `17-automatisation` |
| Rundeck Community | Automatisation opérations | Windows, Linux, macOS | ⏳ à faire | → `17-automatisation` |
| Rundeck | Orchestration tâches | Windows, Linux, macOS | ⏳ à faire | → `17-automatisation` |
| Salt Project | Automatisation infrastructure | Windows, Linux, macOS | ✅ existant | `17-automatisation/03-salt` |
| Puppet Open Source | Gestion configuration | Windows, Linux, macOS | ✅ existant | `17-automatisation/02-puppet` |
| Chef Infra (community) | Gestion configuration | Windows, Linux, macOS | ⏳ à faire | → `17-automatisation` |
| CFEngine | Gestion configuration | Windows, Linux, macOS | ⏳ à faire | → `17-automatisation` |
| Terraform | Infrastructure as Code | Windows, Linux, macOS | ✅ existant | `17-automatisation/04-terraform` |
| OpenTofu | Infrastructure as Code | Windows, Linux, macOS | ✅ existant | `17-automatisation/04-terraform` |
| Pulumi | Infrastructure as Code | Windows, Linux, macOS | ⏳ à faire | → `17-automatisation` |
| Terragrunt | Orchestration Terraform | Windows, Linux, macOS | ⏳ à faire | → `17-automatisation` |
| Terramate | Orchestration IaC | Windows, Linux, macOS | ⏳ à faire | → `17-automatisation` |
| Cloud-init | Initialisation VM | Linux, BSD | ⏳ à faire | → `17-automatisation` |
| Ignition | Provisioning OS | Linux | ⏳ à faire | → `17-automatisation` |
| Foreman | Provisioning et gestion serveurs | Linux | ⏳ à faire | → `17-automatisation` |
| Katello | Gestion contenu et patchs | Linux | ⏳ à faire | → `17-automatisation` |
| Uyuni | Gestion parc et patchs | Linux | ⏳ à faire | → `17-automatisation` |
| Rudder | Configuration et conformité | Windows, Linux | ⏳ à faire | → `17-automatisation` |
| Rex (R)? | Automatisation distante | Linux, Unix | ⏳ à faire | → `17-automatisation` |
| Fabric | Automatisation SSH Python | Windows, Linux, macOS | ⏳ à faire | → `17-automatisation` |
| Invoke | Task execution Python | Windows, Linux, macOS | ⏳ à faire | → `17-automatisation` |
| Nornir | Automatisation réseau Python | Windows, Linux, macOS | ⏳ à faire | → `17-automatisation` |
| Netmiko | Automatisation équipements réseau | Windows, Linux, macOS | ⏳ à faire | → `17-automatisation` |
| NAPALM | Automatisation réseau | Windows, Linux, macOS | ⏳ à faire | → `17-automatisation` |
| Nornir Salt | Automatisation réseau | Windows, Linux, macOS | ⏳ à faire | → `17-automatisation` |
| StackStorm | Automatisation événementielle | Linux | ⏳ à faire | → `17-automatisation` |
| Huginn | Automatisation événementielle | Windows, Linux, macOS | ⏳ à faire | → `17-automatisation` |
| n8n (source available/community) | Automatisation workflows | Windows, Linux, macOS | ✅ existant | `21-outils/05-ia-productivite/06-n8n` |
| Node-RED | Automatisation low-code | Windows, Linux, macOS | ⏳ à faire | → `17-automatisation` |
| Activepieces (community) | Automatisation workflows | Windows, Linux, macOS | ⏳ à faire | → `17-automatisation` |
| Windmill (community) | Automatisation scripts et workflows | Windows, Linux, macOS | ⏳ à faire | → `17-automatisation` |
| Kestra | Orchestration workflows | Windows, Linux, macOS | ⏳ à faire | → `17-automatisation` |
| Apache Airflow | Orchestration pipelines | Windows, Linux, macOS | ⏳ à faire | → `17-automatisation` |
| Prefect | Orchestration workflows | Windows, Linux, macOS | ⏳ à faire | → `17-automatisation` |
| Dagster | Orchestration data | Windows, Linux, macOS | ⏳ à faire | → `17-automatisation` |
| Temporal | Orchestration durable | Windows, Linux, macOS | ⏳ à faire | → `17-automatisation` |
| Netflix Conductor | Orchestration microservices | Linux, macOS | ⏳ à faire | → `17-automatisation` |
| Apache DolphinScheduler | Orchestration tâches | Linux | ⏳ à faire | → `17-automatisation` |
| Molecule | Tests rôles Ansible | Windows, Linux, macOS | ⏳ à faire | → `17-automatisation` |
| Testinfra | Tests infrastructure | Windows, Linux, macOS | ⏳ à faire | → `17-automatisation` |
| InSpec (core open source) | Tests conformité | Windows, Linux, macOS | ⏳ à faire | → `17-automatisation` |
| Serverspec | Tests infrastructure | Linux, macOS | ⏳ à faire | → `17-automatisation` |
| KitchenCI | Tests infrastructure | Windows, Linux, macOS | ⏳ à faire | → `17-automatisation` |

## 12. MESSAGERIE, COLLABORATION, GROUPWARE ET COMMUNICATION — 11/80

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| Matrix Synapse | Serveur messagerie Matrix | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| Dendrite | Serveur Matrix | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| Conduit | Serveur Matrix léger | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| Continuwuity | Serveur Matrix | Linux, macOS | ⏳ à faire | → `10-messagerie` |
| Element Server Suite (components) | Messagerie Matrix | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| Mattermost Team Edition | Chat équipe | Linux, Windows via conteneur | ⏳ à faire | → `10-messagerie` |
| Rocket.Chat Community | Chat équipe | Linux, Windows via conteneur | ⏳ à faire | → `10-messagerie` |
| Zulip | Chat équipe | Linux | ⏳ à faire | → `10-messagerie` |
| XMPP Prosody | Serveur XMPP | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| ejabberd | Serveur XMPP | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| Openfire | Serveur XMPP | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| Snikket | Messagerie XMPP | Linux | ⏳ à faire | → `10-messagerie` |
| MongooseIM | Serveur XMPP | Linux | ⏳ à faire | → `10-messagerie` |
| Jitsi Meet | Visioconférence | Linux | ⏳ à faire | → `10-messagerie` |
| Jitsi Videobridge | Serveur média | Linux | ⏳ à faire | → `10-messagerie` |
| BigBlueButton | Classe virtuelle | Linux | ⏳ à faire | → `10-messagerie` |
| Galène | Visioconférence | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| Nextcloud Talk | Chat et visioconférence | Linux | ✅ existant | `09-fichiers-partage/08-nextcloud` |
| Element | Client Matrix | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| Converse.js | Client XMPP web | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| Zammad | Helpdesk | Linux | ✅ existant | `21-outils/06-support-parc/06-zammad` |
| Chatwoot | Support client omnicanal | Linux | ⏳ à faire | → `10-messagerie` |
| FreeScout | Helpdesk email | Linux | ⏳ à faire | → `10-messagerie` |
| osTicket | Ticketing support | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| GLPI | ITSM et parc informatique | Windows, Linux, macOS | ✅ existant | `21-outils/06-support-parc/04-glpi-installation` |
| iTop | ITSM et CMDB | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| OTOBO | ITSM | Linux | ⏳ à faire | → `10-messagerie` |
| Znuny | ITSM | Linux | ⏳ à faire | → `10-messagerie` |
| Request Tracker | Ticketing | Linux, Unix | ⏳ à faire | → `10-messagerie` |
| UVdesk Community | Helpdesk | Linux | ⏳ à faire | → `10-messagerie` |
| Faveo Helpdesk Community | Helpdesk | Linux | ⏳ à faire | → `10-messagerie` |
| OpenProject | Gestion projet | Linux | ⏳ à faire | → `10-messagerie` |
| Taiga | Gestion projet agile | Linux | ⏳ à faire | → `10-messagerie` |
| Plane (community) | Gestion projet | Linux, Windows via conteneur | ⏳ à faire | → `10-messagerie` |
| Leantime | Gestion projet | Linux | ⏳ à faire | → `10-messagerie` |
| Redmine | Gestion projet | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| Trac | Gestion projet et wiki | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| Phabricator (archivé) | Collaboration développement | Linux | ⏳ à faire | → `10-messagerie` |
| Tuleap Community | ALM et projet | Linux | ⏳ à faire | → `10-messagerie` |
| Kanboard | Kanban | Linux | ⏳ à faire | → `10-messagerie` |
| Wekan | Kanban | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| Focalboard (archivé) | Gestion projet | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| Vikunja | Tâches et projets | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| AppFlowy | Espace de travail | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| AFFiNE | Espace de travail | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| Outline | Wiki collaboratif | Linux | ⏳ à faire | → `10-messagerie` |
| BookStack | Wiki documentaire | Linux | ✅ existant | `21-outils/05-ia-productivite/09-bookstack` |
| Wiki.js | Wiki | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| XWiki | Wiki | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| DokuWiki | Wiki | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| MediaWiki | Wiki | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| TWiki | Wiki | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| MoinMoin | Wiki | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| Gollum | Wiki Git | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| HedgeDoc | Édition Markdown collaborative | Linux | ⏳ à faire | → `10-messagerie` |
| Etherpad | Édition collaborative | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| CryptPad | Suite collaborative chiffrée | Linux | ⏳ à faire | → `10-messagerie` |
| ownCloud | Suite collaborative | Linux | ✅ existant | `09-fichiers-partage/09-owncloud` |
| SOGo | Groupware | Linux | ⏳ à faire | → `10-messagerie` |
| Kopano Core Community | Groupware | Linux | ⏳ à faire | → `10-messagerie` |
| Cal.com (core open source) | Planification rendez-vous | Linux, Windows via conteneur | ⏳ à faire | → `10-messagerie` |
| Radicale | Serveur CalDAV/CardDAV | Windows, Linux, macOS | ✅ existant | `10-messagerie/08-radicale` |
| Baïkal | Serveur CalDAV/CardDAV | Linux | ⏳ à faire | → `10-messagerie` |
| DAViCal | Serveur CalDAV | Linux | ⏳ à faire | → `10-messagerie` |
| Mailu | Suite serveur mail | Linux | ⏳ à faire | → `10-messagerie` |
| Mailcow | Suite serveur mail | Linux | ⏳ à faire | → `10-messagerie` |
| docker-mailserver | Serveur mail | Linux | ⏳ à faire | → `10-messagerie` |
| Modoboa | Suite serveur mail | Linux | ⏳ à faire | → `10-messagerie` |
| iRedMail (open source edition) | Suite serveur mail | Linux, BSD | ⏳ à faire | → `10-messagerie` |
| Postfix | MTA SMTP | Windows via ports, Linux, macOS | ✅ existant | `10-messagerie/01-postfix` |
| Exim | MTA SMTP | Linux, Unix | ✅ existant | `10-messagerie/03-exim` |
| OpenSMTPD | MTA SMTP | OpenBSD, Linux | ⏳ à faire | → `10-messagerie` |
| Dovecot | Serveur IMAP/POP3 | Linux, Unix | ✅ existant | `10-messagerie/02-dovecot` |
| Rspamd | Filtrage spam | Linux | ✅ existant | `10-messagerie/04-rspamd` |
| SpamAssassin | Filtrage spam | Windows, Linux, macOS | ✅ existant | `10-messagerie/05-spamassassin` |
| Amavis | Filtrage email | Linux | ⏳ à faire | → `10-messagerie` |
| Roundcube | Webmail | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| SnappyMail | Webmail | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| SquirrelMail | Webmail historique | Linux | ⏳ à faire | → `10-messagerie` |
| RainLoop (abandonné) | Webmail historique | Linux | ⏳ à faire | → `10-messagerie` |

## 13. WEB, CMS, E-COMMERCE ET PORTAILS — 1/64

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| WordPress | CMS | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| Drupal | CMS | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| Joomla | CMS | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| Ghost | CMS/blog | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| Grav | CMS flat-file | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| ClassicPress | CMS | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| TYPO3 | CMS entreprise | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| Contao | CMS | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| October CMS (community) | CMS Laravel | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| Strapi | CMS headless | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| Directus | CMS headless | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| Payload CMS | CMS headless | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| KeystoneJS | CMS headless | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| Sanity Studio (source available) | CMS headless | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| Wagtail | CMS Django | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| Mezzanine | CMS Django | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| Plone | CMS Python | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| Zope | Serveur applicatif | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| Liferay Community Edition | Portail | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| Jahia (community components) | CMS | Linux | ⏳ à faire | → `25-web-cms-portails` |
| eXo Platform (community) | Portail collaboratif | Linux | ⏳ à faire | → `25-web-cms-portails` |
| Alfresco Community | ECM | Linux, Windows | ⏳ à faire | → `25-web-cms-portails` |
| Nuxeo (community legacy) | ECM | Linux | ⏳ à faire | → `25-web-cms-portails` |
| Moodle | LMS | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| Canvas LMS (open source) | LMS | Linux | ⏳ à faire | → `25-web-cms-portails` |
| Chamilo | LMS | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| ILIAS | LMS | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| Open edX | LMS | Linux | ⏳ à faire | → `25-web-cms-portails` |
| Frappe Framework | Framework ERP | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| ERPNext | ERP | Linux | ⏳ à faire | → `25-web-cms-portails` |
| Odoo Community | ERP/CRM | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| Tryton | ERP | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| Dolibarr | ERP/CRM | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| iDempiere | ERP | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| metasfresh | ERP | Linux | ⏳ à faire | → `25-web-cms-portails` |
| Apache OFBiz | ERP | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| ERP5 | ERP | Linux | ⏳ à faire | → `25-web-cms-portails` |
| FrontAccounting | Comptabilité/ERP | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| Invoice Ninja (community) | Facturation | Linux | ⏳ à faire | → `25-web-cms-portails` |
| Akaunting (community) | Comptabilité | Linux | ⏳ à faire | → `25-web-cms-portails` |
| Kimai | Suivi temps et facturation | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| Crater (archivé) | Facturation | Linux | ⏳ à faire | → `25-web-cms-portails` |
| OpenCart | E-commerce | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| PrestaShop | E-commerce | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| Magento Open Source | E-commerce | Linux | ⏳ à faire | → `25-web-cms-portails` |
| WooCommerce | E-commerce WordPress | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| Saleor | E-commerce headless | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| Medusa | E-commerce headless | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| Sylius | E-commerce Symfony | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| Shopware Community | E-commerce | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| Bagisto | E-commerce Laravel | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| Spree Commerce | E-commerce Ruby | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| Reaction Commerce (archivé) | E-commerce | Linux | ⏳ à faire | → `25-web-cms-portails` |
| Vendure | E-commerce headless | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| Solidus | E-commerce Ruby | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| Open Source POS (OSPOS) | Caisse POS | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| uniCenta oPOS | Caisse POS | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| Floreant POS | Caisse POS | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| ERPNext POS | Caisse POS | Linux | ⏳ à faire | → `25-web-cms-portails` |
| OpenBoxes | Gestion stocks | Linux | ⏳ à faire | → `25-web-cms-portails` |
| Inventree | Gestion inventaire | Windows, Linux, macOS | ⏳ à faire | → `25-web-cms-portails` |
| Snipe-IT | Gestion actifs | Linux | ⏳ à faire | → `25-web-cms-portails` |
| OCS Inventory NG | Inventaire IT | Windows, Linux, macOS | ✅ existant | `21-outils/06-support-parc/07-ocs-inventory` |
| FusionInventory | Inventaire IT (ancien) | Windows, Linux | ⏳ à faire | → `25-web-cms-portails` |

## 14. DEVOPS, DEPOTS DE CODE, REGISTRY ET QUALITE — 5/56

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| Git | Gestion versions | Windows, Linux, macOS | ✅ existant | `14-devops/01-git` |
| Gitea | Forge Git | Windows, Linux, macOS | ✅ existant | `14-devops/03-gitea` |
| Forgejo | Forge Git | Windows, Linux, macOS | ✅ existant | `14-devops/04-forgejo` |
| GitLab Community Edition | Forge DevOps | Linux | ✅ existant | `14-devops/02-gitlab` |
| Gogs | Forge Git | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| OneDev | Forge DevOps | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| SourceHut | Forge de développement | Linux | ⏳ à faire | → `14-devops` |
| Pagure | Forge Git | Linux | ⏳ à faire | → `14-devops` |
| Phorge | Forge développement | Linux | ⏳ à faire | → `14-devops` |
| Gerrit Code Review | Revue de code | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| Review Board | Revue de code | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| RhodeCode Community | Forge Git | Linux | ⏳ à faire | → `14-devops` |
| Fossil SCM | Gestion versions | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| Mercurial | Gestion versions | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| Subversion Apache | Gestion versions | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| Harbor | Registry OCI | Linux | ⏳ à faire | → `14-devops` |
| Distribution Registry | Registry Docker | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| Zot | Registry OCI | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| Nexus Repository OSS | Gestion dépôts artefacts | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| JFrog Artifactory OSS (legacy) | Gestion artefacts | Linux | ⏳ à faire | → `14-devops` |
| Verdaccio | Registry npm | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| SonarQube Community Build | Qualité code | Windows, Linux, macOS | ✅ existant | `14-devops/07-sonarqube` |
| SonarLint | Analyse IDE | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| Semgrep CE | Analyse statique | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| CodeQL CLI (license restrictions) | Analyse code | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| PMD | Analyse statique | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| Checkstyle | Analyse Java | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| SpotBugs | Analyse Java | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| ESLint | Analyse JavaScript | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| Prettier | Formatage code | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| Ruff | Lint Python | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| Pylint | Lint Python | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| Mypy | Types Python | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| Bandit | Sécurité Python | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| Grype | Scan vulnérabilités | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| Syft | SBOM | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| Cosign | Signature artefacts | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| in-toto | Chaîne approvisionnement | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| Tekton Chains | Signature pipelines | Linux | ⏳ à faire | → `14-devops` |
| Renovate | Mise à jour dépendances | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| Dependabot (service GitHub) | Mise à jour dépendances | Cloud | ⏳ à faire | → `14-devops` |
| Mend Renovate CLI | Mise à jour dépendances | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| OpenRewrite | Modernisation code | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| Allure Report | Rapports tests | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| ReportPortal | Rapports tests | Linux | ⏳ à faire | → `14-devops` |
| Sonobuoy | Tests Kubernetes | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| k6 | Tests de charge | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| Apache JMeter | Tests de charge | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| Locust | Tests de charge | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| Gatling (core) | Tests de charge | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| Vegeta | Tests HTTP | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| wrk | Tests HTTP | Linux, macOS | ⏳ à faire | → `14-devops` |
| hey | Tests HTTP | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| Siege | Tests HTTP | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| OWASP Juice Shop | Application de test sécurité | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |
| WebGoat | Application de test sécurité | Windows, Linux, macOS | ⏳ à faire | → `14-devops` |

## 15. SERVICES WINDOWS, GESTION PARC ET OUTILS D'ADMINISTRATION — 6/41

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| OpenSSH for Windows | Serveur/client SSH | Windows | ✅ existant | `08-acces-distant-vpn/01-openssh` |
| PowerShell 7 | Shell et scripts | Windows, Linux, macOS | ⏳ à faire | → `26-gestion-parc` |
| Windows Terminal | Terminal | Windows | ⏳ à faire | → `26-gestion-parc` |
| WinGet CLI | Gestion paquets Windows | Windows | ⏳ à faire | → `26-gestion-parc` |
| Chocolatey (community edition) | Gestion paquets Windows | Windows | ⏳ à faire | → `26-gestion-parc` |
| Scoop | Gestion paquets Windows | Windows | ⏳ à faire | → `26-gestion-parc` |
| NSSM | Gestion services Windows | Windows | ⏳ à faire | → `26-gestion-parc` |
| WinSW | Wrapper services Windows | Windows | ⏳ à faire | → `26-gestion-parc` |
| RDPY | Outils RDP Python | Windows, Linux, macOS | ⏳ à faire | → `26-gestion-parc` |
| FreeRDP | Client/serveur RDP | Windows, Linux, macOS | ⏳ à faire | → `26-gestion-parc` |
| Apache Guacamole | Passerelle RDP/VNC/SSH | Windows, Linux, macOS (serveur Linux) | ⏳ à faire | → `26-gestion-parc` |
| MeshCentral | Gestion et téléassistance | Windows, Linux, macOS | ✅ existant | `21-outils/06-support-parc/03-meshcentral` |
| RustDesk Server | Relais bureau distant | Windows, Linux, macOS | ✅ existant | `21-outils/06-support-parc/02-rustdesk` |
| Remmina | Client bureau distant | Linux | ⏳ à faire | → `26-gestion-parc` |
| TigerVNC | Serveur/client VNC | Windows, Linux, macOS | ⏳ à faire | → `26-gestion-parc` |
| TightVNC | Serveur/client VNC | Windows, Linux | ⏳ à faire | → `26-gestion-parc` |
| UltraVNC | Serveur/client VNC | Windows | ⏳ à faire | → `26-gestion-parc` |
| xrdp | Serveur RDP Linux | Linux | ⏳ à faire | → `26-gestion-parc` |
| X2Go | Bureau distant | Linux, Windows client | ⏳ à faire | → `26-gestion-parc` |
| FreeIPA client | Intégration identité | Linux | ✅ existant | `01-annuaire-identite/03-freeipa` |
| Winbind | Intégration AD | Windows, Linux | ⏳ à faire | → `26-gestion-parc` |
| WSL | Sous-système Linux | Windows | ⏳ à faire | → `26-gestion-parc` |
| Cygwin | Environnement Unix | Windows | ⏳ à faire | → `26-gestion-parc` |
| MSYS2 | Environnement Unix et outils | Windows | ⏳ à faire | → `26-gestion-parc` |
| Git for Windows | Git et shell | Windows | ⏳ à faire | → `26-gestion-parc` |
| Rufus (open source) | Création supports boot | Windows | ⏳ à faire | → `26-gestion-parc` |
| Ventoy | Création supports multiboot | Windows, Linux | ⏳ à faire | → `26-gestion-parc` |
| Clonezilla | Clonage système | Windows, Linux, macOS | ✅ existant | `21-outils/07-disques-recuperation/02-clonezilla` |
| FOG Project | Déploiement images | Linux, Windows clients | ⏳ à faire | → `26-gestion-parc` |
| opsi | Déploiement logiciel | Linux server, Windows clients | ⏳ à faire | → `26-gestion-parc` |
| WAPT Community | Déploiement logiciel | Windows, Linux server | ⏳ à faire | → `26-gestion-parc` |
| Open-AudIT | Inventaire réseau | Windows, Linux, macOS | ⏳ à faire | → `26-gestion-parc` |
| GLPI Agent | Inventaire agent | Windows, Linux, macOS | ✅ existant | `21-outils/06-support-parc/04-glpi-installation` |
| Win32-OpenSSH | SSH Windows | Windows | ⏳ à faire | → `26-gestion-parc` |
| RPort | Gestion distante | Windows, Linux, macOS | ⏳ à faire | → `26-gestion-parc` |
| Tactical RMM | RMM et téléassistance | Windows, Linux, macOS | ⏳ à faire | → `26-gestion-parc` |
| Remotely | Téléassistance | Windows, Linux, macOS | ⏳ à faire | → `26-gestion-parc` |
| Actiona | Automatisation GUI | Windows, Linux | ⏳ à faire | → `26-gestion-parc` |
| AutoHotkey | Automatisation Windows | Windows | ⏳ à faire | → `26-gestion-parc` |
| AutoIt | Automatisation Windows | Windows | ⏳ à faire | → `26-gestion-parc` |
| PowerToys | Utilitaires Windows | Windows | ⏳ à faire | → `26-gestion-parc` |

## 16. SERVICES MACOS, LINUX DESKTOP ET OUTILS MULTIPLATEFORMES — 3/67

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| Homebrew | Gestionnaire paquets | macOS, Linux | ⏳ à faire | → `21-outils` |
| MacPorts | Gestionnaire paquets | macOS | ⏳ à faire | → `21-outils` |
| Nix | Gestionnaire paquets reproductible | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| GNU Guix | Gestionnaire paquets | Linux | ⏳ à faire | → `21-outils` |
| Flatpak | Applications sandbox | Linux | ⏳ à faire | → `21-outils` |
| Snapd | Gestionnaire paquets | Linux | ⏳ à faire | → `21-outils` |
| AppImage | Format applications portables | Linux | ⏳ à faire | → `21-outils` |
| Apt | Gestionnaire paquets | Debian/Ubuntu | ⏳ à faire | → `21-outils` |
| DNF | Gestionnaire paquets | Fedora/RHEL-like | ⏳ à faire | → `21-outils` |
| YUM | Gestionnaire paquets historique | CentOS/RHEL | ⏳ à faire | → `21-outils` |
| Zypper | Gestionnaire paquets | openSUSE/SLES | ⏳ à faire | → `21-outils` |
| Pacman | Gestionnaire paquets | Arch Linux | ⏳ à faire | → `21-outils` |
| APK | Gestionnaire paquets | Alpine Linux | ⏳ à faire | → `21-outils` |
| Portage | Gestionnaire paquets | Gentoo | ⏳ à faire | → `21-outils` |
| OpenRC | Init et services | Linux, BSD | ⏳ à faire | → `21-outils` |
| systemd | Init et services | Linux | ⏳ à faire | → `21-outils` |
| runit | Init et services | Linux, BSD | ⏳ à faire | → `21-outils` |
| s6 | Suite supervision services | Linux, BSD | ⏳ à faire | → `21-outils` |
| Supervisord | Gestion processus | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| Monit | Supervision processus | Linux, BSD | ⏳ à faire | → `21-outils` |
| PM2 | Gestion processus Node.js | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| forever | Gestion processus Node.js | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| circus | Gestion processus | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| GNU Screen | Multiplexeur terminal | Linux, macOS | ⏳ à faire | → `21-outils` |
| tmux | Multiplexeur terminal | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| Zellij | Multiplexeur terminal | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| Fish shell | Shell | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| Zsh | Shell | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| Bash | Shell | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| nushell | Shell | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| Starship | Invite shell | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| Oh My Zsh | Configuration Zsh | Linux, macOS | ⏳ à faire | → `21-outils` |
| chezmoi | Gestion dotfiles | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| GNU Stow | Gestion dotfiles | Linux, macOS | ⏳ à faire | → `21-outils` |
| Ansible Pull | Configuration poste | Windows, Linux, macOS | ✅ existant | `17-automatisation/01-ansible` |
| Timeshift | Snapshots système | Linux | ⏳ à faire | → `21-outils` |
| Snapper | Snapshots système | Linux | ⏳ à faire | → `21-outils` |
| Back In Time | Sauvegarde poste | Linux | ⏳ à faire | → `21-outils` |
| Déjà Dup | Sauvegarde poste | Linux | ⏳ à faire | → `21-outils` |
| KDE Connect | Intégration appareils | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| Barrier | Partage clavier/souris | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| Input Leap | Partage clavier/souris | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| Synergy Core (open source legacy) | Partage clavier/souris | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| LocalSend | Transfert fichiers local | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| KDE Plasma | Environnement bureau | Linux, BSD | ⏳ à faire | → `21-outils` |
| GNOME | Environnement bureau | Linux, BSD | ⏳ à faire | → `21-outils` |
| XFCE | Environnement bureau | Linux, BSD | ⏳ à faire | → `21-outils` |
| MATE | Environnement bureau | Linux, BSD | ⏳ à faire | → `21-outils` |
| Cinnamon | Environnement bureau | Linux | ⏳ à faire | → `21-outils` |
| LXQt | Environnement bureau | Linux | ⏳ à faire | → `21-outils` |
| COSMIC | Environnement bureau | Linux | ⏳ à faire | → `21-outils` |
| Xfce Terminal | Terminal graphique | Linux | ⏳ à faire | → `21-outils` |
| Alacritty | Terminal graphique | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| WezTerm | Terminal graphique | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| Kitty | Terminal graphique | Linux, macOS | ⏳ à faire | → `21-outils` |
| Ghostty | Terminal graphique | Linux, macOS | ⏳ à faire | → `21-outils` |
| Neovim | Éditeur terminal | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| Vim | Éditeur texte | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| Emacs | Éditeur texte | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| Geany | IDE léger | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| VSCodium | Éditeur code | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| Eclipse IDE | IDE | Windows, Linux, macOS | ✅ existant | `21-outils/04-developpement/04-eclipse` |
| Apache NetBeans | IDE | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| Qt Creator | IDE | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| Code::Blocks | IDE | Windows, Linux, macOS | ⏳ à faire | → `21-outils` |
| Kate | Éditeur texte | Linux, Windows | ⏳ à faire | → `21-outils` |
| Notepad++ | Éditeur texte | Windows | ✅ existant | `21-outils/04-developpement/05-notepad-plus-plus` |

## 17. STREAMING, MEDIA, AUDIO, VIDEO ET TRANSCODAGE — 7/49

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| Jellyfin | Serveur média | Windows, Linux, macOS | ✅ existant | `20-multimedia-services/01-jellyfin` |
| Navidrome | Serveur musique | Windows, Linux, macOS | ✅ existant | `20-multimedia-services/03-navidrome` |
| Ampache | Serveur musique | Windows, Linux, macOS | ⏳ à faire | → `20-multimedia-services` |
| LMS (Lyrion Music Server) | Serveur musique | Windows, Linux, macOS | ⏳ à faire | → `20-multimedia-services` |
| Mopidy | Serveur musique | Windows, Linux, macOS | ⏳ à faire | → `20-multimedia-services` |
| Airsonic-Advanced | Serveur musique | Windows, Linux, macOS | ⏳ à faire | → `20-multimedia-services` |
| Funkwhale | Plateforme audio | Linux | ⏳ à faire | → `20-multimedia-services` |
| AzuraCast | Radio web | Linux | ⏳ à faire | → `20-multimedia-services` |
| LibreTime | Radio web | Linux | ⏳ à faire | → `20-multimedia-services` |
| Icecast | Streaming audio | Windows, Linux, macOS | ✅ existant | `20-multimedia-services/04-icecast` |
| Owncast | Streaming vidéo live | Windows, Linux, macOS | ⏳ à faire | → `20-multimedia-services` |
| PeerTube | Plateforme vidéo | Linux | ⏳ à faire | → `20-multimedia-services` |
| MediaCMS | Plateforme vidéo | Linux | ⏳ à faire | → `20-multimedia-services` |
| Ant Media Community (license check) | Streaming vidéo | Linux | ⏳ à faire | → `20-multimedia-services` |
| OvenMediaEngine | Streaming vidéo | Linux | ⏳ à faire | → `20-multimedia-services` |
| SRS | Serveur streaming | Linux, Windows, macOS | ⏳ à faire | → `20-multimedia-services` |
| Nginx RTMP Module | Streaming RTMP | Linux | ✅ existant | `20-multimedia-services/05-nginx-rtmp` |
| Red5 Open Source | Serveur streaming | Windows, Linux, macOS | ⏳ à faire | → `20-multimedia-services` |
| Janus WebRTC Server | Serveur WebRTC | Linux | ⏳ à faire | → `20-multimedia-services` |
| mediasoup | SFU WebRTC | Windows, Linux, macOS | ⏳ à faire | → `20-multimedia-services` |
| LiveKit | Serveur WebRTC | Windows, Linux, macOS | ⏳ à faire | → `20-multimedia-services` |
| Pion WebRTC | Bibliothèque WebRTC | Windows, Linux, macOS | ⏳ à faire | → `20-multimedia-services` |
| Kurento | Serveur média WebRTC | Linux | ⏳ à faire | → `20-multimedia-services` |
| FFmpeg | Traitement audio/vidéo | Windows, Linux, macOS | ⏳ à faire | → `20-multimedia-services` |
| HandBrake | Transcodage vidéo | Windows, Linux, macOS | ⏳ à faire | → `20-multimedia-services` |
| GStreamer | Framework multimédia | Windows, Linux, macOS | ⏳ à faire | → `20-multimedia-services` |
| OBS Studio | Capture et streaming | Windows, Linux, macOS | ⏳ à faire | → `20-multimedia-services` |
| VLC | Lecteur média | Windows, Linux, macOS | ⏳ à faire | → `20-multimedia-services` |
| MPV | Lecteur média | Windows, Linux, macOS | ⏳ à faire | → `20-multimedia-services` |
| Kodi | Media center | Windows, Linux, macOS | ⏳ à faire | → `20-multimedia-services` |
| Shaka Packager | Packaging vidéo | Windows, Linux, macOS | ⏳ à faire | → `20-multimedia-services` |
| Bento4 | Packaging MP4 | Windows, Linux, macOS | ⏳ à faire | → `20-multimedia-services` |
| MediaMTX | Serveur RTSP/RTMP/WebRTC | Windows, Linux, macOS | ⏳ à faire | → `20-multimedia-services` |
| Restreamer | Streaming et retransmission | Windows, Linux, macOS | ⏳ à faire | → `20-multimedia-services` |
| Tdarr (community) | Automatisation transcodage | Windows, Linux, macOS | ⏳ à faire | → `20-multimedia-services` |
| Unmanic | Automatisation médias | Windows, Linux, macOS | ⏳ à faire | → `20-multimedia-services` |
| FileFlows | Traitement médias | Windows, Linux, macOS | ⏳ à faire | → `20-multimedia-services` |
| Bazarr | Sous-titres | Windows, Linux, macOS | ⏳ à faire | → `20-multimedia-services` |
| Sonarr | Gestion séries | Windows, Linux, macOS | ⏳ à faire | → `20-multimedia-services` |
| Radarr | Gestion films | Windows, Linux, macOS | ⏳ à faire | → `20-multimedia-services` |
| Lidarr | Gestion musique | Windows, Linux, macOS | ⏳ à faire | → `20-multimedia-services` |
| Readarr | Gestion livres | Windows, Linux, macOS | ⏳ à faire | → `20-multimedia-services` |
| Prowlarr | Gestion indexeurs | Windows, Linux, macOS | ⏳ à faire | → `20-multimedia-services` |
| Jackett | Proxy indexeurs | Windows, Linux, macOS | ⏳ à faire | → `20-multimedia-services` |
| qBittorrent | Client BitTorrent | Windows, Linux, macOS | ✅ existant | `20-multimedia-services/06-bittorrent/02-qbittorrent` |
| Transmission | Client BitTorrent | Windows, Linux, macOS | ✅ existant | `20-multimedia-services/06-bittorrent/01-transmission` |
| Deluge | Client BitTorrent | Windows, Linux, macOS | ✅ existant | `20-multimedia-services/06-bittorrent/03-deluge` |
| aria2 | Téléchargement multi-protocole | Windows, Linux, macOS | ⏳ à faire | → `20-multimedia-services` |
| yt-dlp | Téléchargement médias | Windows, Linux, macOS | ⏳ à faire | → `20-multimedia-services` |

## 18. DNS WEB, EMAIL, ANTI-SPAM ET OUTILS DE COMMUNICATION — 4/31

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| PostfixAdmin | Administration Postfix | Linux | ⏳ à faire | → `10-messagerie` |
| Mailpit | Test SMTP local | Windows, Linux, macOS | ✅ existant | `10-messagerie/07-mailpit` |
| MailHog | Test SMTP local | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| smtp4dev | Test SMTP local | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| Haraka | Serveur SMTP Node.js | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| Postal | Plateforme envoi email | Linux | ⏳ à faire | → `10-messagerie` |
| Listmonk | Newsletters | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| Mautic | Marketing automation | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| phpList | Newsletters | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| Sympa | Listes de diffusion | Linux | ⏳ à faire | → `10-messagerie` |
| Mailman 3 | Listes de diffusion | Linux | ✅ existant | `10-messagerie/06-mailman` |
| Mailman 2 (legacy) | Listes de diffusion | Linux | ⏳ à faire | → `10-messagerie` |
| OpenDKIM | Signature DKIM | Linux | ⏳ à faire | → `10-messagerie` |
| OpenDMARC | Validation DMARC | Linux | ⏳ à faire | → `10-messagerie` |
| Postgrey | Greylisting SMTP | Linux | ⏳ à faire | → `10-messagerie` |
| policyd-spf | Validation SPF | Linux | ⏳ à faire | → `10-messagerie` |
| OpenARC | Validation ARC | Linux | ⏳ à faire | → `10-messagerie` |
| SoGo Connector | Connecteur groupware | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| Nextcloud Calendar | Calendrier | Linux | ✅ existant | `09-fichiers-partage/08-nextcloud` |
| Nextcloud Contacts | Contacts | Linux | ✅ existant | `09-fichiers-partage/08-nextcloud` |
| DAVx5 (client open source) | Synchronisation CalDAV/CardDAV | Android | ⏳ à faire | → `10-messagerie` |
| Evolution | Client mail/groupware | Linux | ⏳ à faire | → `10-messagerie` |
| Thunderbird | Client mail | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| KMail | Client mail | Linux | ⏳ à faire | → `10-messagerie` |
| Claws Mail | Client mail | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| Mutt | Client mail terminal | Linux, macOS | ⏳ à faire | → `10-messagerie` |
| NeoMutt | Client mail terminal | Linux, macOS | ⏳ à faire | → `10-messagerie` |
| aerc | Client mail terminal | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| getmail6 | Récupération mail | Linux, macOS | ⏳ à faire | → `10-messagerie` |
| Fetchmail | Récupération mail | Windows, Linux, macOS | ⏳ à faire | → `10-messagerie` |
| OfflineIMAP | Synchronisation mail | Linux, macOS | ⏳ à faire | → `10-messagerie` |

## 19. DATA, BIG DATA, MESSAGE BROKERS ET STREAMING — 5/55

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| Apache Kafka | Streaming événements | Windows, Linux, macOS | ✅ existant | `12-recherche-messages/04-kafka` |
| Redpanda (community source) | Streaming Kafka-compatible | Linux | ⏳ à faire | → `27-data-analytique` |
| Apache Pulsar | Messaging et streaming | Windows, Linux, macOS | ⏳ à faire | → `27-data-analytique` |
| RabbitMQ | Message broker | Windows, Linux, macOS | ✅ existant | `12-recherche-messages/03-rabbitmq` |
| ActiveMQ Classic | Message broker | Windows, Linux, macOS | ⏳ à faire | → `12-recherche-messages` |
| ActiveMQ Artemis | Message broker | Windows, Linux, macOS | ⏳ à faire | → `12-recherche-messages` |
| Apache RocketMQ | Message broker | Windows, Linux, macOS | ⏳ à faire | → `12-recherche-messages` |
| NATS | Message broker | Windows, Linux, macOS | ⏳ à faire | → `12-recherche-messages` |
| Mosquitto | Broker MQTT | Windows, Linux, macOS | ✅ existant | `12-recherche-messages/05-mosquitto` |
| EMQX (community) | Broker MQTT | Windows, Linux, macOS | ✅ existant | `12-recherche-messages/06-emqx` |
| VerneMQ | Broker MQTT | Linux | ⏳ à faire | → `12-recherche-messages` |
| NanoMQ | Broker MQTT | Windows, Linux, macOS | ⏳ à faire | → `12-recherche-messages` |
| HiveMQ CE | Broker MQTT | Windows, Linux, macOS | ⏳ à faire | → `12-recherche-messages` |
| ZeroMQ | Messaging bibliothèque | Windows, Linux, macOS | ⏳ à faire | → `27-data-analytique` |
| NSQ | Message broker | Windows, Linux, macOS | ⏳ à faire | → `12-recherche-messages` |
| Beanstalkd | Queue de tâches | Linux, macOS | ⏳ à faire | → `12-recherche-messages` |
| Gearman | Queue de tâches | Windows, Linux, macOS | ⏳ à faire | → `12-recherche-messages` |
| Celery | Queue de tâches Python | Windows, Linux, macOS | ⏳ à faire | → `12-recherche-messages` |
| Dramatiq | Queue de tâches Python | Windows, Linux, macOS | ⏳ à faire | → `12-recherche-messages` |
| RQ | Queue de tâches Python | Windows, Linux, macOS | ⏳ à faire | → `12-recherche-messages` |
| BullMQ | Queue de tâches Node.js | Windows, Linux, macOS | ⏳ à faire | → `12-recherche-messages` |
| pg-boss | Queue PostgreSQL | Windows, Linux, macOS | ⏳ à faire | → `12-recherche-messages` |
| Graphile Worker | Queue PostgreSQL | Windows, Linux, macOS | ⏳ à faire | → `12-recherche-messages` |
| Apache Flink | Traitement streaming | Windows, Linux, macOS | ⏳ à faire | → `27-data-analytique` |
| Apache Spark | Traitement distribué | Windows, Linux, macOS | ⏳ à faire | → `27-data-analytique` |
| Apache Beam | Traitement data | Windows, Linux, macOS | ⏳ à faire | → `27-data-analytique` |
| Apache Samza | Traitement streaming | Linux | ⏳ à faire | → `27-data-analytique` |
| Apache Storm | Traitement streaming | Linux | ⏳ à faire | → `27-data-analytique` |
| Apache NiFi | Flux de données | Windows, Linux, macOS | ⏳ à faire | → `27-data-analytique` |
| Apache SeaTunnel | Intégration données | Windows, Linux, macOS | ⏳ à faire | → `27-data-analytique` |
| Airbyte (community) | ELT | Windows, Linux, macOS | ⏳ à faire | → `27-data-analytique` |
| Meltano | ELT | Windows, Linux, macOS | ⏳ à faire | → `27-data-analytique` |
| Singer taps | Connecteurs ELT | Windows, Linux, macOS | ⏳ à faire | → `27-data-analytique` |
| Debezium | CDC | Windows, Linux, macOS | ⏳ à faire | → `27-data-analytique` |
| Kafka Connect | Connecteurs streaming | Windows, Linux, macOS | ⏳ à faire | → `27-data-analytique` |
| Benthos / Redpanda Connect | Pipeline données | Windows, Linux, macOS | ⏳ à faire | → `27-data-analytique` |
| Flink CDC | CDC streaming | Linux | ⏳ à faire | → `27-data-analytique` |
| Apache Hudi | Lakehouse | Linux | ⏳ à faire | → `27-data-analytique` |
| Apache Iceberg | Format table lakehouse | Windows, Linux, macOS | ⏳ à faire | → `27-data-analytique` |
| Delta Lake | Lakehouse | Windows, Linux, macOS | ⏳ à faire | → `27-data-analytique` |
| Project Nessie | Catalogue lakehouse | Windows, Linux, macOS | ⏳ à faire | → `27-data-analytique` |
| Apache Atlas | Gouvernance données | Linux | ⏳ à faire | → `27-data-analytique` |
| OpenMetadata | Catalogue et gouvernance | Linux, Windows via conteneur | ⏳ à faire | → `27-data-analytique` |
| DataHub | Catalogue données | Linux | ⏳ à faire | → `27-data-analytique` |
| Amundsen | Catalogue données | Linux | ⏳ à faire | → `27-data-analytique` |
| dbt Core | Transformation SQL | Windows, Linux, macOS | ⏳ à faire | → `27-data-analytique` |
| SQLMesh | Transformation SQL | Windows, Linux, macOS | ⏳ à faire | → `27-data-analytique` |
| Polars | DataFrame | Windows, Linux, macOS | ⏳ à faire | → `27-data-analytique` |
| Apache Arrow | Format et moteur colonne | Windows, Linux, macOS | ⏳ à faire | → `27-data-analytique` |
| JupyterHub | Plateforme notebooks | Windows, Linux, macOS | ⏳ à faire | → `27-data-analytique` |
| JupyterLab | Notebooks | Windows, Linux, macOS | ✅ existant | `21-outils/05-ia-productivite/05-jupyterlab` |
| MLflow | Cycle de vie ML | Windows, Linux, macOS | ⏳ à faire | → `27-data-analytique` |
| DVC | Versionnement données | Windows, Linux, macOS | ⏳ à faire | → `27-data-analytique` |
| LakeFS | Versionnement data lake | Windows, Linux, macOS | ⏳ à faire | → `27-data-analytique` |
| Pachyderm | Pipelines données | Linux | ⏳ à faire | → `27-data-analytique` |

## 20. IA, MACHINE LEARNING ET INFERENCE AUTO-HEBERGEE — 2/57

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| Ollama | Exécution LLM locale | Windows, Linux, macOS | ✅ existant | `21-outils/05-ia-productivite/04-ollama-open-webui` |
| llama.cpp | Inference LLM | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| LocalAI | API IA locale | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| vLLM | Serveur inference LLM | Linux | ⏳ à faire | → `28-ia-machine-learning` |
| Text Generation Inference | Serveur inference LLM | Linux | ⏳ à faire | → `28-ia-machine-learning` |
| Hugging Face Transformers | Bibliothèque ML | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| Hugging Face TGI | Inference LLM | Linux | ⏳ à faire | → `28-ia-machine-learning` |
| Open WebUI | Interface LLM auto-hébergée | Windows, Linux, macOS | ✅ existant | `21-outils/05-ia-productivite/04-ollama-open-webui` |
| LibreChat | Interface chat IA | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| AnythingLLM | Espace de travail LLM | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| Dify | Plateforme applications IA | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| Flowise | Constructeur flux LLM | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| Langflow | Constructeur flux IA | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| LangChain | Framework LLM | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| LlamaIndex | Framework RAG | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| Haystack | Framework recherche/RAG | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| RAGFlow | Moteur RAG | Linux | ⏳ à faire | → `28-ia-machine-learning` |
| Quivr | Base de connaissance IA | Linux, Windows via conteneur | ⏳ à faire | → `28-ia-machine-learning` |
| Khoj | Assistant personnel IA | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| PrivateGPT | RAG local | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| GPT4All | LLM local | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| Jan | LLM local | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| KoboldCpp | Inference LLM | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| text-generation-webui | Interface inference LLM | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| SillyTavern | Interface chat LLM | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| ComfyUI | Génération image par nœuds | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| AUTOMATIC1111 Stable Diffusion WebUI | Génération image | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| InvokeAI | Génération image | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| Fooocus | Génération image | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| OpenCV | Vision par ordinateur | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| PyTorch | Framework ML | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| TensorFlow | Framework ML | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| JAX | Framework ML | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| scikit-learn | Machine learning | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| XGBoost | Machine learning | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| LightGBM | Machine learning | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| CatBoost | Machine learning | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| ONNX Runtime | Inference ML | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| OpenVINO | Inference accélérée | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| BentoML | Déploiement modèles | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| KServe | Serving modèles Kubernetes | Linux | ⏳ à faire | → `28-ia-machine-learning` |
| Seldon Core | Serving modèles | Linux | ⏳ à faire | → `28-ia-machine-learning` |
| Ray | Calcul distribué/IA | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| Kubeflow | Plateforme ML Kubernetes | Linux | ⏳ à faire | → `28-ia-machine-learning` |
| ClearML | MLOps | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| Aim | Suivi expériences ML | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| Label Studio | Annotation données | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| CVAT | Annotation vision | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| FiftyOne | Gestion datasets vision | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| Whisper.cpp | Transcription locale | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| faster-whisper | Transcription audio | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| Whisper | Reconnaissance vocale | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| Piper | Synthèse vocale | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| Coqui TTS | Synthèse vocale | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| Kokoro TTS (open weights) | Synthèse vocale (licence modèle à vérifier) | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| RVC Project | Conversion voix | Windows, Linux, macOS | ⏳ à faire | → `28-ia-machine-learning` |
| Mimic 3 | Synthèse vocale | Linux | ⏳ à faire | → `28-ia-machine-learning` |

## 21. DOCUMENTATION, RECHERCHE, GED ET CONNAISSANCE — 2/48

| Service | Rôle | Plateformes | État | Fiche / cible |
| --- | --- | --- | --- | --- |
| Paperless-ngx | GED et archivage | Windows, Linux, macOS | ⏳ à faire | → `29-documentation-ged` |
| Mayan EDMS | GED | Linux | ⏳ à faire | → `29-documentation-ged` |
| Teedy | GED | Windows, Linux, macOS | ⏳ à faire | → `29-documentation-ged` |
| OpenKM Community | GED | Windows, Linux | ⏳ à faire | → `29-documentation-ged` |
| LogicalDOC Community | GED | Windows, Linux | ⏳ à faire | → `29-documentation-ged` |
| SeedDMS | GED | Windows, Linux, macOS | ⏳ à faire | → `29-documentation-ged` |
| Docspell | GED | Windows, Linux, macOS | ⏳ à faire | → `29-documentation-ged` |
| Documenso | Signature électronique | Windows, Linux, macOS | ⏳ à faire | → `29-documentation-ged` |
| OpenSign | Signature électronique | Linux | ⏳ à faire | → `29-documentation-ged` |
| LibreSign | Signature électronique Nextcloud | Linux | ⏳ à faire | → `29-documentation-ged` |
| Stirling-PDF | Outils PDF web | Windows, Linux, macOS | ⏳ à faire | → `29-documentation-ged` |
| Gotenberg | Conversion documents API | Windows, Linux, macOS | ⏳ à faire | → `29-documentation-ged` |
| ONLYOFFICE Docs Community | Suite bureautique serveur | Windows, Linux | ⏳ à faire | → `29-documentation-ged` |
| Collabora Online Development Edition | Suite bureautique web | Linux | ⏳ à faire | → `29-documentation-ged` |
| LibreOffice | Suite bureautique | Windows, Linux, macOS | ⏳ à faire | → `29-documentation-ged` |
| Apache OpenOffice | Suite bureautique | Windows, Linux, macOS | ⏳ à faire | → `29-documentation-ged` |
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

## 22. RESEAU, ACCES DISTANT, TRANSFERT ET OUTILS DIAGNOSTIC — 3/50

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
| FRR | Routage dynamique | Linux, BSD | ⏳ à faire | → `21-outils` |
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

