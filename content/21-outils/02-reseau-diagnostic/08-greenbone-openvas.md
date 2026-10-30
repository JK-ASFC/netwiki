---
title: Greenbone (OpenVAS)
description: Analyse de vulnérabilités libre avec Greenbone Community Edition (GVM, scanner OpenVAS) — architecture (gvmd, ospd-openvas, flux de tests NVT, interface GSA), installation par Docker Compose, synchronisation des flux, cibles, listes de ports, configurations d'analyse, analyses authentifiées (SSH, SMB), tâches planifiées, rapports et filtres, gestion des faux positifs, cadre d'autorisation et limites.
tags: [greenbone, openvas, gvm, vulnérabilités, scanner, cve, audit]
icon: shield-alert
---

**Greenbone Community Edition** (GPL) est la solution libre d'**analyse de vulnérabilités** issue d'OpenVAS : elle teste les hôtes du réseau avec plus de 100 000 tests (*NVT*) et produit des rapports par CVE et niveau de gravité (CVSS). Version commerciale : **Greenbone Enterprise** (appliances, flux Enterprise plus complet et plus rapide).

> [!WARNING]
> Une analyse de vulnérabilités envoie beaucoup de trafic et des tests parfois intrusifs : autorisation écrite, information du SOC, fenêtres convenues pour les systèmes sensibles (automates, équipements médicaux, anciens systèmes qui peuvent planter).

## Architecture

| Composant | Rôle |
| --- | --- |
| **ospd-openvas / openvas-scanner** | Moteur d'analyse |
| **gvmd** | Gestionnaire : cibles, tâches, résultats, utilisateurs (base PostgreSQL) |
| **GSA** (*Greenbone Security Assistant*) | Interface web |
| Flux (*feeds*) | NVT, données SCAP/CERT, configurations — synchronisés quotidiennement |
| Redis, notus-scanner | Cache, analyse locale des paquets installés (analyses authentifiées) |

## Installation (Docker Compose)

Greenbone publie un fichier **Compose** officiel pour la Community Edition :

```bash
sudo apt install docker.io docker-compose-v2
mkdir -p ~/greenbone && cd ~/greenbone
curl -f -O -L https://greenbone.github.io/docs/latest/_static/compose.yaml
docker compose -f compose.yaml pull
docker compose -f compose.yaml up -d
# Mot de passe de l'administrateur (par défaut « admin » : le changer)
docker compose -f compose.yaml exec -u gvmd gvmd gvmd --user=admin --new-password='MotDePasseTresLong'
# Interface : http://127.0.0.1:9392 (publier derrière un reverse proxy HTTPS si accès distant)
```

La **première synchronisation** des flux et le chargement des tests prennent de longues minutes à plusieurs heures : attendre que *Administration → Feed Status* soit à jour avant d'analyser. Prévoir 4 vCPU, 8 Go de RAM et plus.

Kali Linux propose aussi des paquets (`gvm`, `gvm-setup`, `gvm-check-setup`).

## Analyser

1. *Configuration → Targets* : hôtes ou plages, **liste de ports** (*All IANA assigned TCP*, ou TCP et UDP les plus courants), méthode de vérification de vie, **identifiants** pour les analyses authentifiées.
2. *Configuration → Credentials* : compte **SSH** (clé) pour Linux et équipements, compte **SMB** pour Windows (administrateur local ou de domaine dédié aux analyses), ESXi, SNMP.
3. *Scans → Tasks* : cible + configuration (*Full and fast* par défaut) + planification (hebdomadaire, hors heures).
4. Lire le **rapport** : filtrer par gravité (`severity>7`), par hôte, par CVE ; exporter en PDF, CSV, XML.

| Type d'analyse | Voit | Remarques |
| --- | --- | --- |
| Non authentifiée | Services exposés, versions annoncées, configurations faibles | Vue de l'attaquant réseau ; plus de faux positifs/négatifs |
| **Authentifiée** | Paquets et correctifs installés, configuration locale | Beaucoup plus précise ; compte dédié, droits minimaux, mot de passe tournant |

## Traiter les résultats

- Prioriser : **gravité** × **exposition** (Internet, DMZ) × **exploitabilité** connue (catalogue KEV de la CISA).
- **Overrides** pour les faux positifs avérés ou les risques acceptés (justification, date d'expiration).
- Suivre la remédiation par tickets ([[04-glpi-installation|GLPI]]) et vérifier par une nouvelle analyse.
- Comparer deux rapports (*delta*) pour mesurer l'évolution.

## Limites

- Le flux **Community** est moins complet et décalé par rapport au flux Enterprise.
- Les applications web demandent un outil spécialisé ([[02-owasp-zap|ZAP]], [[03-burp-suite|Burp]]).
- Pour un parc Windows/Linux important, les scanners commerciaux ([[01-nessus|Nessus]], Qualys, Rapid7) ou un agent EDR avec gestion des vulnérabilités offrent une meilleure couverture et un meilleur suivi.

## Dépannage

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Liste des configurations d'analyse vide | Flux non synchronisé ou non chargé | Attendre la fin de la synchronisation, journaux de `gvmd` |
| Hôtes « dead » alors qu'ils sont actifs | ICMP filtré | *Alive test* : « Consider Alive » ou TCP-SYN |
| Analyse authentifiée sans effet | Identifiants refusés, SMB/WMI bloqués | Rapport « Authenticated scan » par hôte, pare-feu, compte |
| Analyse très lente | Trop de ports/hôtes simultanés, réseau | Ajuster `max_hosts`/`max_checks`, découper les cibles |
