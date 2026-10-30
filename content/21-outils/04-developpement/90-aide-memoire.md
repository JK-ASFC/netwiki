---
title: Outils de développement — aide-mémoire (VS Code, JetBrains, Visual Studio, GitHub, DBeaver, Playwright, uv…)
description: Commandes et raccourcis des outils de développement avec exemples — VS Code (ligne de commande code, extensions, raccourcis, Remote SSH), IntelliJ IDEA et PyCharm (raccourcis, lanceurs), Visual Studio (devenv, msbuild, dotnet), Eclipse, Notepad++ (raccourcis, recherche par expressions régulières), GitHub CLI (gh) et GitHub Desktop, DBeaver et clients SQL, pgAdmin / MySQL Workbench, Playwright (installation, tests, codegen, rapport), uv (projets Python).
tags: [aide-mémoire, vscode, jetbrains, visual studio, gh, dbeaver, playwright, uv]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-vscode|VS Code]], [[06-github-github-desktop|GitHub]], [[09-playwright|Playwright]] et [[10-uv|uv]].

## VS Code

```bash
code .                                         # ouvrir le dossier courant
code -g configs/sw-paris-01.cfg:120            # aller à la ligne 120
code --diff ancien.cfg nouveau.cfg             # comparer deux fichiers
code --list-extensions > extensions.txt
code --install-extension ms-vscode-remote.remote-ssh
code --install-extension redhat.ansible
cat extensions.txt | xargs -L1 code --install-extension      # réinstaller une liste
code --remote ssh-remote+srv01 /etc/nginx                    # ouvrir un dossier distant
```

| Raccourci | Effet |
| --- | --- |
| `Ctrl+Shift+P` | Palette de commandes |
| `Ctrl+P` | Ouvrir un fichier par son nom |
| `Ctrl+Shift+F` | Rechercher dans tous les fichiers |
| `Ctrl+D` | Sélectionner l'occurrence suivante (multicurseur) |
| `Alt+Clic` / `Ctrl+Alt+↓` | Ajouter un curseur |
| `Ctrl+ù` (azerty) / ``Ctrl+` `` | Terminal intégré |
| `F2` | Renommer un symbole |
| `Shift+Alt+F` | Formater le document |

## IntelliJ IDEA / PyCharm

| Raccourci | Effet |
| --- | --- |
| `Shift` `Shift` | Rechercher partout |
| `Ctrl+Shift+A` | Rechercher une action |
| `Ctrl+Alt+L` | Reformater |
| `Shift+F6` | Renommer |
| `Ctrl+B` | Aller à la déclaration |
| `Alt+Entrée` | Corrections rapides |

```bash
idea .              # lanceur en ligne de commande (Tools → Create Command-line Launcher / JetBrains Toolbox)
pycharm diff a.py b.py
```

## Visual Studio et .NET

```powershell
dotnet --list-sdks
dotnet new console -n OutilReseau && cd OutilReseau
dotnet add package Renci.SshNet
dotnet build -c Release
dotnet test
dotnet publish -c Release -r win-x64 --self-contained -p:PublishSingleFile=true
& "C:\Program Files\Microsoft Visual Studio\2022\Community\MSBuild\Current\Bin\MSBuild.exe" Solution.sln /p:Configuration=Release /m
devenv Solution.sln /Build Release
```

## Eclipse et Notepad++

| Outil | Raccourci | Effet |
| --- | --- | --- |
| Eclipse | `Ctrl+Shift+R` / `Ctrl+Shift+T` | Ouvrir une ressource / un type |
| Eclipse | `Ctrl+Shift+F` | Formater |
| Notepad++ | `Ctrl+H` (mode « Expression régulière ») | Rechercher/remplacer par regex |
| Notepad++ | `Alt+Maj+sélection` | Sélection en colonne |
| Notepad++ | *Édition → Opérations sur les lignes* | Trier, supprimer les doublons et lignes vides |
| Notepad++ | `Ctrl+F2` / `F2` | Signet / signet suivant |

Expression utile (Notepad++) : remplacer `^\s*!.*$\R` par rien pour supprimer les lignes de commentaire d'une configuration Cisco.

## GitHub CLI et GitHub Desktop

```bash
gh auth login
gh repo clone JK-ASFC/netwiki
gh repo create JK-ASFC/outil --private --source . --push
gh issue list --state open
gh issue create --title "Erreur d'import" --body "Étapes pour reproduire…"
gh pr create --fill --base main
gh pr checkout 12
gh pr merge 12 --squash --delete-branch
gh run list --limit 5
gh run watch
gh release create v1.40.0 --generate-notes ./release/*.exe
gh secret set NETWIKI_SIGNING_KEY < ~/.netwiki-signing/netwiki-ed25519-private.pem
```

GitHub Desktop : `Ctrl+Shift+P` (pousser), `Ctrl+Shift+T` (tirer), `Ctrl+Shift+N` (nouvelle branche), *Repository → Open in Visual Studio Code*.

## Bases de données (DBeaver, pgAdmin, MySQL Workbench)

| Outil | Raccourci / fonction | Effet |
| --- | --- | --- |
| DBeaver | `Ctrl+Entrée` | Exécuter la requête courante |
| DBeaver | `Alt+X` | Exécuter le script |
| DBeaver | `Ctrl+Shift+F` | Formater le SQL |
| DBeaver | Clic droit → *Export Data* | CSV, JSON, SQL, XLSX |
| pgAdmin | `F5` / `F7` | Exécuter / expliquer le plan |
| MySQL Workbench | `Ctrl+Entrée` / `Ctrl+Shift+Entrée` | Exécuter l'instruction / tout le script |

Connexions : privilégier les comptes en lecture seule et les tunnels SSH intégrés plutôt que d'exposer les ports des bases.

## Playwright

```bash
npm init playwright@latest
npx playwright install --with-deps chromium
npx playwright test
npx playwright test tests/connexion.spec.ts --headed --project=chromium
npx playwright codegen https://intranet.exemple.fr        # enregistrer un parcours
npx playwright show-report
npx playwright test --trace on && npx playwright show-trace test-results/*/trace.zip
```

## uv (Python)

```bash
uv init outil-reseau && cd outil-reseau
uv add netmiko rich
uv run python main.py
uv run --with httpx python -c "import httpx; print(httpx.get('https://www.exemple.fr').status_code)"
uv tool install ruff && ruff check .
uv python list
uv lock --upgrade && uv sync
uvx ansible-lint playbooks/
```
