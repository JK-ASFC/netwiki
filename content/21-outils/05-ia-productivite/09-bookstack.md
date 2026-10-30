---
title: BookStack
description: BookStack, plateforme de documentation et wiki d'équipe auto-hébergée — organisation en étagères, livres, chapitres et pages, éditeurs WYSIWYG et Markdown, installation (Docker, script Ubuntu), configuration .env, authentification LDAP/Active Directory, SAML et OIDC, rôles et permissions, recherche, révisions, API, sauvegarde et mises à jour, sécurité.
tags: [bookstack, wiki, documentation, ldap, oidc, docker, base de connaissances]
icon: library
---

**BookStack** (MIT, PHP/Laravel) est un **wiki d'équipe** simple et structuré : la documentation est rangée comme une bibliothèque. Bien adapté à la documentation d'exploitation partagée (procédures, architectures, fiches de services), avec authentification d'entreprise et droits fins.

| Niveau | Exemple |
| --- | --- |
| **Étagère** | « Infrastructure » |
| **Livre** | « Réseau du siège » |
| **Chapitre** | « Cœur de réseau » |
| **Page** | « Remplacement d'un module SFP » |

## Installation

```yaml /srv/bookstack/compose.yaml (image LinuxServer.io)
services:
  bookstack:
    image: lscr.io/linuxserver/bookstack:latest      # épingler une version
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Paris
      APP_URL: https://doc.corp.exemple.fr
      APP_KEY: ${APP_KEY}                            # base64:… (clé de chiffrement de l'application)
      DB_HOST: db
      DB_PORT: "3306"
      DB_DATABASE: bookstack
      DB_USERNAME: bookstack
      DB_PASSWORD: ${DB_PASSWORD}
    volumes: ["./config:/config"]
    ports: ["127.0.0.1:6875:80"]
    depends_on: [db]
    restart: unless-stopped
  db:
    image: lscr.io/linuxserver/mariadb:latest
    environment:
      PUID: "1000"
      PGID: "1000"
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: bookstack
      MYSQL_USER: bookstack
      MYSQL_PASSWORD: ${DB_PASSWORD}
    volumes: ["./db:/config"]
    restart: unless-stopped
```

Le projet fournit aussi un **script d'installation** pour Ubuntu (Apache, PHP, MySQL) et une procédure manuelle (Linux, Windows avec PHP). Compte initial : `admin@admin.com` / `password` — **à changer immédiatement**.

## Authentification d'entreprise

```ini .env (extraits — LDAP vers Active Directory)
AUTH_METHOD=ldap
LDAP_SERVER=ldaps://dc01.corp.exemple.fr:636
LDAP_BASE_DN="OU=Utilisateurs,DC=corp,DC=exemple,DC=fr"
LDAP_DN="CN=svc-bookstack,OU=Services,DC=corp,DC=exemple,DC=fr"
LDAP_PASS="MotDePasseServiceLdap"
LDAP_USER_FILTER="(&(sAMAccountName={user})(memberOf=CN=GG-Documentation,OU=Groupes,DC=corp,DC=exemple,DC=fr))"
LDAP_ID_ATTRIBUTE=objectGUID
LDAP_EMAIL_ATTRIBUTE=mail
LDAP_DISPLAY_NAME_ATTRIBUTE=displayName
LDAP_USER_TO_GROUPS=true
LDAP_GROUP_ATTRIBUTE="memberOf"
LDAP_REMOVE_FROM_GROUPS=true
```

Les groupes AD sont associés aux **rôles** BookStack (champ *External Authentication IDs* du rôle). Alternatives : **SAML 2.0** ou **OIDC** ([[05-keycloak/02-federation-clients-mfa|Keycloak]], Entra ID) pour le SSO et la MFA ; MFA intégrée (TOTP) pour l'authentification locale.

## Rôles et permissions

- Rôles globaux (*Admin*, *Éditeur*, *Lecteur*) et **permissions par élément** (étagère, livre, chapitre, page) qui surchargent celles du rôle.
- Livre « Sécurité » visible seulement de l'équipe sécurité ; procédures publiques en lecture pour tout le service.

## Fonctions utiles

| Fonction | Usage |
| --- | --- |
| Éditeur WYSIWYG ou **Markdown** | Selon les préférences ; diagrammes **draw.io** intégrés |
| **Révisions** | Historique et restauration de chaque page |
| Recherche | Plein texte avec filtres (étiquettes, type, date) |
| Étiquettes | Classement transversal (`service:dhcp`, `site:lyon`) |
| Modèles de pages | Trames de procédure, de fiche de service |
| Exports | PDF, HTML, texte, Markdown |
| **API** REST | Automatiser la création de pages (inventaires générés, rapports) |
| Webhooks, journal d'audit | Notifications, traçabilité |

## Sauvegarde et mises à jour

```bash
cd /srv/bookstack
docker compose exec -T db mariadb-dump -u root -p"$DB_ROOT_PASSWORD" bookstack > sauvegarde-$(date +%F).sql
tar czf fichiers-$(date +%F).tgz config/www/uploads config/www/files config/www/.env    # pièces jointes, images, .env
```

Les mises à jour (fréquentes) appliquent les migrations au démarrage ; sauvegardez avant, lisez les notes de version.

## Sécurité

- [ ] HTTPS (reverse proxy), `APP_URL` exact ; compte administrateur initial changé ou supprimé
- [ ] Inscription publique désactivée ; SSO + MFA
- [ ] Pas de secrets dans les pages (lien vers le gestionnaire de mots de passe)
- [ ] Mises à jour régulières, sauvegardes testées
