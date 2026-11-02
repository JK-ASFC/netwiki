---
title: Interface graphique (Bareos WebUI)
description: Bareos WebUI — installation et accès, création du compte administrateur (profil webui-admin), tableau de bord des tâches, lancement manuel d'une sauvegarde, assistant de restauration (sélection des fichiers dans l'arborescence), clients, volumes et pools, planifications, console bconsole intégrée, sécurisation.
tags: [bareos, webui, interface graphique, sauvegarde, restauration]
icon: app-window
---

## Accès

Après installation de `bareos-webui`, créer un utilisateur de console ayant le profil `webui-admin` :

```bash
sudo bconsole
*configure add console name=admin password=MotDePasseWebUI profile=webui-admin tlsenable=false
*reload
```

Puis `http://bareos.corp.exemple.fr/bareos-webui/` (publier en HTTPS ; restreindre au réseau d'administration).

<!-- CAPTURE: Bareos WebUI — page de connexion | _assets/bareos-webui-connexion.png -->

## Tableau de bord

Tâches des dernières 24 h (réussies, en erreur, en cours), dernières tâches, état du Director.

<!-- CAPTURE: Bareos WebUI — tableau de bord des tâches | _assets/bareos-webui-tableau-de-bord.png -->

## Tâches

*Jobs → Run* : lancer une tâche (niveau Full/Incremental/Differential) ; *Jobs → Show* : historique, journal détaillé d'une tâche (fichiers, octets, durée, erreurs).

## Restauration

*Restore* : client, sauvegarde source (dernière ou date précise), **arborescence des fichiers** à cocher, client de destination, chemin (`/tmp/bareos-restores`), remplacement ou non → *Restore*.

<!-- CAPTURE: Bareos WebUI — assistant de restauration avec arborescence de fichiers | _assets/bareos-webui-restauration.png -->

## Clients, stockage, planification

*Clients* (état du File Daemon, version), *Storages* et *Pools* (volumes, statut Full/Append/Recycle, rétention), *Schedules* (prochaines exécutions), *Console* (commandes bconsole dans le navigateur).

<!-- CAPTURE: Bareos WebUI — liste des volumes d'un pool | _assets/bareos-webui-volumes.png -->

## Correspondance interface ↔ bconsole

| Action | WebUI | bconsole |
| --- | --- | --- |
| Lancer une sauvegarde | Jobs → Run | `run job=srv-web-01 level=Full yes` |
| Voir les tâches en cours | Dashboard | `status director` |
| Restaurer | Restore | `restore client=srv-web-01-fd` |
| Lister les volumes | Pools / Volumes | `list volumes pool=Full` |
