---
title: "docker exec"
description: "PowerShell — docker exec (Conteneurisation) : Exécute une commande dans un conteneur actif."
tags: [powershell, commande, docker]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Docker |
| **Contexte** | Conteneurisation |
| **Commande type** | `docker exec -it app sh` |

## Rôle

Exécute une commande dans un conteneur actif.

## En détail

Exécute une commande à l'intérieur d'un conteneur déjà lancé, par exemple ouvrir un shell pour inspecter son contenu.

## Options

| Option | Rôle |
| --- | --- |
| `-it` | shell interactif |
| `-u ‹utilisateur›` | utilisateur |
| `-w ‹dossier›` | répertoire |

## Exemples

**Shell**

```powershell
docker exec -it web sh
```

**Tester nginx**

```powershell
docker exec web nginx -t
```

## Dans les autres shells

- [[27-commandes/01-bash/08-docker/docker-exec|docker exec (Bash)]]
- [[27-commandes/03-macos/08-docker/docker-exec|docker exec (macOS)]]

*Mots-clés : entrer conteneur shell commande intérieur bash exec docker*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
