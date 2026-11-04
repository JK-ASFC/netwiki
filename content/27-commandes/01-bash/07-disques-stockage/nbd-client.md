---
title: "nbd-client"
description: "Bash — nbd-client (Stockage réseau) : Rattache un disque distant (Network Block Device) à un /dev/nbdX local : il s'utilise ensuite comme un disque ordinaire."
tags: [bash, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Disques & stockage |
| **Contexte** | Stockage réseau |
| **Commande type** | `nbd-client 10.0.0.1 10809 /dev/nbd0` |

## Rôle

Rattache un disque distant (Network Block Device) à un /dev/nbdX local : il s'utilise ensuite comme un disque ordinaire.

## Options

| Option | Rôle |
| --- | --- |
| `-N ‹nom d'export›` | nom de l'export côté serveur (obligatoire avec les serveurs récents) |
| `-l` | LISTE les exports proposés par le serveur sans rien connecter |
| `-d ‹/dev/nbdX›` | DÉCONNECTE le périphérique indiqué (à faire après démontage) |
| `-c ‹/dev/nbdX›` | vérifie si le périphérique est connecté (renvoie le PID du client) |
| `-p` | persistant : tente de se reconnecter automatiquement après une coupure réseau |
| `-t ‹secondes›` | délai d'expiration avant d'abandonner la connexion |
| `-b ‹taille de bloc›` | taille de bloc négociée (512, 1024, 4096) |

## Exemples

**Lister les exports**

```bash
sudo nbd-client -l 10.0.0.1
```

**Connecter**

```bash
sudo nbd-client 10.0.0.1 10809 /dev/nbd0 -N donnees
```

**Déconnecter**

```bash
sudo nbd-client -d /dev/nbd0
```

**Vérifier**

```bash
sudo nbd-client -c /dev/nbd0
```

*Mots-clés : nbd network block device disque réseau distant client attacher*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
