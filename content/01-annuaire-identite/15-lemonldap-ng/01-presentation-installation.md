---
title: Présentation, installation et configuration
description: LemonLDAP::NG — portail SSO web open source (Gendarmerie nationale, Worteks, OW2), protocoles (CAS, SAML 2, OpenID Connect, en-têtes HTTP via agents Nginx/Apache), backends d'authentification (LDAP, Active Directory, Kerberos, base SQL, second facteur TOTP/WebAuthn/OTP par e-mail), installation sur Debian/Ubuntu et RHEL, configuration par le Manager, protection d'une application par en-têtes, fournisseur OIDC, sessions, journalisation et sécurité.
tags: [lemonldap-ng, sso, cas, saml, oidc, portail, ldap, active directory]
icon: info
---

**LemonLDAP::NG** (GPL, consortium OW2) est un **portail d'authentification unique** très utilisé dans l'administration française : il fédère l'authentification (LDAP, Active Directory, Kerberos, base SQL, autre IdP) et la redistribue aux applications par **en-têtes HTTP** (agents *Handler* pour Nginx/Apache), **CAS**, **SAML 2** ou **OpenID Connect**, avec contrôle d'accès par règles et second facteur.

| Composant | Rôle | URL type |
| --- | --- | --- |
| **Portal** | Page de connexion, menu des applications, MFA | `https://auth.corp.exemple.fr` |
| **Manager** | Interface web de configuration | `https://manager.corp.exemple.fr` |
| **Handler** | Agent dans le serveur web protégeant les applications (contrôle, en-têtes) | — |
| Sessions | Fichiers, base SQL, Redis, LDAP (partagées entre plusieurs serveurs) | — |

## Installation

```bash
# Debian / Ubuntu : dépôt officiel LemonLDAP::NG
curl -fsSL https://lemonldap-ng.org/_media/rpm-gpg-key-ow2 | sudo gpg --dearmor -o /usr/share/keyrings/lemonldap-ng.gpg
echo "deb [signed-by=/usr/share/keyrings/lemonldap-ng.gpg] https://lemonldap-ng.org/deb 2.0 main" | sudo tee /etc/apt/sources.list.d/lemonldap-ng.list
sudo apt update && sudo apt install lemonldap-ng lemonldap-ng-nginx      # ou lemonldap-ng-apache2
# RHEL / Rocky / Alma : dépôt rpm de lemonldap-ng.org, puis : sudo dnf install lemonldap-ng lemonldap-ng-nginx
sudo sed -i 's/example\.com/corp.exemple.fr/g' /etc/lemonldap-ng/* /var/lib/lemonldap-ng/conf/lmConf-1.json /etc/nginx/sites-available/*
sudo systemctl restart nginx lemonldap-ng-fastcgi-server
```

Comptes de démonstration (`dwho` / `dwho`) à supprimer : *Manager → General Parameters → Authentication* → passer du module *Demo* à **LDAP** ou **Active Directory**.

## Authentification Active Directory

*Manager → General Parameters → Authentication parameters* : module **Active Directory** ; *LDAP parameters* : serveur `ldaps://dc01.corp.exemple.fr`, base, compte de liaison, filtre (`(&(sAMAccountName=$user)(objectClass=person))`), attributs exportés (`mail`, `cn`, `memberOf`). Second facteur : *Second factors* → TOTP, WebAuthn, OTP par e-mail, avec règle d'activation (ex. `$groups =~ /admins/`).

## Protéger une application par en-têtes

*Virtual Hosts → Ajouter* `appli.corp.exemple.fr` : règles d'accès (`default` → `$groups =~ /\bcompta\b/`, `^/admin` → `$uid eq "alice"`), en-têtes envoyés (`Auth-User` → `$uid`, `Auth-Mail` → `$mail`). Côté Nginx :

```nginx /etc/nginx/sites-available/appli.conf
server {
  listen 443 ssl;
  server_name appli.corp.exemple.fr;
  location = /lmauth {
    internal;
    include /etc/nginx/fastcgi_params;
    fastcgi_pass unix:/run/llng-fastcgi-server/llng-fastcgi.sock;
    fastcgi_param VHOSTTYPE Main;
    fastcgi_pass_request_body off;
    fastcgi_param CONTENT_LENGTH "";
    fastcgi_param HOST $http_host;
    fastcgi_param X_ORIGINAL_URI $original_uri;
  }
  location / {
    set $original_uri $uri$is_args$args;
    auth_request /lmauth;
    auth_request_set $lmremote_user $upstream_http_lm_remote_user;
    auth_request_set $lmlocation $upstream_http_location;
    error_page 401 $lmlocation;
    # En-têtes définis dans le Manager, transmis à l'application
    auth_request_set $authuser $upstream_http_auth_user;
    auth_request_set $authmail $upstream_http_auth_mail;
    proxy_set_header Auth-User $authuser;
    proxy_set_header Auth-Mail $authmail;
    proxy_pass http://10.0.30.15:8080;
  }
}
```

## Fournisseur OIDC ou SAML

*Issuer modules* : activer **OpenID Connect** (clés générées dans le Manager), puis *OpenID Connect Relying Parties → Ajouter* (identifiant client, secret, URI de redirection, attributs exportés) ; idem **SAML** (métadonnées du SP) ou **CAS**.

## Exploitation

- Configuration stockée en JSON (`/var/lib/lemonldap-ng/conf/lmConf-N.json`, versionnée) ou en base pour plusieurs serveurs.
- Journaux : syslog/journald (`journalctl -u lemonldap-ng-fastcgi-server`), niveau dans *General Parameters → Logs*.
- Sessions et notifications : *Manager → Sessions* (déconnexion forcée), explorateur de sessions persistantes.

Interface : [[03-interface-graphique|Manager et portail]] · commandes : [[90-aide-memoire|aide-mémoire]].
