---
title: Gluu Flex (Janssen) et OpenAM
description: Plateformes IAM Java historiques — Gluu Flex et le projet Janssen (Linux Foundation) : serveur d'authentification OpenID certifié, scripts personnalisés, installation (paquets ou Helm), interface d'administration Admin UI et TUI ; OpenAM (Open Identity Platform, fork communautaire de ForgeRock/Sun OpenSSO) : SSO, SAML, OAuth2/OIDC, agents web, installation sur Tomcat, console d'administration et migration.
tags: [gluu, janssen, openam, iam, sso, saml, oidc, java]
icon: key-round
---

## Gluu Flex et Janssen

Le **projet Janssen** (Linux Foundation, Apache 2.0) est le cœur libre de **Gluu Flex** (offre commerciale de Gluu) : serveur d'autorisation **OpenID Connect certifié**, serveur FIDO2, SCIM, verrouillage, scripts d'authentification personnalisés (Python/Java) et base PostgreSQL ou MySQL. Cible : grandes organisations, conformité, flux d'authentification sur mesure.

Installation (Ubuntu 22.04/24.04, RHEL 9) : paquet `jans` téléchargé depuis les Releases GitHub du projet, puis :

```bash
sudo apt install ./jans_*.ubuntu24.04_amd64.deb
sudo python3 /opt/jans/jans-setup/setup.py           # nom d'hôte, base, mot de passe administrateur, modules
sudo /opt/jans/bin/jans_cli_tui.py                   # interface texte d'administration (TUI)
```

Kubernetes : chart Helm `janssen/janssen` (ou `gluu/gluu` pour Flex). **Gluu Flex** ajoute l'**Admin UI** web (gestion des clients OIDC, scripts, utilisateurs, journaux) et le support éditeur.

<!-- CAPTURE: Janssen — interface TUI d'administration (clients OpenID) | _assets/janssen-tui-clients.png -->

## OpenAM

**OpenAM** est la suite SSO Java historique (Sun OpenSSO puis ForgeRock) ; la branche communautaire maintenue est **OpenAM (Open Identity Platform)** (licence CDDL). Fonctions : SSO web avec **agents** (Apache, Nginx, IIS, Tomcat), SAML 2.0 (IdP/SP, fédération), OAuth2/OIDC, authentification adaptative par chaînes de modules, magasin de configuration et d'utilisateurs LDAP (OpenDJ).

Installation : JDK 11+, Tomcat 9/10 et le WAR `openam.war` déployé (`/openam`), puis assistant web de configuration (configuration par défaut ou personnalisée avec OpenDJ externe). Conteneur : `openidentityplatform/openam`.

```bash
docker run -d -h openam.corp.exemple.fr -p 8080:8080 --name openam openidentityplatform/openam
# puis http://openam.corp.exemple.fr:8080/openam : assistant de configuration, compte amadmin
```

Console : *Realms* (royaumes, magasins d'identités LDAP/AD, chaînes d'authentification), *Applications* (agents, fournisseurs SAML et OAuth2), *Configure → Global Services*.

<!-- CAPTURE: OpenAM — console, royaume et chaînes d'authentification | _assets/openam-console-royaume.png -->

> [!NOTE]
> Pour un nouveau projet, une plateforme récente ([[05-keycloak/01-presentation-installation|Keycloak]], [[02-zitadel|Zitadel]]) est plus simple à exploiter ; OpenAM se justifie surtout pour un parc existant d'agents et de fédérations SAML.
