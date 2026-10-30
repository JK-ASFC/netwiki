---
title: GitHub Copilot
description: GitHub Copilot, assistant de programmation — offres (gratuite, Pro, Business, Enterprise), éditeurs pris en charge (VS Code, Visual Studio, JetBrains, Neovim, terminal), complétion, discussion, mode agent et agent de codage, usages pour les scripts et l'infrastructure as code, fichiers d'instructions du dépôt, politiques d'organisation (exclusions de contenu, filtre de code public, modèles autorisés), confidentialité et vérification du code généré.
tags: [github copilot, ia, assistant de code, vscode, agent, politique, sécurité]
icon: bot
---

**GitHub Copilot** propose du code dans l'éditeur (complétion), répond aux questions sur le code (discussion), et peut réaliser des modifications sur plusieurs fichiers (**mode agent**, agent de codage qui ouvre des demandes de fusion). Il est utile pour écrire scripts PowerShell/Bash, playbooks Ansible, code Terraform, tests et documentation.

## Offres

| Offre | Pour qui |
| --- | --- |
| **Free** | Usage individuel limité (quotas) |
| Pro / Pro+ | Individuels, quotas élevés, modèles avancés |
| **Business** | Organisations : gestion des licences, **politiques**, exclusions de contenu, données non utilisées pour l'entraînement |
| **Enterprise** | + personnalisation avancée, intégration à GitHub Enterprise Cloud |

Les modèles disponibles (plusieurs fournisseurs) et les quotas de requêtes « premium » évoluent : consultez la documentation actuelle.

## Éditeurs

Extensions pour **VS Code** ([[04-developpement/01-vscode|VS Code]]), **Visual Studio**, IDE **JetBrains**, Eclipse, Xcode, Neovim ; **Copilot CLI** dans le terminal ; discussion sur github.com.

## Usages en infrastructure

| Tâche | Conseil |
| --- | --- |
| Écrire un script | Commencer par un commentaire décrivant précisément le besoin et l'environnement ; relire chaque ligne |
| Playbook / module Terraform | Fournir un exemple existant du dépôt comme modèle de style |
| Expliquer du code hérité | `/explain` sur un script ancien avant de le modifier |
| Tests | Générer des tests Pester ou pytest, puis les compléter |
| Revue | Demander les failles de sécurité possibles (injection, secrets, droits) |

**Instructions du dépôt** : un fichier `.github/copilot-instructions.md` décrit les conventions (langue des commentaires, outils, styles, interdits) appliquées automatiquement aux réponses.

```markdown .github/copilot-instructions.md
- Scripts PowerShell compatibles 5.1 et 7, commentaires en français, gestion d'erreurs avec try/catch.
- Ansible : noms de modules complets (ansible.builtin.*), tâches idempotentes, pas de shell si un module existe.
- Ne jamais écrire de secret en clair : variables d'environnement ou ansible-vault.
```

## Politiques d'organisation (Business / Enterprise)

| Politique | Recommandation |
| --- | --- |
| **Exclusions de contenu** | Exclure les dépôts/chemins sensibles (secrets, configurations de sécurité) |
| Suggestions correspondant à du **code public** | Bloquer (limite le risque de reprise de code sous licence) |
| Modèles et fonctions autorisés | Selon la politique (agents, modèles tiers, recherche web) |
| Attribution des licences | Par équipe, révision régulière |
| Journal d'audit | Suivi des activations et changements de politique |

## Risques et vérification

- Le code proposé peut être **faux**, obsolète, ou **non sécurisé** (injection, désactivation de la vérification TLS, droits excessifs) : relire, tester, analyser (lint, tests, revue par un pair).
- Le **mode agent** exécute des commandes dans le terminal : vérifier chaque commande proposée, ne pas l'utiliser sur un poste ayant des accès de production ouverts.
- Pas de secret dans le code ni dans les fichiers ouverts (ils servent de contexte).

Voir aussi [[01-chatgpt|bonnes pratiques des assistants d'IA]] et [[03-cursor|Cursor]].
