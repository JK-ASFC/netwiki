---
title: "ssh"
description: "Bash — ssh (Accès distant / Bastion) : Connexion distante et tunnels de ports."
tags: [bash, commande, ssh]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | SSH |
| **Contexte** | Accès distant / Bastion |
| **Commande type** | `ssh -i ~/.ssh/id_ed25519 -p 22 edwin@10.20.0.2` |

## Rôle

Connexion distante et tunnels de ports.

## En détail

Ouvre une session sécurisée sur une machine distante, comme si on était devant son terminal. La base de l'administration à distance.

## Options

| Option | Rôle |
| --- | --- |
| `-i ‹chemin_clé›` | clé privée |
| `-p ‹port›` | port |
| `-L ‹port_local:hôte_cible:port_cible›` | tunnel local (ex: 8080:localhost:80) |
| `-R ‹port_distant:hôte_local:port_local›` | tunnel inverse (ex: 9000:localhost:3000) |
| `-J ‹user@hôte_rebond›` | rebond (jump host) |
| `-N` | pas de commande (tunnel) |
| `-v` | mode verbeux |
| `-V` | affiche la version d'OpenSSH installée puis quitte (utile pour vérifier le support d'un algorithme ou d'une option) |

## Exemples

**Tunnel local**

```bash
ssh -N -L 8080:localhost:80 user@host
```

**Tunnel reverse**

```bash
ssh -N -R 9183:localhost:9100 user@host
```

**Rebond bastion**

```bash
ssh -J bastion user@cible-interne
```

## Dans les autres shells

- [[27-commandes/02-powershell/25-ssh/ssh|ssh (PowerShell)]]
- [[27-commandes/03-macos/24-ssh/ssh|ssh (macOS)]]

*Mots-clés : connexion distant serveur tunnel port forward rebond jump bastion ssh*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
