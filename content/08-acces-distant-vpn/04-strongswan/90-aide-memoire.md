---
title: strongSwan — aide-mémoire des commandes
description: Commandes strongSwan avec exemples — interface swanctl (load-all, list-conns, list-sas, initiate, terminate, list-certs, stats), configuration swanctl.conf (site à site IKEv2 PSK et certificats, accès distant EAP), PKI intégrée (pki --gen, --self, --issue), noyau XFRM (ip xfrm state/policy), journaux charon, ancienne interface ipsec (stroke), tests et dépannage.
tags: [aide-mémoire, strongswan, ipsec, ikev2, swanctl, vpn]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation|strongSwan]].

## swanctl

```bash
sudo systemctl status strongswan                # service charon-systemd (selon distribution)
sudo swanctl --load-all                          # charger connexions, secrets, certificats
sudo swanctl --list-conns
sudo swanctl --list-sas
sudo swanctl --initiate --child lyon-net
sudo swanctl --terminate --ike lyon
sudo swanctl --list-certs
sudo swanctl --list-authorities
sudo swanctl --stats
sudo swanctl --log                              # journal en direct
```

## Site à site IKEv2 (PSK)

```swanctl
# /etc/swanctl/conf.d/lyon.conf
connections {
  lyon {
    version = 2
    local_addrs = 203.0.113.2
    remote_addrs = 198.51.100.20
    proposals = aes256gcm16-prfsha384-ecp384
    local {
      auth = psk
      id = paris.exemple.fr
    }
    remote {
      auth = psk
      id = lyon.exemple.fr
    }
    children {
      lyon-net {
        local_ts = 10.0.0.0/16
        remote_ts = 10.60.0.0/16
        esp_proposals = aes256gcm16-ecp384
        start_action = trap
        dpd_action = restart
      }
    }
  }
}
secrets {
  ike-lyon {
    id-1 = paris.exemple.fr
    id-2 = lyon.exemple.fr
    secret = "CleLongueEtAleatoire2026-0123456789abcdef"
  }
}
```

## PKI intégrée

```bash
pki --gen --type ecdsa --size 384 --outform pem > /etc/swanctl/private/ac.key
pki --self --ca --lifetime 3650 --in /etc/swanctl/private/ac.key --dn "C=FR, O=Exemple, CN=AC VPN" --outform pem > /etc/swanctl/x509ca/ac.crt
pki --gen --type ecdsa --size 384 --outform pem > /etc/swanctl/private/vpn.key
pki --req --type priv --in /etc/swanctl/private/vpn.key --dn "C=FR, O=Exemple, CN=vpn.exemple.fr" --san vpn.exemple.fr --outform pem > vpn.csr
pki --issue --cacert /etc/swanctl/x509ca/ac.crt --cakey /etc/swanctl/private/ac.key --type pkcs10 --in vpn.csr --lifetime 825 --flag serverAuth --flag ikeIntermediate --outform pem > /etc/swanctl/x509/vpn.crt
pki --print --in /etc/swanctl/x509/vpn.crt
```

## Noyau (XFRM)

```bash
sudo ip xfrm state            # SA actives (clés : ne pas partager la sortie)
sudo ip xfrm policy
sudo ip -s xfrm state | grep -E "src|bytes"
sudo ip xfrm monitor
```

## Ancienne interface (stroke, ipsec.conf)

```bash
sudo ipsec statusall
sudo ipsec up lyon
sudo ipsec down lyon
sudo ipsec reload && sudo ipsec rereadsecrets
```

## Dépannage

```bash
sudo journalctl -u strongswan -f
sudo swanctl --log --level 2
sudo tcpdump -ni eth0 udp port 500 or udp port 4500 or esp
```

| Message | Cause |
| --- | --- |
| `NO_PROPOSAL_CHOSEN` | Propositions IKE/ESP différentes entre pairs |
| `AUTHENTICATION_FAILED` | Clé partagée ou identités (`id`) différentes, certificat non approuvé |
| `TS_UNACCEPTABLE` | Sélecteurs de trafic (`local_ts`/`remote_ts`) non symétriques |
| SA établies sans trafic | Routage, pare-feu (ESP, UDP 4500), NAT appliqué avant IPsec |
