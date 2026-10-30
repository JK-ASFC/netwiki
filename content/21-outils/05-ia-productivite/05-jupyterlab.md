---
title: JupyterLab
description: JupyterLab pour l'administrateur réseau — notebooks Python interactifs (code, résultats, graphiques et texte), installation avec uv ou pip, noyaux et environnements, usages (automatisation réseau avec Netmiko et NAPALM, analyse de journaux et de CSV avec pandas, appels d'API, rapports), extensions, partage et versionnement, JupyterHub multi-utilisateurs, sécurité (jeton, mot de passe, exposition, secrets).
tags: [jupyterlab, jupyter, notebooks, python, pandas, netmiko, automatisation]
icon: notebook
---

**JupyterLab** (BSD) est un environnement web de **notebooks** : on y écrit du code Python par cellules, on voit immédiatement le résultat (tableaux, graphiques), et on documente la démarche en Markdown dans le même fichier (`.ipynb`). Idéal pour **explorer** : interroger une API, analyser un export de journaux, prototyper un script d'automatisation réseau avant de l'industrialiser.

## Installation

```bash
uv tool install jupyterlab                 # outil isolé (voir uv)
jupyter lab                                # ouvre http://localhost:8888/lab?token=…
# ou dans un projet avec ses dépendances
uv init analyses && cd analyses && uv add jupyterlab pandas matplotlib netmiko napalm requests
uv run jupyter lab
```

Windows, macOS, Linux : identique avec [[04-developpement/10-uv|uv]] ou `pip install jupyterlab` dans un environnement virtuel. VS Code ouvre aussi les notebooks nativement.

## Exemples d'usages

```python Cellule : relevé de l'état des interfaces de plusieurs commutateurs (Netmiko)
from netmiko import ConnectHandler
import os, pandas as pd

commutateurs = ["10.0.0.11", "10.0.0.12", "10.0.0.13"]
lignes = []
for hote in commutateurs:
    with ConnectHandler(device_type="cisco_ios", host=hote, username="lecture",
                        password=os.environ["MDP_RESEAU"]) as cnx:
        for itf in cnx.send_command("show interfaces status", use_textfsm=True):
            lignes.append({"equipement": hote, **itf})

df = pd.DataFrame(lignes)
df[df["status"] == "err-disabled"]          # ports en erreur sur tout le parc
```

```python Cellule : analyse d'un export de journaux pare-feu
journaux = pd.read_csv("export-parefeu.csv", parse_dates=["date"])
refus = journaux[journaux["action"] == "deny"]
refus.groupby("src_ip").size().sort_values(ascending=False).head(10)       # 10 sources les plus bloquées
refus.set_index("date").resample("1h").size().plot(title="Refus par heure")
```

D'autres usages : interroger [[01-ansible/03-automatisation-reseau|NetBox]] ou une API de supervision, calculer des plans d'adressage (`ipaddress`), produire un rapport d'inventaire en HTML/PDF (`jupyter nbconvert`).

## Bonnes pratiques

- Un notebook sert à **explorer** ; le code stable devient un **script** ou un module (versionné, testé, planifié).
- Versionner les notebooks **sans les résultats** (qui contiennent souvent des données) : `nbstripout` ou `jupyter nbconvert --clear-output`.
- Variables d'environnement ou coffre pour les identifiants ; jamais de mot de passe dans une cellule.

## JupyterHub

**JupyterHub** fournit des JupyterLab **multi-utilisateurs** sur un serveur (ou Kubernetes) : authentification (LDAP, OIDC), un environnement isolé par utilisateur, ressources limitées. Version légère : *The Littlest JupyterHub* pour une petite équipe.

## Sécurité

- [ ] JupyterLab **exécute du code** avec les droits de l'utilisateur : ne jamais l'exposer sans authentification (le jeton ou un mot de passe sont actifs par défaut ; ne pas les désactiver)
- [ ] Écoute sur `127.0.0.1` (accès distant par tunnel SSH : `ssh -L 8888:127.0.0.1:8888 serveur`) ou JupyterHub derrière HTTPS et SSO
- [ ] Ne pas ouvrir de notebooks non fiables en mode de confiance (code et sorties HTML actives)
- [ ] Sorties contenant des données sensibles supprimées avant partage
