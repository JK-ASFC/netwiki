---
title: "pip / pipx"
description: "Bash — pip / pipx (Python) : Installe des paquets Python : pip dans l'environnement courant, pipx en environnement isolé par application."
tags: [bash, commande, paquets-mises-a-jour]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Paquets & mises à jour |
| **Contexte** | Python |
| **Commande type** | `pip install requests` |

## Rôle

Installe des paquets Python : pip dans l'environnement courant, pipx en environnement isolé par application.

## Options

| Option | Rôle |
| --- | --- |
| `install ‹paquet›` | installe un paquet |
| `uninstall ‹paquet›` | desinstalle un paquet |
| `list` | liste les paquets installés |
| `show ‹paquet›` | affiche les détails d'un paquet |
| `upgrade` | met à jour (via --upgrade / pipx upgrade) |
| `--user` | installe pour l'utilisateur seul |
| `--force` | force la réinstallation |
| `(-r requirements.txt)` | pip : installe depuis un fichier |

## Exemples

**pip : installer une bibliothèque**

```bash
pip install requests
```

**pip : installer depuis un fichier de version**

```bash
pip install -r requirements.txt
```

**pip : figer les versions du projet**

```bash
pip freeze > requirements.txt
```

**pip : dans un environnement virtuel (recommandé)**

```bash
python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt
```

**pipx : installer un outil en ligne de commande**

```bash
pipx install ruff
```

**pipx : lancer sans installer durablement**

```bash
pipx run black --check .
```

**pipx : tout mettre à jour sans risque**

```bash
pipx upgrade-all
```

**pipx : lister les outils installés**

```bash
pipx list
```

## Dans les autres shells

- [[27-commandes/02-powershell/16-paquets-mises-a-jour/pip-pipx|pip / pipx (PowerShell)]]
- [[27-commandes/03-macos/17-paquets-mises-a-jour/pip-pipx|pip / pipx (macOS)]]

*Mots-clés : pip pipx python paquet package installer environnement virtuel venv isolé application requirements freeze*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
