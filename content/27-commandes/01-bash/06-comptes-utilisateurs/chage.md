---
title: "chage"
description: "Bash — chage (Comptes / Expiration) : Gère l'expiration et le vieillissement des mots de passe."
tags: [bash, commande, comptes-utilisateurs]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Comptes & utilisateurs |
| **Contexte** | Comptes / Expiration |
| **Commande type** | `chage -l jdupont` |

## Rôle

Gère l'expiration et le vieillissement des mots de passe.

## En détail

Gère l'expiration des mots de passe d'un compte : durée de validité, date d'expiration. Outil de politique de sécurité des comptes.

## Options

| Option | Rôle |
| --- | --- |
| `-l` | affiche la politique |
| `-M ‹jours›` | durée de validité max (jours) |
| `-m ‹jours›` | durée MINIMALE avant de pouvoir rechanger le mot de passe |
| `-W ‹jours›` | jours d'avertissement avant l'expiration du mot de passe |
| `-I ‹jours›` | jours d'inactivité après expiration avant verrouillage |
| `-E ‹AAAA-MM-JJ›` | date d'expiration du compte (format AAAA-MM-JJ ; -1 supprime l'expiration) |
| `-d 0` | force le changement au prochain login |

## Exemples

**Voir la politique**

```bash
chage -l jdupont
```

**Validité 90 jours**

```bash
chage -M 90 jdupont
```

**Compte expirant**

```bash
chage -E 2026-12-31 jdupont
```

*Mots-clés : expiration vieillissement mot de passe politique chage*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
