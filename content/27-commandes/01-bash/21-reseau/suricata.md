---
title: "suricata"
description: "Bash — suricata (IDS / IPS) : Moteur de détection d'intrusion (IDS/IPS) : inspecte le trafic avec des règles et lève des alertes (eve.json, fast.log). suricata-update gère les règles."
tags: [bash, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Réseau |
| **Contexte** | IDS / IPS |
| **Commande type** | `suricata -r capture.pcap` |

## Rôle

Moteur de détection d'intrusion (IDS/IPS) : inspecte le trafic avec des règles et lève des alertes (eve.json, fast.log). suricata-update gère les règles.

## Options

| Option | Rôle |
| --- | --- |
| `-i ‹interface›` | écoute une interface en direct |
| `-r ‹fichier.pcap›` | analyse une capture |
| `-T` | teste la configuration sans lancer |
| `-c ‹suricata.yaml›` | chemin du fichier de conf |
| `-S ‹règles›` | charge un fichier de règles précis |
| `-l ‹dossier›` | dossier de sortie des logs |
| `(suricata-update)` | met à jour les règles |
| `(suricatasc)` | console de contrôle du démon |

## Exemples

**Tester la config**

```bash
sudo suricata -T -c /etc/suricata/suricata.yaml
```

**Analyser une capture**

```bash
suricata -r capture.pcap -l ./logs
```

**Mettre à jour les règles**

```bash
sudo suricata-update
```

*Mots-clés : suricata ids ips détection intrusion règles alertes pcap eve fast réseau sécurité*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
