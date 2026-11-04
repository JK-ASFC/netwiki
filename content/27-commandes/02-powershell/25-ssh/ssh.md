---
title: "ssh"
description: "PowerShell — ssh (Accès distant) : Client OpenSSH intégré à Windows 10/11 : connexion distante et tunnels."
tags: [powershell, commande, ssh]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | SSH |
| **Contexte** | Accès distant |
| **Commande type** | `ssh edwin@10.20.0.2` |

## Rôle

Client OpenSSH intégré à Windows 10/11 : connexion distante et tunnels.

## En détail

Ouvre une session sécurisée sur une machine distante, comme si on était devant son terminal. La base de l'administration à distance.

## Options

| Option | Rôle |
| --- | --- |
| `-i ‹chemin_clé›` | clé privée |
| `-p ‹port›` | port (défaut 22) |
| `-L ‹port_local:hôte_cible:port_cible›` | tunnel local (ex: 8080:localhost:80) |
| `-J ‹bastion›` | rebond via un hôte (jump) |
| `-v` | mode verbeux (debug) |

## Exemples

**Connexion simple**

```powershell
ssh edwin@10.20.0.2
```

**Clé + port**

```powershell
ssh -i $env:USERPROFILE\.ssh\id_ed25519 -p 2222 edwin@10.20.0.2
```

**Tunnel local vers Grafana**

```powershell
ssh -L 3000:127.0.0.1:3000 edwin@10.20.0.2
```

## Dans les autres shells

- [[27-commandes/01-bash/23-ssh/ssh|ssh (Bash)]]
- [[27-commandes/03-macos/24-ssh/ssh|ssh (macOS)]]

*Mots-clés : ssh openssh client connexion distant windows tunnel port rebond bastion*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
