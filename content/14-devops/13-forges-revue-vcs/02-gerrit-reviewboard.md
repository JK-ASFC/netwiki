---
title: Gerrit et Review Board
description: Revue de code avant intégration — Gerrit Code Review (Apache 2.0, Java : revue par changement, votes Code-Review et Verified, intégration CI ; java -jar gerrit.war init, gerrit.config, ports 8080 et 29418, Docker gerritcodereview/gerrit, commandes SSH gerrit, git push refs/for/main, crochet Change-Id) et Review Board (MIT, Python/Django : revue de code et de documents pour Git, Subversion, Mercurial, Perforce ; pip install ReviewBoard, rb-site install, Docker beanbag/reviewboard, RBTools rbt post).
tags: [gerrit, review board, revue de code, git, ci, rbtools]
icon: git-pull-request
---

| | **Gerrit** | **Review Board** |
| --- | --- | --- |
| Licence | Apache 2.0 | MIT |
| Socle | Java (base NoteDb dans Git) | Python/Django, base SQL |
| Modèle | Chaque commit est un **changement** à approuver avant fusion | Demandes de revue sur des diffs (avant ou après commit) |
| Gestionnaires | Git | Git, Subversion, Mercurial, Perforce, ClearCase… |
| Usage | Grands projets (Android, Chromium), CI qui vote | Équipes multi-gestionnaires, revue de documents |

## Gerrit

```bash
sudo apt install -y openjdk-21-jre-headless git
sudo useradd -m -d /srv/gerrit gerrit && sudo -iu gerrit
wget https://gerrit-releases.storage.googleapis.com/gerrit-3.14.4.war -O gerrit.war
java -jar gerrit.war init --batch --install-all-plugins -d /srv/gerrit/site
git config --file /srv/gerrit/site/etc/gerrit.config gerrit.canonicalWebUrl 'https://gerrit.corp.exemple.fr/'
git config --file /srv/gerrit/site/etc/gerrit.config httpd.listenUrl 'proxy-https://127.0.0.1:8080/'
git config --file /srv/gerrit/site/etc/gerrit.config auth.type LDAP      # ou OAUTH, OPENID, HTTP
/srv/gerrit/site/bin/gerrit.sh restart
```

Ports : **8080** (web, derrière un reverse proxy) et **29418** (SSH Git et commandes d'administration). Docker : `docker run -d -p 8080:8080 -p 29418:29418 -v gerrit-site:/var/gerrit gerritcodereview/gerrit`. Sous Windows et macOS : même archive WAR avec Java.

Flux de travail :

```bash
git clone ssh://jk@gerrit.corp.exemple.fr:29418/infra/ansible && cd ansible
curl -Lo .git/hooks/commit-msg https://gerrit.corp.exemple.fr/tools/hooks/commit-msg && chmod +x .git/hooks/commit-msg   # ajoute Change-Id
git commit -am "Ajout du rôle NTP"
git push origin HEAD:refs/for/main            # crée le changement à relire
ssh -p 29418 jk@gerrit.corp.exemple.fr gerrit ls-projects
ssh -p 29418 jk@gerrit.corp.exemple.fr gerrit review --code-review +2 --submit 12345,1
```

Un changement est fusionné quand il obtient les votes requis (*Code-Review +2*, *Verified +1* posé par la CI : Jenkins, Zuul). Droits par projet dans *Browse → Repositories → Access*.

<!-- CAPTURE: Changement Gerrit avec votes et commentaires | _assets/gerrit-changement.png -->

## Review Board

```bash
python3 -m venv /opt/reviewboard && . /opt/reviewboard/bin/activate
pip install ReviewBoard "ReviewBoard[postgres]"
rb-site install /var/www/reviews.corp.exemple.fr        # questions : domaine, base, cache memcached, administrateur
```

Le site généré contient la configuration du serveur web (Apache `mod_wsgi` ou NGINX + Gunicorn). Docker : image officielle `beanbag/reviewboard` (avec PostgreSQL et memcached). Administration : `https://reviews.corp.exemple.fr/admin/` (dépôts, groupes de relecteurs, authentification LDAP/AD).

Côté développeur, **RBTools** publie les modifications à relire :

```bash
pip install RBTools
rbt setup-repo
rbt post                      # crée une demande de revue avec le diff courant
rbt post -u                   # met à jour la demande existante
rbt land                      # fusionne après approbation
```

Commandes : [[90-aide-memoire|aide-mémoire]].
