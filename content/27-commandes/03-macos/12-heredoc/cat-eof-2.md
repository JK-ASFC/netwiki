---
title: "cat <<EOF"
description: "macOS — cat <<EOF (Injecter des valeurs) : Délimiteur nu : le shell remplace $VAR et $(commande) AVANT d'écrire. Pratique pour injecter du dynamique, risqué pour une config qui contient des $."
tags: [macos, commande, heredoc]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Heredoc |
| **Contexte** | Injecter des valeurs |
| **Commande type** | `cat <<EOF` |

## Rôle

Délimiteur nu : le shell remplace $VAR et $(commande) AVANT d'écrire. Pratique pour injecter du dynamique, risqué pour une config qui contient des $.

## Options

| Option | Rôle |
| --- | --- |
| `(délimiteur nu EOF)` | $VAR et $(cmd) sont évalués avant l'écriture |
| `(\$ échappé)` | garde un $ littéral dans un heredoc nu |
| `(config avec des $)` | préfère la version citée 'EOF' |

## Exemples

**Snapshot système**

```zsh
cat > info.txt <<EOF⏎Hôte : $(hostname)⏎Kernel : $(uname -r)⏎Le : $(date +%F)⏎EOF
```

**Garder un $ précis**

```zsh
cat > prix.txt <<EOF⏎Total : 50\$⏎EOF
```

**Valeur d'une variable**

```zsh
cat > port.conf <<EOF⏎PORT=$APP_PORT⏎EOF
```

## Dans les autres shells

- [[27-commandes/01-bash/12-heredoc/cat-eof-2|cat <<EOF (Bash)]]

*Mots-clés : heredoc eof expansion variable substitution injecter dynamique cat nu*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
