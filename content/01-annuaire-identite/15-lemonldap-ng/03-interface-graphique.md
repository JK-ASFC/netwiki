---
title: Interface graphique (Manager et portail)
description: Interfaces de LemonLDAP::NG — portail (connexion, menu des applications, second facteur, notifications), Manager (arbre de configuration : paramètres généraux, hôtes virtuels, fournisseurs SAML/OIDC/CAS, seconds facteurs ; sauvegarde et comparaison des versions de configuration), explorateur de sessions, notifications, équivalents en ligne de commande.
tags: [lemonldap-ng, manager, portail, interface graphique, sso]
icon: app-window
---

## Portail

`https://auth.corp.exemple.fr` : formulaire de connexion (ou choix du mode : AD, Kerberos, autre IdP), **menu des applications** autorisées, gestion des seconds facteurs (*2FA Manager*), changement de mot de passe, notifications à accepter.

![LemonLDAP::NG — portail : menu des applications autorisées, regroupées par catégorie (FusionIAM, applications d'exemple, administration)](_assets/lemonldap-portail-menu.png "Portail LemonLDAP::NG après connexion : tuiles des applications accessibles en SSO")

![LemonLDAP::NG — gestion des seconds facteurs : une clé WebAuthn enregistrée, avec sa date et le bouton de suppression](_assets/lemonldap-2fa.png "2FA Manager du portail : liste des seconds facteurs de l'utilisateur (ici une clé WebAuthn/FIDO)")

## Manager

`https://manager.corp.exemple.fr` (accès réservé aux administrateurs par règle) :

| Section | Contenu |
| --- | --- |
| **Configuration** | Arbre : *General Parameters* (authentification, portail, sessions, journaux, MFA), *Variables*, *Virtual Hosts* (règles et en-têtes), *SAML/OIDC/CAS service* et partenaires |
| Sessions | Sessions actives, recherche, suppression (déconnexion forcée) |
| Notifications | Messages à faire accepter (charte) |
| Second factors | Appareils MFA enregistrés par utilisateur |

Chaque enregistrement crée une **nouvelle version** de configuration, comparable et restaurable (*Browse* les versions).

![LemonLDAP::NG — Manager : arbre de configuration (paramètres généraux, portail, modules d'authentification, combinaison de backends) avec l'aide contextuelle à droite](_assets/lemonldap-manager-vhost.png "Manager LemonLDAP::NG : navigation dans l'arbre de configuration")

![LemonLDAP::NG — Manager : boîte de dialogue de choix du logo d'une application du menu du portail](_assets/lemonldap-choix-logo.png "Personnalisation du menu : sélection de l'icône associée à une application")

<!-- CAPTURE: LemonLDAP::NG — Manager, explorateur de sessions | _assets/lemonldap-manager-sessions.png -->

## Correspondance Manager ↔ ligne de commande

| Action | Manager | Commande |
| --- | --- | --- |
| Lire un paramètre | Arbre de configuration | `/usr/share/lemonldap-ng/bin/lemonldap-ng-cli get portal` |
| Modifier un paramètre | Enregistrer | `lemonldap-ng-cli -yes 1 set ldapServer ldaps://dc01.corp.exemple.fr` |
| Supprimer les sessions d'un utilisateur | Sessions | `lemonldap-ng-sessions search --where uid=alice` puis `delete` |
