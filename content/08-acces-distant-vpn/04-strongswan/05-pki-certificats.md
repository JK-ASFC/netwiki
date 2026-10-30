---
title: PKI et certificats pour IPsec
description: Créer une AC VPN avec l'outil pki de strongSwan (ECDSA ou RSA), certificats de passerelle (SAN, EKU serverAuth et ikeIntermediate), certificats utilisateurs et export PKCS#12, révocation (CRL, OCSP), intégration avec AD CS et Let's Encrypt, identités IKE et contraintes.
tags: [strongswan, pki, certificats, x509, crl, ocsp, adcs, letsencrypt]
icon: badge-check
---

## AC dédiée au VPN avec `pki`

```bash
cd ~/pki-vpn && umask 077
# Clé et certificat auto-signé de l'AC (10 ans)
pki --gen --type ecdsa --size 384 --outform pem > ac-vpn.key
pki --self --ca --lifetime 3650 --in ac-vpn.key --type ecdsa \
    --dn "C=FR, O=Exemple, CN=AC VPN Exemple" --outform pem > ac-vpn.crt
```

> [!TIP]
> **ECDSA P-384** est pris en charge par Windows 10/11, macOS/iOS et Android récents. Pour des équipements anciens, utilisez **RSA 3072** (`--type rsa --size 3072`). Conservez la clé de l'AC hors ligne (ou au moins hors de la passerelle).

## Certificat de la passerelle

```bash
pki --gen --type ecdsa --size 384 --outform pem > vpn.exemple.fr.key
pki --pub --in vpn.exemple.fr.key --type ecdsa | \
pki --issue --lifetime 825 --cacert ac-vpn.crt --cakey ac-vpn.key \
    --dn "C=FR, O=Exemple, CN=vpn.exemple.fr" \
    --san vpn.exemple.fr --san 203.0.113.10 \
    --flag serverAuth --flag ikeIntermediate \
    --crl http://pki.exemple.fr/ac-vpn.crl \
    --outform pem > vpn.exemple.fr.crt

pki --print --in vpn.exemple.fr.crt           # vérifier SAN, EKU, validité
```

```bash
sudo install -m 644 ac-vpn.crt          /etc/swanctl/x509ca/
sudo install -m 644 vpn.exemple.fr.crt  /etc/swanctl/x509/
sudo install -m 600 vpn.exemple.fr.key  /etc/swanctl/private/
sudo swanctl --load-creds
sudo swanctl --list-certs
```

| Élément | Exigence |
| --- | --- |
| **SAN** | Le nom (et éventuellement l'IP) que les clients et pairs utilisent ; l'`id` de la connexion doit y figurer |
| **EKU** | `serverAuth` (Windows) ; `ikeIntermediate` (anciens macOS) ; les deux ne gênent pas |
| Durée | ≤ 825 jours pour les clients Apple ; plus court si renouvellement automatisé |
| Point de distribution CRL / OCSP | Facultatif mais nécessaire pour révoquer |

## Certificats de pairs (site à site)

Chaque site reçoit son propre certificat (SAN = son FQDN, `--flag serverAuth --flag clientAuth`). Côté connexion :

```swanctl
remote {
    auth = pubkey
    id = lyon.exemple.fr          # identité attendue (SAN du certificat du pair)
    cacerts = ac-vpn.crt          # contrainte : émis par cette AC uniquement
}
```

## Certificats utilisateurs

```bash
pki --gen --type ecdsa --size 256 --outform pem > alice.key
pki --pub --in alice.key --type ecdsa | \
pki --issue --lifetime 365 --cacert ac-vpn.crt --cakey ac-vpn.key \
    --dn "C=FR, O=Exemple, CN=alice@exemple.fr" --san alice@exemple.fr \
    --flag clientAuth --outform pem > alice.crt

# Paquet PKCS#12 pour Windows, macOS, iOS, Android
openssl pkcs12 -export -inkey alice.key -in alice.crt -certfile ac-vpn.crt \
    -name "VPN Alice" -out alice.p12
# Anciens systèmes (macOS < 12, Android anciens) : ajouter -legacy
```

Sous Windows, importer le `.p12` dans le magasin **Utilisateur** (EAP-TLS utilisateur) ou **Ordinateur** (tunnel machine, `-AuthenticationMethod MachineCertificate`).

## Révocation

```bash
# Révoquer le certificat d'Alice et publier la CRL (validité 15 jours par défaut)
pki --signcrl --cacert ac-vpn.crt --cakey ac-vpn.key \
    --reason key-compromise --cert alice.crt \
    --lifetime 30 --outform pem > ac-vpn.crl
# CRL suivante : ajouter --lastcrl ac-vpn.crl pour conserver les révocations précédentes
sudo install -m 644 ac-vpn.crl /etc/swanctl/x509crl/
sudo swanctl --load-creds
```

| Mécanisme | Mise en œuvre |
| --- | --- |
| CRL locale | Fichier dans `/etc/swanctl/x509crl/` : simple, efficace pour une AC dédiée |
| CRL publiée (HTTP) | URL dans le certificat (`--crl`) ; strongSwan la télécharge et la met en cache |
| OCSP | URL `--ocsp` dans le certificat ; répondeur OCSP de la PKI |
| Politique | `remote { revocation = strict }` (refuser si l'état est inconnu) ou `ifuri` (strict seulement si une URL est présente) |

> [!IMPORTANT]
> Sans CRL ni OCSP, un certificat volé reste valable jusqu'à son expiration. Pour un accès distant par certificat, prévoyez la révocation dès le départ, ou une **AC dédiée** dont chaque certificat a une durée courte.

## Avec AD CS

- Modèle *IPSec* ou duplicata de *Serveur Web* avec les EKU **Authentification du serveur** + **IP security IKE intermediate** pour la passerelle ; demande depuis Linux par CSR (`pki --req`) puis `certreq -submit`.
- Modèle utilisateur/ordinateur avec **Authentification du client** et **auto-enrôlement** par GPO pour EAP-TLS.
- L'AC racine d'entreprise est déjà approuvée par les postes du domaine.

Voir [[01-active-directory/10-adcs-pki|AD CS et PKI]].

```bash
pki --req --type priv --in vpn.exemple.fr.key \
    --dn "C=FR, O=Exemple, CN=vpn.exemple.fr" --san vpn.exemple.fr --outform pem > vpn.exemple.fr.csr
```

## Avec Let's Encrypt

Pour l'accès distant **par mot de passe** (EAP), un certificat public évite de distribuer l'AC aux clients.

```bash /etc/letsencrypt/renewal-hooks/deploy/strongswan.sh
#!/bin/sh
# Copier le certificat renouvelé vers strongSwan et recharger
[ "$RENEWED_LINEAGE" = "/etc/letsencrypt/live/vpn.exemple.fr" ] || exit 0
install -m 644 "$RENEWED_LINEAGE/cert.pem"    /etc/swanctl/x509/vpn.exemple.fr.crt
install -m 644 "$RENEWED_LINEAGE/chain.pem"   /etc/swanctl/x509ca/le-intermediaire.crt
install -m 600 "$RENEWED_LINEAGE/privkey.pem" /etc/swanctl/private/vpn.exemple.fr.key
swanctl --load-creds
```

L'intermédiaire placé dans `x509ca/` permet de transmettre la chaîne aux clients. Avec une AC publique, **ne l'utilisez pas** pour authentifier des pairs (`cacerts`) : n'importe quel détenteur d'un certificat de cette AC serait accepté.

## Identités IKE

| Forme de l'`id` | Exemple | Correspond à |
| --- | --- | --- |
| FQDN | `vpn.exemple.fr` | SAN DNS |
| Adresse e-mail | `alice@exemple.fr` | SAN e-mail (RFC 822) |
| Adresse IP | `203.0.113.10` | SAN IP |
| DN | `"C=FR, O=Exemple, CN=vpn.exemple.fr"` | Sujet du certificat |
| Joker | `*@exemple.fr`, `%any` | Toute identité correspondante |

Erreur typique : `constraint check failed: identity 'X' required` → l'`id` configuré n'apparaît pas dans le certificat présenté.
