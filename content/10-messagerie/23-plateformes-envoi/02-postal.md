---
title: Postal
description: Postal, plate-forme d'envoi d'e-mails auto-hébergée (Ruby, MIT) façon SendGrid ou Mailgun — organisations et serveurs, envoi par SMTP et API HTTP, réception et routes vers des webhooks, suivi des ouvertures et clics, rebonds, listes de suppression, pools d'adresses IP ; installation avec le script postal (Docker, MariaDB, Caddy), postal.yml, DNS (SPF, DKIM, chemin de retour, MX, domaine de suivi), réputation et délivrabilité.
tags: [postal, envoi transactionnel, smtp, api, webhooks, délivrabilité, docker, mariadb]
icon: send
---

**Postal** fournit à une organisation sa propre **plate-forme d'envoi** : les applications envoient leurs e-mails transactionnels (inscriptions, factures, alertes) ou leurs campagnes par **SMTP** ou **API HTTP**, et Postal gère la file d'attente, les **rebonds**, le **suivi** (ouvertures, clics), les **webhooks** et la réception de réponses.

| Notion | Rôle |
| --- | --- |
| **Organisation** | Client ou service interne |
| **Serveur** (*mail server*) | Espace d'envoi d'une application, avec ses identifiants SMTP, clés d'API, domaines et statistiques |
| **Domaine** | Domaine d'expédition vérifié (SPF, DKIM) |
| **Route** | Que faire d'un message reçu : le renvoyer à un webhook HTTP, l'accepter, le refuser |
| **Pool d'IP** | Adresses d'envoi dédiées (séparer transactionnel et marketing) |
| **Suppression** | Adresses exclues après rebond définitif ou plainte |

## Installation

Prérequis : serveur Linux avec Docker et Docker Compose, **MariaDB**, nom d'hôte avec PTR, port 25 sortant ouvert par l'hébergeur.

```bash
sudo git clone https://github.com/postalserver/install /opt/postal/install
sudo ln -s /opt/postal/install/bin/postal /usr/bin/postal

docker run -d --name postal-mariadb -p 127.0.0.1:3306:3306 --restart always \
  -e MARIADB_DATABASE=postal -e MARIADB_ROOT_PASSWORD=MotDePasseRoot mariadb

sudo postal bootstrap postal.exemple.fr        # génère /opt/postal/config/postal.yml et le Caddyfile
sudoedit /opt/postal/config/postal.yml          # mot de passe MariaDB, nom DNS, SMTP sortant…
sudo postal initialize
sudo postal make-user                           # premier administrateur
sudo postal start
```

Caddy (proxy fourni) obtient automatiquement le certificat de l'interface web.

## DNS

| Enregistrement | Rôle |
| --- | --- |
| `A`/`AAAA` + **PTR** du serveur | Identité de l'émetteur, réputation |
| SPF du domaine (`include:spf.postal.exemple.fr`) | Autoriser Postal à envoyer |
| **DKIM** (clé publiée par Postal pour chaque domaine) | Signature des messages |
| `psrp` (*return path*) | Domaine des rebonds (adresse d'enveloppe) |
| MX `routes.postal.exemple.fr` | Réception des réponses et des rebonds |
| Domaine de **suivi** | Réécriture des liens et pixel d'ouverture |
| **DMARC** | Politique du domaine d'expédition |

L'interface indique pour chaque domaine les valeurs exactes et vérifie leur présence.

## Envoyer

```bash
# SMTP : identifiants créés dans le serveur Postal (Credentials)
swaks --server postal.exemple.fr --port 25 -tls --auth-user org/serveur --auth-password CLE \
  --from noreply@exemple.fr --to alice@exemple.org

# API HTTP
curl -s -X POST https://postal.exemple.fr/api/v1/send/message \
  -H "X-Server-API-Key: CLE_API" -H "Content-Type: application/json" \
  -d '{"to":["alice@exemple.org"],"from":"noreply@exemple.fr","subject":"Test","plain_body":"Bonjour"}'
```

## Exploitation

```bash
sudo postal status ; sudo postal logs ; sudo postal stop ; sudo postal start
sudo postal upgrade                              # mise à jour (lire les notes de version)
```

- **Réputation** : chauffer progressivement une nouvelle IP, surveiller les rebonds et les plaintes, inscrire le domaine aux programmes des grands fournisseurs (Google Postmaster, Microsoft SNDS).
- **Webhooks** : recevoir dans l'application les événements (remis, rebond, ouvert, cliqué) pour mettre à jour ses données.
- Pour les **newsletters**, un gestionnaire de listes comme Listmonk peut envoyer via Postal (voir [[25-listes-newsletters/01-listmonk-phplist|Listmonk et phpList]]).

Voir aussi : [[01-haraka|Haraka]] et la page SPF, DKIM et DMARC du wiki. Commandes : [[90-aide-memoire|aide-mémoire]].
