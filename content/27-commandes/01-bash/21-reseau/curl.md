---
title: "curl"
description: "Bash — curl (Tests d'API / Web) : Client HTTP universel ; -fsSL = script propre."
tags: [bash, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Réseau |
| **Contexte** | Tests d'API / Web |
| **Commande type** | `curl -fsSL https://example.com/install.sh` |

## Rôle

Client HTTP universel ; -fsSL = script propre.

## En détail

Envoie des requêtes à une URL et affiche la réponse : tester une API, télécharger un fichier, vérifier qu'un site répond. Très polyvalent.

## Options

| Option | Rôle |
| --- | --- |
| `-f` | échoue sur erreur HTTP |
| `-s` | silencieux |
| `-S` | affiche les erreurs |
| `-L` | suit les redirections |
| `-I` | en-têtes seuls |
| `-o ‹fichier›` | écrit dans un fichier |
| `-O` | nom de fichier distant |
| `-H ‹en-tete›` | ajoute un en-tête (ex: 'Content-Type: application/json') |
| `-X ‹methode›` | méthode HTTP (POST...) |
| `-d ‹donnees›` | corps de la requête (implique POST) |
| `-u ‹user:pass›` | authentification |
| ⚠️ `-k` | ignore le certificat TLS |
| `-w ‹format›` | (--write-out) format de sortie, ex: %{http_code} |
| `-X ‹POST›` | méthode HTTP (GET, POST, PUT, DELETE) |

> [!WARNING]
> Options à manier avec précaution : `-k`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**En-têtes**

```bash
curl -I https://example.com
```

**POST JSON**

```bash
curl -X POST -H "Content-Type: application/json" -d '{"k":"v"}' https://api.site
```

**Code HTTP**

```bash
curl -s -o /dev/null -w "%{http_code}" https://example.com
```

## Dans les autres shells

- [[27-commandes/03-macos/22-reseau/curl|curl (macOS)]]

*Mots-clés : http télécharger api requête web download rest header curl*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
