---
title: "anacron"
description: "Bash — anacron (Tâches differees) : Exécute les tâches périodiques manquees (machines non H24)."
tags: [bash, commande, automatisation]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Automatisation |
| **Contexte** | Tâches differees |
| **Commande type** | `anacron -n` |

## Rôle

Exécute les tâches périodiques manquees (machines non H24).

## Options

| Option | Rôle |
| --- | --- |
| `-n` | exécute maintenant (sans délai) |
| `-f` | force (ignore l'horodatage) |
| `-d` | mode debug (premier plan) |
| `-T` | teste le fichier de configuration |

## Exemples

**Fichier de configuration**

```bash
sudo nano /etc/anacrontab
```

**Ligne quotidienne (dans /etc/anacrontab)**

```bash
1 5 cron.daily run-parts /etc/cron.daily
```

**Ligne hebdomadaire**

```bash
7 10 cron.weekly run-parts /etc/cron.weekly
```

**Tester la config**

```bash
anacron -T
```

**Forcer maintenant**

```bash
sudo anacron -n -f
```

*Mots-clés : anacron cron tâches périodique diffère planification anacron*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
