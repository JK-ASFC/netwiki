---
title: Forges, revue et gestion de versions — aide-mémoire
description: Commandes Gogs (Docker), OneDev (Docker), Gerrit (init, gerrit.sh, SSH gerrit, push refs/for), Review Board (rb-site, rbt post), Subversion (svnadmin, svnserve, svn), Mercurial (hg) et Fossil (fossil) avec exemples.
tags: [aide-mémoire, gogs, onedev, gerrit, review board, svn, mercurial, fossil]
icon: terminal
---

Explications : [[01-forges|forges]] · [[02-gerrit-reviewboard|Gerrit et Review Board]] · [[03-subversion-mercurial-fossil|Subversion, Mercurial, Fossil]].

```bash
docker logs -f gogs ; docker exec -it gogs ls /data/gogs/conf
docker logs -f onedev
java -jar gerrit.war init --batch --install-all-plugins -d /srv/gerrit/site ; /srv/gerrit/site/bin/gerrit.sh status
git push origin HEAD:refs/for/main
ssh -p 29418 jk@gerrit.corp.exemple.fr gerrit ls-projects
ssh -p 29418 jk@gerrit.corp.exemple.fr gerrit review --code-review +2 --submit 12345,1
rb-site install /var/www/reviews.corp.exemple.fr ; rb-site upgrade /var/www/reviews.corp.exemple.fr
rbt post ; rbt post -u ; rbt land
svnadmin create /srv/svn/infra ; svnserve -d -r /srv/svn
svnadmin dump /srv/svn/infra | gzip > svn-infra.dump.gz ; svnadmin load /srv/svn/infra-restaure < svn-infra.dump
svn checkout https://svn.corp.exemple.fr/svn/infra/trunk infra ; svn update ; svn commit -m "Message"
hg clone https://hg.corp.exemple.fr/projet ; hg pull -u ; hg commit -m "Message" ; hg push
fossil init infra.fossil ; fossil ui infra.fossil ; fossil server --port 8080 /srv/fossil/ ; fossil sync
```
