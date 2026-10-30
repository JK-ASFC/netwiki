---
title: GitHub et GitHub Desktop
description: GitHub pour les équipes d'infrastructure — organisations, équipes et droits, dépôts privés, protections de branches et ensembles de règles, demandes de fusion et CODEOWNERS, GitHub Actions (exécuteurs hébergés et auto-hébergés, secrets, OIDC), sécurité (Dependabot, analyse de code, détection de secrets, SSO, clés), GitHub Desktop pour les administrateurs non développeurs, GitHub CLI (gh), comparaison avec GitLab et Forgejo auto-hébergés.
tags: [github, github desktop, gh, actions, git, dépôts, sécurité]
icon: git-branch
---

**GitHub** (Microsoft) héberge des dépôts [[01-git/01-presentation-installation|Git]] et fournit la collaboration (demandes de fusion, revues, tickets), la CI/CD (**Actions**) et des fonctions de sécurité. Pour une équipe d'infrastructure : versionner scripts, playbooks [[01-ansible/01-presentation-installation|Ansible]], code Terraform, configurations, documentation. Alternatives auto-hébergées : [[02-gitlab/01-presentation-installation|GitLab]], [[03-gitea/01-presentation-installation|Gitea]], [[04-forgejo/01-presentation-installation|Forgejo]].

## Organisation

| Élément | Bonne pratique |
| --- | --- |
| **Organisation** | Une par entreprise (ou par entité) ; propriétaires peu nombreux |
| Équipes | `infra-reseau`, `infra-systeme`, `securite` ; droits sur les dépôts par équipe |
| Visibilité | Dépôts **privés** ou internes par défaut |
| Authentification | **2FA obligatoire** pour l'organisation, **SSO SAML/OIDC** (GitHub Enterprise) avec l'annuaire, clés SSH ou jetons à durée limitée (*fine-grained tokens*) |

## Protéger les branches

*Settings → Rules → Rulesets* (ou protections de branche) sur `main` :

- interdire les poussées directes et les réécritures d'historique ;
- exiger une **demande de fusion** avec au moins une **revue** approuvée ;
- exiger la réussite des **vérifications** (lint, `terraform plan`, `ansible-lint`) ;
- **CODEOWNERS** : revue obligatoire de l'équipe propriétaire selon les chemins.

```text .github/CODEOWNERS
/reseau/        @exemple-org/infra-reseau
/terraform/     @exemple-org/infra-systeme @exemple-org/securite
*.ps1           @exemple-org/infra-systeme
```

## GitHub Actions

```yaml .github/workflows/ansible.yml
name: Vérifications Ansible
on:
  pull_request:
    paths: ["ansible/**"]
permissions:
  contents: read
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pipx install ansible-core ansible-lint
      - run: ansible-lint ansible/
```

| Sujet | Recommandation |
| --- | --- |
| Exécuteurs | Hébergés par GitHub (Internet), ou **auto-hébergés** dans le réseau interne pour atteindre l'infrastructure — à isoler, éphémères, jamais sur des dépôts publics |
| Secrets | *Secrets* d'organisation/dépôt/environnement ; environnements avec **approbation** pour la production |
| Accès au cloud | **OIDC** (jetons temporaires) plutôt que des clés stockées |
| Actions tierces | Épingler par **empreinte de commit** (`uses: org/action@<sha>`) : des actions populaires ont été compromises |
| Droits du jeton | `permissions:` minimales |

## Sécurité du code

- **Détection de secrets** (*secret scanning*, *push protection*) : bloque la poussée d'un mot de passe ou d'une clé.
- **Dependabot** : alertes et mises à jour des dépendances vulnérables.
- **Code scanning** (CodeQL) pour le code applicatif.
- Journal d'audit de l'organisation, envoyé au SIEM (offres Enterprise).

## GitHub Desktop

Application graphique (Windows, macOS) pour les membres de l'équipe peu à l'aise avec la ligne de commande : cloner, créer une branche, valider, pousser, ouvrir une demande de fusion, résoudre les conflits simples.

```powershell
winget install GitHub.GitHubDesktop
```

## GitHub CLI

```bash
gh auth login
gh repo clone exemple-org/infra-reseau
gh pr create --title "VLAN 40 site de Lyon" --body "Ajout du VLAN utilisateurs" --reviewer exemple-org/infra-reseau
gh pr checks && gh pr merge --squash --delete-branch
gh run list --workflow ansible.yml
gh secret set NETBOX_TOKEN --env production
```

## Points d'attention

- Données hébergées chez un tiers (localisation, conformité) ; **GitHub Enterprise Server** pour un hébergement sur site, ou forge auto-hébergée.
- Ne jamais versionner de secrets (fichier `.gitignore`, détection de secrets, [[05-owasp-dependency-check|analyse]] des dépendances) ; un secret poussé doit être **révoqué**, pas seulement supprimé de l'historique.
