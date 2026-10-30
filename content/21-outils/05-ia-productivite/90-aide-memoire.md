---
title: IA et productivité — aide-mémoire (Ollama, Open WebUI, JupyterLab, n8n, Copilot, Obsidian, BookStack…)
description: Commandes et raccourcis des outils d'IA et de productivité avec exemples — Ollama (modèles, exécution, API locale, Modelfile), Open WebUI en conteneur, JupyterLab (lancement, noyaux, conversion de carnets), n8n (conteneur, export/import des workflows en CLI), GitHub Copilot (raccourcis, chat), Cursor, Power Automate (ligne de commande), Obsidian (raccourcis, liens), BookStack (commandes artisan), bonnes pratiques de confidentialité.
tags: [aide-mémoire, ollama, open webui, jupyterlab, n8n, copilot, obsidian, bookstack]
icon: terminal
---

Référence rapide ; les explications sont dans [[04-ollama-open-webui|Ollama et Open WebUI]], [[05-jupyterlab|JupyterLab]], [[06-n8n|n8n]] et [[09-bookstack|BookStack]].

> [!NOTE]
> Ne collez jamais de mots de passe, de configurations sensibles ou de données personnelles dans un service d'IA en ligne. Pour ces usages, préférez un modèle local (Ollama) ou masquez les informations.

## Ollama (modèles locaux)

```bash
ollama --version
ollama pull llama3.1:8b
ollama list
ollama run llama3.1:8b "Explique la différence entre OSPF et BGP en 5 lignes."
ollama ps                                    # modèles chargés en mémoire
ollama stop llama3.1:8b
ollama rm ancien-modele
OLLAMA_HOST=127.0.0.1:11434 ollama serve     # écoute locale uniquement
curl -s http://127.0.0.1:11434/api/generate -d '{"model":"llama3.1:8b","prompt":"Résume RFC 4271 en une phrase.","stream":false}' | jq -r .response
curl -s http://127.0.0.1:11434/api/tags | jq '.models[].name'
```

```text
# Modelfile : assistant spécialisé
FROM llama3.1:8b
PARAMETER temperature 0.2
SYSTEM "Tu es un assistant d'architecte réseau. Réponds en français, de façon concise, avec des commandes vérifiables."
```

```bash
ollama create assistant-reseau -f Modelfile && ollama run assistant-reseau
```

## Open WebUI

```bash
docker run -d --name open-webui -p 127.0.0.1:3000:8080 -v open-webui:/app/backend/data \
  -e OLLAMA_BASE_URL=http://host.docker.internal:11434 --add-host=host.docker.internal:host-gateway ghcr.io/open-webui/open-webui:main
docker logs -f open-webui
```

## JupyterLab

```bash
uv tool install jupyterlab        # ou : pip install jupyterlab
jupyter lab --no-browser --ip 127.0.0.1 --port 8888
jupyter kernelspec list
python -m ipykernel install --user --name outils-reseau --display-name "Python (outils réseau)"
jupyter nbconvert --to html analyse-trafic.ipynb
jupyter nbconvert --to script analyse-trafic.ipynb
jupyter nbconvert --execute --to notebook --inplace rapport.ipynb      # réexécuter un carnet
```

| Raccourci (mode commande) | Effet |
| --- | --- |
| `Maj+Entrée` | Exécuter la cellule et passer à la suivante |
| `A` / `B` | Insérer une cellule au-dessus / en dessous |
| `M` / `Y` | Cellule Markdown / code |
| `D` `D` | Supprimer la cellule |

## n8n

```bash
docker run -d --name n8n -p 127.0.0.1:5678:5678 -v n8n_data:/home/node/.n8n -e GENERIC_TIMEZONE=Europe/Paris n8nio/n8n
docker exec -u node n8n n8n export:workflow --all --output=/home/node/.n8n/sauvegarde-workflows.json
docker exec -u node n8n n8n export:credentials --all --output=/home/node/.n8n/identifiants.json      # chiffrés par la clé de l'instance
docker exec -u node n8n n8n import:workflow --input=/home/node/.n8n/sauvegarde-workflows.json
```

## GitHub Copilot et Cursor

| Raccourci (VS Code) | Effet |
| --- | --- |
| `Tab` | Accepter la suggestion |
| `Alt+]` / `Alt+[` | Suggestion suivante / précédente |
| `Ctrl+I` | Chat dans l'éditeur |
| `Ctrl+Alt+I` | Panneau de chat |
| `/explain`, `/fix`, `/tests` | Commandes du chat |

Cursor reprend les raccourcis de VS Code ; `Ctrl+K` modifie la sélection par instruction, `Ctrl+L` ouvre le chat.

## Power Automate (bureau)

```powershell
# Lancer un flux de bureau par son URL (copiée depuis Power Automate pour le bureau)
& "C:\Program Files (x86)\Power Automate Desktop\PAD.Console.Host.exe" "ms-powerautomate:/console/flow/run?workflowName=Sauvegarde%20configs"
```

## Obsidian

| Raccourci | Effet |
| --- | --- |
| `Ctrl+O` | Ouvrir une note |
| `Ctrl+P` | Palette de commandes |
| `Ctrl+Maj+F` | Rechercher dans le coffre |
| `[[` | Lien vers une note |
| `Ctrl+G` | Vue graphe |

## BookStack

```bash
cd /var/www/bookstack
php artisan bookstack:create-admin --email=admin@exemple.fr --name="Administrateur"
php artisan bookstack:regenerate-search
php artisan bookstack:cleanup-images --dry-run
php artisan bookstack:update-url https://ancien.exemple.fr https://wiki.exemple.fr
php artisan migrate --force          # après mise à jour (git pull + composer install)
```
