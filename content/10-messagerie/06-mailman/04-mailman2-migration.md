---
title: Mailman 2 (ancienne version) et migration vers Mailman 3
description: Exploiter une installation Mailman 2 encore en service (Python 2, fin de vie) — commandes bin/ (list_lists, newlist, add_members, remove_members, config_list, check_perms), interface d'administration, archives Pipermail — puis la migrer vers Mailman 3 (import21, hyperkitty_import, redirections des anciennes URL, tests).
tags: [mailman, mailman 2, mailman 3, migration, listes de diffusion, pipermail, hyperkitty]
icon: mails
---

**Mailman 2** a équipé la plupart des serveurs de listes pendant vingt ans. Il repose sur **Python 2**, en fin de vie, et n'est plus maintenu : les distributions récentes ne le fournissent plus. Cette page sert à **exploiter** un serveur existant le temps de le **migrer** vers [[01-presentation-installation|Mailman 3]] (ou vers [[25-listes-newsletters/03-sympa|Sympa]]).

## Exploiter Mailman 2

Les commandes se trouvent dans `/usr/lib/mailman/bin/` (Debian) ou `/usr/local/mailman/bin/` :

```bash
sudo /usr/lib/mailman/bin/list_lists                         # listes existantes
sudo /usr/lib/mailman/bin/newlist equipe admin@exemple.fr    # créer une liste
sudo /usr/lib/mailman/bin/list_members equipe
echo "alice@exemple.fr" | sudo /usr/lib/mailman/bin/add_members -r - equipe
sudo /usr/lib/mailman/bin/remove_members equipe bob@exemple.fr
sudo /usr/lib/mailman/bin/config_list -o equipe.cfg equipe   # exporter la configuration
sudo /usr/lib/mailman/bin/check_perms -f                     # corriger les droits
sudo /usr/lib/mailman/bin/withlist -r fix_url equipe         # après un changement de nom d'hôte
```

- Administration web : `https://serveur/cgi-bin/mailman/admin/<liste>`, archives Pipermail : `/pipermail/<liste>/`.
- Fichiers : `/var/lib/mailman/lists/<liste>/config.pck` (configuration et abonnés), `/var/lib/mailman/archives/private/<liste>.mbox/<liste>.mbox` (archives).

## Migrer vers Mailman 3

1. **Installer Mailman 3** (Core, Postorius, HyperKitty) sur un nouveau serveur ou à côté (voir [[01-presentation-installation|Mailman 3]]).
2. **Copier** `/var/lib/mailman/lists/` et `/var/lib/mailman/archives/private/` depuis l'ancien serveur.
3. Pour chaque liste, **créer** la liste dans Mailman 3 puis **importer** configuration et abonnés :

```bash
sudo -u list mailman create equipe@listes.exemple.fr
sudo -u list mailman import21 equipe@listes.exemple.fr /srv/mm2/lists/equipe/config.pck
```

4. **Importer les archives** dans HyperKitty (commande Django du projet web, chemin selon l'installation) :

```bash
sudo -u www-data django-admin hyperkitty_import --pythonpath /etc/mailman3 --settings settings \
  -l equipe@listes.exemple.fr /srv/mm2/archives/private/equipe.mbox/equipe.mbox
sudo -u www-data django-admin update_index --pythonpath /etc/mailman3 --settings settings
```

5. **Basculer** la réception (MX ou transport Postfix) vers Mailman 3.
6. **Rediriger** les anciennes URL (`/cgi-bin/mailman/listinfo/<liste>`, `/pipermail/<liste>/`) vers Postorius et HyperKitty pour ne pas casser les liens existants.
7. Prévenir les **propriétaires** de listes : nouvelle interface, comptes à créer (Mailman 3 utilise des comptes utilisateurs et non un mot de passe par liste).

> [!TIP]
> Tester la migration sur une copie avec quelques listes représentatives (liste modérée, liste d'information, grosse archive) avant de tout basculer.

Commandes : [[90-aide-memoire|aide-mémoire Mailman]].
