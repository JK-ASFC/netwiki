---
title: "sudo tee"
description: "Bash — sudo tee (Fichier système) : Écrit un fichier appartenant à root. 'sudo cat > /etc/x' échoue : la redirection est ouverte par ton shell, sans les droits. tee, lui, tourne sous sudo."
tags: [bash, commande, heredoc]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Heredoc |
| **Contexte** | Fichier système |
| **Commande type** | `sudo tee` |

## Rôle

Écrit un fichier appartenant à root. 'sudo cat > /etc/x' échoue : la redirection est ouverte par ton shell, sans les droits. tee, lui, tourne sous sudo.

## Options

| Option | Rôle |
| --- | --- |
| `-a` | ajoute à la fin au lieu d'écraser |
| `(tee reçoit le flux sur stdin)` | et l'écrit en tant que root |
| `(> /etc/… échoue)` | la redirection n'a pas les droits, d'où tee |

## Exemples

**Créer un vhost**

```bash
sudo tee /etc/nginx/sites-available/site.conf <<'EOF'⏎server {⏎    listen 80;⏎    server_name example.com;⏎}⏎EOF
```

**Ajouter une entrée hosts**

```bash
sudo tee -a /etc/hosts <<'EOF'⏎10.20.0.2 ratpi⏎EOF
```

**Paramètre sysctl**

```bash
sudo tee /etc/sysctl.d/99-perso.conf <<'EOF'⏎net.ipv4.ip_forward=1⏎EOF
```

## Dans les autres shells

- [[27-commandes/03-macos/12-heredoc/sudo-tee|sudo tee (macOS)]]

*Mots-clés : sudo tee root système etc fichier privilège heredoc droits écrire*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
