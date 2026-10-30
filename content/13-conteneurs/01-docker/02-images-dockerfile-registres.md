---
title: Images, Dockerfile et registres
description: Construire des images avec un Dockerfile (instructions, cache des couches, builds multi-étapes, utilisateur non root, .dockerignore), BuildKit et buildx (multi-architectures), étiquetage et versions, registres (Docker Hub et ses limites, registre privé registry:2 avec TLS et authentification, Harbor, miroirs), analyse de vulnérabilités et signature.
tags: [docker, dockerfile, image, buildx, registre, harbor, trivy, multi-stage]
icon: layers
---

## Dockerfile

```dockerfile Dockerfile (application Python, multi-étapes)
# syntax=docker/dockerfile:1
FROM python:3.12-slim AS construction
WORKDIR /src
COPY requirements.txt .
RUN pip wheel --no-cache-dir --wheel-dir /wheels -r requirements.txt

FROM python:3.12-slim
LABEL org.opencontainers.image.source="https://gitlab.corp.exemple.fr/reseau/inventaire"
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
RUN useradd --system --uid 10001 app
WORKDIR /app
COPY --from=construction /wheels /wheels
RUN pip install --no-cache-dir /wheels/* && rm -rf /wheels
COPY --chown=app:app . .
USER app
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=3s CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/sante')"
ENTRYPOINT ["gunicorn", "--bind", "0.0.0.0:8000", "inventaire.wsgi"]
```

| Instruction | Rôle |
| --- | --- |
| `FROM` | Image de base (préférer des images officielles, minimales : `-slim`, `alpine`, *distroless*) |
| `RUN` | Exécute une commande à la construction (une couche) |
| `COPY` / `ADD` | Copie des fichiers (`ADD` décompresse les archives, préférer `COPY`) |
| `ENV`, `ARG` | Variables d'exécution / de construction (pas de secrets dans `ARG`/`ENV`) |
| `USER` | Utilisateur d'exécution : **ne pas rester root** |
| `EXPOSE` | Documentation du port (ne publie rien) |
| `ENTRYPOINT` / `CMD` | Commande principale / arguments par défaut |
| `HEALTHCHECK` | Sonde de santé |

### Bonnes pratiques

- Ordonner les instructions de la plus stable à la plus changeante (le **cache** est réutilisé jusqu'à la première couche modifiée).
- **Multi-étapes** : outils de compilation dans une étape, image finale minimale.
- `.dockerignore` (`.git`, `node_modules`, secrets, fichiers locaux).
- Versions **figées** des images de base (`python:3.12.7-slim`, voire par condensat).
- Secrets de construction par `RUN --mount=type=secret,id=npmrc …` (BuildKit), jamais copiés dans l'image.

## Construire et publier

```bash
docker build -t registre.corp.exemple.fr/reseau/inventaire:1.4.2 .
docker build --secret id=npmrc,src=$HOME/.npmrc -t app:dev .
docker image history registre.corp.exemple.fr/reseau/inventaire:1.4.2      # couches et tailles

# Multi-architectures (amd64 + arm64) avec buildx
docker buildx create --name multi --use
docker buildx build --platform linux/amd64,linux/arm64 -t registre.corp.exemple.fr/reseau/inventaire:1.4.2 --push .

docker login registre.corp.exemple.fr
docker push registre.corp.exemple.fr/reseau/inventaire:1.4.2
```

Étiquetez avec une version immuable (`1.4.2`, condensat Git) ; `latest` n'est qu'un alias mobile, à éviter en production.

## Registres

| Registre | Remarque |
| --- | --- |
| Docker Hub | Images officielles ; **limites de téléchargement** pour les accès anonymes ou gratuits : utiliser un compte et un miroir |
| **Harbor** | Registre d'entreprise libre : projets, RBAC, LDAP/AD, analyse de vulnérabilités, réplication, cache proxy de Docker Hub |
| GitLab / Gitea / Forgejo | Registre intégré à la forge |
| `registry:2` (Distribution) | Registre minimal |

### Registre minimal privé

```bash
sudo mkdir -p /srv/registre/{donnees,auth,certs}
docker run --rm --entrypoint htpasswd httpd:2 -Bbn ci 'MotDePasse' | sudo tee /srv/registre/auth/htpasswd
docker run -d --name registre --restart=always -p 443:5000 \
  -v /srv/registre/donnees:/var/lib/registry -v /srv/registre/auth:/auth -v /srv/registre/certs:/certs \
  -e REGISTRY_AUTH=htpasswd -e REGISTRY_AUTH_HTPASSWD_REALM="Registre" -e REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd \
  -e REGISTRY_HTTP_TLS_CERTIFICATE=/certs/registre.crt -e REGISTRY_HTTP_TLS_KEY=/certs/registre.key \
  registry:2
```

Une AC interne doit être approuvée par les hôtes Docker : `/etc/docker/certs.d/registre.corp.exemple.fr/ca.crt`.

### Miroir de Docker Hub

```json /etc/docker/daemon.json (extrait)
{
  "registry-mirrors": ["https://miroir-hub.corp.exemple.fr"]
}
```

## Analyse et signature

```bash
trivy image registre.corp.exemple.fr/reseau/inventaire:1.4.2          # vulnérabilités, secrets, mauvaise configuration
docker scout cves registre.corp.exemple.fr/reseau/inventaire:1.4.2     # outil Docker
cosign sign registre.corp.exemple.fr/reseau/inventaire@sha256:…       # signature (Sigstore)
```

Intégrez l'analyse dans la chaîne CI et bloquez les images présentant des vulnérabilités critiques corrigeables.
