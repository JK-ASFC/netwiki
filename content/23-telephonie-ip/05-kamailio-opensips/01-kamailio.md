---
title: Kamailio — proxy et registrar SIP
description: Kamailio, serveur SIP libre à très haute capacité — rôles (proxy, registrar, répartiteur devant des IPBX, passerelle WebRTC, routage opérateur), installation sous Debian/Ubuntu, base de données d'abonnés (kamdbctl, kamctl), structure de kamailio.cfg (directives #!define, modules, routes), répartition avec dispatcher, protection anti-flood (pike, htable), relais média avec rtpengine, TLS, commandes kamctl et kamcmd, supervision et dépannage.
tags: [kamailio, sip, proxy, registrar, dispatcher, rtpengine, webrtc]
icon: git-merge
---

**Kamailio** (ex-OpenSER, licence GPL) est un **serveur SIP** capable de traiter des milliers d'appels par seconde. Il ne gère **pas le média** et n'est pas un IPBX : il route la signalisation. On le place devant des IPBX ou des passerelles pour l'enregistrement des postes, la répartition de charge, la sécurité et la terminaison WebRTC ; il équipe de nombreux opérateurs.

| Rôle | Exemple |
| --- | --- |
| Registrar et proxy | Des milliers de postes s'enregistrent sur Kamailio, qui relaie vers les IPBX |
| Répartiteur | `dispatcher` distribue les appels entre plusieurs Asterisk/FreeSWITCH, avec sonde de disponibilité |
| Bordure (avec rtpengine) | Filtrage, anti-flood, NAT, chiffrement : rôle proche d'un SBC |
| WebRTC | SIP over WebSocket (`websocket`), DTLS-SRTP via rtpengine |
| Routage opérateur | Tables de préfixes (`carrierroute`, `drouting`), LCR |

## Installation

```bash
sudo apt install -y kamailio kamailio-mysql-modules kamailio-tls-modules kamailio-websocket-modules kamailio-extra-modules
kamailio -v
```

Le dépôt `deb.kamailio.org` propose les dernières versions stables. Kamailio est réservé à Linux/BSD (pas de version Windows ou macOS de production ; utiliser une VM ou Docker pour un laboratoire).

### Base des abonnés

```bash
sudo sed -i 's/^# DBENGINE=MYSQL/DBENGINE=MYSQL/; s/^# SIP_DOMAIN=kamailio.org/SIP_DOMAIN=sip.exemple.fr/' /etc/kamailio/kamctlrc
sudo kamdbctl create
sudo kamctl add 1001 Xq7vR2pL9mZt4KwBn3Hs
sudo kamctl ul show
```

## Structure de kamailio.cfg

Le fichier d'exemple active des fonctions par des **directives de préprocesseur** en tête de fichier :

```kamailio
#!KAMAILIO
#!define WITH_MYSQL
#!define WITH_AUTH
#!define WITH_USRLOCDB
#!define WITH_NAT
#!define WITH_ANTIFLOOD
#!define WITH_TLS
```

Puis viennent les paramètres globaux (`listen=`, `alias=`), le chargement des modules (`loadmodule`), leurs paramètres (`modparam`) et la **logique de routage** (`request_route`, `route[...]`, `reply_route`, `failure_route[...]`).

## Répartition vers des IPBX (dispatcher)

```text
# /etc/kamailio/dispatcher.list : groupe, destination
1 sip:10.0.30.11:5060
1 sip:10.0.30.12:5060
```

```kamailio
loadmodule "dispatcher.so"
modparam("dispatcher", "list_file", "/etc/kamailio/dispatcher.list")
modparam("dispatcher", "ds_ping_interval", 30)
modparam("dispatcher", "ds_probing_mode", 1)

# extrait de request_route, après authentification et enregistrement
if (is_method("INVITE") && !has_totag()) {
    # algorithme 4 = tourniquet, avec bascule si un serveur ne répond plus
    if (!ds_select_dst("1", "4")) {
        send_reply("503", "Service Unavailable");
        exit;
    }
    t_on_failure("BASCULE");
}
route(RELAY);

failure_route[BASCULE] {
    if (t_is_canceled()) exit;
    if (t_check_status("408|5[0-9][0-9]") && ds_next_dst()) {
        t_on_failure("BASCULE");
        route(RELAY);
    }
}
```

## Protection

```kamailio
loadmodule "pike.so"
loadmodule "htable.so"
modparam("pike", "sampling_time_unit", 2)
modparam("pike", "reqs_density_per_unit", 16)
modparam("htable", "htable", "ipban=>size=8;autoexpire=300;")

route[REQINIT] {
    if ($sht(ipban=>$si) != $null) {
        exit;
    }
    if (!pike_check_req()) {
        xlog("L_ALERT", "ALERTE : inondation depuis $si:$sp\n");
        $sht(ipban=>$si) = 1;
        exit;
    }
    if ($ua =~ "friendly-scanner|sipcli|sipvicious") {
        exit;
    }
}
```

## Média : rtpengine

**rtpengine** (Sipwise) relaie et transforme le RTP piloté par Kamailio : traversée du NAT, conversion SRTP ↔ RTP (WebRTC), enregistrement, transcodage limité.

```kamailio
loadmodule "rtpengine.so"
modparam("rtpengine", "rtpengine_sock", "udp:127.0.0.1:2223")

route[NATMANAGE] {
    if (has_body("application/sdp")) {
        rtpengine_manage("replace-origin replace-session-connection ICE=remove");
    }
}
```

## Commandes

| Commande | Usage |
| --- | --- |
| `kamctl add 1001 <motdepasse>` / `kamctl rm 1001` | Abonnés |
| `kamctl ul show` / `kamcmd ul.dump` | Enregistrements en cours |
| `kamcmd dispatcher.list` | État des destinations du dispatcher |
| `kamcmd dispatcher.reload` | Recharger la liste |
| `kamcmd core.uptime` / `kamcmd core.version` | État |
| `kamcmd stats.get_statistics all` | Statistiques |
| `kamcmd htable.dump ipban` / `kamcmd htable.delete ipban 203.0.113.50` | Adresses bannies |
| `kamailio -c -f /etc/kamailio/kamailio.cfg` | **Vérifier la syntaxe** avant redémarrage |
| `systemctl restart kamailio` | Appliquer (le script est compilé au démarrage) |

## Interface et supervision

Kamailio n'a pas d'interface officielle : **Siremis** (interface web historique), **Kamailio Web**, ou un outil maison sur sa base de données et son API JSON-RPC. La supervision et l'analyse des appels se font avec **HOMER** (module `siptrace`/`hep`, voir [[15-diagnostic-voip/02-homer-voipmonitor|HOMER]]), Prometheus (`xhttp_prom`) et les journaux.

Suite : [[02-opensips|OpenSIPS]].
