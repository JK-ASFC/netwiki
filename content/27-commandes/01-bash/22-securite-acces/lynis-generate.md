---
title: "lynis generate"
description: "Bash — lynis generate (Audit / Génération) : Génère des éléments utilisés par Lynis, comme les identifiants d'hôte (hostid et hostid2) qui servent d'empreinte de la machine."
tags: [bash, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Sécurité & accès |
| **Contexte** | Audit / Génération |
| **Commande type** | `lynis generate hostids` |

## Rôle

Génère des éléments utilisés par Lynis, comme les identifiants d'hôte (hostid et hostid2) qui servent d'empreinte de la machine.

## Options

| Option | Rôle |
| --- | --- |
| `hostids` | génère les identifiants d'hôte |
| `systemd-units` | génère des unités systemd |

## Exemples

**Voir les identifiants actuels**

```bash
lynis show hostids
```

**Générer des identifiants**

```bash
lynis generate hostids
```

**Générer des unités systemd**

```bash
lynis generate systemd-units
```

## Dans les autres shells

- [[27-commandes/03-macos/23-securite-acces/lynis-generate|lynis generate (macOS)]]

*Mots-clés : lynis generate hostids systemd-units identifiant hôte empreinte*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
