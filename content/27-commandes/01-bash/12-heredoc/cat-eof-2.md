---
title: "cat <<EOF"
description: "Bash — cat <<EOF (Injecter des valeurs) : Délimiteur nu : le shell remplace $VAR et $(commande) AVANT d'écrire. Pratique pour injecter du dynamique, risqué pour une config qui contient des $."
tags: [bash, commande, heredoc]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
cat > info.txt <<EOF⏎Hôte : $(hostname)⏎Kernel : $(uname -r)⏎Le : $(date +%F)⏎EOF
```

**Garder un $ précis**

```bash
cat > prix.txt <<EOF⏎Total : 50\$⏎EOF
```

**Valeur d'une variable**

```bash
cat > port.conf <<EOF⏎PORT=$APP_PORT⏎EOF
```

## Dans les autres shells

- [[27-commandes/03-macos/12-heredoc/cat-eof-2|cat <<EOF (macOS)]]

*Mots-clés : heredoc eof expansion variable substitution injecter dynamique cat nu*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
