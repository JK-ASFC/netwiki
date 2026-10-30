---
title: Ghidra
description: Ghidra, suite de rétro-ingénierie logicielle de la NSA — usages défensifs (analyse de logiciels malveillants, vérification d'un binaire, compréhension d'un micrologiciel, recherche de vulnérabilités autorisée), installation (Java 21), environnement d'analyse isolé, projets et import de binaires (PE, ELF, Mach-O, micrologiciels), analyse automatique, décompilateur, références croisées, chaînes, scripts Java et Python, Ghidra Server pour le travail en équipe, cadre légal.
tags: [ghidra, rétro-ingénierie, malware, décompilateur, analyse, binaire, sécurité]
icon: binary
---

**Ghidra** (Apache 2.0), publié par la NSA en 2019, désassemble et **décompile** des programmes compilés (Windows, Linux, macOS, micrologiciels embarqués, nombreuses architectures : x86, ARM, MIPS, PowerPC…) pour en reconstituer la logique en pseudo-code C. Alternative libre à IDA Pro.

Usages défensifs pour une équipe d'infrastructure ou de sécurité :

- comprendre le comportement d'un **logiciel malveillant** trouvé sur un serveur (indicateurs : domaines, adresses, clés de registre, mécanisme de persistance) ;
- examiner un **micrologiciel** d'équipement ou un binaire tiers suspect ;
- vérifier ce que fait réellement un outil avant de l'utiliser.

> [!WARNING]
> **Légalité** : la rétro-ingénierie est encadrée (droit d'auteur, licences, articles L122-6-1 du Code de la propriété intellectuelle en France pour l'interopérabilité). Les logiciels malveillants s'analysent dans un **laboratoire isolé** : machine virtuelle dédiée sans accès au réseau de production, instantanés, pas de dossiers partagés, échantillons stockés dans des archives chiffrées (mot de passe conventionnel `infected`).

## Installation

```bash
# Java 21 (JDK) requis — voir OpenJDK
sudo apt install openjdk-21-jdk
unzip ghidra_11.4.2_PUBLIC_*.zip -d /opt         # archive depuis le dépôt officiel GitHub NationalSecurityAgency/ghidra
/opt/ghidra_11.4.2_PUBLIC/ghidraRun
```

Windows : `ghidraRun.bat` ; macOS : `ghidraRun` (ou `brew install --cask ghidra`). Vérifiez l'empreinte SHA-256 publiée avec la version.

## Premiers pas

1. *File → New Project* (projet non partagé), puis **importer** le binaire (format et architecture détectés automatiquement).
2. Ouvrir dans le **CodeBrowser** et accepter l'**analyse automatique** (fonctions, références, types, chaînes).
3. Explorer :

| Fenêtre | Usage |
| --- | --- |
| *Symbol Tree* | Fonctions, importations (API Windows appelées : `CreateRemoteThread`, `InternetOpenUrl`, `RegSetValueEx`…), exportations |
| **Defined Strings** | Chaînes : URL, adresses IP, chemins, commandes, messages |
| Listing | Désassemblage |
| **Decompiler** | Pseudo-code C de la fonction courante |
| References / *Show References to* | Qui appelle cette fonction, qui utilise cette chaîne |
| Function Graph | Graphe de flux de contrôle |

Renommer variables et fonctions au fil de la compréhension (touche <kbd>L</kbd>), commenter, définir des structures : le décompilateur s'améliore à mesure.

## Scripts et automatisation

Le *Script Manager* propose des scripts Java et Python (Jython, et **PyGhidra** pour Python 3) ; le mode **headless** analyse des lots de fichiers sans interface :

```bash
/opt/ghidra_11.4.2_PUBLIC/support/analyzeHeadless /srv/analyses Projet -import echantillon.bin -postScript ExtraireChaines.java -deleteProject
```

## Travail en équipe

**Ghidra Server** héberge des projets partagés (contrôle de version des annotations, verrouillage, comptes) pour une équipe de réponse aux incidents.

## Compléments

| Besoin | Outil |
| --- | --- |
| Analyse rapide automatisée en bac à sable | Sandbox (CAPE, ANY.RUN, Joe Sandbox selon la politique de confidentialité) |
| Règles de détection | **YARA** (rédiger des règles à partir des chaînes et motifs trouvés) |
| Analyse de micrologiciels | binwalk (extraction), puis Ghidra |
| Débogage dynamique | x64dbg (Windows), GDB |

Les indicateurs extraits (domaines, IP, empreintes) alimentent le SIEM, l'EDR et le pare-feu ([[05-suricata/02-regles-ips|règles Suricata]], [[09-defender/02-endpoint-exploitation|indicateurs Defender]]).
