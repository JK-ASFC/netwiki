---
title: VSCodium
description: VSCodium, la version entièrement libre de Visual Studio Code — différences avec VS Code (licence MIT, pas de télémétrie Microsoft, place de marché Open VSX), installation sur Windows, macOS et Linux, migration des réglages et extensions, extensions Microsoft indisponibles (Remote-SSH, Pylance, C# Dev Kit, Live Share) et leurs alternatives, déploiement en entreprise.
tags: [vscodium, vscode, open vsx, éditeur, télémétrie, logiciel libre]
icon: code
---

**VSCodium** est construit à partir du code source libre (MIT) de [[01-vscode|Visual Studio Code]], sans les ajouts propres à Microsoft : pas de télémétrie Microsoft, pas de marque Microsoft, et une **place de marché d'extensions différente**. L'interface, les raccourcis et la plupart des extensions sont identiques.

| | VS Code | VSCodium |
| --- | --- | --- |
| Licence du binaire | Licence propriétaire Microsoft | **MIT** |
| Télémétrie | Activée par défaut (désactivable) | Désactivée à la construction |
| Place de marché | Visual Studio Marketplace | **Open VSX** (Fondation Eclipse) |
| Extensions Microsoft fermées | Disponibles | **Interdites** par leur licence hors produits Microsoft |
| Mises à jour | Microsoft | Projet VSCodium (même rythme, quelques jours après) |

## Installation

```powershell
winget install VSCodium.VSCodium
```

```bash
brew install --cask vscodium                    # macOS
flatpak install flathub com.vscodium.codium     # Linux (ou dépôt APT/RPM du projet, Snap, AppImage)
codium .                                        # la commande s'appelle codium
```

Les réglages se trouvent dans `~/.config/VSCodium/User/` (Linux), `%APPDATA%\VSCodium\User\` (Windows), `~/Library/Application Support/VSCodium/User/` (macOS).

## Migrer depuis VS Code

```bash
# Recopier les réglages et raccourcis (Linux)
cp ~/.config/Code/User/settings.json ~/.config/VSCodium/User/
cp ~/.config/Code/User/keybindings.json ~/.config/VSCodium/User/

# Réinstaller les extensions (celles présentes sur Open VSX)
code --list-extensions > extensions.txt
xargs -n1 codium --install-extension < extensions.txt
```

Une extension absente d'Open VSX peut s'installer depuis un fichier `.vsix` téléchargé chez l'éditeur, si sa licence le permet : `codium --install-extension extension.vsix`.

## Extensions Microsoft et alternatives

| Extension Microsoft | Disponible ? | Alternative libre |
| --- | --- | --- |
| PowerShell, Python, YAML (Red Hat), Ansible (Red Hat), Terraform (HashiCorp), Docker, GitLens | Oui, sur Open VSX | — |
| **Remote - SSH** | Non | **Open Remote - SSH** (Open VSX) |
| **Pylance** | Non | **basedpyright** ou Pyright, Jedi |
| **C/C++** (cpptools), **C# Dev Kit** | Non | **clangd**, extensions C# libres (csharp-ls) |
| **Live Share** | Non | Partage d'écran, ou édition collaborative par d'autres extensions |
| **Dev Containers**, WSL | Non | Open Remote - WSL, DevPod, Dev Container CLI |
| GitHub Copilot | Non (place de marché Microsoft) | Assistants compatibles Open VSX (Continue…), voir la page IA du wiki |

> [!WARNING]
> Modifier `product.json` pour pointer VSCodium vers la place de marché de Microsoft est techniquement possible mais **contraire aux conditions d'utilisation** de celle-ci. En entreprise, restez sur Open VSX ou choisissez VS Code.

## En entreprise

- **Pourquoi VSCodium** : politique « logiciel libre uniquement », refus de la télémétrie, environnements sans compte Microsoft.
- **Pourquoi rester sur VS Code** : besoin de Remote - SSH, Dev Containers, Pylance ou Copilot, support et stratégies de groupe Microsoft.
- Déploiement : `winget` ou paquet MSI/EXE sur Windows, dépôt du projet ou Flatpak sur Linux ; réglages imposés par un `settings.json` déployé ou par les politiques du système (voir la documentation du projet).

Voir aussi : [[01-vscode|Visual Studio Code]] · [[12-netbeans-qt-creator-code-blocks|NetBeans, Qt Creator, Code::Blocks]]. Commandes : [[90-aide-memoire|aide-mémoire]].
