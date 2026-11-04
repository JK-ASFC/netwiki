---
title: "curl"
description: "macOS — curl (Client HTTP) : Client HTTP universel : API, téléchargements, tests (présent par défaut sur macOS)."
tags: [macos, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Réseau |
| **Contexte** | Client HTTP |
| **Commande type** | `curl -fsSL https://example.com` |

## Rôle

Client HTTP universel : API, téléchargements, tests (présent par défaut sur macOS).

## En détail

Envoie des requêtes à une URL et affiche la réponse : tester une API, télécharger un fichier, vérifier qu'un site répond. Très polyvalent.

## Options

| Option | Rôle |
| --- | --- |
| `-f` | échoue proprement sur une erreur HTTP |
| `-s` | silencieux |
| `-S` | affiche quand même les erreurs |
| `-L` | suit les redirections |
| `-I` | en-têtes seuls |
| `-o ‹fichier›` | écrit dans un fichier |
| `-O` | garde le nom distant |
| `-H ‹'en-tête'›` | ajoute un en-tête |
| `-X ‹méthode›` | méthode HTTP (POST, PUT…) |
| `-d ‹données›` | corps de requête (implique POST) |
| `-u ‹user:pass›` | authentification |

## Exemples

**Télécharger**

```zsh
curl -O https://example.com/fichier.zip
```

**En-têtes**

```zsh
curl -I https://example.com
```

**POST JSON**

```zsh
curl -X POST -H 'Content-Type: application/json' -d '{"k":"v"}' https://api.site
```

## Dans les autres shells

- [[27-commandes/01-bash/21-reseau/curl|curl (Bash)]]

*Mots-clés : http api curl télécharger requête rest header web*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
