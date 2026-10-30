---
title: Asterisk — PJSIP, postes et trunks
description: Configurer chan_pjsip dans Asterisk — objets (transport, endpoint, auth, aor, registration, identify, acl), transports UDP et TLS, réglages NAT (local_net, external_media_address, rtp_symmetric, force_rport, rewrite_contact, direct_media), modèles de postes, trunk opérateur par enregistrement ou par IP, pjsip_wizard.conf, plage RTP, codecs, et commandes CLI de vérification (pjsip show, pjsip set logger).
tags: [asterisk, pjsip, sip, trunk, nat, tls, configuration]
icon: settings-2
---

## Les objets PJSIP

`pjsip.conf` décrit des **objets** typés ; plusieurs objets de types différents peuvent porter le même nom (ex. `[1001]` endpoint, auth et aor).

| Type | Rôle |
| --- | --- |
| `transport` | Protocole et adresse d'écoute (UDP, TCP, TLS, WS/WSS), réglages NAT |
| `endpoint` | Profil d'appel : contexte du dialplan, codecs, média, DTMF, sécurité |
| `auth` | Identifiants (entrants ou sortants) |
| `aor` (*address of record*) | Où joindre l'endpoint : contacts enregistrés ou statiques, sonde (`qualify`) |
| `registration` | Enregistrement sortant d'Asterisk auprès d'un opérateur |
| `identify` | Associe des paquets entrants à un endpoint **par adresse IP** (trunks) |
| `acl` | Listes d'accès (aussi dans `acl.conf`) |

## Transports

```pjsip
; /etc/asterisk/pjsip.conf
[global]
type=global
user_agent=PBX-Exemple
endpoint_identifier_order=ip,username

[transport-udp]
type=transport
protocol=udp
bind=0.0.0.0:5060
; serveur derrière un NAT : réseaux internes et adresse publique annoncée
local_net=10.0.0.0/8
local_net=192.168.0.0/16
external_media_address=203.0.113.10
external_signaling_address=203.0.113.10

[transport-tls]
type=transport
protocol=tls
bind=0.0.0.0:5061
cert_file=/etc/asterisk/keys/pbx.crt
priv_key_file=/etc/asterisk/keys/pbx.key
method=tlsv1_2
local_net=10.0.0.0/8
external_media_address=203.0.113.10
external_signaling_address=203.0.113.10
```

## Postes avec des modèles

```pjsip
; ---------- modèles (le "!" rend la section non instanciée) ----------
[modele-poste](!)
type=endpoint
context=interne
disallow=all
allow=g722,alaw,ulaw
direct_media=no
rtp_symmetric=yes
force_rport=yes
rewrite_contact=yes
dtmf_mode=rfc4733
language=fr
device_state_busy_at=2

[modele-auth](!)
type=auth
auth_type=userpass

[modele-aor](!)
type=aor
max_contacts=2
remove_existing=yes
qualify_frequency=60

; ---------- poste 1001 ----------
[1001](modele-poste)
auth=1001
aors=1001
callerid="Alice Martin" <1001>
mailboxes=1001@default

[1001](modele-auth)
username=1001
password=Xq7vR2pL9mZt4KwBn3Hs

[1001](modele-aor)

; ---------- poste 1002 en TLS + SRTP ----------
[1002](modele-poste)
auth=1002
aors=1002
callerid="Bruno Petit" <1002>
transport=transport-tls
media_encryption=sdes
media_encryption_optimistic=no

[1002](modele-auth)
username=1002
password=Lw8cT5yQ2nVb7RpXk4Df

[1002](modele-aor)
```

| Paramètre | Effet |
| --- | --- |
| `direct_media=no` | Asterisk reste sur le chemin du RTP (indispensable avec NAT, enregistrement, transcodage) |
| `rtp_symmetric`, `force_rport`, `rewrite_contact` | Ignorer les adresses privées annoncées et répondre à l'adresse source réelle (postes derrière NAT) |
| `max_contacts` | Nombre d'appareils pouvant s'enregistrer sur le même compte |
| `qualify_frequency` | Sonde `OPTIONS` régulière : détecte un poste injoignable et garde le NAT ouvert |
| `media_encryption=sdes` | SRTP (avec le transport TLS) |
| `device_state_busy_at` | Le poste est considéré occupé à partir de N appels (supervision, files) |

## Trunk opérateur par enregistrement

```pjsip
[operateur-auth]
type=auth
auth_type=userpass
username=0123456789
password=MotDePasseFourniParOperateur

[operateur-reg]
type=registration
transport=transport-udp
outbound_auth=operateur-auth
server_uri=sip:sip.operateur.example
client_uri=sip:0123456789@sip.operateur.example
contact_user=0123456789
retry_interval=60
forbidden_retry_interval=600
expiration=600

[operateur]
type=aor
contact=sip:sip.operateur.example
qualify_frequency=60

[operateur]
type=endpoint
transport=transport-udp
context=entrant
disallow=all
allow=alaw,g722
outbound_auth=operateur-auth
aors=operateur
from_user=0123456789
from_domain=sip.operateur.example
direct_media=no
send_pai=yes
trust_id_outbound=yes

[operateur]
type=identify
endpoint=operateur
match=sip.operateur.example
```

Pour un trunk **authentifié par IP**, supprimez `registration` et `outbound_auth` et renseignez dans `identify` les adresses de l'opérateur (`match=198.51.100.0/27`).

## Variante concise : pjsip_wizard.conf

```pjsip
; /etc/asterisk/pjsip_wizard.conf
[modele-poste-wiz](!)
type=wizard
accepts_registrations=yes
accepts_auth=yes
transport=transport-udp
endpoint/context=interne
endpoint/disallow=all
endpoint/allow=g722,alaw
endpoint/direct_media=no
endpoint/rtp_symmetric=yes
endpoint/force_rport=yes
endpoint/rewrite_contact=yes
aor/max_contacts=1
aor/qualify_frequency=60

[1003](modele-poste-wiz)
inbound_auth/username=1003
inbound_auth/password=Hm6zP9sW3qXc8LtBv2Ny
endpoint/callerid="Chloé Durand" <1003>
```

## RTP

```ini
; /etc/asterisk/rtp.conf
[general]
rtpstart=10000
rtpend=20000
strictrtp=yes
icesupport=no
```

La plage RTP doit être ouverte (et redirigée en cas de NAT) en UDP sur le pare-feu.

## Commandes de vérification

| Commande | Usage |
| --- | --- |
| `pjsip show endpoints` | État de tous les endpoints (`Avail`, `Unavail`, `Not in use`, `In use`) |
| `pjsip show endpoint 1001` | Détail d'un endpoint (codecs, transport, contacts) |
| `pjsip show contacts` / `pjsip show aors` | Contacts enregistrés, latence (`RTT`) |
| `pjsip show registrations` | État des enregistrements sortants (`Registered`, `Rejected`) |
| `pjsip show transports` | Transports actifs |
| `pjsip show identifies` | Correspondances IP → endpoint |
| `pjsip set logger on` / `pjsip set logger host 198.51.100.20` | Afficher les messages SIP (tous / d'un hôte) |
| `pjsip send register operateur-reg` | Forcer un réenregistrement |
| `pjsip qualify 1001` | Sonder un contact |
| `rtp set debug on` / `rtp set debug ip 10.0.40.21` | Tracer les paquets RTP |
| `module reload res_pjsip.so` | Recharger la configuration PJSIP |

```bash
asterisk -rx "pjsip show endpoints" | grep -E "Endpoint:|Contact:"
asterisk -rx "pjsip show registrations"
```

Suite : [[03-dialplan-fonctions|dialplan et fonctions téléphoniques]].
