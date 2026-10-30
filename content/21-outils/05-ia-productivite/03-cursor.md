---
title: Cursor
description: Cursor, éditeur de code centré sur l'IA (dérivé de VS Code) — installation, reprise des extensions et réglages de VS Code, complétion multi-lignes, discussion avec le code du projet, mode agent (modifications sur plusieurs fichiers, commandes de terminal), règles de projet (.cursor/rules), indexation et fichier .cursorignore, mode confidentialité et offres entreprise, précautions de sécurité pour l'infrastructure.
tags: [cursor, ia, éditeur, agent, vscode, confidentialité, règles]
icon: sparkles
---

**Cursor** (Anysphere, commercial avec offre gratuite) est un éditeur dérivé de **VS Code** dans lequel l'IA est centrale : complétion de plusieurs lignes, discussion avec tout le projet indexé, et **agent** capable de modifier plusieurs fichiers et d'exécuter des commandes. Les extensions, thèmes et raccourcis de [[04-developpement/01-vscode|VS Code]] se réutilisent.

## Installation

```powershell
winget install Anysphere.Cursor
```

macOS : `.dmg` ; Linux : AppImage / paquets. Au premier lancement, import des extensions et réglages de VS Code, connexion au compte Cursor.

## Fonctions

| Fonction | Usage |
| --- | --- |
| Complétion (*Tab*) | Propose la suite et les modifications liées (renommage, mise à jour d'appels) |
| Discussion | Questions sur le projet, avec fichiers, dossiers ou documentation cités en contexte (`@fichier`, `@docs`) |
| **Agent** | Réalise une tâche : modifie plusieurs fichiers, lance des commandes (tests, lint), corrige jusqu'au succès — avec validation des actions |
| Édition en ligne (<kbd>Ctrl</kbd>+<kbd>K</kbd>) | Réécrire une sélection selon une instruction |
| Indexation | Recherche sémantique dans le code |

## Règles de projet

Les **règles** (`.cursor/rules/*.mdc`, ou fichier `AGENTS.md`) guident l'IA avec les conventions du dépôt :

```markdown .cursor/rules/infrastructure.mdc
---
description: Conventions du dépôt d'infrastructure
alwaysApply: true
---
- Terraform : modules dans modules/, variables typées et documentées, pas de valeurs codées en dur pour les environnements.
- Ansible : tâches idempotentes, noms de modules complets, secrets dans ansible-vault.
- Toute commande qui modifie un environnement réel (apply, playbook sans --check) est INTERDITE à l'agent : proposer la commande, ne pas l'exécuter.
```

Le fichier **`.cursorignore`** exclut des fichiers de l'indexation et du contexte de l'IA (secrets, données, fichiers d'état Terraform) :

```text .cursorignore
*.tfstate
*.tfvars
.env
secrets/
inventaires/production/group_vars/*/vault.yml
```

## Confidentialité et entreprise

| Réglage / offre | Effet |
| --- | --- |
| **Mode confidentialité** (*Privacy Mode*) | Le code n'est pas conservé par l'éditeur ni ses fournisseurs pour l'entraînement |
| Offre **Teams / Enterprise** | Mode confidentialité imposé à l'organisation, SSO, administration, facturation centralisée |
| Modèles | Plusieurs fournisseurs ; clés d'API propres possibles selon l'offre |

Le code envoyé transite par les serveurs de l'éditeur et des fournisseurs de modèles : validez l'usage avec la politique de sécurité (code propriétaire, données réglementées).

## Précautions en infrastructure

- [ ] Ne pas donner à l'agent un terminal disposant d'accès **de production** (identifiants chargés, VPN d'administration ouvert, `kubectl` sur le cluster de production)
- [ ] Valider chaque commande avant exécution (désactiver l'exécution automatique)
- [ ] Revoir chaque modification comme une demande de fusion ; tests et `--check`/`plan` obligatoires
- [ ] Exclure secrets et fichiers d'état avec `.cursorignore` et `.gitignore`

Voir aussi [[02-github-copilot|GitHub Copilot]] et [[01-chatgpt|bonnes pratiques des assistants d'IA]].
