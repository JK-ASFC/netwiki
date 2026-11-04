---
title: "ssh <<'EOF'"
description: "Bash — ssh <<'EOF' (Commandes distantes) : Exécute plusieurs commandes d'affilée sur une machine distante, en une seule session SSH."
tags: [bash, commande, heredoc]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Heredoc |
| **Contexte** | Commandes distantes |
| **Commande type** | `ssh <<'EOF'` |

## Rôle

Exécute plusieurs commandes d'affilée sur une machine distante, en une seule session SSH.

## Options

| Option | Rôle |
| --- | --- |
| `(cité 'EOF')` | les $ sont évalués sur la machine DISTANTE |
| `(nu EOF)` | les $ seraient évalués en LOCAL avant l'envoi |
| `-T` | désactive le pseudo-terminal, utile pour un script |

## Exemples

**Audit rapide**

```bash
ssh serveur <<'EOF'⏎hostname⏎uptime⏎df -h⏎EOF
```

**Mise à jour à distance**

```bash
ssh serveur <<'EOF'⏎sudo apt update⏎sudo apt -y upgrade⏎EOF
```

**Sans pseudo-terminal**

```bash
ssh -T serveur <<'EOF'⏎whoami⏎hostname⏎EOF
```

## Dans les autres shells

- [[27-commandes/03-macos/12-heredoc/ssh-eof|ssh <<'EOF' (macOS)]]

*Mots-clés : ssh distant remote heredoc plusieurs commandes session serveur eof bloc*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
