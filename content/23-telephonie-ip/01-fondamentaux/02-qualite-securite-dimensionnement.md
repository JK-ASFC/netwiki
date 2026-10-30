---
title: Qualité de service, sécurité et dimensionnement VoIP
description: Concevoir une téléphonie IP fiable et sûre — seuils de qualité (délai, gigue, pertes, MOS), QoS (DSCP, files prioritaires, VLAN voix), dimensionnement des lignes (Erlang B) et de la bande passante, menaces (balayages SIP, force brute, fraude téléphonique, écoute, déni de service) et contre-mesures (mots de passe, ACL, pare-feu, fail2ban, TLS/SRTP, SBC, restrictions d'appels), supervision des CDR et obligations (urgences, conservation).
tags: [voip, qos, dscp, erlang, sécurité, fraude, fail2ban, srtp]
icon: shield-check
---

## Seuils de qualité

| Indicateur | Objectif | Au-delà |
| --- | --- | --- |
| Délai de bout en bout (un sens) | **< 150 ms** (UIT-T G.114) | Conversation hachée, interruptions mutuelles |
| Gigue | **< 30 ms** | Tampons de gigue saturés, voix robotique |
| Pertes de paquets | **< 1 %** | Coupures de syllabes (Opus tolère mieux) |
| MOS (*Mean Opinion Score*) | **≥ 4** (G.711 ≈ 4,4 au mieux) | < 3,6 : qualité jugée médiocre |

Le **MOS** se calcule à partir du facteur R (modèle E) ; les IPBX, postes et outils de supervision (statistiques RTCP) le remontent par appel.

## QoS

| Trafic | DSCP | 802.1p (CoS) | File |
| --- | --- | --- | --- |
| Voix (RTP) | **46 – EF** | 5 (6 chez certains constructeurs) | Prioritaire stricte (LLQ), limitée en débit |
| Signalisation (SIP, SCCP) | 24 – CS3 (ou 26 – AF31) | 3 | Garantie |
| Vidéo interactive | 34 – AF41 | 4 | Garantie |
| Données | 0 – BE | 0 | Défaut |

- Séparez la voix dans un **VLAN voix** (découverte par LLDP-MED ou CDP, voir [[27-mitel/01-reseau-telephonie-ip|réseau pour la téléphonie IP]]).
- Faites confiance au marquage DSCP des postes sur les ports d'accès, appliquez les files sur **tous** les goulets (uplinks, WAN, VPN) ; sur Internet, la QoS n'est pas garantie.
- Exemple de politique sur un routeur Cisco : [[03-cisco-routeurs/03-qos-haute-dispo-depannage|QoS Cisco]].

## Dimensionnement

### Nombre de canaux (Erlang B)

Le trafic en **erlangs** = nombre d'appels à l'heure chargée × durée moyenne (en heures). Exemple : 120 appels de 3 minutes à l'heure chargée = 120 × 3 / 60 = **6 erlangs**. La table d'Erlang B donne le nombre de canaux (lignes simultanées d'un trunk SIP) pour un taux de blocage visé :

| Trafic | Blocage 1 % | Blocage 0,5 % |
| --- | --- | --- |
| 2 erlangs | 7 canaux | 7 canaux |
| 6 erlangs | 13 canaux | 14 canaux |
| 10 erlangs | 18 canaux | 19 canaux |
| 20 erlangs | 30 canaux | 32 canaux |

Règle empirique en entreprise : 1 canal pour 4 à 8 utilisateurs, à ajuster selon le métier (centre d'appels : 1 pour 1).

### Bande passante

Bande passante = nombre d'appels simultanés × débit par appel (≈ 87 kbit/s par sens en G.711, ≈ 31 kbit/s en G.729, voir [[01-sip-sdp-rtp-codecs|codecs]]) + signalisation + marge (≈ 20 %). Exemple : 13 canaux G.711 ≈ 1,2 Mbit/s symétriques réservés à la voix.

### Serveur

Un IPBX logiciel (Asterisk, 3CX, FreeSWITCH) traite des centaines d'appels simultanés sur une machine modeste tant qu'il n'y a **pas de transcodage** (conversion de codec) ni d'enregistrement massif : alignez les codecs entre postes et trunks.

## Menaces

| Menace | Description |
| --- | --- |
| **Balayages SIP** | Robots (SIPVicious « friendly-scanner », etc.) qui sondent en permanence le port 5060 d'Internet |
| **Force brute** | Essais de mots de passe sur les comptes des postes (`REGISTER`) |
| **Fraude téléphonique** (*toll fraud*) | Compte compromis utilisé pour appeler des numéros surtaxés internationaux : des milliers d'euros en un week-end |
| Écoute | Capture du RTP non chiffré sur le réseau |
| Déni de service | Inondation SIP, épuisement des canaux |
| Usurpation (*spoofing*) | Numéro présenté falsifié (vishing) |
| Vulnérabilités | Interfaces d'administration d'IPBX exposées et non mises à jour |

## Contre-mesures

- [ ] **Mots de passe SIP longs et aléatoires** (≥ 16 caractères), différents de l'extension ; identifiants d'authentification différents du numéro si possible
- [ ] **Ne pas exposer le port SIP à tout Internet** : trunk opérateur autorisé par IP, télétravailleurs via VPN ou **SBC** ; à défaut, port non standard (ne protège que du bruit) et filtrage géographique
- [ ] **ACL** sur l'IPBX (réseaux autorisés par compte), refus des appels anonymes
- [ ] **fail2ban** (ou l'équivalent intégré : 3CX, FreePBX Responsive Firewall) sur les échecs d'authentification
- [ ] **Restrictions d'appels** : international, surtaxés et satellite interdits par défaut, autorisés par groupe ; plafond d'appels simultanés par poste et par trunk ; plafond de crédit chez l'opérateur
- [ ] **TLS + SRTP** pour la signalisation et le média, surtout hors du LAN
- [ ] Interfaces d'administration (FreePBX, 3CX, CUCM…) **jamais exposées** ; mises à jour suivies
- [ ] Surveillance des **CDR** : alertes sur les appels internationaux, la nuit, les pics de volume

Exemple de filtrage nftables sur un IPBX Linux (opérateur et LAN seulement) :

```nft
table inet filter {
  set sip_autorises {
    type ipv4_addr; flags interval;
    elements = { 10.0.0.0/8, 203.0.113.10/32 }
  }
  chain input {
    type filter hook input priority 0; policy drop;
    ct state established,related accept
    iif lo accept
    ip saddr 10.0.99.0/24 tcp dport { 22, 443 } accept
    ip saddr @sip_autorises udp dport 5060 accept
    ip saddr @sip_autorises tcp dport 5061 accept
    udp dport 10000-20000 accept
  }
}
```

Exemple de prison fail2ban pour Asterisk (journal `security` activé dans `logger.conf`) :

```ini
# /etc/fail2ban/jail.d/asterisk.local
[asterisk]
enabled  = true
filter   = asterisk
port     = 5060,5061
protocol = all
logpath  = /var/log/asterisk/security
maxretry = 5
findtime = 600
bantime  = 86400
```

## Exploitation et obligations

| Sujet | Bonne pratique |
| --- | --- |
| Urgences | Routes vers 112/15/17/18/114 testées, numéro présenté correct, localisation (adresse déclarée à l'opérateur pour chaque site) |
| CDR | Conservation limitée et justifiée (données personnelles, RGPD) ; accès restreint |
| Enregistrement des appels | Information préalable des interlocuteurs, finalité et durée définies |
| Sauvegardes | Configuration, messages vocaux, prompts, licences |
| Plan de reprise | Trunk de secours, renvoi automatique vers mobiles si l'IPBX ou le lien tombe |
| Électricité | Onduleur pour l'IPBX, les commutateurs PoE et les routeurs |

Outils de diagnostic : [[15-diagnostic-voip/01-sngrep-wireshark-sipp|sngrep, Wireshark, SIPp]].
