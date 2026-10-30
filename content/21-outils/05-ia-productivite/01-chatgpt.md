---
title: ChatGPT et assistants conversationnels
description: Utiliser ChatGPT (et les assistants comparables) dans le travail d'administration réseau et système — usages efficaces (scripts, expressions régulières, analyse de journaux et de configurations, documentation, explication de protocoles), rédaction des demandes, vérification systématique, offres grand public et entreprise, confidentialité des données (ce qu'il ne faut jamais coller), gouvernance en entreprise et limites.
tags: [chatgpt, ia, assistant, llm, productivité, confidentialité, gouvernance]
icon: message-square
---

**ChatGPT** (OpenAI) et les assistants conversationnels comparables (Claude, Gemini, Microsoft Copilot, Mistral Le Chat) génèrent du texte et du code à partir de demandes en langage naturel. Bien utilisés, ils font gagner un temps considérable ; mal utilisés, ils produisent des erreurs plausibles et peuvent faire fuir des données.

## Usages efficaces

| Usage | Exemple de demande |
| --- | --- |
| Scripts | « Écris un script PowerShell qui liste les comptes AD inactifs depuis 90 jours et exporte un CSV, avec gestion d'erreurs et commentaires » |
| Expressions régulières, filtres | « Filtre d'affichage Wireshark pour les réponses DNS en erreur venant de 10.0.10.53 » |
| Lecture de configurations | « Explique cette configuration de route-map BGP (données anonymisées) et signale les risques » |
| Analyse de journaux | « Voici un extrait anonymisé de journal FreeRADIUS : pourquoi l'authentification EAP-TLS échoue-t-elle ? » |
| Conversion | Traduire un playbook Ansible en Terraform, une règle iptables en nftables |
| Documentation | Rédiger une procédure, un résumé de changement, un message aux utilisateurs |
| Apprentissage | Expliquer un protocole, comparer deux technologies, préparer une certification |

## Bien formuler

- Donner le **contexte** (système, version, contraintes : « Windows Server 2022, sans module ActiveDirectory, PowerShell 5.1 »).
- Demander un **format** précis (script commenté, tableau, étapes numérotées) et les **hypothèses** retenues.
- Itérer : fournir l'erreur obtenue, demander une correction ou une alternative.
- Demander explicitement les **risques** et les **commandes de vérification** / de retour arrière.

## Vérifier, toujours

> [!WARNING]
> Les modèles **inventent** parfois des commandes, options, paramètres ou noms de cmdlets qui n'existent pas, avec assurance. Toute commande générée doit être **comprise**, vérifiée dans la documentation officielle et testée en **laboratoire** avant la production — surtout les commandes destructrices (suppression, réinitialisation, `overridden`, `--force`).

## Confidentialité

Ne collez **jamais** dans un service public :

- mots de passe, clés privées, jetons d'API, secrets de connexion, chaînes de connexion ;
- configurations complètes non anonymisées (adresses publiques, noms internes, communautés SNMP, clés pré-partagées) ;
- données personnelles (journaux avec noms, adresses e-mail, IP d'utilisateurs) ou données classifiées.

Anonymisez (remplacer adresses, noms, domaines par des valeurs fictives comme `exemple.fr`, `10.0.0.0/8`) et retirez les secrets.

| Offre | Données |
| --- | --- |
| Grand public (gratuit / Plus / Pro) | Selon les paramètres, les conversations peuvent servir à l'amélioration des modèles : désactiver l'option dans les paramètres de contrôle des données |
| **Offres entreprise** (Business/Team, Enterprise, Edu) | Données non utilisées pour l'entraînement par défaut, SSO, administration, conservation et journalisation maîtrisées, engagements contractuels (DPA) |
| API | Conditions propres ; conservation limitée, options de zéro conservation selon le contrat |

## Gouvernance en entreprise

- Politique d'usage de l'IA : outils autorisés, catégories de données interdites, validation humaine obligatoire.
- Comptes **entreprise** avec SSO plutôt que comptes personnels (« IA fantôme »).
- Filtrage (proxy, CASB) des services non autorisés ; sensibilisation des équipes.
- Pour les données qui ne doivent pas sortir : modèles **locaux** ([[04-ollama-open-webui|Ollama et Open WebUI]]) ou offres hébergées dans un cadre contractuel adapté.

Pour le code dans l'éditeur, voir [[02-github-copilot|GitHub Copilot]] et [[03-cursor|Cursor]].
