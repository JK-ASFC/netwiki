---
title: Clients, sécurité et dépannage
description: Accéder à WebDAV depuis Windows (client WebClient et ses limites, lecteur réseau, réglages du registre, alternatives rclone mount et clients tiers), macOS (Finder), Linux (davfs2, GVfs, rclone), sécuriser un serveur WebDAV (TLS, authentification, scripts, verrous, journaux), tester avec curl et cadaver, et résoudre les problèmes fréquents.
tags: [webdav, windows, webclient, macos, davfs2, rclone, sécurité, dépannage]
icon: settings-2
---

## Windows

Le **mini-redirecteur WebDAV** (service **WebClient**) permet de monter un lecteur réseau :

```powershell
# Windows Server : installer la fonctionnalité (déjà présente sur les postes Windows 10/11)
Install-WindowsFeature WebDAV-Redirector
Set-Service WebClient -StartupType Automatic; Start-Service WebClient

net use Z: https://dav.corp.exemple.fr/partage /user:alice /persistent:yes
# ou : Explorateur → Connecter un lecteur réseau → https://dav.corp.exemple.fr/partage
```

| Limite du client Windows | Réglage (registre `HKLM\SYSTEM\CurrentControlSet\Services\WebClient\Parameters`) |
| --- | --- |
| Taille de fichier limitée à ~47 Mo | `FileSizeLimitInBytes` (DWORD, max `0xFFFFFFFF` ≈ 4 Go) |
| Authentification Basic refusée en HTTP | `BasicAuthLevel` = 2 (Basic autorisé en HTTPS et HTTP) — gardez 1 (HTTPS seulement) |
| Lenteur à l'ouverture des répertoires | Détection automatique du proxy : désactiver si inutile ; délais `SendReceiveTimeoutInSec` |

> [!NOTE]
> Le client WebClient est ancien et limité (taille des fichiers, performances, gestion des verrous). Pour un usage intensif, préférez **rclone mount** (avec WinFsp), le client de synchronisation de la plateforme (Nextcloud, Seafile) ou un client tiers (WinSCP, Cyberduck, RaiDrive).

```powershell
winget install WinFsp.WinFsp Rclone.Rclone
rclone mount davcorp: Z: --vfs-cache-mode full --network-mode
```

## macOS

Finder → *Aller → Se connecter au serveur* (⌘K) → `https://dav.corp.exemple.fr/partage`. Les fichiers `._*` et `.DS_Store` créés par le Finder peuvent être bloqués côté serveur. Alternatives : Cyberduck / Mountain Duck, `rclone mount` (macFUSE ou FUSE-T).

## Linux

```bash
# davfs2 (montage noyau via FUSE)
sudo apt install davfs2
echo "https://dav.corp.exemple.fr/partage alice MotDePasse" | sudo tee -a /etc/davfs2/secrets && sudo chmod 600 /etc/davfs2/secrets
sudo mount -t davfs https://dav.corp.exemple.fr/partage /mnt/dav

# GVfs (GNOME Fichiers) : davs://dav.corp.exemple.fr/partage
# rclone
rclone mount davcorp: /mnt/dav --vfs-cache-mode full --daemon
```

## Tester

```bash
curl -u alice -X PROPFIND -H "Depth: 1" https://dav.corp.exemple.fr/partage/ | xmllint --format -
curl -u alice -T rapport.pdf https://dav.corp.exemple.fr/partage/rapport.pdf
curl -u alice -X MKCOL https://dav.corp.exemple.fr/partage/nouveau/
curl -u alice -X MOVE -H "Destination: https://dav.corp.exemple.fr/partage/nouveau/rapport.pdf" https://dav.corp.exemple.fr/partage/rapport.pdf
cadaver https://dav.corp.exemple.fr/partage/        # client interactif (ls, put, get, lock)
litmus https://dav.corp.exemple.fr/partage/ alice MotDePasse   # suite de conformité
```

## Sécurité

- [ ] **HTTPS uniquement** (l'authentification Basic transmet le mot de passe à chaque requête)
- [ ] Authentification forte : comptes annuaire, mots de passe d'application, ou SSO via la plateforme ; MFA sur les accès Internet
- [ ] **Aucune exécution** de scripts dans les répertoires WebDAV (PHP, CGI désactivés) : sinon un envoi de fichier devient une exécution de code
- [ ] Droits du système de fichiers limités au compte du serveur web, répertoires dédiés
- [ ] Limite de taille d'envoi, limitation de débit, [[01-fail2ban/01-presentation-configuration|Fail2ban]] sur les échecs 401
- [ ] Journaux d'accès conservés (qui a envoyé / supprimé quoi)
- [ ] Antivirus sur les envois (ICAP, ClamAV) si les fichiers viennent de l'extérieur

## Problèmes fréquents

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Windows : « Le dossier n'est pas valide » / erreur 67 | Service WebClient arrêté, URL HTTP avec Basic | Démarrer WebClient, utiliser HTTPS |
| Windows : copie > 50 Mo en échec | `FileSizeLimitInBytes` | Augmenter la limite, ou rclone |
| `405 Method Not Allowed` sur PROPFIND (nginx) | Module `dav_ext` absent | Installer et charger `dav_ext` |
| `423 Locked` | Verrou orphelin d'un client planté | Expiration du verrou, purge de la base de verrous |
| `413 Request Entity Too Large` | Limite du serveur ou du proxy | `client_max_body_size`, `LimitRequestBody`, `maxAllowedContentLength` |
| Fichiers enregistrés vides depuis Office | Pas de verrous, cache client | `LOCK` activé, `--vfs-cache-mode full` (rclone) |
| macOS : impossible d'écrire | Fichiers `._*` refusés, verrous | Autoriser ou filtrer ces fichiers, activer LOCK |
