---
title: Diagnostic VoIP — sngrep, tcpdump, Wireshark, SIPp, sipsak
description: Outils et méthode pour diagnostiquer la téléphonie IP — capturer (tcpdump, ports miroirs, captures intégrées des IPBX et SBC), lire la signalisation en direct (sngrep), analyser appels et qualité RTP dans Wireshark (Appels VoIP, diagrammes de flux, analyse de flux RTP, lecture audio, filtres), tester (sipsak, SIPp en charge, PJSUA), auditer ses propres serveurs (SIPVicious), méthode pas à pas par symptôme.
tags: [voip, diagnostic, sngrep, wireshark, tcpdump, sipp, sipsak, rtp]
icon: activity
---

## Méthode

1. **Où capturer ?** Sur l'IPBX/SBC (les deux côtés de la session), sinon par un **port miroir** du commutateur.
2. **Signalisation** : l'appel s'établit-il ? Quel code d'erreur, envoyé par qui ?
3. **SDP** : adresses `c=` (privées ?), ports, codecs communs, chiffrement.
4. **Média** : des paquets RTP circulent-ils dans **les deux sens**, vers les bonnes adresses ? Quelles pertes et quelle gigue ?

## Capturer

```bash
# Toute la VoIP (SIP + plage RTP d'Asterisk) dans un fichier, rotation par 100 Mo
sudo tcpdump -i any -n -s 0 -C 100 -w /tmp/voip.pcap 'port 5060 or port 5061 or portrange 10000-20000'
# Uniquement un poste
sudo tcpdump -i any -n -s 0 -w /tmp/poste.pcap host 10.0.40.21
```

| Plateforme | Capture intégrée |
| --- | --- |
| Windows | Wireshark (Npcap) ou `pktmon start --capture --pkt-size 0 -f C:\temp\voip.etl` puis `pktmon etl2pcap` |
| macOS | Wireshark ou `sudo tcpdump -i en0 -w voip.pcap port 5060` |
| 3CX, FreePBX, AudioCodes, CUCM | Captures dans l'interface (voir chaque page) |

> [!NOTE]
> Avec **TLS**, la signalisation capturée est chiffrée : utilisez les traces de l'IPBX (`pjsip set logger on`, `sofia global siptrace on`) ou, en laboratoire, les clés de session. Avec **SRTP**, l'audio ne peut pas être réécouté, mais les statistiques (pertes, gigue) restent analysables.

## sngrep : la signalisation en direct

```bash
sudo apt install sngrep
sudo sngrep                              # toutes les interfaces, port SIP par défaut
sudo sngrep -d eth0 port 5060            # interface et filtre BPF
sudo sngrep -c                           # seulement les appels (INVITE)
sudo sngrep -I /tmp/voip.pcap            # relire une capture
sudo sngrep -O /tmp/sortie.pcap          # enregistrer en même temps
```

| Touche | Action |
| --- | --- |
| Entrée | Afficher l'**échelle** (*call flow*) de l'appel sélectionné |
| Espace | Sélectionner plusieurs dialogues (ex. les deux jambes d'un appel) |
| `F2` | Enregistrer en pcap |
| `F3` / `/` | Rechercher |
| `F7` | Filtrer (méthode, numéros, adresses) |
| `F8` | Réglages |

## Wireshark

| Menu / filtre | Usage |
| --- | --- |
| *Téléphonie → Appels VoIP* | Liste des appels, **Diagramme de flux**, **Lire les flux** (réécoute du RTP non chiffré) |
| *Téléphonie → RTP → Flux RTP* puis *Analyser* | Pertes, gigue max/moyenne, séquences erronées, delta |
| *Téléphonie → SIP → Flux* | Statistiques des méthodes et réponses |
| `sip` / `rtp` / `rtcp` / `rtpevent` | Signalisation, média, statistiques, DTMF |
| `sip.Method == "INVITE"` | Débuts d'appel |
| `sip.Status-Code >= 400` | Échecs |
| `sip.Call-ID == "abc123@10.0.40.21"` | Un dialogue précis |
| `sdp.connection_info contains "192.168."` | SDP annonçant une adresse privée (NAT) |
| *Analyser → Décoder comme… → RTP* | Forcer le décodage RTP sur des ports inhabituels (ou activer `rtp_udp` heuristique) |

Voir aussi [[02-reseau-diagnostic/02-wireshark-analyse|l'analyse avec Wireshark]].

## Tester

```bash
# sipsak : envoyer un OPTIONS (le serveur répond-il ?)
sipsak -vv -s sip:pbx.exemple.fr
# sipsak : tester l'enregistrement d'un compte
sipsak -U -C sip:1001@10.0.40.99 -s sip:1001@pbx.exemple.fr -a 'Xq7vR2pL9mZt4KwBn3Hs' -vv
```

```bash
# SIPp : générateur de charge — côté serveur de test (répond aux appels)
sipp -sn uas -p 5070
# côté client : 5 appels/s, 100 appels au total, 30 simultanés au plus, vers le numéro 1002
sipp -sn uac -s 1002 -r 5 -m 100 -l 30 10.0.30.11:5060
```

SIPp sert à **valider la capacité** d'un IPBX ou d'un SBC avant la mise en production (sur une plateforme de test, jamais sur un système d'autrui ni un trunk facturé). PJSUA (voir [[14-softphones/01-softphones|softphones]]) permet de scripter des appels réels.

### Audit de vos propres serveurs

**SIPVicious** (`svmap`, `svwar`, `svcrack`) reproduit les balayages des attaquants : utilisez-le **uniquement** sur vos systèmes, avec autorisation, pour vérifier que les comptes ne sont pas énumérables et que fail2ban/anti-piratage réagit.

```bash
svmap 10.0.30.0/24                 # découvrir les serveurs SIP de votre réseau
svwar -m INVITE -e1000-1099 10.0.30.11   # vérifier si les extensions sont énumérables
```

## Par symptôme

| Symptôme | Que regarder |
| --- | --- |
| Pas de sonnerie | Réponse à l'INVITE : `401/407` en boucle (identifiants), `403` (droits/ACL), `404` (plan de numérotation), `408` (destination injoignable) |
| Audio unidirectionnel | SDP `c=` privé, RTP envoyé vers la mauvaise adresse, pare-feu ; RTP présent dans un seul sens dans *Flux RTP* |
| Coupure au bout de ~30 s | `200 OK` retransmis sans `ACK` (le `Contact` est injoignable : NAT) |
| Voix hachée | Analyse RTP : pertes > 1 %, gigue > 30 ms → QoS, Wi-Fi, saturation |
| DTMF ignorés | Absence de `rtpevent` (RFC 4733) ou SIP INFO attendu |
| Appels qui échouent par moments | `503` du trunk (canaux saturés), DNS, bascule de serveur |

Supervision continue de la qualité : [[02-homer-voipmonitor|HOMER et VoIPmonitor]].
