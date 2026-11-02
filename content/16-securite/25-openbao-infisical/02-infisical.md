---
title: Infisical
description: Infisical (MIT pour le cœur, éditions commerciales) — plate-forme de gestion des secrets orientée équipes de développement et CI/CD : projets, environnements (dev, recette, prod), dossiers, versions et retour arrière, références de secrets, rotation, secrets dynamiques (éditions payantes), contrôle d'accès, journaux d'audit, auto-hébergement (Docker Compose, Helm, PostgreSQL et Redis), CLI infisical (login, run, export), SDK, intégrations (GitHub Actions, GitLab CI, Kubernetes Operator, Ansible, Terraform) et comparaison avec OpenBao/Vault.
tags: [infisical, secrets, ci/cd, développeurs, kubernetes, gitops]
icon: info
---

**Infisical** vise les **équipes applicatives** : une interface claire pour ranger les secrets par **projet** et **environnement**, une CLI qui injecte les variables au lancement (`infisical run -- npm start`), et des intégrations prêtes pour la CI et Kubernetes. [[01-openbao|OpenBao]]/Vault reste plus adapté aux besoins d'infrastructure avancés (PKI, chiffrement en tant que service, secrets dynamiques de bases).

## Auto-hébergement

```bash
curl -o docker-compose.prod.yml https://raw.githubusercontent.com/Infisical/infisical/main/docker-compose.prod.yml
curl -o .env https://raw.githubusercontent.com/Infisical/infisical/main/.env.example
# Renseigner ENCRYPTION_KEY, AUTH_SECRET (openssl rand), SITE_URL, connexion PostgreSQL et Redis, SMTP
docker compose -f docker-compose.prod.yml up -d       # interface http://<hôte>:80
# Kubernetes : chart Helm infisical-standalone
```

## CLI et intégrations

```bash
# CLI : brew install infisical/get-cli/infisical ; winget install infisical ; paquets .deb/.rpm
infisical login --domain https://secrets.corp.exemple.fr
infisical init                                   # associe le dossier au projet
infisical run --env=prod -- ./demarrer.sh        # secrets injectés en variables d'environnement
infisical export --env=dev --format=dotenv > .env.local
infisical secrets set API_CLE=valeur --env=dev
```

- **CI** : identité machine (*Machine Identity*, authentification universelle) ; actions GitHub et GitLab.
- **Kubernetes** : **Infisical Operator** (synchronise vers des Secret) ou External Secrets Operator.
- Contrôle d'accès par projet et environnement ; journal d'audit (rétention selon l'édition).

Interface : [[03-interface-graphique|interfaces graphiques]] · commandes : [[90-aide-memoire|aide-mémoire]].
