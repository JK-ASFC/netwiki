---
title: Registres et artefacts — aide-mémoire
description: Commandes Harbor (install.sh, docker compose), Distribution (htpasswd, garbage-collect, catalogue), Zot, clients docker et podman, Nexus (mot de passe initial, configuration npm, pip, Maven), Verdaccio (lancement, Docker, npm adduser, publish) avec exemples.
tags: [aide-mémoire, harbor, registry, zot, nexus, verdaccio]
icon: terminal
---

Explications : [[01-harbor-distribution-zot|Harbor, Distribution, Zot]] · [[02-nexus-artifactory-verdaccio|Nexus, Artifactory, Verdaccio]].

```bash
cd harbor && sudo ./install.sh --with-trivy ; sudo docker compose ps ; sudo docker compose down && sudo docker compose up -d
docker run --rm --entrypoint htpasswd httpd:2 -Bbn ci-deploiement 'MdpRegistre2026' >> /srv/registre/auth/htpasswd
docker exec registre registry garbage-collect /etc/distribution/config.yml
curl -s -u ci-deploiement https://registre.corp.exemple.fr/v2/_catalog
curl -s -u ci-deploiement https://registre.corp.exemple.fr/v2/infra/nginx/tags/list
docker login registre.corp.exemple.fr ; docker push registre.corp.exemple.fr/infra/nginx:1.27
docker logs -f zot
docker exec nexus cat /nexus-data/admin.password
npm config set registry https://nexus.corp.exemple.fr/repository/npm-groupe/
pip config set global.index-url https://nexus.corp.exemple.fr/repository/pypi-groupe/simple
verdaccio ; npm adduser --registry https://npm.corp.exemple.fr/ ; npm publish --registry https://npm.corp.exemple.fr/
```
