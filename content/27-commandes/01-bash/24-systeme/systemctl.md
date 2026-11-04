---
title: "systemctl"
description: "Bash — systemctl (Supervision & exploitation) : Pilote les services systemd : état, démarrage, boot."
tags: [bash, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Système |
| **Contexte** | Supervision & exploitation |
| **Commande type** | `systemctl status nginx` |

## Rôle

Pilote les services systemd : état, démarrage, boot.

## En détail

Le chef d'orchestre des services (programmes qui tournent en arrière-plan, comme un serveur web). Permet de démarrer, arrêter, redémarrer un service ou de l'activer au démarrage.

## Options

| Option | Rôle |
| --- | --- |
| `status` | état + derniers logs |
| `start / stop` | démarre / arrête |
| `restart` | redémarre |
| `enable --now` | active au boot + démarre |
| `--failed` | unités en échec |
| `daemon-reload` | recharge les fichiers unit après création/modification d'un .service |
| `get-default` | affiche la cible (target) de démarrage par défaut |
| `set-default ‹cible.target›` | définit la cible de démarrage par défaut : multi-user.target (texte), graphical.target (bureau), rescue.target (maintenance) |
| `isolate ‹cible.target›` | bascule immédiatement vers une cible, comme changer de niveau à chaud (rescue.target, multi-user.target…) |
| `list-units --type=target` | liste les cibles actuellement actives |

## Exemples

**Redémarrer puis vérifier**

```bash
sudo systemctl restart nginx && systemctl status nginx
```

**Tout ce qui a échoué**

```bash
systemctl --failed
```

**Activer au démarrage**

```bash
sudo systemctl enable --now nginx
```

**Cible de démarrage par défaut**

```bash
systemctl get-default
```

**Démarrer en mode texte**

```bash
sudo systemctl set-default multi-user.target
```

**Basculer en maintenance**

```bash
sudo systemctl isolate rescue.target
```

*Mots-clés : service démon démarrer arrêter boot systemd activer unit redémarrer*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
