---
title: "zeek"
description: "Bash — zeek (Analyse réseau (NSM)) : Moniteur de sécurité réseau (NSM) : analyse le trafic en direct ou rejoue un .pcap, et produit des logs riches (conn, dns, http, ssl). zeekctl pilote le déploiement."
tags: [bash, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Réseau |
| **Contexte** | Analyse réseau (NSM) |
| **Commande type** | `zeek -r capture.pcap` |

## Rôle

Moniteur de sécurité réseau (NSM) : analyse le trafic en direct ou rejoue un .pcap, et produit des logs riches (conn, dns, http, ssl). zeekctl pilote le déploiement.

## Options

| Option | Rôle |
| --- | --- |
| `-i ‹interface›` | capture en direct sur une interface |
| `-r ‹fichier.pcap›` | rejoue une capture enregistrée |
| `-C` | ignore les checksums (utile sur port mirroring) |
| `local` | charge la policy locale (local.zeek) |
| `-e ‹script›` | exécute un script Zeek en ligne |
| `(zeekctl deploy)` | installe la conf puis (re)lance le cluster |
| `(zeek-cut)` | extrait des colonnes nommées d'un .log |

## Exemples

**Rejouer une capture**

```bash
zeek -C -r capture.pcap
```

**Capturer en direct**

```bash
sudo zeek -i eth0 local
```

**Extraire des colonnes**

```bash
cat conn.log | zeek-cut id.orig_h id.resp_h
```

*Mots-clés : zeek nsm analyse réseau trafic pcap logs conn dns ssl ids sécurité zeekctl zeek-cut*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
