---
title: "cat <<'EOF'"
description: "macOS — cat <<'EOF' (Écrire un fichier) : Crée un fichier multi-ligne d'un seul bloc. Le délimiteur cité 'EOF' garde le contenu littéral : aucun $ n'est interprété."
tags: [macos, commande, heredoc]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Heredoc |
| **Contexte** | Écrire un fichier |
| **Commande type** | `cat <<'EOF'` |

## Rôle

Crée un fichier multi-ligne d'un seul bloc. Le délimiteur cité 'EOF' garde le contenu littéral : aucun $ n'est interprété.

## Options

| Option | Rôle |
| --- | --- |
| `(> écrase, >> ajoute à la fin)` | sens de la redirection |
| `(délimiteur cité 'EOF')` | le contenu reste littéral, les $ ne bougent pas |
| `(EOF final)` | seul, collé à la marge gauche, sans espace avant |

## Exemples

**Fichier de config**

```zsh
cat > config.conf <<'EOF'⏎port=8080⏎host=localhost⏎mode=production⏎EOF
```

**Garder les $ littéraux**

```zsh
cat > app.env <<'EOF'⏎SECRET=p@ss$word⏎DIR=$HOME/app⏎EOF
```

**Ajouter sans écraser**

```zsh
cat >> ~/.bashrc <<'EOF'⏎alias ll='ls -lah'⏎EOF
```

## Dans les autres shells

- [[27-commandes/01-bash/12-heredoc/cat-eof|cat <<'EOF' (Bash)]]

*Mots-clés : heredoc eof cat écrire créer fichier config bloc littéral multi-ligne*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
