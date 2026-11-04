---
title: "usermod"
description: "Bash — usermod (Comptes / Modification) : Modifie un compte existant (groupes, shell, verrou)."
tags: [bash, commande, comptes-utilisateurs]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Comptes & utilisateurs |
| **Contexte** | Comptes / Modification |
| **Commande type** | `usermod -aG sudo jdupont` |

## Rôle

Modifie un compte existant (groupes, shell, verrou).

## En détail

Modifie un compte existant : l'ajouter à un groupe, changer son shell ou son dossier personnel.

## Options

| Option | Rôle |
| --- | --- |
| `-aG ‹groupes›` | ajoute à des groupes (sans retirer des autres) |
| `-g ‹groupe›` | change le groupe principal (primaire) du compte |
| `-s ‹shell›` | change le shell |
| `-d ‹home›` | change le répertoire perso |
| `-e ‹AAAA-MM-JJ›` | date d'expiration du compte (format AAAA-MM-JJ ; une valeur vide "" signifie aucune expiration) |
| `-L` | verrouille le compte |
| `-U` | deverrouille le compte |
| `-c ‹commentaire›` | description |

## Exemples

**Ajouter à un groupe**

```bash
usermod -aG docker jdupont
```

**Changer le shell**

```bash
usermod -s /usr/sbin/nologin svc
```

**Verrouiller le compte**

```bash
usermod -L jdupont
```

*Mots-clés : modifier compte groupe shell verrou usermod*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
