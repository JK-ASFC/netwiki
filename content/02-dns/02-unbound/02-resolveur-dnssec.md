---
title: Résolveur, cache, DNSSEC et performances
description: Configuration complète d'Unbound en résolveur d'entreprise — écoute et contrôle d'accès, durcissement, minimisation QNAME, préchargement, contenu périmé, validation DNSSEC et exceptions, dimensionnement du cache, threads et slabs, réglages réseau.
tags: [unbound, résolveur, cache, dnssec, performance, durcissement]
icon: shield-check
---

## Configuration de référence

```unbound /etc/unbound/unbound.conf.d/resolveur.conf
server:
    # --- Écoute et accès
    interface: 10.0.10.53
    interface: 127.0.0.1
    interface: ::1
    port: 53
    do-ip4: yes
    do-ip6: yes
    do-udp: yes
    do-tcp: yes
    access-control: 0.0.0.0/0 refuse
    access-control: ::0/0 refuse
    access-control: 127.0.0.0/8 allow
    access-control: ::1 allow
    access-control: 10.0.0.0/8 allow
    access-control: 192.168.0.0/16 allow

    # --- Discrétion
    hide-identity: yes
    hide-version: yes
    identity: ""

    # --- Durcissement
    harden-glue: yes
    harden-dnssec-stripped: yes
    harden-below-nxdomain: yes
    harden-referral-path: no               # coûteux, peu de gain
    harden-algo-downgrade: no
    use-caps-for-id: no                    # « 0x20 » : améliore la résistance à l'empoisonnement, mais casse certains serveurs
    qname-minimisation: yes                # n'envoyer à chaque niveau que le nécessaire (vie privée)
    aggressive-nsec: yes                   # répondre NXDOMAIN depuis le cache grâce aux NSEC validés (RFC 8198)
    unwanted-reply-threshold: 10000000

    # --- Protection contre le « DNS rebinding » : refuser des réponses publiques pointant vers des IP privées
    private-address: 10.0.0.0/8
    private-address: 172.16.0.0/12
    private-address: 192.168.0.0/16
    private-address: 169.254.0.0/16
    private-address: fd00::/8
    private-address: fe80::/10
    private-domain: "corp.exemple.fr"      # exception : ce domaine peut renvoyer des IP privées

    # --- DNSSEC
    auto-trust-anchor-file: "/var/lib/unbound/root.key"
    val-clean-additional: yes

    # --- Cache
    msg-cache-size: 128m
    rrset-cache-size: 256m                 # ≈ 2 × msg-cache-size
    cache-min-ttl: 0
    cache-max-ttl: 86400
    cache-max-negative-ttl: 3600
    prefetch: yes                          # rafraîchir les entrées populaires avant expiration
    prefetch-key: yes
    serve-expired: yes                     # répondre avec du périmé si les autoritaires sont injoignables (RFC 8767)
    serve-expired-ttl: 86400
    serve-expired-client-timeout: 1800     # ms : tenter d'abord une réponse fraîche

    # --- Performances
    num-threads: 4
    msg-cache-slabs: 4                     # puissance de 2 proche de num-threads
    rrset-cache-slabs: 4
    infra-cache-slabs: 4
    key-cache-slabs: 4
    so-reuseport: yes
    so-rcvbuf: 4m
    so-sndbuf: 4m
    outgoing-range: 8192
    num-queries-per-thread: 4096
    edns-buffer-size: 1232

    # --- Journalisation
    verbosity: 1
    use-syslog: yes
    log-servfail: yes
    # log-queries: yes                    # temporairement : volumineux
```

> [!TIP]
> Après un changement de `so-rcvbuf`/`so-sndbuf`, augmentez les limites du noyau sinon Unbound avertit au démarrage :
> ```bash
> echo -e "net.core.rmem_max=8388608\nnet.core.wmem_max=8388608" | sudo tee /etc/sysctl.d/90-unbound.conf && sudo sysctl --system
> ```

## Contrôle d'accès

| Action `access-control` | Effet |
| --- | --- |
| `allow` | Requêtes récursives autorisées |
| `refuse` | Réponse REFUSED |
| `deny` | Paquet ignoré silencieusement |
| `allow_snoop` | Autorisé, y compris les requêtes non récursives (consulter le cache) — administration |
| `allow_setrd` | Force la récursion même si le client ne la demande pas |
| `deny_non_local` / `refuse_non_local` | Seules les zones locales |

L'entrée la plus **spécifique** (préfixe le plus long) l'emporte.

## DNSSEC

La validation est active dès que `auto-trust-anchor-file` est présent (module `validator` dans `module-config`, par défaut `"validator iterator"`).

```bash
dig @10.0.10.53 www.isc.org +dnssec +multi     # drapeau ad
unbound-host -v -C /etc/unbound/unbound.conf www.isc.org     # « (secure) »
```

### Exceptions

```unbound
server:
    # Domaine interne non signé dont le parent public est signé (ex. sous-domaine délégué en interne)
    domain-insecure: "ad.exemple.fr"
    # Désactiver la validation pour une zone locale de test
    domain-insecure: "lab.local"
    # Ancre de confiance d'une zone interne signée
    trust-anchor: "corp.interne. DS 34567 13 2 A1B2C3…"
```

> [!WARNING]
> Une **horloge fausse** fait échouer la validation DNSSEC (signatures « pas encore valides » ou expirées) et rend tout le DNS indisponible : synchronisez le serveur en NTP **avant** d'activer la validation. Sur les équipements sans horloge sauvegardée, l'option `val-override-date` sert au diagnostic uniquement.

## Racine en local (RFC 8806)

Pour réduire la latence et la dépendance aux serveurs racine, Unbound peut tenir une copie de la zone racine :

```unbound
auth-zone:
    name: "."
    primary: 170.247.170.2          # b.root-servers.net
    primary: 192.0.47.132           # xfr.cjr.dns.icann.org
    primary: 192.0.32.132           # xfr.lax.dns.icann.org
    fallback-enabled: yes
    for-downstream: no
    for-upstream: yes
    zonefile: "/var/lib/unbound/root.zone"
```

## Mode redirecteur plutôt que récursif

Si le pare-feu interdit les requêtes DNS directes vers Internet, Unbound peut tout transmettre à des résolveurs amont (en clair ou chiffré, voir [[04-dot-doh-securite]]) :

```unbound
forward-zone:
    name: "."
    forward-addr: 9.9.9.9
    forward-addr: 149.112.112.112
    forward-first: no
```

## Dimensionnement

| Charge | `num-threads` | Caches | Remarques |
| --- | --- | --- | --- |
| Petit site (< 500 clients) | 1-2 | 32-64 Mo | Valeurs par défaut presque suffisantes |
| Entreprise (milliers de clients) | Nombre de cœurs | 256 Mo – 1 Go | `so-reuseport`, slabs = puissance de 2 |
| Opérateur | Nombre de cœurs | Plusieurs Go | Compilé avec libevent, `outgoing-range` élevé |

Mémoire réellement utilisée ≈ (msg + rrset) × 2,5 environ (structures internes). Voir `unbound-control stats` : `mem.cache.rrset`, `mem.cache.message`.

## Haute disponibilité

- Deux résolveurs (ou plus) distribués par DHCP ; idéalement une **IP anycast** ou une VIP keepalived pour une bascule immédiate (même principe que pour [[01-bind9/03-cache-recursif-forwarders\|BIND]]).
- La configuration étant sans état, il suffit de la déployer à l'identique (Ansible, Git).
