---
title: Portainer — aide-mémoire des commandes
description: Commandes Portainer avec exemples — déploiement du serveur (Docker, Kubernetes avec Helm), agent et Edge Agent, mise à jour, réinitialisation du mot de passe administrateur (helper-reset-password), sauvegarde et restauration, API REST (authentification, environnements, piles, conteneurs), sécurisation.
tags: [aide-mémoire, portainer, docker, kubernetes, api, interface graphique]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Portainer]].

## Déploiement

```bash
docker volume create portainer_data
docker run -d --name portainer --restart=always -p 9443:9443 \
  -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce:lts
# Agent sur un autre hôte Docker (port 9001, à filtrer)
docker run -d --name portainer_agent --restart=always -p 9001:9001 \
  -v /var/run/docker.sock:/var/run/docker.sock -v /var/lib/docker/volumes:/var/lib/docker/volumes portainer/agent:lts
# Kubernetes
helm repo add portainer https://portainer.github.io/k8s/ && helm repo update
helm upgrade --install --create-namespace -n portainer portainer portainer/portainer --set service.type=ClusterIP --set tls.force=true
```

## Mise à jour

```bash
docker pull portainer/portainer-ce:lts
docker stop portainer && docker rm portainer
docker run -d --name portainer --restart=always -p 9443:9443 -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce:lts
```

## Mot de passe administrateur perdu

```bash
docker stop portainer
docker run --rm -v portainer_data:/data portainer/helper-reset-password      # affiche un nouveau mot de passe
docker start portainer
```

## Sauvegarde

```bash
docker stop portainer
docker run --rm -v portainer_data:/data -v "$PWD":/sauvegarde alpine tar czf /sauvegarde/portainer-$(date +%F).tar.gz -C /data .
docker start portainer
# Ou depuis l'interface : Settings → Backup Portainer (archive chiffrée)
```

## API REST

```bash
P=https://portainer.exemple.fr:9443/api
JWT=$(curl -sk -X POST $P/auth -d '{"username":"admin","password":"'"$MDP"'"}' | jq -r .jwt)
# Ou jeton d'accès : en-tête X-API-Key (Mon compte → Access tokens)
curl -sk -H "Authorization: Bearer $JWT" $P/endpoints | jq '.[] | {Id, Name, Type}'
curl -sk -H "Authorization: Bearer $JWT" "$P/endpoints/1/docker/containers/json?all=true" | jq '.[] | {Names, State}'
curl -sk -H "Authorization: Bearer $JWT" $P/stacks | jq '.[] | {Id, Name, EndpointId}'
curl -sk -X POST -H "Authorization: Bearer $JWT" "$P/endpoints/1/docker/containers/web/restart"
```

## Sécurisation

- [ ] Port 9443 uniquement depuis le réseau d'administration ; certificat valide
- [ ] Comptes nominatifs, équipes et rôles, authentification LDAP/OAuth
- [ ] Le socket Docker monté donne un accès **root** à l'hôte : limiter qui peut administrer Portainer
- [ ] Agent (9001) filtré pour n'accepter que le serveur Portainer
