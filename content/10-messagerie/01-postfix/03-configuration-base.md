---
title: "Configuration de base : envoi, relais interne, smarthost"
description: Paramètres essentiels de main.cf (identité, domaines locaux, interfaces, réseaux de confiance, tailles), serveur qui envoie seulement (null client), relais interne pour applications et imprimantes, relais via un smarthost avec authentification SASL et TLS (fournisseur, Microsoft 365), alias et adresses d'expédition.
tags: [postfix, main.cf, relayhost, smarthost, sasl, null client, relais, aliases]
icon: settings-2
---

## Paramètres essentiels

```postfix /etc/postfix/main.cf
# Identité
myhostname = mx1.exemple.fr
mydomain = exemple.fr
myorigin = $mydomain                       # domaine ajouté aux adresses locales (root → root@exemple.fr)
smtpd_banner = $myhostname ESMTP

# Écoute
inet_interfaces = all
inet_protocols = ipv4, ipv6                # « ipv4 » si l'IPv6 n'a pas de PTR correct

# Domaines livrés localement (comptes Unix) — vide pour un serveur de boîtes virtuelles
mydestination = $myhostname, localhost.$mydomain, localhost

# Clients autorisés à relayer sans authentification
mynetworks = 127.0.0.0/8 [::1]/128

# Limites
message_size_limit = 52428800              # 50 Mio
mailbox_size_limit = 0
recipient_delimiter = +                    # alice+lettres@exemple.fr → boîte d'alice

# Compatibilité (valeurs par défaut sûres des versions récentes)
compatibility_level = 3.6
```

| Paramètre | Rôle |
| --- | --- |
| `myhostname` | Nom annoncé en `HELO` : doit correspondre au PTR |
| `mydestination` | Domaines « locaux » (livraison aux comptes Unix) |
| `mynetworks` | Réseaux de confiance (relais sans authentification) : **le plus restreint possible** |
| `relayhost` | Relais par lequel passe tout le courrier sortant |
| `inet_interfaces` | Interfaces d'écoute (`loopback-only` pour un serveur qui n'accepte rien du réseau) |

## Scénario 1 : serveur qui envoie seulement (null client)

Serveur applicatif ou d'infrastructure qui doit envoyer des alertes, sans recevoir de courrier.

```postfix /etc/postfix/main.cf
myhostname = srv-app01.corp.exemple.fr
myorigin = corp.exemple.fr
inet_interfaces = loopback-only
mydestination =
relayhost = [relais.corp.exemple.fr]:25
local_transport = error:livraison locale désactivée
```

```bash
echo "Test d'alerte" | mail -s "Test $(hostname)" admin@exemple.fr
```

Les crochets `[ ]` désactivent la recherche MX : le nom est résolu directement en A/AAAA.

## Scénario 2 : relais interne (applications, imprimantes, scanners)

```postfix /etc/postfix/main.cf
inet_interfaces = all
mynetworks = 127.0.0.0/8, 10.0.20.0/24, 10.0.50.10/32
smtpd_relay_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_unauth_destination
relayhost = [mx1.exemple.fr]:25           # ou envoi direct vers Internet
smtpd_tls_security_level = may
```

> [!WARNING]
> Un `mynetworks` trop large (tout `10.0.0.0/8`) transforme le serveur en **relais ouvert interne** : un poste compromis peut envoyer du spam en votre nom. Listez précisément les équipements, ou exigez une authentification SASL.

## Scénario 3 : relais via un smarthost authentifié

```postfix /etc/postfix/main.cf
relayhost = [smtp.fournisseur.fr]:587
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = lmdb:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_sasl_tls_security_options = noanonymous
smtp_tls_security_level = encrypt          # jamais d'authentification en clair
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

```text /etc/postfix/sasl_passwd
[smtp.fournisseur.fr]:587    compte@exemple.fr:MotDePasse
```

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
sudo postfix reload
```

### Cas de Microsoft 365

| Méthode | Remarque |
| --- | --- |
| **Connecteur entrant par IP ou certificat** (Exchange Online) | Recommandé : Postfix relaie vers `<domaine>.mail.protection.outlook.com:25` sans mot de passe, le connecteur reconnaît l'IP publique ou le certificat TLS |
| SMTP AUTH (`smtp.office365.com:587`) | Authentification de base en cours de retrait par Microsoft : à éviter pour de nouveaux déploiements |

```postfix
relayhost = [exemple-fr.mail.protection.outlook.com]:25
smtp_tls_security_level = encrypt
```

## Alias et adresses

```text /etc/aliases
postmaster: root
abuse:      root
root:       admin-systeme@exemple.fr
```

```bash
sudo newaliases
```

```postfix /etc/postfix/main.cf (réécrire l'expéditeur des messages système)
sender_canonical_maps = regexp:/etc/postfix/expediteur_canonique
```

```text /etc/postfix/expediteur_canonique
/^(root|www-data|nagios)@.*$/   alertes-noreply@exemple.fr
```

Les adresses `postmaster@` et `abuse@` doivent exister pour chaque domaine (RFC 5321 / bonnes pratiques).

## Vérifier

```bash
sudo postconf -n
sudo postfix check
swaks --to admin@exemple.fr --server 127.0.0.1          # outil de test SMTP
sudo tail -f /var/log/mail.log
```
