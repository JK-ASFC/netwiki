---
title: Bacula / Bareos — aide-mémoire des commandes
description: Commandes Bacula et Bareos avec exemples — console bconsole (status, run, list jobs/volumes, messages, restore guidé et par fichier, estimate, label, update volume, prune, purge, cancel, reload), vérification des configurations (bacula-dir -t, bacula-sd -t, bacula-fd -t), démons et ports, bls/bextract en secours, catalogue (sauvegarde), Bareos WebUI.
tags: [aide-mémoire, bacula, bareos, bconsole, sauvegarde, catalogue]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-architecture|Bacula]]. Les commandes sont identiques sous **Bareos** (`bareos-dir`, `bareos-sd`, `bareos-fd`).

## Vérifier et démarrer

```bash
sudo bacula-dir -t -c /etc/bacula/bacula-dir.conf
sudo bacula-sd -t -c /etc/bacula/bacula-sd.conf
sudo bacula-fd -t -c /etc/bacula/bacula-fd.conf
sudo systemctl restart bacula-dir bacula-sd bacula-fd
sudo ss -ltnp | grep -E '9101|9102|9103'        # director, client (fd), stockage (sd)
```

## bconsole

```text
status dir
status client=srv-web01-fd
status storage=Fichier
messages
run job=Sauvegarde-srv-web01 level=Full yes
estimate job=Sauvegarde-srv-web01 listing
list jobs
list jobtotals
llist jobid=1234
list volumes pool=Quotidien
list files jobid=1234
show job=Sauvegarde-srv-web01
cancel jobid=1240
reload
```

## Restauration

```text
restore
  5                               (sélectionner la sauvegarde la plus récente d'un client)
  cd /etc/nginx
  mark nginx.conf
  done
  yes

restore client=srv-web01-fd where=/tmp/restauration select current all done yes
restore jobid=1234 client=srv-web01-fd restoreclient=srv-secours-fd where=/srv/restauration file=/etc/hosts yes
```

## Volumes et rétention

```text
label storage=Fichier pool=Quotidien volume=Quotidien-0042
update volume=Quotidien-0042 volstatus=Used
update pool=Quotidien                  (appliquer les nouveaux paramètres du pool aux volumes)
prune volume=Quotidien-0012 yes
purge volume=Quotidien-0012            (destructif : supprime les enregistrements du catalogue)
```

## En dernier recours (sans catalogue)

```bash
sudo bls -j -V Quotidien-0042 Fichier                        # contenu d'un volume
sudo bextract -V Quotidien-0042 -i liste.txt Fichier /tmp/restauration
sudo bscan -s -m -c /etc/bacula/bacula-sd.conf -V Quotidien-0042 Fichier     # reconstruire le catalogue
```

## Catalogue

```bash
sudo -u bacula /etc/bacula/scripts/make_catalog_backup.pl MyCatalog     # selon distribution
sudo -u postgres pg_dump bacula > /srv/sauvegardes/catalogue-bacula-$(date +%F).sql
```

Bareos fournit une interface web (**Bareos WebUI**) pour suivre les travaux et lancer des restaurations.
