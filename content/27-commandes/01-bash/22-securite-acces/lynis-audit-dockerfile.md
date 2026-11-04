---
title: "lynis audit dockerfile"
description: "Bash — lynis audit dockerfile (Audit / Docker) : Audite un Dockerfile (et non l'hôte) : ENTRYPOINT, CMD, utilisateur déclaré, fichiers téléchargés. Les résultats détaillés vont dans le journal de Lynis."
tags: [bash, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
lynis audit dockerfile Dockerfile
```

**Chemin complet**

```bash
lynis audit dockerfile /workspace/dockerfiles/Dockerfile
```

**Depuis un clone, sans installation**

```bash
./lynis audit dockerfile Dockerfile
```

## Dans les autres shells

- [[27-commandes/03-macos/23-securite-acces/lynis-audit-dockerfile|lynis audit dockerfile (macOS)]]

*Mots-clés : lynis audit dockerfile docker image conteneur sécurité entrypoint cmd user*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
