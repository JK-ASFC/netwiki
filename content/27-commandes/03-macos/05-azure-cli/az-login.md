---
title: "az login"
description: "macOS — az login (Azure / authentification) : Ouvre une session Azure et met en cache les jetons utilisés par toutes les commandes suivantes."
tags: [macos, commande, azure-cli]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Azure CLI |
| **Contexte** | Azure / authentification |
| **Commande type** | `az login` |

## Rôle

Ouvre une session Azure et met en cache les jetons utilisés par toutes les commandes suivantes.

## Options

| Option | Rôle |
| --- | --- |
| `--use-device-code` | connexion par code sur un autre appareil |
| `--service-principal` | connexion d'un compte applicatif |
| `--tenant ‹tenant›` | annuaire Entra ID à cibler |
| `--identity` | utilise l'identité managée de la machine |
| `--allow-no-subscriptions` | autorise un compte sans abonnement |
| `--scope ‹portee›` | portée du jeton demande |
| ⚠️ `az logout` | ferme la session et purge les jetons |
| `--output ‹format›` | forme de la réponse affichée |

> [!WARNING]
> Options à manier avec précaution : `az logout`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Connexion interactive**

```zsh
az login
```

**Serveur sans navigateur**

```zsh
az login --use-device-code
```

**Compte applicatif**

```zsh
az login --service-principal --username APP_ID --password SECRET --tenant TENANT_ID
```

**Depuis une VM Azure**

```zsh
az login --identity
```

## Dans les autres shells

- [[27-commandes/01-bash/05-azure-cli/az-login|az login (Bash)]]

*Mots-clés : azure login connexion authentification jeton principal service tenant navigateur appareil*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
