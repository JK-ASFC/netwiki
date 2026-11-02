---
title: Interfaces graphiques
description: Interfaces web d'OpenBao (connexion par méthode d'authentification, moteurs de secrets, navigation KV et versions, politiques, méthodes d'authentification, outils, état du cluster Raft) et d'Infisical (projets, environnements, tableau des secrets, versions, intégrations, identités machines, membres et rôles, journal d'audit), avec emplacements de captures d'écran.
tags: [openbao, infisical, interface graphique, secrets, captures]
icon: monitor
---

## OpenBao (`https://<nœud>:8200/ui`)

Connexion (jeton, OIDC, LDAP, userpass), **Secrets engines** (KV : arborescence, versions, métadonnées), **Access** (méthodes d'authentification, entités, groupes), **Policies**, **Tools** (chiffrer, hacher, aléatoire), **Raft storage** (pairs, instantanés).

<!-- CAPTURE: OpenBao — navigation dans un moteur KV | _assets/openbao-kv.png -->
<!-- CAPTURE: OpenBao — politiques ACL | _assets/openbao-politiques.png -->

## Infisical

Projets, **tableau des secrets** par environnement (comparaison dev/recette/prod), historique des versions, **Integrations**, **Access Control** (membres, rôles, identités machines), **Audit Logs**.

<!-- CAPTURE: Infisical — tableau des secrets par environnement | _assets/infisical-secrets.png -->
