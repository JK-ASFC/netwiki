---
title: WatchGuard Firebox — Fireware Web UI, Policy Manager et WatchGuard Cloud
description: Pare-feu WatchGuard Firebox (T-Series, M-Series, FireboxV/Cloud) sous Fireware — accès (Web UI sur le port 8080, comptes admin et status, console), outils de gestion (Fireware Web UI, WatchGuard System Manager avec Policy Manager et Firebox System Manager, WatchGuard Cloud, Dimension), types d'interfaces (Trusted, Optional, External), politiques filtre de paquets et proxy, services d'abonnement (Gateway AV, IPS, APT Blocker, WebBlocker, DNSWatch), NAT (dynamique, SNAT, 1-to-1), Multi-WAN et SD-WAN, VPN (BOVPN, Mobile VPN IKEv2 et SSL), FireCluster, CLI SSH et dépannage.
tags: [watchguard, firebox, fireware, policy manager, wsm, watchguard cloud, vpn, pare-feu]
icon: shield
---

**WatchGuard** vise les PME et sites distribués avec ses boîtiers **Firebox** sous **Fireware**. L'administration se fait au choix par l'interface web **Fireware Web UI**, par la suite Windows **WatchGuard System Manager** (WSM) — dont **Policy Manager** est l'éditeur de configuration historique — ou depuis **WatchGuard Cloud** (gestion ou simple visibilité dans le cloud).

## Accès

| Accès | Paramètres |
| --- | --- |
| Fireware Web UI | `https://10.0.1.1:8080` sur l'interface 1 (Trusted) en configuration usine ; assistant *Web Setup Wizard* |
| Comptes intégrés | `admin` (lecture/écriture) et `status` (lecture seule) : mots de passe à changer dès l'assistant |
| CLI | SSH sur le port **4118** ; console série (115200 bauds sur la plupart des modèles) |
| WSM | Connexion au Firebox depuis Windows (port 4105/4117 pour les outils de gestion) |

## Outils graphiques

| Outil | Rôle |
| --- | --- |
| **Fireware Web UI** | Configuration et supervision dans le navigateur |
| **Policy Manager** (WSM) | Édition hors ligne de la configuration, puis enregistrement sur le Firebox ; modèles |
| **Firebox System Manager** (WSM) | Supervision en temps réel : *Traffic Monitor*, état des VPN, utilisateurs authentifiés, listes de blocage |
| WatchGuard Server Center | Management Server (gestion centralisée, modèles, VPN gérés), Log Server, Report Server |
| **WatchGuard Dimension** | Machine virtuelle de journaux et tableaux de bord |
| **WatchGuard Cloud** | Gestion cloud, rapports, déploiement « zero-touch » (RapidDeploy) |

## Interfaces et politiques

| Notion | Explication |
| --- | --- |
| Types d'interfaces | **Trusted** (interne), **Optional** (DMZ, invités), **External** (WAN), Custom |
| Alias intégrés | `Any-Trusted`, `Any-Optional`, `Any-External`, `Firebox` |
| Politique **filtre de paquets** | Filtrage sur adresses, ports, protocoles |
| Politique **proxy** | Inspection applicative (HTTP-proxy, HTTPS-proxy avec inspection de contenu, SMTP-proxy, DNS-proxy, FTP-proxy) avec des *actions* proxy réutilisables |
| Ordre | Classement automatique par précision (*Auto-Order*) par défaut, ou ordre manuel |
| Services d'abonnement | Gateway AntiVirus, IPS, **APT Blocker** (bac à sable), WebBlocker, Application Control, Reputation Enabled Defense, **DNSWatch**, spamBlocker |

## NAT

| Type | Usage |
| --- | --- |
| NAT dynamique | Sortie Internet des réseaux privés (actif par défaut pour les plages RFC 1918) |
| **SNAT** (static NAT) | Publication : action SNAT utilisée comme destination dans la politique entrante |
| 1-to-1 NAT | Adresse publique dédiée à un serveur |

## Multi-WAN, SD-WAN, VPN, haute disponibilité

- **Multi-WAN** (bascule, répartition) et actions **SD-WAN** dans les politiques selon la mesure des liens (latence, gigue, pertes).
- **BOVPN** (*Branch Office VPN*) site à site, ou **BOVPN Virtual Interface** pour router (statique, OSPF, BGP) dans les tunnels.
- **Mobile VPN** : IKEv2 (clients natifs), SSL (client WatchGuard), IPsec ; authentification AD/RADIUS avec **AuthPoint** (MFA WatchGuard).
- **FireCluster** : deux Firebox identiques en actif/passif ou actif/actif, interfaces de cluster dédiées.

## CLI

La CLI SSH (port 4118) sert surtout au diagnostic, à la récupération et à l'automatisation simple :

```watchguard
WG#show sysinfo
WG#show interface
WG#show route
WG#show arp
WG#ping 10.0.20.15
WG#traceroute 8.8.8.8
WG#configure
WG(config)#show running-config
WG(config)#exit
WG#reboot
```

(Les sous-commandes disponibles varient selon la version de Fireware : `?` et le guide de référence CLI.) Pour le dépannage quotidien, l'outil principal reste *System Status → Traffic Monitor* (Web UI) ou **Firebox System Manager**, avec l'option de journaliser les politiques concernées, et *Diagnostic Tasks* (ping, traceroute, capture TCP dump, recherche DNS).

## Sauvegarde et mises à jour

*System → Backup and Restore Image* (image chiffrée), export de la configuration XML ; mises à jour de Fireware par la Web UI, Policy Manager ou WatchGuard Cloud (lire les notes de version, sauvegarder avant).

## Sécurisation et problèmes fréquents

- [ ] Ports d'administration (8080, 4117, 4118) accessibles seulement depuis le réseau d'administration (politique *WatchGuard Web UI* restreinte, pas d'`Any-External`)
- [ ] Mots de passe `admin`/`status` changés, comptes nominatifs (gestion par rôles), MFA AuthPoint
- [ ] Fireware à jour (antécédents : botnet Cyclops Blink visant les Firebox en 2022, faille critique du service IKEv2 en 2025)
- [ ] Journaux envoyés vers Dimension, WatchGuard Cloud ou un syslog

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Trafic refusé « Unhandled » | Aucune politique ne correspond | Traffic Monitor, créer la politique adaptée |
| Site web cassé avec HTTPS-proxy | Inspection de contenu sans AC déployée | Déployer le certificat, exceptions de domaines |
| Publication sans effet | SNAT absent de la destination de la politique | Utiliser l'action SNAT dans la politique entrante |
| Changements Policy Manager perdus | Configuration non enregistrée sur le Firebox | *File → Save → To Firebox* |
