---
title: Visual Studio Code
description: VS Code pour l'administrateur réseau et système — installation et déploiement (Windows, macOS, Linux, VSCodium), extensions utiles (Remote-SSH, WSL, Dev Containers, PowerShell, Python, YAML, Ansible, HashiCorp Terraform, Docker, GitLens, REST Client), édition de configurations d'équipements, Git intégré, terminal, paramètres et synchronisation, confiance de l'espace de travail, sécurité des extensions et télémétrie, gestion en entreprise.
tags: [vscode, éditeur, extensions, remote-ssh, powershell, ansible, git]
icon: code
---

**Visual Studio Code** (Microsoft, gratuit ; code source MIT) est devenu l'éditeur commun des développeurs **et** des administrateurs : scripts PowerShell et Bash, playbooks Ansible, Terraform, fichiers YAML, configurations d'équipements, Markdown (comme les articles de ce wiki), le tout avec Git intégré.

## Installation

```powershell
winget install Microsoft.VisualStudioCode --scope machine      # installation pour tous les utilisateurs
```

```bash
# Debian / Ubuntu : dépôt Microsoft (paquet code) ; RHEL : dépôt rpm ; macOS :
brew install --cask visual-studio-code
```

**VSCodium** : même éditeur compilé sans la télémétrie ni la marque Microsoft (catalogue d'extensions Open VSX, certaines extensions Microsoft indisponibles).

## Extensions utiles

| Extension | Usage |
| --- | --- |
| **Remote - SSH** | Ouvrir un dossier sur un serveur Linux via SSH (l'éditeur reste local) |
| WSL / **Dev Containers** | Travailler dans WSL ou dans un conteneur de développement reproductible |
| **PowerShell** | Coloration, analyse (PSScriptAnalyzer), débogage, console intégrée |
| Python, Pylance | Scripts et automatisation |
| **YAML** (Red Hat) | Validation par schémas (Kubernetes, Compose, GitLab CI) |
| **Ansible** (Red Hat) | Complétion des modules, ansible-lint |
| HashiCorp Terraform | Syntaxe HCL, formatage, complétion des fournisseurs |
| Docker / Container Tools | Images, conteneurs, Compose |
| GitLens | Historique, auteurs ligne par ligne |
| REST Client | Requêtes HTTP dans des fichiers `.http` |
| Cisco IOS / syntaxes réseau, Log File Highlighter | Lecture de configurations et de journaux |
| markdownlint, Mermaid | Documentation |

## Remote - SSH

```text ~/.ssh/config (utilisé par VS Code)
Host srv-web-01
    HostName srv-web-01.corp.exemple.fr
    User admin
    IdentityFile ~/.ssh/id_ed25519
    ProxyJump bastion.corp.exemple.fr
```

*Palette (<kbd>Ctrl</kbd>+<kbd>Maj</kbd>+<kbd>P</kbd>) → Remote-SSH: Connect to Host*. VS Code installe un petit serveur dans `~/.vscode-server` sur la machine distante (connexion Internet ou installation hors ligne nécessaire) ; à proscrire sur les systèmes sensibles où l'installation de logiciels n'est pas autorisée.

## Paramètres utiles

```jsonc settings.json (extraits)
{
  "files.eol": "\n",
  "files.trimTrailingWhitespace": true,
  "editor.renderWhitespace": "boundary",
  "editor.rulers": [120],
  "files.associations": { "*.cfg": "ini", "*.j2": "jinja-yaml" },
  "telemetry.telemetryLevel": "off",
  "security.workspace.trust.enabled": true,
  "git.autofetch": true,
  "[powershell]": { "editor.formatOnSave": true }
}
```

Fins de ligne : les scripts Bash édités sous Windows doivent rester en **LF** (sinon `\r` provoque des erreurs) ; fichier `.gitattributes` dans les dépôts.

## Sécurité

- **Confiance de l'espace de travail** (*Workspace Trust*) : un dossier non approuvé s'ouvre en mode restreint (pas d'exécution de tâches ni d'extensions qui exécutent du code).
- **Extensions** : n'installez que des extensions d'éditeurs vérifiés et largement utilisées ; des extensions malveillantes ont été publiées sur la place de marché (vol de jetons, mineurs). Limitez la liste par politique en entreprise.
- Pas de secrets dans les fichiers de l'espace de travail ou les paramètres synchronisés.

## Gestion en entreprise

Stratégies de groupe / profils de configuration (modèles ADMX fournis pour Windows) : liste des extensions autorisées (`extensions.allowed`), désactivation des mises à jour automatiques ou de la télémétrie, paramètres imposés. Installation machine (`--scope machine`) pour des mises à jour gérées par l'outil de déploiement ([[09-pdq-deploy|PDQ Deploy]], [[10-intune-inscription|Intune]]).
