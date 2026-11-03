---
title: Harbor, Distribution Registry et Zot
description: Registres d'images de conteneurs OCI auto-hébergés — Harbor (Apache 2.0, CNCF : projets, droits RBAC, analyse de vulnérabilités Trivy, signature, réplication, quotas, proxy cache, OIDC/LDAP ; installateur hors ligne, harbor.yml, install.sh, Helm), Distribution Registry (Apache 2.0 : image registry:3, config.yml, authentification htpasswd, TLS, ramasse-miettes) et Zot (Apache 2.0, CNCF : registre OCI natif en un binaire, extensions recherche, interface, synchronisation ; ghcr.io/project-zot/zot), clients docker et podman, certificats et sauvegarde.
tags: [harbor, distribution, registry, zot, oci, docker, conteneurs]
icon: container
---

Un **registre** stocke les images de conteneurs et artefacts OCI (charts Helm, signatures, SBOM) au plus près des clusters : rapidité, indépendance vis-à-vis du Docker Hub (limites de téléchargement), contrôle de ce qui est déployé. Voir aussi [[01-docker/01-presentation-installation|Docker]] et [[04-kubernetes/01-presentation-architecture|Kubernetes]].

| | **Harbor** | **Distribution** | **Zot** |
| --- | --- | --- | --- |
| Interface web | Oui, complète | Non | Oui (extension) |
| Utilisateurs et projets | RBAC, OIDC, LDAP | htpasswd ou jeton externe | htpasswd, LDAP, OIDC, politiques d'accès |
| Analyse de vulnérabilités | Trivy intégré | Non | Extension (Trivy) |
| Réplication, proxy cache | Oui | Proxy (*pull-through cache*) | Synchronisation (*sync*) |
| Ressources | 4 Go de RAM, plusieurs services | Très légères | Très légères (un binaire) |

## Harbor

```bash
V=v2.15.4
wget https://github.com/goharbor/harbor/releases/download/$V/harbor-offline-installer-$V.tgz
tar xzf harbor-offline-installer-$V.tgz && cd harbor
cp harbor.yml.tmpl harbor.yml
```

Dans `harbor.yml` :

```yaml
hostname: registre.corp.exemple.fr
https:
  port: 443
  certificate: /etc/ssl/corp/registre.corp.exemple.fr.crt
  private_key: /etc/ssl/corp/registre.corp.exemple.fr.key
harbor_admin_password: MdpAdminHarbor2026
database:
  password: MdpBaseHarbor2026
data_volume: /data
```

```bash
sudo ./install.sh --with-trivy        # Docker et Docker Compose requis sur l'hôte
```

Interface : `https://registre.corp.exemple.fr` (compte `admin`). Créer des **projets** (publics ou privés), des membres et des **comptes robots** pour la CI, activer l'**analyse automatique** à l'envoi et l'interdiction de déployer les images vulnérables, configurer **réplication** et **proxy cache** (miroir du Docker Hub), rétention et quotas. Authentification d'entreprise : *Configuration → Authentication* (OIDC, LDAP/AD). Kubernetes : chart Helm officiel `harbor/harbor`.

<!-- CAPTURE: Projet Harbor avec résultats d'analyse Trivy | _assets/harbor-projet.png -->

Exploitation : `docker compose ps` / `down` / `up -d` dans le dossier `harbor`, **ramasse-miettes** planifié (*Administration → Clean Up*), sauvegarde de `/data` (registre, base PostgreSQL interne, configuration). Mise à jour : nouvelle version de l'installateur, migration de `harbor.yml` avec l'outil `prepare` selon les notes de version.

## Distribution Registry

```bash
sudo mkdir -p /srv/registre/{data,auth,certs}
docker run --rm --entrypoint htpasswd httpd:2 -Bbn ci-deploiement 'MdpRegistre2026' | sudo tee /srv/registre/auth/htpasswd
docker run -d --name registre --restart=always -p 443:5000 \
  -v /srv/registre/data:/var/lib/registry -v /srv/registre/auth:/auth -v /srv/registre/certs:/certs \
  -e REGISTRY_AUTH=htpasswd -e REGISTRY_AUTH_HTPASSWD_REALM="Registre" -e REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd \
  -e REGISTRY_HTTP_TLS_CERTIFICATE=/certs/registre.crt -e REGISTRY_HTTP_TLS_KEY=/certs/registre.key \
  registry:3
```

Pour servir de **miroir** du Docker Hub : `REGISTRY_PROXY_REMOTEURL=https://registry-1.docker.io`. Suppression des couches inutilisées (registre arrêté ou en lecture seule) : `docker exec registre registry garbage-collect /etc/distribution/config.yml`. Le registre fonctionne aussi en binaire sous Windows et macOS.

## Zot

```bash
docker run -d --name zot -p 127.0.0.1:5000:5000 -v /srv/zot:/var/lib/registry ghcr.io/project-zot/zot-linux-amd64:latest
```

Configuration JSON (`/etc/zot/config.json`) : stockage (`rootDirectory`, déduplication, ramasse-miettes), `http` (adresse, port, TLS, authentification htpasswd/LDAP/OIDC, politiques d'accès par dépôt), `extensions` (recherche, interface web, analyse Trivy, synchronisation depuis d'autres registres, métriques). Binaire unique pour Linux, macOS et Windows ; image minimale `zot-minimal-*` sans extensions. Client dédié : `zli`.

## Utilisation par les clients

```bash
docker login registre.corp.exemple.fr
docker tag nginx:1.27 registre.corp.exemple.fr/infra/nginx:1.27
docker push registre.corp.exemple.fr/infra/nginx:1.27
podman pull registre.corp.exemple.fr/infra/nginx:1.27
curl -s -u ci-deploiement https://registre.corp.exemple.fr/v2/_catalog
```

Avec une autorité de certification interne, déposer son certificat dans `/etc/docker/certs.d/registre.corp.exemple.fr/ca.crt` (Docker) ou `/etc/containers/certs.d/…` (Podman), et dans le magasin de confiance des nœuds Kubernetes (containerd : `/etc/containerd/certs.d/`).

Commandes : [[90-aide-memoire|aide-mémoire]].
