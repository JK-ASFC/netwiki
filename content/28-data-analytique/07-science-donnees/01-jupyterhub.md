---
title: JupyterHub
description: JupyterHub, serveur de carnets Jupyter multi-utilisateurs — architecture (hub, proxy configurable, serveurs individuels), installation simple (The Littlest JupyterHub) ou sur Kubernetes (Zero to JupyterHub, Helm), jupyterhub_config.py, authentificateurs (PAM, OAuth, LDAP, GitHub, Keycloak), lanceurs (local, Docker, Kubernetes, systemd), profils de ressources, stockage persistant, services d'arrêt des serveurs inactifs, administration et sécurité.
tags: [jupyterhub, jupyter, jupyterlab, carnets, notebooks, science des données, kubernetes, tljh]
icon: flask-conical
---

**JupyterHub** donne à chaque utilisateur son propre serveur **JupyterLab** (carnets Python, R, Julia…), accessible par le navigateur, avec une authentification centralisée. Usages : équipes data, enseignement, calcul partagé sur GPU.

## Architecture

| Composant | Rôle |
| --- | --- |
| **Hub** | Authentifie, démarre et arrête les serveurs, API d'administration |
| **Proxy** (configurable-http-proxy) | Point d'entrée HTTP (8000), aiguille vers le hub ou le serveur de l'utilisateur |
| **Authentificateur** | PAM (comptes Unix), OAuth/OIDC (Keycloak, GitHub, Entra ID), LDAP, Native |
| **Lanceur** (*spawner*) | Processus local, **systemd**, **Docker**, **Kubernetes** (KubeSpawner), Slurm |
| Serveur individuel | JupyterLab de l'utilisateur, avec ses fichiers et noyaux |

## Installation

### The Littlest JupyterHub (un serveur, jusqu'à quelques dizaines d'utilisateurs)

```bash
curl -L https://tljh.jupyter.org/bootstrap.py | sudo -E python3 - --admin admin
sudo tljh-config set https.enabled true
sudo tljh-config set https.letsencrypt.email admin@exemple.fr
sudo tljh-config add-item https.letsencrypt.domains jupyter.exemple.fr
sudo tljh-config set limits.memory 4G
sudo tljh-config reload proxy ; sudo tljh-config reload
sudo -E pip install pandas polars scikit-learn      # paquets pour tous (environnement partagé)
```

### Zero to JupyterHub (Kubernetes)

```bash
helm repo add jupyterhub https://hub.jupyter.org/helm-chart/ && helm repo update
helm upgrade --install jhub jupyterhub/jupyterhub --namespace jhub --create-namespace --values config.yaml
kubectl -n jhub get pods ; kubectl -n jhub logs deploy/hub
```

```yaml config.yaml
hub:
  config:
    JupyterHub: { authenticator_class: generic-oauth }
    GenericOAuthenticator:
      client_id: jupyterhub
      client_secret: "…"
      oauth_callback_url: https://jupyter.exemple.fr/hub/oauth_callback
      authorize_url: https://sso.exemple.fr/realms/data/protocol/openid-connect/auth
      token_url: https://sso.exemple.fr/realms/data/protocol/openid-connect/token
      userdata_url: https://sso.exemple.fr/realms/data/protocol/openid-connect/userinfo
      username_claim: preferred_username
      allowed_groups: [ data ]
      admin_groups: [ data-admin ]
      manage_groups: true
singleuser:
  image: { name: quay.io/jupyter/scipy-notebook, tag: latest }
  memory: { limit: 8G, guarantee: 2G }
  cpu: { limit: 4 }
  storage: { capacity: 20Gi }
  profileList:
    - display_name: "Standard (2 Go)"
      default: true
    - display_name: "GPU"
      kubespawner_override: { extra_resource_limits: { nvidia.com/gpu: "1" } }
cull: { enabled: true, timeout: 3600 }
```

### Installation manuelle

```python /etc/jupyterhub/jupyterhub_config.py
c.JupyterHub.bind_url = "http://127.0.0.1:8000"
c.Authenticator.allowed_users = {"alice", "bob"}
c.Authenticator.admin_users = {"admin"}
c.JupyterHub.spawner_class = "dockerspawner.DockerSpawner"
c.DockerSpawner.image = "quay.io/jupyter/scipy-notebook:latest"
c.DockerSpawner.volumes = {"jupyterhub-{username}": "/home/jovyan/work"}
c.DockerSpawner.mem_limit = "4G"
c.JupyterHub.services = [{"name": "nettoyage", "command": ["python3", "-m", "jupyterhub_idle_culler", "--timeout=3600"]}]
c.JupyterHub.load_roles = [{"name": "nettoyage", "scopes": ["list:users", "read:users:activity", "read:servers", "delete:servers"], "services": ["nettoyage"]}]
```

```bash
python3 -m pip install jupyterhub jupyterlab dockerspawner jupyterhub-idle-culler
sudo npm install -g configurable-http-proxy
jupyterhub -f /etc/jupyterhub/jupyterhub_config.py
```

## Exploitation et sécurité

- Placer le proxy derrière **HTTPS** (Nginx, Traefik ou Let's Encrypt intégré à TLJH).
- **Arrêter les serveurs inactifs** (culler) pour libérer mémoire et GPU.
- Un carnet exécute du code arbitraire : isoler chaque utilisateur (conteneur, limites mémoire et CPU), ne jamais lancer les serveurs en root, restreindre l'accès réseau sortant si les données sont sensibles.
- Sauvegarder les volumes personnels ; JupyterHub ne versionne pas les carnets (utiliser Git avec l'extension jupyterlab-git).
- API REST d'administration : `GET /hub/api/users` avec un jeton (`jupyterhub token` ou depuis le panneau).

Voir aussi : [[02-mlflow|MLflow]] · [[03-dvc-pachyderm|DVC et Pachyderm]]. Commandes : [[90-aide-memoire|aide-mémoire]].
