---
title: Présentation, installation et VPN d'accès distant
description: Rôle Accès à distance de Windows Server (RRAS) — fonctions (VPN, routage, NAT, DirectAccess déprécié, proxy d'application web), protocoles VPN (IKEv2, SSTP, L2TP/IPsec et PPTP en voie de dépréciation), installation, attribution des adresses, authentification RADIUS/NPS, Always On VPN (profils, tunnels de périphérique et utilisateur, certificats), pare-feu et ports.
tags: [rras, vpn, windows server, ikev2, sstp, always on vpn, nps, accès distant]
icon: info
---

Le rôle **Accès à distance** (*RemoteAccess*) regroupe :

| Service | Statut |
| --- | --- |
| **Routage et accès distant** (RRAS) : VPN, routage, NAT | Disponible ; base d'**Always On VPN** |
| DirectAccess | **Déprécié** — migrer vers Always On VPN ou une solution ZTNA |
| Proxy d'application web (WAP) | Publication d'applications (AD FS) |

RRAS est un choix économique pour un VPN d'accès distant intégré à AD et à NPS, en particulier avec **Always On VPN**. Pour un VPN multiplateforme ou à forte charge, comparez avec [[04-strongswan/04-acces-distant-ikev2|strongSwan]], [[03-wireguard/01-presentation-installation|WireGuard]] ou les pare-feu du marché.

## Protocoles

| Protocole | Ports | Remarques |
| --- | --- | --- |
| **IKEv2** | 500/UDP, 4500/UDP | Recommandé : rapide, reprise de session (MOBIKE), certificats ou EAP |
| **SSTP** | 443/TCP | Traverse tous les pare-feu (TLS) ; repli quand IKEv2 est bloqué |
| L2TP/IPsec | 500, 4500, 1701 (dans IPsec) | Ancien ; **dépréciation annoncée** |
| PPTP | 1723/TCP + GRE | **Non sûr**, dépréciation annoncée : à désactiver |

## Installation

```powershell
Install-WindowsFeature RemoteAccess, Routing, DirectAccess-VPN -IncludeManagementTools
Install-RemoteAccess -VpnType Vpn
# Console : rrasmgmt.msc (Routage et accès distant)
```

Architecture conseillée : serveur RRAS avec **deux interfaces** (externe en DMZ derrière le pare-feu, interne vers le LAN), pare-feu en amont qui ne transmet que 443/TCP et 500/4500 UDP.

### Adresses des clients

*Propriétés du serveur → IPv4* : pool statique dédié (ex. `10.0.200.10–10.0.200.250`) routé vers le serveur RRAS par le cœur de réseau, ou DHCP via l'interface interne. Le pool statique simplifie le routage et le filtrage.

### Authentification

*Propriétés → Sécurité* : fournisseur d'authentification **RADIUS** (serveurs [[02-nps/01-presentation-installation|NPS]]) ou Windows (NPS local) ; méthodes **EAP** (certificats) et, pour SSTP, le certificat TLS du serveur :

```powershell
# Certificat SSTP (nom public vpn.exemple.fr, délivré par une AC publique ou interne approuvée par les clients)
$cert = Get-ChildItem Cert:\LocalMachine\My | Where-Object Subject -like "*vpn.exemple.fr*"
Set-RemoteAccess -SslCertificate $cert
Restart-Service RemoteAccess
```

## Always On VPN

**Always On VPN** (AOVPN) utilise le client VPN natif de Windows 10/11 piloté par un **profil** (XML, déployé par Intune, ConfigMgr ou script PowerShell) :

| Tunnel | Authentification | Usage |
| --- | --- | --- |
| **Tunnel de périphérique** | Certificat **ordinateur**, IKEv2 uniquement | Avant l'ouverture de session : contrôleurs de domaine, GPO, réinitialisation de mot de passe |
| **Tunnel utilisateur** | Certificat utilisateur (EAP-TLS / PEAP-TLS) | Accès aux ressources de l'utilisateur |

```xml Profil AOVPN (extrait)
<VPNProfile>
  <AlwaysOn>true</AlwaysOn>
  <DnsSuffix>corp.exemple.fr</DnsSuffix>
  <TrustedNetworkDetection>corp.exemple.fr</TrustedNetworkDetection>
  <NativeProfile>
    <Servers>vpn.exemple.fr</Servers>
    <NativeProtocolType>IKEv2</NativeProtocolType>
    <Authentication>
      <UserMethod>Eap</UserMethod>
    </Authentication>
    <RoutingPolicyType>SplitTunnel</RoutingPolicyType>
  </NativeProfile>
  <Route>
    <Address>10.0.0.0</Address>
    <PrefixSize>8</PrefixSize>
  </Route>
  <DomainNameInformation>
    <DomainName>.corp.exemple.fr</DomainName>
    <DnsServers>10.0.10.53,10.0.10.54</DnsServers>
  </DomainNameInformation>
</VPNProfile>
```

Points d'attention : **détection de réseau approuvé** (pas de tunnel au bureau), tunnel fractionné (*split tunnel*) avec les routes internes, règles de résolution DNS (NRPT), certificats délivrés par AD CS ([[01-active-directory/10-adcs-pki|PKI]]), et chiffrement IKEv2 renforcé côté serveur (par défaut, RRAS accepte des algorithmes faibles) :

```powershell
Set-VpnServerConfiguration -CustomPolicy -EncryptionMethod AES256 -IntegrityCheckMethod SHA256 `
  -CipherTransformConstants GCMAES256 -AuthenticationTransformConstants GCMAES256 -DHGroup Group14 -PfsGroup PFS2048 -SALifeTimeSeconds 28800
```

Les mêmes paramètres doivent figurer dans le profil client (`CryptographySuite`).

Suite : [[02-routage-nat-exploitation|routage, NAT, sécurité et dépannage]].
