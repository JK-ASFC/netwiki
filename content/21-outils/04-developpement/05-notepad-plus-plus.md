---
title: Notepad++
description: Notepad++, éditeur de texte léger pour Windows — installation et déploiement silencieux, version portable, fonctions pour l'administrateur (coloration de nombreux langages, recherche et remplacement par expressions régulières dans plusieurs fichiers, mode colonne, encodages et fins de ligne, macros, comparaison), greffons utiles (Compare, XML Tools, JSON Viewer, NppFTP), langages définis par l'utilisateur pour les configurations d'équipements, mises à jour et sécurité.
tags: [notepad++, éditeur, regex, windows, greffons, encodage]
icon: file-code
---

**Notepad++** (GPL) est l'éditeur de texte léger de référence sous Windows : démarrage instantané, gros fichiers (journaux de plusieurs centaines de Mo), coloration de dizaines de langages. Pour un projet complet (Git, extensions, SSH), voir [[01-vscode|VS Code]].

## Installation

```powershell
winget install Notepad++.Notepad++
# Déploiement silencieux (installateur NSIS)
npp.8.8.Installer.x64.exe /S
```

Version **portable** (archive ZIP) pour une clé USB d'intervention. Configuration dans `%APPDATA%\Notepad++` (ou à côté de l'exécutable en portable) ; `doLocalConf.xml` force la configuration locale.

## Fonctions utiles

| Fonction | Usage |
| --- | --- |
| **Rechercher dans les fichiers** (<kbd>Ctrl</kbd>+<kbd>Maj</kbd>+<kbd>F</kbd>) | Chercher/remplacer dans tout un dossier (configurations sauvegardées, journaux), avec filtres |
| **Expressions régulières** | Extraire, transformer, nettoyer |
| **Mode colonne** (<kbd>Alt</kbd>+glisser) | Éditer plusieurs lignes à la fois, insérer une numérotation |
| Encodage | Conversion UTF-8 / ANSI / UTF-8 avec BOM (scripts PowerShell 5.1 : UTF-8 **avec BOM** pour les accents) |
| Fins de ligne | *Édition → Convertir les sauts de ligne* : Unix (LF) pour les scripts Linux |
| Macros | Enregistrer une suite d'actions et la rejouer sur un fichier |
| Surveillance du fichier (*tail -f*) | *Affichage → Surveiller* : suivi d'un journal en direct |
| Session | Rouvrir les fichiers ouverts au redémarrage |

### Exemples d'expressions régulières

| Rechercher | Remplacer | Effet |
| --- | --- | --- |
| `^\s*$\R` | (vide) | Supprimer les lignes vides |
| `^interface (\S+)` | `interface \1\r\n description A-DOCUMENTER` | Insérer une description sous chaque interface |
| `(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})` | `"\1"` | Mettre les adresses IP entre guillemets |
| `^(?!.*ERROR).*\R` | (vide) | Ne garder que les lignes contenant `ERROR` |

## Greffons

*Modules d'extension → Gestionnaire de modules* :

| Greffon | Usage |
| --- | --- |
| **Compare** | Comparer deux configurations (avant/après) |
| XML Tools | Valider, indenter, XPath |
| JSON Viewer / JSTool | Indenter et parcourir du JSON |
| NppFTP | Ouvrir des fichiers par SFTP |
| MarkdownViewer++ | Aperçu Markdown |

## Langage défini par l'utilisateur

*Langage → Langage défini par l'utilisateur* : créer une coloration pour les configurations Cisco/FortiOS (mots-clés `interface`, `vlan`, `shutdown`, commentaires `!`), exportable en XML et partageable dans l'équipe ; de nombreuses définitions existent déjà dans la communauté.

## Mises à jour et sécurité

- [ ] Mettre à jour régulièrement (correctifs de sécurité, y compris du mécanisme de mise à jour) ; en entreprise, désactiver la mise à jour automatique et déployer les versions validées
- [ ] Greffons uniquement depuis le gestionnaire officiel
- [ ] Ne pas laisser de fichiers de secrets ouverts dans les sessions et sauvegardes automatiques (`%APPDATA%\Notepad++\backup`)
