---
title: "getent"
description: "Bash — getent (Comptes / Annuaire) : Interroge les bases système (passwd, group, hosts)."
tags: [bash, commande, comptes-utilisateurs]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Comptes & utilisateurs |
| **Contexte** | Comptes / Annuaire |
| **Commande type** | `getent passwd jdupont` |

## Rôle

Interroge les bases système (passwd, group, hosts).

## En détail

Interroge les bases du système (utilisateurs, groupes, hôtes), qu'elles soient locales ou centralisées. Pour vérifier qu'un compte existe vraiment.

## Options

| Option | Rôle |
| --- | --- |
| `passwd` | comptes |
| `group` | groupes |
| `hosts` | résolution de noms |
| `shadow` | infos d'expiration |

## Exemples

**Un compte**

```bash
getent passwd jdupont
```

**Un groupe**

```bash
getent group sudo
```

**Tous les comptes**

```bash
getent passwd
```

*Mots-clés : annuaire nsswitch passwd group hosts getent*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
