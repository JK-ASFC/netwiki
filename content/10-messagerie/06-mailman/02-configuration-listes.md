---
title: Intégration Postfix, listes, modération et DMARC
description: Raccorder Mailman 3 à Postfix (LMTP, tables générées postfix_lmtp et postfix_domains, domaine dédié aux listes), créer et administrer des listes (ligne de commande et Postorius), types de listes, politiques d'abonnement et de modération, rebonds, archives privées ou publiques, atténuation DMARC et signature ARC, envoi des courriels de l'interface web.
tags: [mailman, postfix, lmtp, listes, modération, dmarc, arc, postorius, hyperkitty]
icon: settings-2
---

## Intégration Postfix

```text /etc/mailman3/mailman.cfg (section MTA)
[mta]
incoming: mailman.mta.postfix.LMTP
outgoing: mailman.mta.deliver.deliver
lmtp_host: 127.0.0.1
lmtp_port: 8024
smtp_host: 127.0.0.1
smtp_port: 25
configuration: python:mailman.config.postfix
```

Mailman génère deux tables pour Postfix dans son répertoire de données :

| Table | Contenu |
| --- | --- |
| `postfix_lmtp` | Adresses des listes (et `-request`, `-bounces`, `-owner`…) → `lmtp:[127.0.0.1]:8024` |
| `postfix_domains` | Domaines de listes |

```postfix /etc/postfix/main.cf
recipient_delimiter = +
unknown_local_recipient_reject_code = 550
owner_request_special = no
transport_maps = hash:/var/lib/mailman3/data/postfix_lmtp
local_recipient_maps = proxy:unix:passwd.byname $alias_maps hash:/var/lib/mailman3/data/postfix_lmtp
relay_domains = hash:/var/lib/mailman3/data/postfix_domains
```

> [!TIP]
> Utilisez un **sous-domaine dédié** aux listes (`listes.exemple.fr`) : il ne doit figurer ni dans `mydestination` ni dans `virtual_mailbox_domains`, et il simplifie SPF, DKIM et DMARC. Ajoutez son enregistrement MX.

```bash
sudo -u list mailman aliases              # régénérer les tables (Debian : utilisateur « list »)
sudo postfix reload
```

## Créer et gérer des listes

```bash
sudo -u list mailman create -o responsable@exemple.fr equipe-reseau@listes.exemple.fr
sudo -u list mailman lists
printf 'alice@exemple.fr\nbob@exemple.fr\n' > /tmp/abonnes.txt
sudo -u list mailman addmembers /tmp/abonnes.txt equipe-reseau@listes.exemple.fr
sudo -u list mailman members equipe-reseau@listes.exemple.fr
sudo -u list mailman delmembers -l equipe-reseau@listes.exemple.fr -m bob@exemple.fr
sudo -u list mailman remove equipe-reseau@listes.exemple.fr        # supprimer la liste
```

La gestion courante se fait dans **Postorius** (propriétaires et modérateurs y ont leurs droits).

## Types de listes et politiques

| Réglage (Postorius) | Choix courants |
| --- | --- |
| Style de liste | *Discussion* (tous les abonnés écrivent) / *Annonce* (seuls les propriétaires/modérateurs) |
| Politique d'abonnement | *Confirmer* (lien envoyé) / *Modérer* / *Confirmer puis modérer* |
| Action par défaut des abonnés | Accepter / Retenir (modération) |
| Action pour les **non-abonnés** | **Retenir** (évite le spam) ou rejeter |
| Taille maximale | Limite des messages (Ko) |
| Pièces jointes | Filtrage du contenu (types MIME autorisés, conversion HTML → texte) |
| Archives | Publiques / privées (abonnés) / désactivées |
| Réponses | `Reply-To` vers la liste ou l'auteur |

## Modération

- Messages retenus : notification aux modérateurs, traitement dans Postorius (*Accepter*, *Rejeter*, *Ignorer*, *Accepter et autoriser l'expéditeur*).
- Règles de **non-abonnés acceptés** (adresses ou expressions régulières) pour les outils automatiques.
- Rspamd en amont filtre déjà la majorité du spam reçu par les adresses de listes.

## Rebonds

Mailman suit les adresses en erreur (VERP) et désactive puis désabonne les adresses qui rebondissent durablement (*Score de rebond*, *Seuil*, *Avertissements*). Laissez ce traitement actif pour protéger la réputation du domaine.

## DMARC et ARC

Une liste redistribue des messages dont le `From:` appartient à d'autres domaines : si ces domaines publient `p=reject`, les destinataires rejettent le message redistribué (SPF et souvent DKIM cassés).

| Réglage d'atténuation DMARC | Effet |
| --- | --- |
| *Remplacer le From: par l'adresse de la liste* (munge From) | `From: Alice via Equipe <equipe@listes.exemple.fr>` : toujours délivrable |
| *Encapsuler le message* | Message d'origine joint |
| Inconditionnel | Appliquer même aux domaines sans politique stricte |

```text /etc/mailman3/mailman.cfg (signature ARC)
[ARC]
enabled: yes
authserv_id: listes.exemple.fr
trusted_authserv_ids: mx1.exemple.fr
privkey: /etc/mailman3/arc/listes.exemple.fr.key
selector: arc2025
domain: listes.exemple.fr
```

Signez aussi les messages sortants en DKIM pour `listes.exemple.fr` (Rspamd ou OpenDKIM) et publiez SPF/DMARC pour ce domaine — voir [[01-postfix/06-spf-dkim-dmarc|SPF, DKIM et DMARC]].

## Courriels de l'interface web

Postorius et HyperKitty envoient des confirmations (inscription, mot de passe) via les paramètres Django :

```python /etc/mailman3/mailman-web.py (extrait)
EMAIL_HOST = 'localhost'
EMAIL_PORT = 25
DEFAULT_FROM_EMAIL = 'listes-admin@listes.exemple.fr'
SERVER_EMAIL = 'listes-admin@listes.exemple.fr'
ALLOWED_HOSTS = ['listes.exemple.fr', 'localhost']
MAILMAN_ARCHIVER_KEY = 'CleArchivageLongue'          # identique à api_key de mailman-hyperkitty.cfg
```

Après modification : `systemctl restart mailman3-web`.
