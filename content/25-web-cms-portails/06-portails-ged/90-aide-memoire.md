---
title: Portails et GED — aide-mémoire des commandes
description: Commandes Liferay (Docker liferay/portal, bundle Tomcat), eXo Platform (Docker), Alfresco Community (Docker Compose acs-deployment, journaux, sauvegarde PostgreSQL et alf_data) avec exemples.
tags: [aide-mémoire, liferay, exo platform, alfresco, ged]
icon: terminal
---

Explications : [[01-liferay-jahia-exo|Liferay, Jahia, eXo]] · [[02-alfresco-nuxeo|Alfresco, Nuxeo]].

```bash
docker run -d --name liferay -p 127.0.0.1:8080:8080 -v liferay-data:/opt/liferay/data liferay/portal:latest
docker logs -f liferay ; docker exec -it liferay bash
docker run -d --name exo -p 127.0.0.1:8080:8080 -v exo-data:/srv/exo exoplatform/exo-community:latest
cd acs-deployment/docker-compose
docker compose -f community-compose.yaml up -d ; docker compose -f community-compose.yaml ps
docker compose -f community-compose.yaml logs -f alfresco
docker compose -f community-compose.yaml exec -T postgres pg_dump -U alfresco alfresco > /srv/sauvegardes/alfresco-$(date +%F).sql
curl -s -u admin http://localhost:8080/alfresco/api/-default-/public/alfresco/versions/1/probes/-ready-
```
