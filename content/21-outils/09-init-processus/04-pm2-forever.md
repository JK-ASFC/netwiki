---
title: PM2 et forever (Node.js)
description: Gestionnaires de processus pour applications Node.js — PM2 (AGPL : mode cluster sur tous les cœurs, rechargement sans coupure, fichier ecosystem.config.js, journaux et pm2-logrotate, pm2 startup et save, surveillance pm2 monit, Windows) et forever (MIT : relance simple d'un script, maintenance communautaire uniquement), comparaison avec une unité systemd et bonnes pratiques de production.
tags: [pm2, forever, node.js, processus, cluster, production]
icon: hexagon
---

| | PM2 | forever |
| --- | --- | --- |
| Rôle | Gestionnaire de processus de production : cluster, rechargement, journaux, démarrage au boot | Relance un script qui s'arrête |
| État | Très utilisé, maintenu | Maintenu par la communauté seulement ; le projet recommande PM2 ou nodemon |
| Licence | AGPL 3.0 | MIT |

Pour une seule application sur un serveur Linux, une unité [[01-systemd|systemd]] suffit ; PM2 apporte le **mode cluster** et le rechargement à chaud. Voir aussi [[06-nodejs/01-presentation-installation|Node.js]].

## PM2

```bash
sudo npm install -g pm2
pm2 start server.js --name api -i max          # mode cluster : un processus par cœur
pm2 list ; pm2 show api ; pm2 monit
pm2 logs api --lines 100
pm2 reload api                                  # rechargement sans interruption (cluster)
pm2 restart api ; pm2 stop api ; pm2 delete api
```

Fichier `ecosystem.config.js` versionné avec l'application :

```javascript
module.exports = {
  apps: [{
    name: 'api',
    script: './server.js',
    cwd: '/opt/api',
    instances: 'max',
    exec_mode: 'cluster',
    max_memory_restart: '512M',
    env_production: { NODE_ENV: 'production', PORT: 3000 },
    error_file: '/var/log/api/erreurs.log',
    out_file: '/var/log/api/sortie.log',
    time: true,
  }],
};
```

```bash
pm2 start ecosystem.config.js --env production
pm2 install pm2-logrotate && pm2 set pm2-logrotate:max_size 20M
pm2 startup systemd -u api --hp /home/api       # affiche la commande sudo à lancer pour créer le service
pm2 save                                        # mémorise la liste des processus pour le redémarrage
pm2 update                                      # après une mise à jour de PM2
```

Lancer PM2 sous un **compte dédié** (jamais root). Sous Windows, `pm2 startup` n'est pas pris en charge : enregistrer PM2 comme service avec [[01-outils-windows/02-services-nssm-winsw|NSSM ou WinSW]] ou utiliser directement ces outils pour l'application.

## forever

```bash
sudo npm install -g forever
forever start -l forever.log -o sortie.log -e erreurs.log server.js
forever list ; forever restart 0 ; forever stop server.js ; forever stopall
```

forever ne gère ni cluster ni démarrage au boot (il faut l'appeler depuis un service ou `@reboot` dans cron). À réserver aux installations existantes ; migrer vers PM2 ou systemd.

Commandes : [[90-aide-memoire|aide-mémoire]].
