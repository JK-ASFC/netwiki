---
title: AdGuard Home
description: AdGuard Home — serveur DNS filtrant libre (GPL) en Go, installation (script Linux, Windows, macOS, FreeBSD, Docker, Raspberry Pi), assistant initial, listes de blocage et règles personnalisées (syntaxe AdGuard), réécritures DNS, réglages par client et services bloqués, résolveurs amont chiffrés (DoH, DoT, DoQ) et transfert conditionnel, chiffrement côté clients, contrôle parental, DHCP, statistiques et journaux, configuration YAML, sauvegarde et haute disponibilité.
tags: [adguard home, dns filtrant, blocage publicitaire, doh, dot, rewrites]
icon: shield-check
---

**AdGuard Home** (GPL) est un serveur **DNS filtrant** : il bloque publicités, traqueurs et domaines malveillants pour tout le réseau, avec une interface web complète, des règles par client, le **DNS chiffré** en entrée et en sortie, et un serveur DHCP optionnel. Un seul binaire, multiplateforme.

## Installation

```bash
curl -s -S -L https://raw.githubusercontent.com/AdguardTeam/AdGuardHome/master/scripts/install.sh | sh -s -- -v
docker run -d --name adguardhome --restart unless-stopped -v /opt/adguard/work:/opt/adguardhome/work -v /opt/adguard/conf:/opt/adguardhome/conf \
  -p 53:53/tcp -p 53:53/udp -p 3000:3000/tcp -p 80:80/tcp -p 853:853/tcp adguard/adguardhome
```

Windows/macOS/FreeBSD : archive des Releases, puis `AdGuardHome.exe -s install` (service). Assistant initial sur `http://<ip>:3000` : interfaces d'écoute (web, DNS), compte administrateur. Libérez le port 53 sur Ubuntu (`DNSStubListener=no` de systemd-resolved).

## Configuration essentielle

| Réglage | Où | Recommandation |
| --- | --- | --- |
| **DNS amont** | *Paramètres → Paramètres DNS* | Résolveurs internes ou chiffrés (`https://dns.quad9.net/dns-query`, `tls://dns.adguard-dns.com`), mode *requêtes parallèles* ou *le plus rapide* |
| **Transfert conditionnel** | Même page, syntaxe `[/corp.exemple.fr/]10.0.10.11 10.0.10.12` | Domaine Active Directory vers les DC |
| **Résolveurs privés** (PTR) | *Serveurs DNS privés inverses* | DC ou routeur pour les adresses internes |
| **Listes de blocage** | *Filtres → Listes de blocage DNS* | Liste AdGuard DNS, listes de logiciels malveillants (avec parcimonie : faux positifs) |
| **Règles personnalisées** | *Filtres → Règles de filtrage personnalisées* | `\|\|domaine.example^` (bloquer), `@@\|\|site-metier.example^` (autoriser) |
| **Réécritures DNS** | *Filtres → Réécritures DNS* | `wiki.corp.exemple.fr → 10.0.20.30` (DNS local simple) |
| **Clients** | *Paramètres → Paramètres client* | Règles, listes et services bloqués par poste ou sous-réseau |
| **Chiffrement** | *Paramètres → Chiffrement* | Certificat pour DoH/DoT/DoQ servis aux clients |

Configuration stockée dans `AdGuardHome.yaml` (sauvegardez ce fichier et le dossier `work/`).

## Haute disponibilité

Deux instances (DHCP ou postes configurés avec les deux adresses) ; synchronisation de configuration avec l'outil communautaire *adguardhome-sync*.

## Nouveautés de la version 1.0.0

> [!WARNING]
> Depuis la 1.0.0, les versions mineures peuvent contenir des changements incompatibles. Le schéma de `AdGuardHome.yaml` reste celui de la 0.107.x.

- **Options de ligne de commande supprimées** : `--no-mem-optimization`, `--no-etc-hosts`, `--port`/`-p` ; `--host`/`-h` n'affiche plus que l'aide avec `--help`. Retirez-les des unités systemd, scripts et fichiers `compose.yaml`.
- **API HTTP** : les points d'accès dépréciés (`/control/querylog_info`, `/control/querylog_config`, `/control/stats_info`, `/control/stats_config`, `/control/blocked_services/set`, `/control/safesearch/enable`, `/control/safesearch/disable`, etc.) sont supprimés. Adaptez vos scripts d'automatisation.
- **DNS amont par défaut** : les nouvelles installations utilisent Cloudflare au lieu de Quad9 ; une configuration existante n'est pas modifiée. Quad9 cessant de servir la France le 24 novembre, remplacez-le dans les amonts, le *bootstrap* et le *fallback* si vous êtes concernés.
- **Réglages par client** : « Utiliser les paramètres globaux » ne concerne plus que la protection ; les services bloqués ont leur propre interrupteur.
- **Sécurité** : mise à jour de Go (correctifs de la 1.27.4) ; les CVE ne sont pas détaillées dans les notes.

Source : notes de version <https://github.com/AdguardTeam/AdGuardHome/releases/tag/v1.0.0>.

Interface : [[04-interface-graphique|interfaces web]] · commandes : [[90-aide-memoire|aide-mémoire]].
