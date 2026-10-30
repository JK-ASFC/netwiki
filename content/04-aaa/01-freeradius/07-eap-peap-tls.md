---
title: "EAP : PEAP, TTLS, EAP-TLS et certificats"
description: Configuration du module eap (tls-config commun, PEAP, TTLS, EAP-TLS), génération des certificats de test, certificats d'une PKI d'entreprise, vérifications des certificats clients (CN, émetteur, OCSP), réglages TLS, tests avec eapol_test et déploiement côté postes.
tags: [freeradius, eap, peap, ttls, eap-tls, certificats, pki, tls, wifi]
icon: lock
---

## Choisir sa méthode

| Méthode | Certificat serveur | Identifiant client | Points forts | Points faibles |
| --- | --- | --- | --- | --- |
| **PEAP-MSCHAPv2** | Oui | Login / mot de passe AD | Natif partout, simple | Dépend de la validation du certificat serveur par le client, bloqué par Credential Guard pour le SSO |
| **EAP-TTLS / PAP** | Oui | Login / mot de passe | Fonctionne avec tout annuaire (LDAP bind) | Le client doit être configuré (pas toujours par défaut) |
| **EAP-TLS** | Oui | **Certificat** utilisateur ou machine | Le plus sûr, pas de mot de passe, résistant au phishing d'identifiants | Exige une PKI et le déploiement des certificats (MDM, GPO d'auto-inscription) |

> [!CAUTION]
> Avec PEAP/TTLS, si les postes **ne vérifient pas le certificat du serveur** (case « Vérifier l'identité du serveur » décochée, ou acceptation manuelle par l'utilisateur), un attaquant peut monter un faux point d'accès (*evil twin*) et récupérer les échanges MS-CHAPv2 — cassables hors ligne. La configuration des postes (GPO, MDM) **doit** imposer l'AC et le nom du serveur.

## Certificats

### Certificats de test (livrés)

À l'installation, FreeRADIUS génère des certificats auto-signés dans `certs/` (via `certs/bootstrap`). Ils ne conviennent **qu'aux tests**.

```bash
cd /etc/freeradius/3.0/certs
sudo vi ca.cnf server.cnf client.cnf     # pays, organisation, CN, durées, mots de passe
sudo make destroycerts
sudo make ca                              # ca.pem / ca.key / ca.der
sudo make server                          # server.pem / server.key / server.crt
sudo make client                          # client.pem / client.p12 (pour EAP-TLS)
sudo chgrp freerad *.pem *.key && sudo chmod 640 *.key
```

### Certificat d'une PKI d'entreprise (recommandé)

Exigences pour le certificat **serveur** :

- EKU **Server Authentication** (`1.3.6.1.5.5.7.3.1`) ; certains anciens clients exigent aussi une extension spécifique.
- **SAN DNS** = nom du serveur RADIUS (ex. `radius.corp.exemple.fr`), identique sur tous les serveurs RADIUS si les clients vérifient le nom (même certificat ou même SAN).
- Clé RSA 2048+ ou ECDSA P-256 ; durée raisonnable (1-2 ans) — **planifier le renouvellement** : les clients doivent faire confiance au nouveau certificat (même AC).

```bash
# Générer clé + CSR, à signer par l'AC d'entreprise (modèle « Serveur RADIUS/NPS » d'AD CS)
openssl req -new -newkey rsa:3072 -nodes -keyout radius.key -out radius.csr \
  -subj "/C=FR/O=Exemple/CN=radius.corp.exemple.fr" \
  -addext "subjectAltName=DNS:radius.corp.exemple.fr" \
  -addext "extendedKeyUsage=serverAuth"
# Après signature : radius.crt + chaîne
cat radius.crt intermediaire.crt > /etc/freeradius/3.0/certs/radius-chain.pem
cp corp-root-ca.pem /etc/freeradius/3.0/certs/corp-ca.pem
```

Création du modèle et auto-inscription des certificats utilisateurs/machines côté Windows : voir [[01-active-directory/10-adcs-pki|AD CS et PKI]].

## Module eap

```radius mods-available/eap
eap {
    default_eap_type = peap            # méthode proposée en premier (le client peut négocier)
    timer_expire = 60
    ignore_unknown_eap_types = no
    cisco_accounting_username_bug = no
    max_sessions = ${max_requests}

    # ---------------------------------------------------------------- TLS commun
    tls-config tls-common {
        private_key_password =
        private_key_file = ${certdir}/radius.key
        certificate_file = ${certdir}/radius-chain.pem
        ca_file = ${certdir}/corp-ca.pem          # AC qui signe les certificats CLIENTS (EAP-TLS)
        # ca_path = ${cadir}
        dh_file = ${certdir}/dh                   # « openssl dhparam -out dh 2048 » si DHE utilisé
        random_file = /dev/urandom
        fragment_size = 1024                      # éviter la fragmentation IP (MTU des liens RADIUS)
        include_length = yes
        auto_chain = yes

        tls_min_version = "1.2"
        tls_max_version = "1.3"                   # 1.3 : clients récents ; mettre 1.2 si problèmes avec d'anciens supplicants
        cipher_list = "DEFAULT"
        cipher_server_preference = yes
        ecdh_curve = "prime256v1"

        cache {
            enable = yes                          # reprise de session TLS : réauthentification rapide (roaming Wi-Fi)
            lifetime = 24                         # heures
            max_entries = 10000
        }

        verify {
            # Vérification externe facultative du certificat client
            # tmpdir = /var/run/freeradius/tmp
            # client = "/usr/bin/openssl verify -CAfile ${..ca_file} %{TLS-Client-Cert-Filename}"
        }

        ocsp {
            enable = no                           # yes : vérifier la révocation des certificats clients
            override_cert_url = yes
            url = "http://ocsp.corp.exemple.fr/ocsp"
            # softfail = yes                      # accepter si le répondeur OCSP est injoignable
        }
    }

    # ---------------------------------------------------------------- EAP-TLS
    tls {
        tls = tls-common
        # Contrôles sur le certificat client
        # check_cert_issuer = "/C=FR/O=Exemple/CN=Corp Issuing CA"
        # check_cert_cn = %{User-Name}
        virtual_server = check-eap-tls           # contrôles avancés (voir plus bas)
    }

    # ---------------------------------------------------------------- PEAP
    peap {
        tls = tls-common
        default_eap_type = mschapv2
        copy_request_to_tunnel = no
        use_tunneled_reply = no
        virtual_server = "inner-tunnel"
        # require_client_cert = no
    }

    # ---------------------------------------------------------------- EAP-TTLS
    ttls {
        tls = tls-common
        default_eap_type = md5
        copy_request_to_tunnel = no
        use_tunneled_reply = no
        virtual_server = "inner-tunnel"
    }

    mschapv2 {
        # send_error = no
    }

    # Désactiver ce qui n'est pas utilisé
    # md5 { }
    # gtc { }
}
```

> [!NOTE]
> `use_tunneled_reply` et `copy_request_to_tunnel` sont conservés pour compatibilité ; la méthode actuelle consiste à placer les attributs de réponse dans `outer.session-state` depuis `inner-tunnel` (voir [[08-8021x-vlan-dynamique-mab]]).

## Contrôles avancés des certificats clients (EAP-TLS)

Le serveur virtuel `check-eap-tls` est appelé pendant la négociation TLS, avec les attributs `TLS-Client-Cert-*` :

```radius sites-available/check-eap-tls
server check-eap-tls {
    authorize {
        # Refuser les certificats qui ne viennent pas de l'AC émettrice attendue
        if (!(&TLS-Client-Cert-Issuer =~ /CN=Corp Issuing CA/)) {
            update reply { &Reply-Message := "Émetteur non autorisé" }
            reject
        }
        # Le CN (ou le SAN UPN) doit correspondre à l'identité annoncée
        if (&TLS-Client-Cert-Common-Name && (&User-Name !~ /%{TLS-Client-Cert-Common-Name}/i)) {
            reject
        }
        # Vérifier que le compte existe toujours et n'est pas désactivé dans AD
        -ldap
        if (notfound) { reject }
        update config { &Auth-Type := Accept }
    }
}
```

```bash
sudo ln -s ../sites-available/check-eap-tls /etc/freeradius/3.0/sites-enabled/
```

Attributs disponibles (extraits) : `TLS-Client-Cert-Common-Name`, `TLS-Client-Cert-Subject`, `TLS-Client-Cert-Issuer`, `TLS-Client-Cert-Serial`, `TLS-Client-Cert-Expiration`, `TLS-Client-Cert-Subject-Alt-Name-Upn`, `TLS-Client-Cert-Subject-Alt-Name-Dns`, `TLS-Cert-Serial` (certificat de l'AC à chaque niveau).

> [!IMPORTANT]
> En EAP-TLS, **la révocation** d'un certificat (poste volé, départ d'un employé) n'est prise en compte que si vous activez **OCSP** ou une **CRL** (`check_crl = yes` + CRL à jour dans `ca_path`), ou si vous vérifiez l'existence/l'état du compte dans l'annuaire comme ci-dessus.

## Inner-tunnel

```radius sites-enabled/inner-tunnel (essentiel)
server inner-tunnel {
    listen {
        ipaddr = 127.0.0.1
        port = 18120
        type = auth
    }
    authorize {
        filter_username
        chap
        mschap
        suffix
        update control {
            &Proxy-To-Realm := LOCAL
        }
        eap { ok = return }
        files
        -sql
        -ldap
        pap
    }
    authenticate {
        Auth-Type PAP { pap }
        Auth-Type MS-CHAP { mschap }
        Auth-Type LDAP { ldap }
        eap
    }
    post-auth {
        # Attributs à renvoyer dans l'Access-Accept externe
        update outer.session-state {
            &User-Name := &User-Name          # vraie identité, utile pour l'accounting
        }
        Post-Auth-Type REJECT {
            attr_filter.access_reject
            update outer.session-state {
                &Module-Failure-Message := &request:Module-Failure-Message
            }
        }
    }
}
```

## Tests avec eapol_test

```ini eap-ttls-pap.conf
network={
    key_mgmt=WPA-EAP
    eap=TTLS
    identity="alice"
    anonymous_identity="anonymous@corp.exemple.fr"
    password="Mot2Passe!"
    phase2="auth=PAP"
    ca_cert="/etc/freeradius/3.0/certs/corp-ca.pem"
    domain_suffix_match="radius.corp.exemple.fr"
}
```

```ini eap-tls.conf
network={
    key_mgmt=WPA-EAP
    eap=TLS
    identity="alice@corp.exemple.fr"
    ca_cert="/etc/freeradius/3.0/certs/corp-ca.pem"
    client_cert="/root/tests/alice.crt"
    private_key="/root/tests/alice.key"
    private_key_passwd="motdepasse-cle"
    domain_suffix_match="radius.corp.exemple.fr"
}
```

```bash
eapol_test -c eap-tls.conf -a 10.0.10.31 -s 'SecretDeTest' -r 0
# « SUCCESS » + l'Access-Accept et ses attributs (VLAN, MS-MPPE-*-Key)
```

## Configuration des postes

| Plateforme | Méthode de déploiement |
| --- | --- |
| Windows (domaine) | **GPO** : *Configuration ordinateur → Stratégies → Paramètres Windows → Paramètres de sécurité → Stratégies de réseau sans fil (IEEE 802.11)* et *Stratégies de réseau câblé (IEEE 802.3)* — méthode, AC racine de confiance, nom du serveur (« Se connecter à ces serveurs »), mode machine/utilisateur |
| Windows / macOS / iOS / Android (MDM) | Profils Wi-Fi Intune, Jamf, Workspace ONE… avec certificat SCEP/PKCS |
| macOS / iOS hors MDM | Profil `.mobileconfig` (Apple Configurator) |
| Linux | NetworkManager (`nmcli connection add type wifi … 802-1x.eap tls …`) ou wpa_supplicant |
| Invités / BYOD | Outil d'enrôlement (eduroam CAT, geteduroam, portails NAC) |

```bash
# Exemple NetworkManager (PEAP)
nmcli connection add type wifi ifname wlan0 con-name Corp ssid Corp \
  wifi-sec.key-mgmt wpa-eap 802-1x.eap peap 802-1x.phase2-auth mschapv2 \
  802-1x.identity alice 802-1x.anonymous-identity anonymous@corp.exemple.fr \
  802-1x.ca-cert /etc/ssl/certs/corp-ca.pem 802-1x.domain-suffix-match radius.corp.exemple.fr \
  802-1x.password-flags 2
```

## Dépannage EAP

| Symptôme (radiusd -X) | Cause |
| --- | --- |
| Plusieurs Access-Challenge puis plus rien | Le client rejette le certificat serveur (AC non approuvée, nom non conforme) — regarder le journal du client |
| `TLS Alert read:fatal:unknown CA` | Le client ne connaît pas l'AC du serveur |
| `TLS Alert write:fatal:unknown CA` | Le serveur ne connaît pas l'AC du certificat client (`ca_file`) |
| `SSL routines … unsupported protocol` | Version TLS non commune (ancien client en TLS 1.0) |
| `eap_peap: The users session was previously rejected` | Échec dans le tunnel : voir les lignes `(n) inner-tunnel` |
| Paquets perdus / timeout lors de l'échange de certificats | Fragmentation IP bloquée : réduire `fragment_size`, vérifier le MTU et les pare-feu (fragments UDP) |
| `Failed to find EAP-Message` / `No EAP session matching state` | Requêtes d'une même session réparties sur plusieurs serveurs RADIUS (répartiteur sans affinité) |
