---
title: PuTTY
description: PuTTY, client SSH, Telnet et série de référence sous Windows — installation (MSI, winget, déploiement silencieux), sessions enregistrées et paramètres par défaut, authentification par clé (PuTTYgen, format PPK, Pageant, conversion OpenSSH), tunnels et rebond, connexion série aux consoles d'équipements réseau, journalisation, outils pscp, psftp et plink, sécurité (vérification des clés d'hôte, versions) et alternatives.
tags: [putty, ssh, série, console, pageant, puttygen, plink, windows]
icon: terminal
---

**PuTTY** (licence MIT) est le client SSH historique de Windows : léger, sans dépendance, il reste incontournable pour les **consoles série** des équipements réseau et les environnements anciens. Windows 10/11 intègre aussi un client OpenSSH (`ssh.exe`) et **Windows Terminal**, souvent plus pratiques pour le SSH courant (voir [[01-openssh/01-presentation|OpenSSH]]).

## Installation

```powershell
winget install PuTTY.PuTTY
# Déploiement silencieux (MSI 64 bits)
msiexec /i putty-64bit-0.83-installer.msi /qn
```

Sur Linux : `sudo apt install putty` (interface) ou `putty-tools` (puttygen, pscp, plink) ; macOS : `brew install putty`.

## Sessions

| Catégorie | Réglage utile |
| --- | --- |
| *Session* | Hôte, port, type (SSH, Serial, Telnet) ; **Default Settings** à configurer en premier (hérité par les nouvelles sessions) |
| *Window → Lines of scrollback* | 20 000 lignes |
| *Window → Translation* | UTF-8 |
| *Connection → Seconds between keepalives* | 30 (évite les coupures par les pare-feu) |
| *Connection → Data → Auto-login username* | Compte d'administration |
| *Connection → SSH → Auth → Credentials* | Clé privée `.ppk` |
| *Session → Logging* | Journal de session `&H-&Y&M&D-&T.log` (traçabilité des interventions) |

Les sessions sont dans le registre `HKCU\Software\SimonTatham\PuTTY\Sessions` : exportables (`reg export`) pour être partagées ou sauvegardées.

## Clés SSH

```text
puttygen                                   # générer une clé Ed25519, protéger par phrase de passe, enregistrer en .ppk
puttygen cle.ppk -O public-openssh -o cle.pub          # clé publique au format OpenSSH (authorized_keys)
puttygen id_ed25519 -o cle.ppk                         # convertir une clé OpenSSH en PPK
puttygen cle.ppk -O private-openssh-new -o id_ed25519  # et l'inverse
```

**Pageant** (agent) garde les clés déchiffrées en mémoire pendant la session Windows ; l'option *Allow agent forwarding* ne doit être activée que vers des hôtes de confiance (un administrateur de la machine distante peut utiliser l'agent).

## Console série

Pour configurer un commutateur ou un routeur neuf : câble console (RJ45 ou USB) + adaptateur USB-série.

| Paramètre | Valeur courante |
| --- | --- |
| Port | `COM3` (Gestionnaire de périphériques) ; `/dev/ttyUSB0` sous Linux |
| Vitesse | **9600** (Cisco, HPE, Juniper par défaut), 115200 (nombreux équipements récents) |
| Données / parité / arrêt | 8 / aucune / 1 (**8N1**) |
| Contrôle de flux | Aucun |

## Tunnels et rebond

*Connection → SSH → Tunnels* : redirection locale (`L8443 → 10.0.20.11:443`), distante, ou dynamique (SOCKS). Rebond par un bastion : *Connection → Proxy* type « SSH to proxy and use port forwarding » (versions récentes), ou `plink` en commande proxy.

## Outils en ligne de commande

```text
pscp -i cle.ppk fichier.cfg admin@10.0.0.2:/tmp/
psftp -i cle.ppk admin@srv-sftp-01
plink -batch -i cle.ppk admin@srv-web-01 "systemctl is-active nginx"
plink -serial COM3 -sercfg 9600,8,n,1,N
```

## Sécurité

- [ ] Version **à jour** (0.81 a corrigé une faille grave sur les clés ECDSA NIST P-521 : clés à régénérer si utilisées avec une version vulnérable)
- [ ] Vérifier l'empreinte de la clé d'hôte à la première connexion (comparer à l'inventaire ou au DNS SSHFP)
- [ ] Clés protégées par phrase de passe ; pas de mot de passe enregistré
- [ ] Préférer un **bastion** et une journalisation centralisée des sessions pour les accès privilégiés

Alternatives : **KiTTY** (fork avec fonctions supplémentaires), **MobaXterm** (onglets, X11, SFTP intégré), **Windows Terminal** + OpenSSH, [[02-termius|Termius]].
