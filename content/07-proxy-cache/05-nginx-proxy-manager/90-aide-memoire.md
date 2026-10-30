---
title: Nginx Proxy Manager — aide-mémoire des commandes
description: Commandes Nginx Proxy Manager avec exemples — déploiement Docker Compose (ports 80, 443, 81), premier accès, sauvegarde et restauration (données, base SQLite ou MariaDB, certificats Let's Encrypt), mise à jour, journaux, inspection de la configuration Nginx générée, vérification et rechargement dans le conteneur, réinitialisation du mot de passe administrateur, sécurisation de l'interface.
tags: [aide-mémoire, nginx proxy manager, docker, reverse proxy, lets encrypt]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation-exploitation|Nginx Proxy Manager]].

## Déploiement

```yaml
# /srv/npm/compose.yaml
services:
  npm:
    image: jc21/nginx-proxy-manager:latest
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
      - "10.0.99.5:81:81"      # interface d'administration sur le réseau d'administration seulement
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
```

```bash
cd /srv/npm && docker compose up -d
docker compose logs -f npm
# Première connexion : http://10.0.99.5:81 (identifiants initiaux à changer immédiatement ; versions récentes : création du compte au premier accès)
```

## Sauvegarde, restauration, mise à jour

```bash
cd /srv/npm && docker compose stop
tar czf /srv/sauvegardes/npm-$(date +%F).tar.gz data letsencrypt
docker compose start
# Restauration : arrêter, extraire l'archive dans /srv/npm, redémarrer
docker compose pull && docker compose up -d          # mise à jour
docker image prune -f
```

## Inspection et dépannage dans le conteneur

```bash
docker exec -it npm-npm-1 nginx -t                   # vérifier la configuration générée
docker exec -it npm-npm-1 nginx -s reload
docker exec -it npm-npm-1 ls /data/nginx/proxy_host/ # un fichier .conf par hôte (numéro = identifiant)
docker exec -it npm-npm-1 cat /data/nginx/proxy_host/3.conf
docker exec -it npm-npm-1 tail -f /data/logs/proxy-host-3_access.log /data/logs/proxy-host-3_error.log
docker exec -it npm-npm-1 certbot certificates
```

## Réinitialiser l'administrateur (base SQLite)

```bash
cd /srv/npm && docker compose stop
sqlite3 data/database.sqlite "UPDATE user SET is_deleted=1 WHERE email='admin@exemple.fr';"
docker compose start
# Au redémarrage, s'il n'existe plus d'utilisateur actif, NPM recrée le compte initial à reconfigurer
```

## Sécurisation

- [ ] Port 81 jamais publié sur Internet (liaison à l'adresse d'administration, pare-feu)
- [ ] Listes d'accès (*Access Lists*) sur les hôtes sensibles, authentification ou restriction IP
- [ ] Option *Block Common Exploits*, HSTS, *Force SSL* activées par hôte
- [ ] Image à jour, sauvegardes de `data/` et `letsencrypt/`
