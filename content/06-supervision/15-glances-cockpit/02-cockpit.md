---
title: Cockpit
description: Cockpit (Red Hat, LGPL) — console web d'administration de serveurs Linux : installation (RHEL/Rocky/Alma et Fedora, Debian/Ubuntu avec backports), port 9090 et socket systemd, connexion avec les comptes système et sudo, modules (stockage et LVM, réseau, comptes, services, journaux, mises à jour, SELinux, pare-feu firewalld, conteneurs Podman, machines virtuelles cockpit-machines, terminal, Navigator, files Samba et NFS de 45Drives), gestion de plusieurs serveurs, certificat TLS, authentification à deux facteurs et sécurité.
tags: [cockpit, administration, linux, console web, rhel, podman, machines virtuelles]
icon: info
---

**Cockpit** donne une **console web** à un serveur Linux : on y voit les performances, les journaux, les services, le stockage, le réseau et l'on peut agir (redémarrer un service, créer un volume LVM, appliquer les mises à jour) avec les **mêmes droits** que le compte connecté. Il ne consomme rien quand personne ne l'utilise (activation par socket systemd).

## Installation

```bash
sudo dnf install cockpit cockpit-podman cockpit-machines cockpit-storaged && sudo systemctl enable --now cockpit.socket   # RHEL/Rocky/Alma/Fedora
sudo firewall-cmd --permanent --add-service=cockpit && sudo firewall-cmd --reload
sudo apt install -t "$(. /etc/os-release; echo $VERSION_CODENAME)-backports" cockpit cockpit-podman   # Debian (backports) ; Ubuntu : apt install cockpit
```

Accès : `https://<serveur>:9090`, connexion avec un compte système (cocher « réutiliser mon mot de passe pour les tâches privilégiées » pour sudo). Modules complémentaires 45Drives : **Navigator** (fichiers), **File Sharing** (Samba et NFS), **Identities**.

## Sécurité

- Certificat : déposer `*.cert` et `*.key` dans `/etc/cockpit/ws-certs.d/` (sinon certificat auto-signé).
- Restreindre l'accès : pare-feu (réseau d'administration seulement), `/etc/cockpit/disallowed-users` (root y figure par défaut), authentification à deux facteurs par PAM (`pam_google_authenticator` ou `pam_u2f`).
- Plusieurs serveurs : ajouter des hôtes depuis l'interface (connexion SSH depuis le serveur Cockpit principal).

Interface : voir les captures ci-dessous · commandes : [[90-aide-memoire|aide-mémoire]].

<!-- CAPTURE: Cockpit — vue d'ensemble d'un serveur | _assets/cockpit-apercu.png -->
<!-- CAPTURE: Cockpit — stockage et LVM | _assets/cockpit-stockage.png -->
<!-- CAPTURE: Cockpit — conteneurs Podman | _assets/cockpit-podman.png -->
