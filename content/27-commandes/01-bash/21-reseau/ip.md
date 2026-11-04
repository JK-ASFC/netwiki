---
title: "ip"
description: "Bash — ip (Dépannage réseau) : Affiche ET configure les adresses IP, liens et routes (remplace ifconfig/route). La configuration est À CHAUD, non persistante (perdue au redémarrage)."
tags: [bash, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Réseau |
| **Contexte** | Dépannage réseau |
| **Commande type** | `ip -br a` |

## Rôle

Affiche ET configure les adresses IP, liens et routes (remplace ifconfig/route). La configuration est À CHAUD, non persistante (perdue au redémarrage).

## En détail

L'outil moderne pour tout ce qui touche au réseau : voir ses adresses IP, ses interfaces, ses routes. Remplace l'ancien ifconfig.

## Options

| Option | Rôle |
| --- | --- |
| `-br` | format bref et compact (une ligne par entrée) |
| `a` | objet ADRESSES (ip a) : les IP des interfaces |
| `r` | objet ROUTES (ip r) : la table de routage |
| `l` | objet LIENS (ip l) : l'état des interfaces |
| `neigh` | objet VOISINS : la table ARP/NDP |
| `add ‹cible›` | AJOUTE une entrée : une adresse en CIDR (10.0.0.5/24), ou « default » pour la route par défaut |
| `del ‹cible›` | SUPPRIME l'entrée indiquée |
| `set` | MODIFIE un lien : à compléter par up ou down |
| `flush` | VIDE toutes les entrées (ex : ip a flush dev eth0) |
| `dev ‹interface›` | cible une interface précise (eth0, ens3, wlan0…) |
| `via ‹passerelle›` | passerelle d'une route (ip r add … via 10.0.0.1) |
| `up` | active l'interface (à utiliser avec set) |
| `down` | désactive l'interface (à utiliser avec set) |

## Exemples

**IP des interfaces**

```bash
ip -br a
```

**Ajouter une IP**

```bash
sudo ip a add 10.0.0.5/24 dev eth0
```

**Supprimer une IP**

```bash
sudo ip a del 10.0.0.5/24 dev eth0
```

**Activer une interface**

```bash
sudo ip l set dev eth0 up
```

**Route par défaut**

```bash
sudo ip r add default via 10.0.0.1
```

**Ajouter une route**

```bash
sudo ip r add 192.168.2.0/24 via 10.0.0.1 dev eth0
```

*Mots-clés : adresse ip interface route réseau carte lien passerelle arp add del dev flush ip*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
