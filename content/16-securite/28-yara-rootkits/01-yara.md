---
title: YARA
description: YARA (VirusTotal, BSD) — langage de règles pour identifier des logiciels malveillants et des fichiers par motifs textuels, hexadécimaux et conditions : installation (Linux, Windows, macOS, yara-python, YARA-X en Rust), écriture de règles (meta, strings, condition, modules pe, elf, hash, math), analyse de fichiers, répertoires et mémoire de processus, sources de règles (signature-base, YARA Forge), intégration (ClamAV, Velociraptor, Wazuh, Security Onion, Thor/Loki, IntelOwl), tests et précautions contre les faux positifs.
tags: [yara, yara-x, détection, malware, règles, forensic]
icon: info
---

**YARA** décrit des familles de logiciels malveillants (ou n'importe quel type de fichier) par des **motifs** et des **conditions** ; une règle peut ensuite être appliquée à des fichiers, des répertoires ou la mémoire d'un processus. C'est le langage commun des équipes de détection : de nombreux outils (scanners, EDR, [[15-velociraptor-grr/01-presentation-installation|Velociraptor]], [[04-clamav/01-presentation-installation|ClamAV]], [[05-wazuh/01-presentation-installation|Wazuh]]) savent exécuter des règles YARA. **YARA-X** est sa réécriture en Rust, compatible pour l'essentiel.

## Installation

| Système | Commande |
| --- | --- |
| Debian/Ubuntu | `sudo apt install yara` |
| RHEL | `sudo dnf install yara` (EPEL) |
| Windows | Binaires des versions GitHub (VirusTotal/yara) ; YARA-X : `yr.exe` |
| macOS | `brew install yara` (et `yara-x`) |
| Python | `pip install yara-python` |

## Écrire une règle

```text
import "pe"

rule Corp_Script_Telechargeur_PowerShell
{
  meta:
    auteur = "equipe-securite"
    description = "Script PowerShell téléchargeant et exécutant du code encodé"
    date = "2026-11-02"
  strings:
    $a = "DownloadString" ascii wide nocase
    $b = "FromBase64String" ascii wide nocase
    $c = "IEX" ascii wide
    $hex = { 4D 5A 90 00 03 00 00 00 }       // en-tête PE intégré
  condition:
    filesize < 2MB and 2 of ($a, $b, $c) or ($hex and pe.number_of_sections > 7)
}
```

```bash
yara -r -s regles.yar /home /tmp                 # -r récursif, -s afficher les chaînes trouvées
yara -p 4 -f regles-index.yar /srv/partage       # 4 threads, mode rapide
sudo yara regles.yar 1234                        # mémoire du processus 1234
yr scan regles.yar /tmp                          # YARA-X
yarac regles.yar regles.compilees                # compilation pour un chargement rapide
```

Sources de règles : dépôts publics (signature-base de Florian Roth, **YARA Forge** qui agrège et teste des règles), CERT nationaux. Toujours **tester** une règle sur un corpus de fichiers sains avant de la déployer largement.

Suite : [[02-chkrootkit-rkhunter|chkrootkit et rkhunter]] · [[90-aide-memoire|aide-mémoire]].
