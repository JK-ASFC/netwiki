---
title: Middlewares, TLS et routage TCP/UDP
description: Fonctions avancées de Traefik — middlewares (en-têtes de sécurité, redirections, authentification forward vers Authelia ou un IdP, limitation de débit, listes d'IP, compression, réessais, disjoncteur), options TLS (versions, suites, mTLS), certificats ACME par défi HTTP, TLS-ALPN ou DNS (certificats génériques), certificats internes, routage TCP par SNI, UDP, sessions collantes et répartition pondérée.
tags: [traefik, middlewares, tls, acme, let's encrypt, forward auth, tcp, sni]
icon: settings-2
---

## Middlewares courants

```yaml /etc/traefik/dynamique/middlewares.yml
http:
  middlewares:
    securite:
      headers:
        stsSeconds: 31536000
        stsIncludeSubdomains: true
        contentTypeNosniff: true
        frameDeny: true
        referrerPolicy: "strict-origin-when-cross-origin"
        customResponseHeaders:
          Server: ""
    limite:
      rateLimit:
        average: 50
        burst: 100
    interne:
      ipAllowList:
        sourceRange: ["10.0.0.0/8", "192.168.0.0/16"]
    sso:
      forwardAuth:
        address: "http://authelia:9091/api/authz/forward-auth"
        trustForwardHeader: true
        authResponseHeaders: ["Remote-User", "Remote-Groups", "Remote-Email"]
    compression:
      compress: {}
    reessais:
      retry:
        attempts: 3
        initialInterval: 200ms
```

```yaml Utilisation sur un routeur (fichier ou étiquettes Docker)
http:
  routers:
    wiki:
      rule: "Host(`wiki.exemple.fr`)"
      entryPoints: [websecure]
      middlewares: [securite, sso, compression]
      service: wiki
      tls:
        certResolver: letsencrypt
```

Avec Docker : `traefik.http.routers.wiki.middlewares=securite@file,sso@file` (le suffixe `@file` désigne le fournisseur où le middleware est défini).

**ForwardAuth** délègue l'authentification à un service ([[06-authelia/02-proxy-oidc-exploitation|Authelia]], oauth2-proxy, Authentik) : SSO et MFA devant des applications qui n'en ont pas.

## TLS

```yaml /etc/traefik/dynamique/tls.yml
tls:
  options:
    default:
      minVersion: VersionTLS12
      sniStrict: true
      cipherSuites:
        - TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
        - TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
        - TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305
        - TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305
    mtls:
      clientAuth:
        caFiles: ["/etc/traefik/ac-clients.pem"]
        clientAuthType: RequireAndVerifyClientCert
  certificates:
    - certFile: /etc/traefik/certs/intranet.corp.exemple.fr.crt     # certificat interne (AD CS)
      keyFile: /etc/traefik/certs/intranet.corp.exemple.fr.key
```

### Défis ACME

| Défi | Prérequis | Usage |
| --- | --- | --- |
| HTTP-01 | Port 80 joignable depuis Internet | Cas simple |
| TLS-ALPN-01 | Port 443 joignable | Sans port 80 |
| **DNS-01** | API du fournisseur DNS (OVH, Cloudflare, Gandi, RFC 2136…) | **Certificats génériques** `*.exemple.fr`, serveurs non exposés à Internet |

```yaml traefik.yml (statique) — défi DNS
certificatesResolvers:
  dns:
    acme:
      email: admin@exemple.fr
      storage: /var/lib/traefik/acme.json
      dnsChallenge:
        provider: ovh
        resolvers: ["1.1.1.1:53", "9.9.9.9:53"]
# Identifiants par variables d'environnement : OVH_ENDPOINT, OVH_APPLICATION_KEY, OVH_APPLICATION_SECRET, OVH_CONSUMER_KEY
```

```yaml Routeur avec certificat générique
tls:
  certResolver: dns
  domains:
    - main: "exemple.fr"
      sans: ["*.exemple.fr"]
```

Une **AC ACME interne** (step-ca, Vault PKI — voir [[07-vault/03-pki-ssh-exploitation|Vault PKI]]) permet le même automatisme pour les noms internes (`caServer` du résolveur).

## TCP et UDP

```yaml /etc/traefik/dynamique/tcp.yml
tcp:
  routers:
    postgres:
      entryPoints: [postgres]          # point d'entrée :5432 défini dans la configuration statique
      rule: "HostSNI(`*`)"
      service: postgres
    ssh-git:
      entryPoints: [websecure]
      rule: "HostSNI(`git.exemple.fr`)"
      tls:
        passthrough: true              # TLS de bout en bout, Traefik route sur le SNI sans déchiffrer
      service: gitlab-https
  services:
    postgres:
      loadBalancer:
        servers:
          - address: "10.0.20.40:5432"
    gitlab-https:
      loadBalancer:
        servers:
          - address: "10.0.20.50:443"
udp:
  services:
    dns:
      loadBalancer:
        servers:
          - address: "10.0.10.53:53"
```

`HostSNI` n'est utilisable qu'avec TLS ; pour du TCP en clair, la règle est ``HostSNI(`*`)`` (tout le trafic du point d'entrée).

## Répartition

```yaml
http:
  services:
    appli:
      loadBalancer:
        sticky:
          cookie:
            name: appli_route
            secure: true
            httpOnly: true
        servers:
          - url: "http://10.0.20.11:8080"
          - url: "http://10.0.20.12:8080"
    appli-canari:
      weighted:
        services:
          - name: appli-v1
            weight: 9
          - name: appli-v2
            weight: 1
```

Le service **pondéré** permet les déploiements progressifs (canari) ; le service **miroir** (*mirroring*) duplique une partie du trafic vers une nouvelle version pour tests.
