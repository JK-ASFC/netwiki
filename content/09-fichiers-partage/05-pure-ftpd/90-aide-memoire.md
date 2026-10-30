---
title: Pure-FTPd — aide-mémoire des commandes
description: Commandes Pure-FTPd avec exemples — options sous forme de fichiers (Debian /etc/pure-ftpd/conf) ou de ligne de commande, utilisateurs virtuels (pure-pw useradd, passwd, usermod, list, mkdb), quotas et limites de débit, TLS, mode passif, utilisateurs connectés (pure-ftpwho), statistiques, tests.
tags: [aide-mémoire, pure-ftpd, ftp, pure-pw, utilisateurs virtuels, tls]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Pure-FTPd]].

## Options (Debian : un fichier par option)

```bash
cd /etc/pure-ftpd/conf
echo yes | sudo tee ChrootEveryone NoAnonymous
echo 2 | sudo tee TLS                              # 1 = TLS autorisé, 2 = TLS obligatoire
echo "40000 40100" | sudo tee PassivePortRange
echo 203.0.113.27 | sudo tee ForcePassiveIP
echo 1000 | sudo tee MinUID
echo /etc/pure-ftpd/pureftpd.pdb | sudo tee PureDB
sudo ln -s ../conf/PureDB /etc/pure-ftpd/auth/50pure    # activer l'authentification virtuelle
sudo cat /etc/ssl/private/ftp.key /etc/ssl/certs/ftp.crt | sudo tee /etc/ssl/private/pure-ftpd.pem > /dev/null
sudo chmod 600 /etc/ssl/private/pure-ftpd.pem
sudo systemctl restart pure-ftpd
```

Équivalent en ligne de commande (autres distributions) : `pure-ftpd -A -E -Y 2 -p 40000:40100 -P 203.0.113.27 -l puredb:/etc/pure-ftpd/pureftpd.pdb`.

## Utilisateurs virtuels (pure-pw)

```bash
sudo groupadd ftpgroup && sudo useradd -g ftpgroup -d /dev/null -s /usr/sbin/nologin ftpuser
sudo pure-pw useradd partenaire1 -u ftpuser -d /srv/ftp/partenaire1 -m          # -m : mettre à jour la base
sudo pure-pw passwd partenaire1 -m
sudo pure-pw usermod partenaire1 -N 500 -T 2048 -m                               # quota 500 Mo, débit 2 Mo/s descendant
sudo pure-pw usermod partenaire1 -r 10.0.0.0/8,203.0.113.0/24 -m                 # IP clientes autorisées
sudo pure-pw show partenaire1
sudo pure-pw list
sudo pure-pw userdel partenaire1 -m
sudo pure-pw mkdb                                                                # reconstruire la base .pdb
```

## Supervision et tests

```bash
sudo pure-ftpwho                       # sessions en cours
sudo pure-ftpwho -s                    # format compact
curl -v --ssl-reqd --user partenaire1 ftp://ftp.exemple.fr/
sudo journalctl -u pure-ftpd -f
```
