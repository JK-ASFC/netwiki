---
title: Kate et Geany
description: Deux éditeurs graphiques légers et complets — Kate (KDE, Linux, Windows, macOS : sessions, terminal intégré, client LSP, recherche dans les dossiers, curseurs multiples, fichiers distants SFTP et en root via KIO, Git) et Geany (GTK, Linux, Windows, macOS : mini-IDE avec compilation et exécution, projets, greffons, très léger) ; comparaison avec Notepad++, VS Code et les éditeurs en terminal.
tags: [kate, kwrite, geany, éditeur, kde, gtk, lsp, sftp]
icon: file-code
---

Pour un poste d'administration Linux, **Kate** et **Geany** offrent une interface graphique classique (menus, onglets, souris) sans la lourdeur d'un IDE : l'équivalent libre de Notepad++ (voir la page Notepad++ du wiki).

| | Kate | Geany |
| --- | --- | --- |
| Bureau, bibliothèque | KDE, Qt | Indépendant, GTK |
| Plates-formes | Linux, Windows, macOS | Linux, Windows, macOS |
| Licence | LGPL | GPL |
| Points forts | LSP, terminal intégré, recherche puissante, fichiers distants via KIO | Très léger, démarre instantanément, compiler et exécuter en un clic |
| Pour qui | Configuration, scripts, petits projets | Machines modestes, scripts, apprentissage (C, Python…) |

## Kate

```bash
sudo apt install kate ; sudo dnf install kate ; winget install KDE.Kate ; brew install --cask kate
kate -n fichier.conf             # nouvelle instance
kate -s exploitation             # ouvrir la session « exploitation »
```

**KWrite** est sa version simplifiée (une seule fenêtre, sans greffons).

| Fonction | Utilisation |
| --- | --- |
| **Sessions** | Retrouver un ensemble de fichiers et de dossiers ouverts (une session par projet ou par client) |
| **Terminal intégré** | `F4` : terminal synchronisé avec le dossier du fichier courant |
| **Recherche dans les fichiers** | Dans un dossier ou un projet, avec expressions régulières et remplacement |
| **Client LSP** | Complétion et diagnostics avec bash-language-server, yaml-language-server, pyright… |
| **Curseurs multiples** | `Alt` + clic, ou `Ctrl+Alt+↑/↓` |
| **Fichiers distants** | Ouvrir `sftp://admin@serveur/etc/nginx/nginx.conf` ou `fish://admin@serveur/…` (KIO) |
| **Fichiers root** | Kate refuse de se lancer en root ; ouvrir le fichier normalement : l'enregistrement demande le mot de passe administrateur (polkit) |
| **Git** | Panneau de projet : état, indexation, historique, comparaison |
| **Modes d'édition** | Coloration de centaines de langages, mode Vi intégré |

## Geany

```bash
sudo apt install geany geany-plugins ; sudo dnf install geany geany-plugins-* ; winget install Geany.Geany
```

| Fonction | Utilisation |
| --- | --- |
| Compiler, construire, exécuter | `F8`, `F9`, `F5` ; commandes réglables par type de fichier (*Construire → Définir les commandes de construction*) |
| Symboles | Panneau latéral des fonctions, classes et variables |
| Projets | Fichier `.geany` avec dossier de base et commandes propres au projet |
| Greffons utiles | *Git Change Bar*, *Tree Browser*, *Spell Check*, *Markdown*, *Code navigation* |
| Terminal | Onglet *Terminal* (VTE) dans le panneau inférieur |

Geany reste utilisable sur un très vieux poste ou une VM sans accélération graphique, là où VS Code devient lent.

## Quel éditeur choisir ?

| Situation | Choix |
| --- | --- |
| Modifier un fichier sur un serveur en SSH | [[01-vim-neovim\|Vim]] (toujours présent) ou nano |
| Éditer à distance depuis son poste | Kate (SFTP), [[02-emacs\|Emacs]] (TRAMP), VS Code (Remote - SSH) |
| Gros projet, Git, extensions | VS Code, VSCodium ou JetBrains (voir la catégorie Développement) |
| Poste léger, scripts | Geany |
| Windows | Notepad++, Kate |

Commandes : [[90-aide-memoire|aide-mémoire]].
