---
title: "lynis audit dockerfile"
description: "macOS — lynis audit dockerfile (Audit / Docker) : Audite un Dockerfile (et non l'hôte) : ENTRYPOINT, CMD, utilisateur déclaré, fichiers téléchargés. Les résultats détaillés vont dans le journal de Lynis."
tags: [macos, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Sécurité & accès |
| **Contexte** | Audit / Docker |
| **Commande type** | `lynis audit dockerfile Dockerfile` |

## Rôle

Audite un Dockerfile (et non l'hôte) : ENTRYPOINT, CMD, utilisateur déclaré, fichiers téléchargés. Les résultats détaillés vont dans le journal de Lynis.

## Options

| Option | Rôle |
| --- | --- |
| `‹fichier›` | chemin du Dockerfile à auditer |
| `(contrôles) ENTRYPOINT CMD USER` | ce que vérifie l'audit |
| `(détails) /var/log/lynis.log` | le journal garde les éléments conformes |

## Exemples

**Auditer un Dockerfile**

```zsh
lynis audit dockerfile Dockerfile
```

**Chemin complet**

```zsh
lynis audit dockerfile /workspace/dockerfiles/Dockerfile
```

**Depuis un clone, sans installation**

```zsh
./lynis audit dockerfile Dockerfile
```

## Dans les autres shells

- [[27-commandes/01-bash/22-securite-acces/lynis-audit-dockerfile|lynis audit dockerfile (Bash)]]

*Mots-clés : lynis audit dockerfile docker image conteneur sécurité entrypoint cmd user*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
