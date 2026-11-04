---
title: "bash"
description: "Bash — bash (Scripts & exécution) : Exécute un script shell, ou une commande passée en argument."
tags: [bash, commande, automatisation]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Automatisation |
| **Contexte** | Scripts & exécution |
| **Commande type** | `bash script.sh` |

## Rôle

Exécute un script shell, ou une commande passée en argument.

## Options

| Option | Rôle |
| --- | --- |
| `-x` | trace chaque commande (debug) |
| `-n` | vérifie la syntaxe sans exécuter |
| `-e` | arrête au premier échec |
| `-c ‹commande›` | exécute une commande passée en argument |
| `-l` | shell de connexion (login) |
| `-v` | affiche les lignes lues |
| `(direct : ./script.sh, apres chmod +x)` |  |

## Exemples

**Lancer un script**

```bash
bash script.sh
```

**Déboguer (trace)**

```bash
bash -x script.sh
```

**Vérifier la syntaxe**

```bash
bash -n script.sh
```

**Directement**

```bash
chmod +x script.sh && ./script.sh
```

**Commande inline**

```bash
bash -c 'echo bonjour'
```

*Mots-clés : bash script exécuter shell sh lancer run debug trace source*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
