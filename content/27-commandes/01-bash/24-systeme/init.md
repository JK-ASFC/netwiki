---
title: "init"
description: "Bash — init (Niveaux d'exécution) : Fait basculer le système vers un niveau d'exécution : 0 arrêt, 6 redémarrage, 1 maintenance. init est aussi le tout premier processus lancé par le noyau (PID 1)."
tags: [bash, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Système |
| **Contexte** | Niveaux d'exécution |
| **Commande type** | `init 6` |

## Rôle

Fait basculer le système vers un niveau d'exécution : 0 arrêt, 6 redémarrage, 1 maintenance. init est aussi le tout premier processus lancé par le noyau (PID 1).

## En détail

init est le tout premier processus (PID 1) qui démarre le système. Comme commande, « init N » (ou telinit N) fait passer la machine à un niveau d'exécution : 0 éteint, 6 redémarre, 1 pour la maintenance. Sur les systèmes systemd, ces niveaux sont traduits en « targets » (init 3 correspond à systemctl isolate multi-user.target).

## Options

| Option | Rôle |
| --- | --- |
| `0 / 1 / 2 / 3 / 4 / 5 / 6 / S` | niveau d'exécution cible (exclusif) : 0 = arrêt, 1 et S = maintenance mono-utilisateur, 3 = multi-utilisateur en mode texte, 5 = graphique, 6 = redémarrage (2 et 4 dépendent de la distribution) |
| `-t ‹secondes›` | délai laissé aux processus avant leur arrêt forcé (SIGKILL) lors du changement de niveau |
| `q` | telinit q : recharge la configuration (relit /etc/inittab en SysV, recharge systemd) sans changer de niveau |
| `u` | telinit u : ré-exécute le démon init lui-même, utile après sa mise à jour |

## Exemples

**Mode maintenance**

```bash
sudo init 1
```

**Redémarrer**

```bash
sudo init 6
```

**Arrêter**

```bash
sudo init 0
```

**Mode graphique**

```bash
sudo init 5
```

*Mots-clés : init telinit runlevel niveau exécution boot démarrage systemd target arrêt redémarrage*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
