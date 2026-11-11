---
title: SearXNG, Whoogle, 4get et LibreX
description: Métamoteurs de recherche auto-hébergés — principe (requêtes relayées vers des moteurs publics sans pistage, pas de profil, pas de publicité ciblée), SearXNG (Python, AGPL : plus de 200 moteurs, settings.yml, secret_key, limiteur et Valkey/Redis, formats JSON, image Docker searxng/searxng, port 8080, moteur par défaut du navigateur, recherche pour les LLM), Whoogle (résultats Google sans pistage, Docker port 5000, état du projet), 4get (PHP, interface légère) et LibreX/LibreY (PHP, instances) ; blocages par les moteurs, usage en entreprise et sécurité.
tags: [searxng, whoogle, 4get, librex, librey, métamoteur, vie privée, recherche web]
icon: globe
---

Un **métamoteur** envoie la requête à plusieurs moteurs (Google, Bing, DuckDuckGo, Qwant, Wikipédia, GitHub, Stack Overflow…), fusionne les résultats et les affiche **sans traceur**, sans cookie publicitaire et sans transmettre l'adresse IP de l'utilisateur aux moteurs. Hébergé en interne, il offre une recherche web commune à toute l'équipe, ou une source de recherche pour des agents IA locaux.

## SearXNG

**SearXNG** (fork actif de Searx) est la référence : plus de 200 moteurs configurables, catégories (général, images, actualités, informatique, science, cartes), réponses instantanées.

```yaml docker-compose.yml
services:
  valkey:
    image: docker.io/valkey/valkey:8-alpine
    command: valkey-server --save 30 1 --loglevel warning
    restart: unless-stopped
  searxng:
    image: docker.io/searxng/searxng:latest
    restart: unless-stopped
    ports: [ "127.0.0.1:8080:8080" ]
    volumes: [ "./searxng:/etc/searxng:rw" ]
    environment:
      SEARXNG_BASE_URL: https://recherche.exemple.fr/
    depends_on: [ valkey ]
```

```yaml searxng/settings.yml
use_default_settings: true
general:
  instance_name: "Recherche interne"
server:
  secret_key: "<openssl rand -hex 32>"
  limiter: true                   # protection contre les abus (nécessite Valkey/Redis)
  image_proxy: true               # les images passent par le serveur
valkey:
  url: valkey://valkey:6379/0
search:
  safe_search: 1
  default_lang: "fr"
  formats: [ html, json ]          # json pour les scripts et les agents IA
ui:
  default_locale: fr
engines:
  - name: bing
    disabled: true
  - name: qwant
    disabled: false
```

```bash
docker compose up -d
curl -s "http://127.0.0.1:8080/search?q=rfc+8200&format=json" | jq '.results[:3][] | {title, url}'
```

- Ajouter l'instance comme **moteur par défaut** du navigateur (fichier OpenSearch fourni par l'instance), éventuellement par GPO.
- Open WebUI, LibreChat, Perplexica et d'autres outils IA peuvent utiliser SearXNG (format JSON) pour la **recherche web** de leurs agents.

## Whoogle

**Whoogle** affiche les résultats **Google** sans publicité, sans JavaScript ni pistage.

```bash
docker run -d --name whoogle -p 127.0.0.1:5000:5000 \
  -e WHOOGLE_CONFIG_LANGUAGE=lang_fr -e WHOOGLE_CONFIG_COUNTRY=FR \
  -e WHOOGLE_USER=equipe -e WHOOGLE_PASS='…' \
  benbusby/whoogle-search:latest
```

> [!NOTE]
> Google bloque de plus en plus les requêtes automatisées et a modifié ses pages sans JavaScript, ce qui casse régulièrement Whoogle ; le projet signale lui-même ces limites. SearXNG, qui interroge de nombreux moteurs, est plus robuste.

## 4get et LibreX / LibreY

- **4get** (PHP) : métamoteur léger et rapide (DuckDuckGo, Brave, Yandex, Google, Mojeek, Marginalia…), avec recherche d'images et de vidéos, proxy d'images, sans JavaScript obligatoire. Installation sur un serveur web PHP ou en conteneur.
- **LibreX** (PHP) : métamoteur minimaliste ; il est poursuivi par son fork **LibreY**, plus actif. Installation par conteneur ou sur Nginx + PHP-FPM, configuration dans `config.php`.

Ces deux projets ont des communautés plus petites : vérifier leur activité et la qualité des résultats avant de les proposer à des utilisateurs.

## Fonctionnement en entreprise

| Point | Conseil |
| --- | --- |
| Blocages (captcha, erreurs 429) | Toutes les requêtes sortent avec l'IP du serveur : activer le limiteur, désactiver les moteurs qui bloquent, éviter les usages automatisés massifs |
| Conditions d'utilisation | L'interrogation automatisée de certains moteurs peut être contraire à leurs conditions ; préférer des API officielles pour les usages intensifs |
| Accès | Authentification devant l'instance (proxy, SSO) si elle est accessible hors du réseau interne |
| Journaux | Ne pas conserver les requêtes des utilisateurs plus que nécessaire (elles révèlent beaucoup) |
| Filtrage | La recherche sûre et le filtrage web de l'entreprise s'appliquent aussi aux résultats |

Commandes : [[90-aide-memoire|aide-mémoire]].
