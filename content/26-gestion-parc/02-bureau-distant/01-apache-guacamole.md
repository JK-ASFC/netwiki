---
title: Apache Guacamole
description: Passerelle de bureau distant sans client (Apache 2.0) — accès RDP, VNC, SSH, Telnet et Kubernetes depuis un simple navigateur HTML5 ; architecture guacd et application web, installation Docker Compose avec PostgreSQL (initdb.sh, variables POSTGRESQL_* et GUACD_HOSTNAME), compte guacadmin, connexions et groupes, partage de session, enregistrement, double authentification TOTP, LDAP/Active Directory, OpenID Connect, reverse proxy Nginx avec WebSocket et durcissement.
tags: [guacamole, bureau distant, rdp, vnc, ssh, bastion, html5, docker]
icon: monitor-smartphone
---

**Apache Guacamole** affiche dans le navigateur des bureaux **RDP** (Windows, [[02-rdp-freerdp-xrdp-remmina|xrdp]]), **VNC** et des terminaux **SSH**, sans rien installer sur le poste client. Placé derrière HTTPS et une double authentification, il remplace l'exposition directe des ports 3389 ou 5900 et sert de **bastion** simple : les identifiants des serveurs restent dans Guacamole, les sessions peuvent être enregistrées.

| Composant | Rôle |
| --- | --- |
| **guacd** | Démon qui parle RDP (FreeRDP), VNC, SSH ; port 4822 |
| **guacamole** (application web Java/Tomcat) | Interface, authentification, protocole Guacamole vers le navigateur ; port 8080 |
| **Base** (PostgreSQL, MySQL/MariaDB, SQL Server) | Utilisateurs, connexions, droits, historique |

Serveur : Linux (Docker recommandé, ou compilation de guacd + Tomcat). Clients : tout navigateur récent (Windows, Linux, macOS, tablettes).

## Installation Docker Compose

```bash
mkdir -p /opt/guacamole/init && cd /opt/guacamole
docker run --rm guacamole/guacamole:1.6.0 /opt/guacamole/bin/initdb.sh --postgresql > init/initdb.sql
```

```yaml
services:
  guacd:
    image: guacamole/guacd:1.6.0
    restart: unless-stopped
    volumes: ["./enregistrements:/var/lib/guacamole/recordings"]
  postgres:
    image: postgres:17
    restart: unless-stopped
    environment:
      POSTGRES_DB: guacamole_db
      POSTGRES_USER: guacamole_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - ./init:/docker-entrypoint-initdb.d:ro
      - pgdata:/var/lib/postgresql/data
  guacamole:
    image: guacamole/guacamole:1.6.0
    restart: unless-stopped
    depends_on: [guacd, postgres]
    ports: ["127.0.0.1:8080:8080"]
    environment:
      GUACD_HOSTNAME: guacd
      POSTGRESQL_HOSTNAME: postgres
      POSTGRESQL_DATABASE: guacamole_db
      POSTGRESQL_USERNAME: guacamole_user
      POSTGRESQL_PASSWORD: ${DB_PASSWORD}
      TOTP_ENABLED: "true"
      WEBAPP_CONTEXT: ROOT
    volumes: ["./enregistrements:/var/lib/guacamole/recordings"]
volumes:
  pgdata:
```

`docker compose up -d`, puis `https://guacamole.corp.exemple.fr` via le reverse proxy. Compte initial **`guacadmin` / `guacadmin`** : créer immédiatement un autre administrateur, puis supprimer ou désactiver `guacadmin`. Avec `TOTP_ENABLED`, chaque utilisateur enregistre une application d'authentification à la première connexion.

Chaque propriété de `guacamole.properties` devient une variable d'environnement en majuscules (`ldap-hostname` → `LDAP_HOSTNAME`, `openid-issuer` → `OPENID_ISSUER`) : authentification [[01-active-directory/01-presentation|Active Directory]] (LDAP_*), [[05-keycloak/01-presentation-installation|Keycloak]] (OPENID_*), etc.

## Reverse proxy (WebSocket)

```nginx
location / {
    proxy_pass http://127.0.0.1:8080/;
    proxy_buffering off;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $http_connection;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    client_max_body_size 1g;          # transferts de fichiers
}
```

Voir [[03-nginx/05-reverse-proxy-repartition|Nginx en reverse proxy]].

## Connexions

*Paramètres → Connexions → Nouvelle connexion* : protocole, nom d'hôte, port, identifiants (ou `${GUAC_USERNAME}` / `${GUAC_PASSWORD}` pour réutiliser ceux de l'utilisateur connecté), sécurité RDP (`nla`), « Ignorer le certificat du serveur » pour un certificat autosigné interne. Regrouper par **groupes de connexions** et attribuer les droits à des groupes d'utilisateurs. Options utiles : lecteur partagé (transfert de fichiers), presse-papiers désactivable, **enregistrement de session** (chemin `${HISTORY_PATH}/${HISTORY_UUID}` avec l'extension d'historique), partage d'une session en direct (lien en lecture seule ou en contrôle).

`Ctrl+Alt+Maj` ouvre le menu latéral (presse-papiers, clavier à l'écran, fichiers).

## Durcissement

- N'exposer que le reverse proxy en HTTPS ; guacd et la base restent sur le réseau Docker interne.
- TOTP ou OpenID Connect avec MFA obligatoire, verrouillage après échecs ([[01-fail2ban/01-presentation-configuration|Fail2ban]] sur les journaux du conteneur).
- Pare-feu des serveurs cibles : RDP, VNC et SSH acceptés **uniquement depuis la passerelle**.
- Sauvegarder la base PostgreSQL ([[02-postgresql/05-sauvegarde-pitr|sauvegarde]]) et les enregistrements.

Commandes : [[90-aide-memoire|aide-mémoire]].
