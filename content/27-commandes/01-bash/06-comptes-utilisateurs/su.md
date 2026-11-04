---
title: "su"
description: "Bash — su (Comptes / Élévation) : Ouvre une session sous une autre identité."
tags: [bash, commande, comptes-utilisateurs]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Comptes & utilisateurs |
| **Contexte** | Comptes / Élévation |
| **Commande type** | `su - jdupont` |

## Rôle

Ouvre une session sous une autre identité.

## En détail

Change d'utilisateur dans le terminal, souvent pour devenir root. su - ouvre une session propre comme si on s'était connecte.

## Options

| Option | Rôle |
| --- | --- |
| `-` | charge l'environnement de la cible |
| `-c ‹commande›` | exécute une seule commande |
| `-s ‹shell›` | force un shell |
| `(sans arg)` | bascule vers root |

## Exemples

**Vers root**

```bash
su -
```

**Vers un utilisateur**

```bash
su - jdupont
```

**Une seule commande**

```bash
su - postgres -c "psql -l"
```

## Dans les autres shells

- [[27-commandes/03-macos/06-comptes-utilisateurs/su|su (macOS)]]

*Mots-clés : changer utilisateur session root élévation su*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
