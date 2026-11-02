---
title: Interface graphique
description: Interface de Zulip — vues (Boîte de réception, Messages récents, fils combinés), canaux et sujets, rédaction et réponse dans un sujet, raccourcis clavier, recherche avec opérateurs, paramètres de l'organisation (utilisateurs, rôles, invitations, canaux par défaut, authentification, émojis, intégrations, robots) et équivalents manage.py.
tags: [zulip, interface web, canaux, sujets, administration]
icon: monitor
---

Accès : `https://chat.corp.exemple.fr` (navigateur, client de bureau ou mobile).

## Lire et écrire

| Zone | Contenu |
| --- | --- |
| Barre de gauche | Vues (**Boîte de réception**, **Messages récents**, Mentions, Favoris), puis canaux et leurs sujets |
| Zone centrale | Messages regroupés par canal **et sujet** |
| Barre de droite | Utilisateurs en ligne, statuts |
| Rédaction (bas) | Choix du canal **et du sujet**, Markdown, LaTeX, fichiers, sondages, appels vidéo (Jitsi, Zoom, BigBlueButton) |

<!-- CAPTURE: Boîte de réception avec canaux et sujets non lus | _assets/zulip-boite-reception.png -->

- Répondre dans le bon sujet : cliquer sur un message puis `r` ; changer de sujet si la conversation dérive (les administrateurs et auteurs peuvent **déplacer** des messages vers un autre sujet ou canal).
- Raccourcis : `n` sujet non lu suivant, `c` nouveau sujet, `/` recherche, `?` aide des raccourcis.
- Recherche : opérateurs `channel:infra topic:sauvegardes sender:jk@corp.exemple.fr has:attachment`.

## Administration de l'organisation

Engrenage → **Paramètres de l'organisation** (propriétaires et administrateurs).

| Section | Usage | Équivalent serveur |
| --- | --- | --- |
| Utilisateurs | Désactiver, changer de rôle (Propriétaire, Administrateur, Modérateur, Membre, Invité) | `manage.py deactivate_user`, `manage.py change_user_role` |
| Invitations | Liens et courriels d'invitation, domaines autorisés | — |
| Canaux par défaut | Canaux rejoints automatiquement par les nouveaux membres | — |
| Authentification | Méthodes activées (courriel, LDAP, SAML, OIDC…) | `AUTHENTICATION_BACKENDS` dans `settings.py` |
| Permissions de l'organisation | Qui crée des canaux, invite, modifie ou supprime des messages | — |
| Émojis, liens automatiques (*linkifiers*) | Lier `INC-1234` à l'outil de tickets | — |
| Robots, intégrations | Webhooks entrants (Grafana, GitLab, Alertmanager…), robots | — |

<!-- CAPTURE: Paramètres de l'organisation, section Utilisateurs | _assets/zulip-parametres-utilisateurs.png -->

### Intégrations

*Paramètres personnels → Robots → Ajouter un robot* (type « Webhook entrant ») donne une adresse à coller dans l'outil émetteur. Exemple d'envoi par l'API avec un robot générique :

```bash
curl -s -X POST https://chat.corp.exemple.fr/api/v1/messages -u supervision-bot@chat.corp.exemple.fr:CLE_API_DU_ROBOT -d type=stream -d to=infra -d topic=alertes --data-urlencode 'content=Disque à 92 % sur srv-web-01'
```
