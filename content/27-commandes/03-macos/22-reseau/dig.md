---
title: "dig"
description: "macOS — dig (Résolution DNS) : Interroge le DNS (paquet bind, présent par défaut sur macOS)."
tags: [macos, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Réseau |
| **Contexte** | Résolution DNS |
| **Commande type** | `dig example.com +short` |

## Rôle

Interroge le DNS (paquet bind, présent par défaut sur macOS).

## En détail

Interroge le DNS : à quelle adresse IP correspond un nom de domaine. L'outil de référence pour diagnostiquer la résolution de noms.

## Options

| Option | Rôle |
| --- | --- |
| `+short` | réponse minimale (juste l'IP) |
| `+trace` | suit la délégation depuis la racine |
| `+dnssec` | demande les signatures RRSIG |
| `+norecurse` | sans récursion : lit le cache |
| `@‹serveur›` | interroge un résolveur précis |
| `-x ‹IP›` | résolution inverse |
| `NS` | serveurs faisant autorité |
| `SOA` | paramètres et numéro de série de la zone |
| `MX` | enregistrements de messagerie |
| `TXT` | SPF, DKIM, preuves de propriété |
| `SRV` | service, port et priorité |
| `DNSKEY` | clés publiques DNSSEC |

## Exemples

**IP d'un domaine**

```zsh
dig example.com +short
```

**Via un DNS précis**

```zsh
dig @1.1.1.1 example.com
```

**Enregistrements MX**

```zsh
dig example.com MX +short
```

## Dans les autres shells

- [[27-commandes/01-bash/21-reseau/dig|dig (Bash)]]

*Mots-clés : dns résolution dig nom domaine ip enregistrement*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
