---
title: Meilisearch, Typesense et Sonic
description: Moteurs de recherche instantanée pour applications — Meilisearch (Rust, MIT : recherche tolérante aux fautes, filtres et facettes, tri, synonymes, recherche hybride vectorielle, clé maîtresse et clés d'API, index, tâches asynchrones, instantanés et dumps, port 7700), Typesense (C++, GPL : schéma de collection, recherche à facettes, géographique et vectorielle, grappe Raft, clés d'API à portée limitée, port 8108) et Sonic (Rust : index d'identifiants très léger, protocole Sonic Channel, port 1491) ; dimensionnement, sécurité et choix face à Elasticsearch.
tags: [meilisearch, typesense, sonic, moteur de recherche, recherche plein texte, recherche instantanée, api]
icon: search
---

Ces moteurs ajoutent à une application une **recherche instantanée** (résultats à chaque frappe), **tolérante aux fautes de frappe**, avec filtres et facettes. Ils sont beaucoup plus simples à exploiter qu'Elasticsearch ou OpenSearch, au prix de fonctions analytiques moins étendues.

## Meilisearch

```bash
docker run -d --name meilisearch -p 127.0.0.1:7700:7700 \
  -v /srv/meili:/meili_data \
  -e MEILI_ENV=production -e MEILI_MASTER_KEY='<clé longue et aléatoire, 16 octets minimum>' \
  getmeili/meilisearch:latest
```

```bash
export MEILI=http://127.0.0.1:7700 CLE='<clé maîtresse>'
# Indexer des documents (création automatique de l'index)
curl -X POST "$MEILI/indexes/equipements/documents?primaryKey=id" -H "Authorization: Bearer $CLE" \
  -H 'Content-Type: application/json' --data-binary @equipements.json
# Réglages : champs filtrables, triables, synonymes
curl -X PATCH "$MEILI/indexes/equipements/settings" -H "Authorization: Bearer $CLE" -H 'Content-Type: application/json' \
  -d '{"filterableAttributes":["site","type"],"sortableAttributes":["date_achat"],"synonyms":{"switch":["commutateur"]}}'
# Rechercher
curl -X POST "$MEILI/indexes/equipements/search" -H "Authorization: Bearer $CLE" -H 'Content-Type: application/json' \
  -d '{"q":"comutateur lyon","filter":"type = switch","facets":["site"],"limit":10}'
curl "$MEILI/tasks?statuses=failed" -H "Authorization: Bearer $CLE"       # indexation asynchrone : suivre les tâches
```

- **Clés** : la clé maîtresse ne sert qu'à créer des **clés d'API** limitées (`/keys`) : une clé de recherche seule pour le navigateur, une clé d'administration pour l'indexation.
- Recherche **hybride** (mots + vecteurs) avec un fournisseur de plongements (Ollama, OpenAI, Hugging Face).
- Sauvegarde : `POST /snapshots` ou `POST /dumps` (portable entre versions, à utiliser pour les mises à jour majeures).
- Toute la base doit tenir sur disque rapide ; la mémoire sert de cache (index mappés).

## Typesense

```bash
docker run -d --name typesense -p 127.0.0.1:8108:8108 -v /srv/typesense:/data \
  typesense/typesense:latest --data-dir /data --api-key='<clé administrateur>' --enable-cors
```

```bash
export TS=http://127.0.0.1:8108 CLE='<clé administrateur>'
curl -X POST "$TS/collections" -H "X-TYPESENSE-API-KEY: $CLE" -H 'Content-Type: application/json' -d '{
  "name":"tickets","fields":[
    {"name":"titre","type":"string","locale":"fr"},
    {"name":"categorie","type":"string","facet":true},
    {"name":"cree_le","type":"int64"}],
  "default_sorting_field":"cree_le"}'
curl -X POST "$TS/collections/tickets/documents/import?action=upsert" -H "X-TYPESENSE-API-KEY: $CLE" --data-binary @tickets.jsonl
curl -G "$TS/collections/tickets/documents/search" -H "X-TYPESENSE-API-KEY: $CLE" \
  --data-urlencode 'q=imprimente' --data-urlencode 'query_by=titre' --data-urlencode 'facet_by=categorie'
curl "$TS/health"
```

- Schéma **explicite** (types de champs), facettes, recherche géographique, vectorielle et conversationnelle.
- **Grappe** de 3 ou 5 nœuds (consensus Raft) pour la haute disponibilité : option `--nodes`.
- **Clés à portée limitée** (*scoped keys*) : intégrer un filtre obligatoire (par exemple `client_id:=42`) dans la clé donnée à un utilisateur.
- Tout l'index est gardé **en mémoire** : prévoir la RAM en conséquence.

## Sonic

**Sonic** (MPL) est un moteur minimaliste : il n'indexe pas les documents mais renvoie des **identifiants** (que l'application va chercher dans sa base). Quelques Mo de mémoire suffisent.

```bash
docker run -d --name sonic -p 127.0.0.1:1491:1491 -v /srv/sonic/config.cfg:/etc/sonic.cfg -v /srv/sonic/store:/var/lib/sonic/store valeriansaliou/sonic:latest
# config.cfg : [channel] inet = "0.0.0.0:1491", auth_password = "…"
```

Protocole texte **Sonic Channel** (`PUSH`, `QUERY`, `SUGGEST`) via des bibliothèques clientes (Node.js, Python, Go…). Projet peu actif : convient aux besoins très simples.

## Choisir

| Critère | Meilisearch | Typesense | Sonic | [[01-elasticsearch/01-presentation-installation\|Elasticsearch]] / OpenSearch |
| --- | --- | --- | --- | --- |
| Mise en route | Très simple | Simple (schéma) | Très simple | Complexe |
| Mémoire | Disque + cache | Tout en RAM | Très faible | Élevée |
| Haute disponibilité | Selon édition / réplication applicative | Grappe Raft | Non | Grappe |
| Analytique, journaux | Non | Non | Non | Oui |
| Licence | MIT (fonctions Enterprise à part) | GPL v3 | MPL 2.0 | Licences variables / Apache 2.0 |

Ne jamais exposer ces moteurs sans clé d'API ; donner au navigateur uniquement des clés **de recherche** limitées.

Voir aussi : [[02-solr-manticore-zinc-tantivy|Solr, Manticore, ZincSearch et Tantivy]]. Commandes : [[90-aide-memoire|aide-mémoire]].
