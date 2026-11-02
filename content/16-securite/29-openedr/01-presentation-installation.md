---
title: Présentation, installation et place dans la défense
description: OpenEDR (Xcitium/Comodo, GPL) — agent EDR open source pour Windows : principes d'un EDR (télémétrie processus, fichiers, registre, réseau ; détection ; investigation ; réponse), composants (pilote noyau, service, envoi vers la plate-forme Xcitium ou un collecteur), installation (MSI), limites (dépendance à la console de l'éditeur, communauté réduite, Windows uniquement), alternatives libres (Wazuh, Velociraptor en surveillance, osquery, Sysmon et SIEM) et critères de choix face aux EDR commerciaux (Microsoft Defender for Endpoint, CrowdStrike, SentinelOne).
tags: [openedr, edr, xcitium, comodo, windows, détection, sysmon]
icon: info
---

Un **EDR** (*Endpoint Detection and Response*) enregistre l'activité détaillée des postes et serveurs (processus et leurs parents, fichiers, registre, connexions), détecte les comportements malveillants et permet d'**isoler** une machine ou de **tuer** un processus à distance. **OpenEDR** est le code de l'agent EDR de **Xcitium** (ex-Comodo) publié sous GPL.

> [!WARNING]
> Le code de l'agent est ouvert, mais l'**analyse** et la **console** reposent principalement sur la plate-forme de l'éditeur (offre gratuite limitée, puis payante) ; la communauté autour du projet est réduite et Windows seul est couvert. Évaluez-le comme un produit de l'éditeur plutôt que comme une solution libre autonome.

## Installation (aperçu)

1. Créer un compte sur la plate-forme Xcitium et récupérer l'installeur **MSI** de l'agent associé à votre organisation.
2. Déployer le MSI (GPO, Intune, [[06-support-parc/09-pdq-deploy|PDQ Deploy]]) sur un groupe pilote.
3. Vérifier la remontée des postes et de la télémétrie dans la console, ajuster les politiques, puis généraliser.

## Alternatives et complémentarité

| Besoin | Solution libre |
| --- | --- |
| Télémétrie détaillée Windows | **Sysmon** (Microsoft, gratuit) + collecte des journaux vers un SIEM ([[05-wazuh/01-presentation-installation\|Wazuh]], [[04-graylog/01-presentation-installation\|Graylog]]) |
| Détection sur hôte, intégrité, vulnérabilités | [[05-wazuh/01-presentation-installation\|Wazuh]] |
| Investigation et chasse sur le parc | [[15-velociraptor-grr/01-presentation-installation\|Velociraptor]] |
| Inventaire et requêtes | [[16-osquery-fleet/01-presentation-installation\|osquery/Fleet]] |
| Antivirus intégré Windows | [[09-defender/01-antivirus-configuration\|Microsoft Defender]] (et sa version EDR sous licence) |

Pour une organisation sans SOC dédié, un EDR commercial **avec service de surveillance (MDR)** apporte souvent plus de sécurité qu'un outil libre non exploité : l'outil ne vaut que par l'équipe qui traite les alertes.

Commandes : [[90-aide-memoire|aide-mémoire]].
