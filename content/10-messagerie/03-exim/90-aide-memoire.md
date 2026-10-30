---
title: Exim — aide-mémoire des commandes
description: Commandes Exim avec exemples — vérification de la configuration (exim -bV), Debian (update-exim4.conf, dpkg-reconfigure), test de routage (exim -bt, -bv), simulation de session SMTP (exim -bh), files d'attente (exim -bp, exiqgrep, exim -M, -Mrm, -qff, exipick), journaux (exigrep, eximstats), retours et tests.
tags: [aide-mémoire, exim, exim4, smtp, exiqgrep, file d'attente]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Exim]]. Sous Debian, le binaire est `exim4` (`exim` est un lien).

## Configuration

```bash
sudo exim -bV | head -5                    # version et vérification de la configuration
sudo dpkg-reconfigure exim4-config         # Debian : assistant
sudo update-exim4.conf && sudo systemctl restart exim4
sudo exim -bP | grep -E "primary_hostname|qualify_domain|local_interfaces"
sudo exim -bP transport_list
```

## Tests de routage et de session

```bash
sudo exim -bt alice.martin@exemple.fr       # comment l'adresse serait routée
sudo exim -bv -v externe@exemple.com        # vérification d'adresse
sudo exim -bh 203.0.113.50                  # simuler une session SMTP depuis cette IP (ACL)
sudo exim -d+all -bt alice.martin@exemple.fr 2>&1 | less     # débogage détaillé
echo "Subject: test" | sudo exim -v alice.martin@exemple.fr
```

## Files d'attente

```bash
sudo exim -bp                              # liste
sudo exim -bpc                             # nombre
sudo exim -bp | exiqsumm                   # résumé par domaine
sudo exiqgrep -f expediteur@exemple.net    # par expéditeur
sudo exiqgrep -r '@exemple.com$' -i        # par destinataire, identifiants seuls
sudo exiqgrep -o 86400 -i                  # plus vieux que 24 h
sudo exim -Mvh 1tVxyz-000abc-12            # en-têtes d'un message
sudo exim -Mvb 1tVxyz-000abc-12            # corps
sudo exim -M 1tVxyz-000abc-12              # forcer la livraison
sudo exim -Mrm 1tVxyz-000abc-12            # supprimer
sudo exiqgrep -f spam@exemple.net -i | xargs sudo exim -Mrm
sudo exim -qff                             # relancer toute la file, y compris les messages gelés
sudo exipick -zi | xargs sudo exim -Mrm    # supprimer les messages gelés
```

## Journaux

```bash
sudo tail -f /var/log/exim4/mainlog         # RHEL : /var/log/exim/main.log
sudo exigrep 1tVxyz-000abc-12 /var/log/exim4/mainlog
sudo exigrep alice.martin@exemple.fr /var/log/exim4/mainlog
sudo eximstats /var/log/exim4/mainlog | less
sudo tail /var/log/exim4/rejectlog /var/log/exim4/paniclog
```

| Symbole dans mainlog | Sens |
| --- | --- |
| `<=` | Message reçu |
| `=>` | Livraison réussie |
| `->` | Livraison supplémentaire du même message |
| `==` | Livraison différée |
| `**` | Échec définitif |
