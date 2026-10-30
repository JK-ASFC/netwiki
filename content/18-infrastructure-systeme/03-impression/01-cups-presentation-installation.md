---
title: CUPS — présentation, installation et files d'impression
description: CUPS (OpenPrinting), le système d'impression de Linux et macOS — architecture (ordonnanceur cupsd, IPP sur 631, filtres, backends), impression sans pilote IPP Everywhere / AirPrint, installation sous Linux, configuration de cupsd.conf, ajout de files avec lpadmin (IPP, socket 9100, LPD), options par défaut, classes d'imprimantes et commandes lp, lpstat, cancel.
tags: [cups, impression, ipp, ipp everywhere, airprint, lpadmin, cupsd, imprimantes]
icon: info
---

**CUPS** (*Common UNIX Printing System*, Apache 2.0) est le système d'impression de **Linux** et de **macOS**. Créé par Easy Software Products, racheté par Apple, il est aujourd'hui développé par la communauté **OpenPrinting**. Il repose sur **IPP** (*Internet Printing Protocol*, HTTP sur le port **631**), qui sert à la fois à soumettre les travaux, à administrer et à partager les files.

## Architecture

```mermaid
flowchart LR
  APP["Applications / clients (lp, IPP)"] -- "IPP 631" --> S["cupsd (ordonnanceur)"]
  S --> F["Filtres<br/>(PDF → PWG raster / PostScript / PCL)"]
  F --> B["Backends : ipp, socket (9100), lpd, usb, smb"]
  B --> P["Imprimantes"]
```

| Élément | Rôle |
| --- | --- |
| `cupsd` | Ordonnanceur : files, travaux, droits, interface web `https://serveur:631` |
| Filtres | Conversion du document vers le langage de l'imprimante |
| Backends | Transport : `ipp://`, `ipps://`, `socket://` (JetDirect 9100), `lpd://`, `usb://` |
| PPD | Ancien format de description d'imprimante (déprécié) |
| **IPP Everywhere / AirPrint** | Impression **sans pilote** : l'imprimante décrit elle-même ses capacités et accepte PWG Raster/PDF |

> [!NOTE]
> **CUPS 2.5 / 3.x** : OpenPrinting abandonne progressivement les pilotes PPD au profit de l'impression sans pilote (IPP Everywhere) et des **Printer Applications** (pilotes encapsulés dans de petites applications IPP, distribuées en Snap ou paquets). Pour les anciennes imprimantes, des Printer Applications génériques (`ps-printer-app`, `hplip-printer-app`, `gutenprint-printer-app`) reprennent les anciens pilotes.

## Installation

```bash
sudo apt install cups cups-filters cups-browsed ipp-usb      # Debian / Ubuntu
sudo dnf install cups cups-filters                           # RHEL / Fedora
sudo systemctl enable --now cups
sudo usermod -aG lpadmin jk                                  # Debian (groupe « sys »/« wheel » sur RHEL)
```

macOS intègre CUPS (*Réglages → Imprimantes et scanners* ; l'interface web s'active avec `cupsctl WebInterface=yes`). Windows ne l'utilise pas mais imprime vers une file CUPS en **IPP** (voir l'article suivant).

## cupsd.conf (serveur d'impression)

```cupsd /etc/cups/cupsd.conf
LogLevel warn
MaxLogSize 10m
# Écoute réseau (au lieu de localhost:631 seulement)
Port 631
Listen /run/cups/cups.sock
ServerAlias impression.corp.exemple.fr
DefaultEncryption IfRequested
Browsing Off
WebInterface Yes
DefaultAuthType Basic

<Location />
  Order allow,deny
  Allow from 10.0.0.0/8
</Location>

<Location /admin>
  AuthType Default
  Require user @SYSTEM
  Order allow,deny
  Allow from 10.0.99.0/24
</Location>

<Location /admin/conf>
  AuthType Default
  Require user @SYSTEM
  Order allow,deny
  Allow from 10.0.99.0/24
</Location>

<Policy default>
  JobPrivateAccess default
  JobPrivateValues default
  <Limit Create-Job Print-Job Print-URI Validate-Job>
    Order deny,allow
  </Limit>
  <Limit Send-Document Send-URI Hold-Job Release-Job Restart-Job Purge-Jobs Set-Job-Attributes Create-Job-Subscription Renew-Subscription Cancel-Subscription Get-Notifications Reprocess-Job Cancel-Current-Job Suspend-Current-Job Resume-Job Cancel-My-Jobs Close-Job CUPS-Move-Job>
    Require user @OWNER @SYSTEM
    Order deny,allow
  </Limit>
  <Limit All>
    Order deny,allow
  </Limit>
</Policy>
```

```bash
sudo cupsd -t                       # test de la configuration
sudo systemctl restart cups
sudo cupsctl --share-printers --no-remote-any    # partager sans tout ouvrir
sudo firewall-cmd --permanent --add-service=ipp && sudo firewall-cmd --reload
```

`@SYSTEM` correspond aux groupes `SystemGroup` de `cups-files.conf` (`lpadmin`, `sys`, `root`).

## Ajouter des files

```bash
# Découvrir les imprimantes réseau et les pilotes
lpinfo -v                                        # périphériques détectés (dnssd://, ipp://, usb://)
lpinfo --make-and-model "HP" -m | head

# Imprimante IPP Everywhere (sans pilote) — méthode recommandée
sudo lpadmin -p IMP-RDC-01 -E -v ipps://imp-rdc-01.corp.exemple.fr/ipp/print -m everywhere \
  -L "Rez-de-chaussée, bureau 12" -D "Multifonction RDC"

# Imprimante ancienne via JetDirect (9100) avec PPD constructeur
sudo lpadmin -p IMP-ATELIER -E -v socket://10.0.50.21:9100 -P /usr/share/ppd/constructeur/modele.ppd

# Options par défaut
sudo lpadmin -p IMP-RDC-01 -o sides=two-sided-long-edge -o print-color-mode=monochrome -o media=iso_a4_210x297mm
sudo lpadmin -d IMP-RDC-01                       # file par défaut

# Classe (pool) : le premier membre libre imprime
sudo lpadmin -p IMP-RDC-01 -c POOL-RDC && sudo lpadmin -p IMP-RDC-02 -c POOL-RDC
sudo cupsenable POOL-RDC && sudo cupsaccept POOL-RDC
```

## Commandes courantes

```bash
lpstat -t                         # état complet : files, travaux, imprimante par défaut
lpstat -o                         # travaux en attente
lp -d IMP-RDC-01 -n 2 -o sides=two-sided-long-edge document.pdf
lpr -P IMP-RDC-01 document.pdf    # syntaxe BSD équivalente
cancel IMP-RDC-01-42              # annuler un travail ; cancel -a IMP-RDC-01 : tous
lpmove IMP-RDC-01-43 IMP-RDC-02   # déplacer un travail
sudo cupsdisable -r "Bourrage" IMP-RDC-01 ; sudo cupsenable IMP-RDC-01
lpoptions -p IMP-RDC-01 -l        # options disponibles
```

Suite : [[02-cups-partage-securite-exploitation|partage, sécurité et exploitation de CUPS]].
