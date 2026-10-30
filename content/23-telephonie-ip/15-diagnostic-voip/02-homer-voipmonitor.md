---
title: Supervision VoIP — HOMER et VoIPmonitor
description: Superviser en continu la signalisation et la qualité de la téléphonie IP — HOMER (capture HEP, agents heplify, intégration Asterisk, FreeSWITCH, Kamailio, OpenSIPS, interface de recherche et d'échelle d'appels, déploiement Docker), VoIPmonitor (sonde passive, MOS par appel, enregistrement, alertes), métriques Prometheus/Grafana, statistiques RTCP des IPBX et alertes utiles.
tags: [voip, supervision, homer, hep, voipmonitor, mos, grafana]
icon: activity
---

Les captures ponctuelles ([[01-sngrep-wireshark-sipp|sngrep, Wireshark]]) ne suffisent pas pour répondre à « l'appel de M. X hier à 15 h était mauvais » : il faut **enregistrer en continu** la signalisation et les indicateurs de qualité.

## HOMER

**HOMER** (sipcapture, libre) collecte les messages SIP (et statistiques RTCP, journaux) envoyés par des **agents** au format **HEP** (*Homer Encapsulation Protocol*), les indexe et propose une interface de recherche avec échelle d'appel.

| Composant | Rôle |
| --- | --- |
| **heplify** / captagent | Agent de capture sur un serveur (copie des paquets SIP/RTCP vers HOMER) |
| Envoi HEP natif | Asterisk (`res_hep`), FreeSWITCH (`capture-server`), Kamailio (`siptrace`), OpenSIPS (`proto_hep`), AudioCodes, rtpengine |
| **heplify-server** | Réception HEP, stockage (PostgreSQL) et métriques (Prometheus) |
| **homer-app** | Interface web : recherche par numéro, Call-ID, période ; échelles ; export pcap |

Déploiement rapide avec Docker (dépôt `sipcapture/homer7-docker`) :

```bash
git clone https://github.com/sipcapture/homer7-docker.git
cd homer7-docker/heplify-server/hom7-prom-all
docker compose up -d
# interface : http://<serveur>:9080 (changer immédiatement le compte par défaut)
```

Agent sur un IPBX Linux :

```bash
# envoie le SIP capturé sur l'interface vers HOMER (UDP 9060)
sudo ./heplify -i any -hs 10.0.98.40:9060 -m SIPRTCP -dim REGISTER
```

Asterisk en natif :

```ini
; /etc/asterisk/hep.conf
[general]
enabled = yes
capture_address = 10.0.98.40:9060
capture_password = SecretHep2026
capture_id = 1101
uuid_type = call-id
```

## VoIPmonitor

**VoIPmonitor** est une sonde **passive** (sur un port miroir ou sur l'IPBX) qui analyse chaque appel : MOS estimé, pertes, gigue, délai, enregistrement optionnel de l'audio, et interface web de recherche et de rapports (version commerciale ; le capteur est libre).

| Indicateur | Usage |
| --- | --- |
| **MOS par appel et par sens** | Identifier les appels dégradés et le tronçon responsable |
| Pertes et gigue par intervalle | Corréler avec la saturation d'un lien |
| Statistiques par trunk, par site, par poste | Repérer un site ou un modèle problématique |
| Alertes | Seuils (MOS < 3,5, ASR en baisse, pic d'appels internationaux) |

## Indicateurs à suivre

| Indicateur | Définition | Alerte typique |
| --- | --- | --- |
| **ASR** (*Answer-Seizure Ratio*) | Appels répondus / tentés | Chute brutale = problème de trunk |
| **ACD** (*Average Call Duration*) | Durée moyenne | Durées très courtes = coupures |
| MOS moyen / centile 5 | Qualité perçue | < 3,6 |
| Appels simultanés | Charge des trunks | > 80 % des canaux |
| Échecs d'enregistrement | Postes ou attaques | Pic soudain (force brute) |
| Appels internationaux hors horaires | Fraude | Toute occurrence |

## Métriques et tableaux de bord

- **heplify-server** expose des métriques Prometheus ; tableaux Grafana fournis par le projet HOMER.
- Asterisk : `res_prometheus` (appels, endpoints, canaux) ; FreeSWITCH : `mod_prometheus` ou exportateurs ESL ; Kamailio : `xhttp_prom`.
- Les CDR (base SQL) alimentent les rapports d'ASR/ACD et de coûts.

Voir aussi la supervision générale : [[04-zabbix/01-presentation-installation|Zabbix]] et [[02-prometheus/01-presentation-installation|Prometheus]].
