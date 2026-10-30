---
title: DNS over TLS / HTTPS et sécurité
description: Chiffrer le DNS avec Unbound — servir DNS over TLS (853) et DNS over HTTPS, transmettre vers des résolveurs amont en DoT, limiter le débit, se protéger des amplifications, isoler le service (chroot, systemd) et bonnes pratiques.
tags: [unbound, dot, doh, dns over tls, sécurité, ratelimit, chiffrement]
icon: lock
---

## Transmettre en DNS over TLS vers l'amont

Quand la récursion directe vers Internet n'est pas souhaitée, Unbound chiffre ses requêtes vers des résolveurs publics (Quad9, Cloudflare, DNS4EU…) :

```unbound /etc/unbound/unbound.conf.d/dot-amont.conf
server:
    tls-cert-bundle: "/etc/ssl/certs/ca-certificates.crt"     # RHEL : /etc/pki/tls/certs/ca-bundle.crt

forward-zone:
    name: "."
    forward-tls-upstream: yes
    forward-addr: 9.9.9.9@853#dns.quad9.net
    forward-addr: 149.112.112.112@853#dns.quad9.net
    forward-addr: 2620:fe::fe@853#dns.quad9.net
    forward-addr: 1.1.1.1@853#cloudflare-dns.com
```

La partie après `#` est le **nom attendu dans le certificat** : sans elle, la connexion est chiffrée mais l'identité du serveur n'est pas vérifiée.

```bash
sudo unbound-checkconf && sudo systemctl restart unbound
sudo tcpdump -ni any port 853 -c 5         # vérifier que le trafic sortant est bien en 853
```

## Servir DNS over TLS (port 853)

```unbound /etc/unbound/unbound.conf.d/dot-service.conf
server:
    interface: 10.0.10.53@853
    interface: 10.0.10.53@53
    tls-service-key: "/etc/unbound/tls/resolveur.key"
    tls-service-pem: "/etc/unbound/tls/resolveur.fullchain.pem"
    tls-port: 853
    tls-ciphers: "ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384"
```

```bash
sudo chown root:unbound /etc/unbound/tls/* && sudo chmod 640 /etc/unbound/tls/*.key
kdig @10.0.10.53 +tls-ca +tls-host=resolveur.exemple.fr www.debian.org     # paquet knot-dnsutils
```

Le certificat (nom `resolveur.exemple.fr`) peut venir d'une PKI interne ([[01-active-directory/10-adcs-pki|AD CS]]) ou de Let's Encrypt (défi DNS si le serveur n'est pas exposé).

## Servir DNS over HTTPS

Disponible si Unbound est compilé avec **libnghttp2** (paquets récents des distributions) — vérifier `unbound -V | grep -i nghttp2`.

```unbound
server:
    interface: 10.0.10.53@443
    https-port: 443
    http-endpoint: "/dns-query"
    tls-service-key: "/etc/unbound/tls/resolveur.key"
    tls-service-pem: "/etc/unbound/tls/resolveur.fullchain.pem"
    http-max-streams: 100
```

```bash
curl -sH 'accept: application/dns-message' "https://resolveur.exemple.fr/dns-query?dns=q80BAAABAAAAAAAAA3d3dwZkZWJpYW4Db3JnAAABAAE" -o - | xxd | head -3
```

Configuration des postes : Windows 11 / Server 2022+ (`Add-DnsClientDohServerAddress`, GPO *Configurer DNS sur HTTPS*), navigateurs (stratégies `DnsOverHttpsMode`, `DnsOverHttpsTemplates`), Android en DoT (« DNS privé »).

> [!TIP]
> En entreprise, offrez DoT/DoH **sur vos résolveurs internes** et bloquez les résolveurs DoH publics connus au pare-feu : les postes gardent le chiffrement sans contourner votre filtrage DNS (RPZ, journalisation).

## Limitation de débit et protection

```unbound
server:
    ratelimit: 1000                    # requêtes/s par zone autoritaire interrogée (protège les tiers)
    ip-ratelimit: 300                  # requêtes/s par IP cliente
    ip-ratelimit-factor: 10            # 1 requête sur 10 passe malgré tout (TC=1 pour forcer TCP)
    ip-ratelimit-size: 4m
    deny-any: yes                      # répondre de façon minimale aux requêtes ANY
    minimal-responses: yes
    unwanted-reply-threshold: 10000000
    # Ne jamais exposer un résolveur ouvert : access-control strict (voir l'article résolveur)
```

## Isolement du service

```unbound
server:
    username: "unbound"
    chroot: "/etc/unbound"              # Debian : chroot désactivé par défaut (""), RHEL : selon le paquet
    directory: "/etc/unbound"
    pidfile: "/run/unbound.pid"
```

Durcissement systemd (complément au chroot) :

```ini /etc/systemd/system/unbound.service.d/hardening.conf
[Service]
ProtectSystem=strict
ProtectHome=yes
PrivateTmp=yes
ReadWritePaths=/var/lib/unbound /run
NoNewPrivileges=yes
CapabilityBoundingSet=CAP_NET_BIND_SERVICE CAP_SETUID CAP_SETGID CAP_SYS_CHROOT CAP_SYS_RESOURCE
```

## Bonnes pratiques

- [ ] `access-control` restreint aux réseaux internes, `refuse` par défaut
- [ ] `hide-identity`, `hide-version`, `qname-minimisation`, `aggressive-nsec`
- [ ] Validation DNSSEC active, NTP fiable
- [ ] `private-address` (anti DNS rebinding) avec `private-domain` pour les zones internes légitimes
- [ ] Amont chiffré (DoT) si redirection vers des résolveurs publics
- [ ] Ports 53/853/443 filtrés au pare-feu ; DNS sortant direct des postes bloqué
- [ ] Mises à jour régulières (avis de sécurité NLnet Labs)
- [ ] Journalisation des SERVFAIL et des correspondances RPZ vers le SIEM
