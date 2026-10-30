---
title: Relais, routage et réécritures avancées
description: Passerelle de messagerie devant Exchange ou Microsoft 365 (relay_domains, transport_maps), relais par expéditeur avec authentification dédiée, réécriture d'adresses (canonical, generic), modification et suppression d'en-têtes, copie et archivage (recipient_bcc_maps), choix de l'IP d'envoi, maîtrise du débit vers les grands fournisseurs, et instances multiples.
tags: [postfix, transport_maps, relay_domains, passerelle, exchange, microsoft 365, canonical, header_checks, postmulti]
icon: route
---

## Passerelle devant Exchange ou Microsoft 365

```mermaid
flowchart LR
  I[Internet] -- ":25" --> G["Passerelle Postfix<br/>postscreen + Rspamd"]
  G -- "transport_maps" --> EX["Exchange interne<br/>exchange.corp.exemple.fr"]
  EX -- "connecteur d'envoi" --> G
  G --> I
```

```postfix /etc/postfix/main.cf
relay_domains = exemple.fr, filiale.exemple.fr
relay_recipient_maps = lmdb:/etc/postfix/destinataires_valides
transport_maps = lmdb:/etc/postfix/transport
mynetworks = 127.0.0.0/8, 10.0.10.25/32       # serveur Exchange autorisé à relayer vers Internet
```

```text /etc/postfix/transport
exemple.fr            smtp:[exchange.corp.exemple.fr]:25
filiale.exemple.fr    smtp:[10.40.0.25]:25
.exemple.fr           smtp:[exchange.corp.exemple.fr]:25
```

```bash
sudo postmap /etc/postfix/transport /etc/postfix/destinataires_valides && sudo postfix reload
```

La liste des destinataires valides peut être générée depuis l'annuaire (requête LDAP sur `proxyAddresses`) ou remplacée par `reject_unverified_recipient`.

## Relais par expéditeur

Envoyer via des relais différents selon le domaine ou l'adresse d'expédition (ex. un domaine via Microsoft 365, un autre via un routeur de campagnes) :

```postfix
sender_dependent_relayhost_maps = lmdb:/etc/postfix/relais_par_expediteur
smtp_sender_dependent_authentication = yes
smtp_sasl_password_maps = lmdb:/etc/postfix/sasl_passwd
```

```text /etc/postfix/relais_par_expediteur
@exemple.fr               [exemple-fr.mail.protection.outlook.com]:25
@newsletter.exemple.fr    [smtp.routeur-campagnes.fr]:587
```

```text /etc/postfix/sasl_passwd
@newsletter.exemple.fr    compte-api:CleSecrete
```

## Réécriture d'adresses

| Paramètre | Portée | Exemple d'usage |
| --- | --- | --- |
| `canonical_maps` | Expéditeur et destinataire, enveloppe et en-têtes | Normaliser `prenom.nom` |
| `sender_canonical_maps` | Expéditeur seulement | `root@srv` → `alertes@exemple.fr` |
| `recipient_canonical_maps` | Destinataire seulement | Migration de domaine |
| `smtp_generic_maps` | À la sortie vers Internet uniquement | Adresses internes `@corp.local` → domaine public |
| `masquerade_domains` | Supprime les sous-domaines | `alice@srv1.exemple.fr` → `alice@exemple.fr` |

```text /etc/postfix/generic
@corp.local                 noreply@exemple.fr
app01@srv-app01.corp.local  app01@exemple.fr
```

## Modifier les en-têtes

```postfix
header_checks = pcre:/etc/postfix/header_checks
smtp_header_checks = pcre:/etc/postfix/smtp_header_checks
```

```text /etc/postfix/smtp_header_checks
# Ne pas divulguer les adresses internes ni le client de l'utilisateur dans les messages sortants
/^Received:.*with ESMTPSA/      IGNORE
/^X-Originating-IP:/            IGNORE
/^User-Agent:/                  IGNORE
/^X-Mailer:/                    IGNORE
```

| Action | Effet |
| --- | --- |
| `IGNORE` | Supprime l'en-tête |
| `REPLACE nouvel-en-tête` | Remplace |
| `PREPEND en-tête` | Ajoute un en-tête |
| `REJECT texte` / `DISCARD` | Rejette / supprime le message |
| `HOLD` | Met en file `hold` (examen manuel) |
| `REDIRECT adresse` | Redirige le message |

## Copie et archivage

```postfix
recipient_bcc_maps = lmdb:/etc/postfix/copie_destinataires
sender_bcc_maps = lmdb:/etc/postfix/copie_expediteurs
# always_bcc = archive@exemple.fr         # tout le courrier (archivage légal)
```

```text /etc/postfix/copie_expediteurs
direction@exemple.fr    archive-direction@exemple.fr
```

L'archivage systématique doit respecter le droit du travail et le RGPD (information des salariés, durée de conservation).

## Choisir l'IP d'envoi et le débit

```mastercf /etc/postfix/master.cf (transports dédiés)
smtp-ip2   unix  -       -       y       -       -       smtp
  -o smtp_bind_address=203.0.113.26
  -o smtp_helo_name=mx2.exemple.fr
lent       unix  -       -       y       -       -       smtp
  -o syslog_name=postfix/lent
```

```postfix /etc/postfix/main.cf
lent_destination_concurrency_limit = 2
lent_destination_rate_delay = 1s
```

```text /etc/postfix/transport (extrait)
outlook.com      lent:
hotmail.com      lent:
```

Les grands fournisseurs limitent le débit des expéditeurs dont la réputation est jeune : étalez les envois de masse, réchauffez progressivement une nouvelle IP.

## Instances multiples

`postmulti` gère plusieurs instances Postfix sur un même serveur (ex. une instance d'entrée et une de sortie, ou une instance dédiée aux envois en masse) :

```bash
sudo postmulti -e init
sudo postmulti -I postfix-sortie -G mta -e create
sudo postmulti -i postfix-sortie -e enable
sudo postmulti -l
sudo postmulti -i postfix-sortie -x postconf -n
```
