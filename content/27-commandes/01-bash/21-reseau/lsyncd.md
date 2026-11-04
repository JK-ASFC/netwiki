---
title: "lsyncd"
description: "Bash — lsyncd (Réseau) : Synchronise un dossier en CONTINU : surveille les changements (inotify) et lance rsync automatiquement."
tags: [bash, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Réseau |
| **Contexte** | Réseau |
| **Commande type** | `lsyncd /etc/lsyncd/lsyncd.conf.lua` |

## Rôle

Synchronise un dossier en CONTINU : surveille les changements (inotify) et lance rsync automatiquement.

## Options

| Option | Rôle |
| --- | --- |
| `-log ‹catégorie›` | active un niveau de journalisation |
| `-nodaemon` | reste au premier plan |
| `-pidfile ‹chemin›` | écrit le PID dans un fichier |
| `-insist` | démarre malgré une cible injoignable |
| `-delay ‹secondes›` | regroupe les évènements avant transfert |
| `(fichier de configuration)` | lsyncd /etc/lsyncd/lsyncd.conf.lua |
| ⚠️ `(piège : suppression)` | delete = true propage les rm |
| `(surveillance inotify)` | limite de dossiers surveillés |

> [!WARNING]
> Options à manier avec précaution : `(piège : suppression)`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Lancer avec sa configuration**

```bash
sudo lsyncd /etc/lsyncd/lsyncd.conf.lua
```

**Mise au point au premier plan**

```bash
sudo lsyncd -nodaemon -log Exec /etc/lsyncd/lsyncd.conf.lua
```

**Vérifier la syntaxe Lua avant de lancer**

```bash
lua -e "dofile('/etc/lsyncd/lsyncd.conf.lua')"
```

**Relever la limite inotify**

```bash
echo 'fs.inotify.max_user_watches=524288' | sudo tee /etc/sysctl.d/40-lsyncd.conf && sudo sysctl -p /etc/sysctl.d/40-lsyncd.conf
```

*Mots-clés : lsyncd synchronisation continue temps réel inotify rsync miroir réplication lua daemon surveillance*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
