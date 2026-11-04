---
title: "dig"
description: "Bash — dig (Dépannage réseau) : Interroge le DNS (+short = réponse seule)."
tags: [bash, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Réseau |
| **Contexte** | Dépannage réseau |
| **Commande type** | `dig +short MX example.com` |

## Rôle

Interroge le DNS (+short = réponse seule).

## En détail

Interroge le DNS : à quelle adresse IP correspond un nom de domaine. L'outil de référence pour diagnostiquer la résolution de noms.

## Options

| Option | Rôle |
| --- | --- |
| `+short` | sortie minimale |
| `+trace` | depuis la racine |
| `+dnssec` | demande les signatures RRSIG |
| `+norecurse` | sans récursion : lit le cache |
| `@‹serveur›` | résolveur à interroger |
| `-x ‹ip›` | inverse (PTR) |
| `NS` | serveurs faisant autorité |
| `SOA` | paramètres et numéro de série de la zone |
| `MX` | serveurs de messagerie |
| `TXT` | SPF, DKIM, preuves de propriété |
| `SRV` | service, port et priorité |
| `DNSKEY` | clés publiques DNSSEC |

## Exemples

**IP d'un domaine**

```bash
dig +short example.com
```

**Serveurs mail**

```bash
dig +short example.com MX
```

**Signatures DNSSEC**

```bash
dig example.com DNSKEY +dnssec
```

## Dans les autres shells

- [[27-commandes/03-macos/22-reseau/dig|dig (macOS)]]

*Mots-clés : dns résolution nom domaine enregistrement mx txt nslookup dig*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
