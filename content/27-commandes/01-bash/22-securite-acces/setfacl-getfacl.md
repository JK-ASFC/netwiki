---
title: "setfacl / getfacl"
description: "Bash — setfacl / getfacl (Durcissement / Sécurité) : Droits fins par utilisateur, au-delà du rwx classique."
tags: [bash, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Sécurité & accès |
| **Contexte** | Durcissement / Sécurité |
| **Commande type** | `setfacl -m u:alice:rwx /srv/app` |

## Rôle

Droits fins par utilisateur, au-delà du rwx classique.

## En détail

Gère des permissions fines au-delà du classique propriétaire/groupe, par exemple autoriser un utilisateur précis. getfacl les affiche, setfacl les définit.

## Options

| Option | Rôle |
| --- | --- |
| `-m ‹règle›` | ajoute/modifie |
| `-x ‹règle›` | retire |
| `-R` | récursif |
| `-d` | ACL par défaut |
| `getfacl` | affiche |

## Exemples

**rwx à un user**

```bash
setfacl -m u:alice:rwx /srv/app
```

**Voir les ACL**

```bash
getfacl /srv/app
```

*Mots-clés : acl droits fins permissions utilisateur getfacl access control*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
