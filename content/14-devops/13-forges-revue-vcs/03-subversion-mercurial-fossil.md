---
title: Subversion, Mercurial et Fossil
description: Gestionnaires de versions autres que Git — Apache Subversion (centralisé : svnadmin create, svnserve, Apache mod_dav_svn et authz, VisualSVN Server sous Windows, TortoiseSVN, svn checkout, commit, update, branches par copie, svnadmin dump et hotcopy, migration vers Git avec git svn), Mercurial (distribué : hg init, clone, commit, push, hg serve et hgweb, TortoiseHg, migration hg-fast-export) et Fossil (dépôt SQLite avec tickets, wiki et forum intégrés : fossil init, ui, server, clone, sync), installation Linux, Windows et macOS.
tags: [subversion, svn, mercurial, hg, fossil, gestion de versions, tortoisesvn]
icon: git-commit-horizontal
---

[[01-git/01-presentation-installation|Git]] domine aujourd'hui, mais ces outils restent présents (code historique, fichiers binaires volumineux, projets scientifiques, petits projets autonomes).

| Outil | Modèle | Licence | Points forts |
| --- | --- | --- | --- |
| **Subversion (SVN)** | Centralisé | Apache 2.0 | Droits par répertoire, verrous sur fichiers binaires, extraction partielle |
| **Mercurial** | Distribué | GPL v2 | Simplicité des commandes, extensions |
| **Fossil** | Distribué | BSD | Un seul fichier SQLite avec **tickets, wiki, forum** et interface web intégrée |

## Subversion

Installation :

```bash
sudo apt install -y subversion                 # client et serveur (Debian/Ubuntu)
sudo dnf install -y subversion                 # RHEL/Rocky
brew install subversion                        # macOS
```

```powershell
winget install --id TortoiseSVN.TortoiseSVN -e    # client graphique Windows (intégré à l'Explorateur, outils en ligne de commande en option)
```

Serveur `svnserve` (protocole `svn://`, port 3690) :

```bash
sudo svnadmin create /srv/svn/infra
sudo tee /srv/svn/infra/conf/svnserve.conf >/dev/null <<'CONF'
[general]
anon-access = none
auth-access = write
password-db = passwd
authz-db = authz
CONF
echo -e "[users]\njk = MdpSvn2026" | sudo tee -a /srv/svn/infra/conf/passwd
sudo svnserve -d -r /srv/svn                     # svn://srv-svn-01/infra
```

Serveur Apache (HTTPS, authentification LDAP possible) : modules `dav_svn` et `authz_svn` (`sudo apt install libapache2-mod-svn`) :

```apache
<Location /svn>
  DAV svn
  SVNParentPath /srv/svn
  AuthType Basic
  AuthName "Dépôts Subversion"
  AuthUserFile /etc/apache2/svn.htpasswd
  AuthzSVNAccessFile /etc/apache2/svn.authz
  Require valid-user
</Location>
```

Sous Windows, **VisualSVN Server** (édition gratuite limitée) fournit Apache + Subversion avec une console de gestion et l'authentification Windows.

Usage :

```bash
svn checkout https://svn.corp.exemple.fr/svn/infra/trunk infra && cd infra
svn update ; svn status ; svn diff
svn add scripts/sauvegarde.sh && svn commit -m "Ajout du script de sauvegarde"
svn copy ^/trunk ^/branches/v2 -m "Branche v2"          # branche = copie bon marché
svn log -l 10 ; svn blame scripts/sauvegarde.sh
sudo svnadmin dump /srv/svn/infra | gzip > /srv/sauvegardes/svn-infra-$(date +%F).dump.gz
sudo svnadmin hotcopy /srv/svn/infra /srv/sauvegardes/svn-infra-copie
git svn clone --stdlayout https://svn.corp.exemple.fr/svn/infra infra-git   # migration vers Git (historique conservé)
```

## Mercurial

```bash
sudo apt install -y mercurial ; brew install mercurial
```

```powershell
winget install --id Mercurial.Mercurial -e ; winget install --id TortoiseHg.TortoiseHg -e
```

```bash
hg init projet && cd projet
hg add && hg commit -m "Premier commit" -u "JK <jk@corp.exemple.fr>"
hg clone https://hg.corp.exemple.fr/projet copie
hg pull -u ; hg push ; hg log -l 5 ; hg branches
hg serve -p 8000                     # serveur web de test ; en production : hgweb (WSGI) derrière Apache ou NGINX
```

Migration vers Git : outil `hg-fast-export` (dépôt `fast-export`) ou import des forges (Heptapod, une variante de GitLab, héberge encore Mercurial).

## Fossil

```bash
sudo apt install -y fossil ; brew install fossil
```

```powershell
winget install --id Fossil.Fossil -e
```

```bash
fossil init infra.fossil                      # crée le dépôt (affiche le mot de passe administrateur)
fossil ui infra.fossil                        # interface locale : timeline, tickets, wiki, forum, réglages
fossil server --port 8080 /srv/fossil/        # sert tous les dépôts du dossier (http://srv-fossil-01:8080/infra)
fossil clone https://fossil.corp.exemple.fr/infra infra.fossil
fossil open infra.fossil ; fossil add . ; fossil commit -m "Ajout des scripts" ; fossil sync
```

Un dépôt Fossil est un **fichier SQLite** : le sauvegarder suffit (copie à froid ou `fossil backup`).

Commandes : [[90-aide-memoire|aide-mémoire]].
