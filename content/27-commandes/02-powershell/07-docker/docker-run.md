---
title: "docker run"
description: "PowerShell — docker run (Conteneurisation) : Crée et démarre un conteneur."
tags: [powershell, commande, docker]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Docker |
| **Contexte** | Conteneurisation |
| **Commande type** | `docker run -d --name app -p 8080:80 nginx` |

## Rôle

Crée et démarre un conteneur.

## En détail

Démarre un nouveau conteneur à partir d'une image. La commande centrale pour lancer une application conteneurisee.

## Options

| Option | Rôle |
| --- | --- |
| `-d` | détache (arrière-plan) |
| `-it` | interactif + TTY (shell) |
| `--name ‹nom›` | nomme le conteneur (sinon nom aléatoire) |
| `-p ‹port_hôte:port_conteneur›` | publie un port de l'hôte vers le conteneur |
| `-v ‹chemin_hôte:chemin_conteneur›` | monte un volume (bind ou nommé) |
| `--mount ‹type=bind,source=/chemin/hote,target=/chemin/conteneur›` | montage explicite (type,source,target...) - alternative lisible à -v |
| `-e ‹CLE=valeur›` | variable d'environnement |
| `--env-file ‹fichier›` | charge les variables depuis un fichier |
| `--network ‹réseau›` | rattache le conteneur à un réseau |
| `--restart ‹politique›` | politique de redémarrage : no, on-failure, always, unless-stopped |
| `-u ‹utilisateur›` | exécute en tant qu'utilisateur (UID ou nom) |
| `-w ‹dossier›` | répertoire de travail dans le conteneur |
| `-h ‹hôte›` | définit le nom d'hôte du conteneur |
| `--memory ‹512m›` | limite de mémoire (RAM) |
| `--cpus ‹1.5›` | nombre de cœurs alloués |
| `--entrypoint ‹commande›` | remplace l'ENTRYPOINT de l'image |
| `--rm` | supprime le conteneur à l'arrêt |

## Exemples

**nginx détaché**

```powershell
docker run -d --name web -p 8080:80 nginx
```

**Shell jetable**

```powershell
docker run --rm -it alpine sh
```

## Dans les autres shells

- [[27-commandes/01-bash/08-docker/docker-run|docker run (Bash)]]
- [[27-commandes/03-macos/08-docker/docker-run|docker run (macOS)]]

*Mots-clés : lancer démarrer conteneur image port volume container run docker*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
