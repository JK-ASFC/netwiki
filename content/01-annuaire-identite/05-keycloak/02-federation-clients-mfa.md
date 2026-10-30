---
title: Fédération AD, clients OIDC/SAML et MFA
description: Configurer Keycloak — royaume dédié, fédération Active Directory par LDAP (paramètres de connexion, synchronisation, correspondance des groupes), Kerberos/SPNEGO pour le SSO des postes du domaine, courtage vers Entra ID, création de clients OIDC (Grafana, GitLab, Kubernetes) et SAML, mappers de groupes, MFA (OTP, WebAuthn, passkeys) et politiques de mots de passe.
tags: [keycloak, active directory, ldap, oidc, saml, mfa, webauthn, mappers, spnego]
icon: settings-2
---

## Royaume

Créez un royaume dédié (`infra`, `entreprise`) — n'utilisez pas `master` pour les applications. Réglages initiaux : *Realm settings → General* (nom affiché), *Login* (pas d'inscription libre, réinitialisation du mot de passe selon la politique), *Email* (SMTP), *Sessions* (durées), *Security defenses* (protection contre le force brute).

## Fédération Active Directory

*User federation → Add LDAP provider* :

| Paramètre | Valeur (exemple AD) |
| --- | --- |
| Vendor | Active Directory |
| Connection URL | `ldaps://dc1.corp.exemple.fr:636 ldaps://dc2.corp.exemple.fr:636` |
| Bind DN / credentials | Compte de service en lecture (`CN=svc_keycloak,OU=Services,…`) |
| Edit mode | **READ_ONLY** (AD reste la source de vérité) |
| Users DN | `OU=Utilisateurs,DC=corp,DC=exemple,DC=fr` |
| Username LDAP attribute | `sAMAccountName` |
| RDN attribute | `cn` |
| UUID attribute | `objectGUID` |
| User object classes | `person, organizationalPerson, user` |
| Custom user LDAP filter | `(&(memberOf=CN=GG_SSO,OU=Groupes,DC=corp,DC=exemple,DC=fr)(!(userAccountControl:1.2.840.113556.1.4.803:=2)))` |
| Search scope | Subtree |
| Synchronisation | Périodique complète (nuit) + changements (toutes les heures) |

Puis *Mappers → Add mapper → group-ldap-mapper* : *Groups DN* `OU=Groupes,…`, *Membership attribute* `member`, *Mode* READ_ONLY → les groupes AD apparaissent dans Keycloak et peuvent être transmis aux applications.

L'AC de l'annuaire doit être approuvée par la JVM (magasin de confiance configuré par `truststore-paths` dans `keycloak.conf`).

### SSO Kerberos (postes du domaine)

Avec un keytab `HTTP/sso.corp.exemple.fr@CORP.EXEMPLE.FR` (compte de service AD avec SPN), activez *Kerberos integration* dans la fédération LDAP : les postes Windows du domaine se connectent **sans saisie** (SPNEGO), à condition que le navigateur autorise l'URL de Keycloak (zone intranet / stratégie `AuthServerAllowlist`).

## Courtage d'identités (Entra ID)

*Identity providers → OpenID Connect v1.0* (ou *Microsoft*) : URL de découverte `https://login.microsoftonline.com/<tenant>/v2.0/.well-known/openid-configuration`, identifiant et secret de l'application Entra. Utile pour des prestataires ou un tenant cloud ; des *mappers* d'IdP importent les groupes ou attribuent des rôles.

## Client OIDC : exemple Grafana

| Réglage | Valeur |
| --- | --- |
| Client ID | `grafana` |
| Client authentication | **On** (client confidentiel : secret) |
| Standard flow | Activé (code d'autorisation) ; désactiver *Direct access grants* si inutile |
| Valid redirect URIs | `https://grafana.corp.exemple.fr/login/generic_oauth` |
| Web origins | `https://grafana.corp.exemple.fr` |
| Mapper « groups » | *Client scopes → dédié → Add mapper → Group Membership*, nom du claim `groups`, *Full group path* désactivé |

Côté Grafana : voir [[03-grafana/03-securite-exploitation|OIDC dans Grafana]]. Même démarche pour GitLab, Gitea, Jenkins, Portainer, Argo CD, Proxmox, vCenter (OIDC)…

### Kubernetes (OIDC)

Client `kubernetes` public (PKCE) avec le claim `groups` ; l'apiserver est configuré avec l'émetteur `https://sso.corp.exemple.fr/realms/infra` — voir [[04-kubernetes/06-securite-rbac|Kubernetes RBAC]].

### Client SAML

Pour les applications SAML (anciennes applications, certains équipements) : importer les métadonnées du fournisseur de service, définir l'*entity ID*, l'URL ACS, la signature des assertions, et des mappers d'attributs (`email`, `groups`).

## MFA

| Méthode | Mise en œuvre |
| --- | --- |
| **OTP** (TOTP) | *Authentication → Required actions → Configure OTP* (enrôlement), politique OTP (algorithme, période) |
| **WebAuthn / passkeys** | Clés FIDO2, Windows Hello, Touch ID ; *WebAuthn Passwordless Policy* |
| Conditionnel | Flux personnalisé : MFA obligatoire pour certains groupes ou clients (*Condition - user role*, *Condition - client*) |

Exemple : dupliquer le flux *browser*, ajouter dans le sous-flux « conditional OTP » une condition sur le rôle `mfa-obligatoire`, puis lier ce flux au royaume (*Bind flow*).

## Politique de mots de passe

*Authentication → Policies → Password policy* (comptes locaux) : longueur, complexité, historique, liste de mots de passe interdits, hachage (Argon2 par défaut dans les versions récentes). Les comptes fédérés suivent la politique de l'AD.
