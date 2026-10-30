---
title: Présentation, installation et configuration
description: ClamAV — moteur antivirus libre (Cisco Talos), composants (clamd, freshclam, clamscan, clamdscan, clamonacc), installation sous Linux, Windows et macOS, configuration du démon et des mises à jour (miroir local, proxy), analyses à la demande et planifiées, analyse à l'accès, et limites.
tags: [clamav, antivirus, clamd, freshclam, clamonacc, installation, sécurité]
icon: info
---

**ClamAV** (GPL, maintenu par Cisco Talos) détecte virus, chevaux de Troie, documents piégés et hameçonnage. Il est surtout utilisé pour **analyser des flux** : messagerie (Rspamd, Postfix), partages de fichiers (Samba), dépôts web et FTP, proxys (ICAP), et pour des analyses planifiées de serveurs Linux.

## Composants

| Composant | Rôle |
| --- | --- |
| **freshclam** | Met à jour les signatures (plusieurs fois par jour) |
| **clamd** | Démon d'analyse (signatures en mémoire) : analyses rapides via socket |
| `clamscan` | Analyse autonome (recharge les signatures à chaque lancement : lent) |
| `clamdscan` | Client de clamd (rapide) |
| **clamonacc** | Analyse à l'accès (fanotify) |
| `sigtool` | Inspecter les bases, créer des signatures |

Le démon charge les signatures en mémoire : prévoyez **2 à 4 Go de RAM** (davantage pendant le rechargement, sauf `ConcurrentDatabaseReload no`).

## Installation

```bash
sudo apt install clamav clamav-daemon clamav-freshclam      # Debian / Ubuntu
sudo dnf install epel-release && sudo dnf install clamav clamd clamav-update   # RHEL
sudo systemctl enable --now clamav-freshclam clamav-daemon  # RHEL : clamav-freshclam, clamd@scan
```

| Plate-forme | Installation |
| --- | --- |
| Windows | Installateur officiel (MSI) : `freshclam.exe`, `clamd.exe`, `clamdscan.exe` ; configuration dans `C:\Program Files\ClamAV\` (copier les exemples `conf_examples`) |
| macOS | `brew install clamav` (copier `freshclam.conf.sample` puis lancer `freshclam`) |
| Docker | Image `clamav/clamav` (clamd + freshclam), utile comme service d'analyse réseau |

Sous Windows, ClamAV n'offre pas de protection en temps réel comparable à **Microsoft Defender**, qui reste l'antivirus recommandé sur ces postes et serveurs.

## Configuration du démon

```clamav /etc/clamav/clamd.conf (extrait, Debian)
LocalSocket /run/clamav/clamd.ctl
LocalSocketGroup clamav
LocalSocketMode 666
# TCPSocket 3310 et TCPAddr 127.0.0.1 pour un accès réseau (à protéger)
User clamav
MaxThreads 12
MaxFileSize 100M
MaxScanSize 400M
StreamMaxLength 100M
ScanArchive yes
ScanPDF yes
ScanOLE2 yes
AlertBrokenExecutables yes
AlertOLE2Macros yes
DetectPUA no
LogSyslog yes
LogFacility LOG_LOCAL6
ConcurrentDatabaseReload yes
```

| Paramètre | Remarque |
| --- | --- |
| `MaxFileSize`, `MaxScanSize`, `StreamMaxLength` | Au-delà, le fichier n'est pas analysé (ou signalé selon `AlertExceedsMax`) |
| `AlertOLE2Macros` | Signale les documents Office à macros (pièces jointes) |
| `DetectPUA` | Logiciels potentiellement indésirables (plus de faux positifs) |
| `TCPSocket` | Pour des clients distants : n'exposez jamais clamd sans filtrage |

## Mises à jour

```clamav /etc/clamav/freshclam.conf (extrait)
DatabaseMirror database.clamav.net
Checks 12
HTTPProxyServer proxy.corp.exemple.fr
HTTPProxyPort 3128
NotifyClamd /etc/clamav/clamd.conf
```

Pour de nombreux serveurs, montez un **miroir local** avec l'outil officiel **cvdupdate** (télécharge les fichiers `.cvd`/`.cdiff`, servis ensuite en HTTP) et pointez `PrivateMirror http://miroir-clamav.corp.exemple.fr` : cela évite d'être limité par le CDN de ClamAV.

```bash
sudo freshclam                # mise à jour manuelle
sigtool --info /var/lib/clamav/daily.cld
```

## Analyses

```bash
clamdscan --fdpass --multiscan --infected /srv/partages                 # via le démon
clamscan -r -i --exclude-dir='^/sys|^/proc|^/dev' --move=/srv/quarantaine /     # autonome (lent)
echo 'X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*' > /tmp/eicar.txt
clamdscan /tmp/eicar.txt          # doit détecter « Eicar-Signature »
```

## Analyse à l'accès

```clamav /etc/clamav/clamd.conf (ajouts)
OnAccessIncludePath /srv/partages
OnAccessIncludePath /var/www/depots
OnAccessExcludeUname clamav
OnAccessPrevention yes          # bloque l'ouverture d'un fichier infecté
```

```bash
sudo systemctl enable --now clamav-clamonacc
```

L'analyse à l'accès a un coût en performances ; limitez-la aux répertoires de dépôt.

## Suite

[[02-integrations-exploitation|Intégrations, signatures personnalisées et exploitation]]
