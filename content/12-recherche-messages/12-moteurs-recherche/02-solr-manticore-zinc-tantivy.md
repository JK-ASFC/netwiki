---
title: Apache Solr, Manticore Search, ZincSearch et Tantivy
description: Moteurs de recherche plein texte — Apache Solr (Lucene, Apache 2.0 : cœurs et collections, schéma géré, analyseurs français, requêtes edismax, facettes, SolrCloud avec ZooKeeper ou mode intégré, bin/solr, port 8983, sécurité Basic Auth et règles), Manticore Search (successeur libre de Sphinx, GPL : SQL sur le protocole MySQL port 9306, HTTP 9308, tables temps réel, recherche texte et vectorielle, réplication Galera, compatibilité Elasticsearch partielle), ZincSearch (Go : API compatible Elasticsearch, très léger, port 4080, état du projet) et Tantivy (bibliothèque Rust, base de Quickwit et ParadeDB) ; choix.
tags: [apache solr, solr, solrcloud, manticore, sphinx, zincsearch, tantivy, lucene, recherche plein texte]
icon: search
---

## Apache Solr

**Solr** est un moteur de recherche d'entreprise fondé sur **Lucene**, comme Elasticsearch, très présent dans les sites de commerce, les bibliothèques, les intranets et des produits tiers (Nextcloud Full Text Search, Drupal, DSpace, Alfresco).

```bash
# Java 17+ ; archive solr-<version>.tgz
tar xzf solr-*.tgz && cd solr-*/
bin/solr start                                        # mode utilisateur ; port 8983
bin/solr create -c documents                          # collection / cœur avec le schéma par défaut
bin/solr post -c documents fichiers/*.json            # indexation (outil « post »)
bin/solr status ; bin/solr stop
# Production : script d'installation de service (bin/install_solr_service.sh) ou image Docker « solr »
docker run -d --name solr -p 127.0.0.1:8983:8983 -v /srv/solr:/var/solr solr:9 solr-precreate documents
```

```bash
curl "http://127.0.0.1:8983/solr/documents/select?q=sauvegarde%20nocturne&defType=edismax&qf=titre^3%20contenu&facet=true&facet.field=categorie&rows=10"
curl -X POST -H 'Content-Type: application/json' http://127.0.0.1:8983/solr/documents/update?commit=true \
  -d '[{"id":"proc-42","titre":"Restauration Veeam","categorie":"sauvegarde"}]'
```

- **Schéma** : géré par API (`/schema`) ; utiliser un type de champ avec analyseur **français** (`text_fr` : élision, mots vides, racinisation).
- **SolrCloud** : collections réparties en fragments répliqués, coordonnées par **ZooKeeper** (ensemble de 3 nœuds) ; Solr 10 introduit un mode de coordination intégré.
- **Sécurité** : `security.json` (authentification Basic ou JWT, règles d'autorisation) ; par défaut l'interface d'administration est ouverte : ne jamais exposer le port 8983.

## Manticore Search

**Manticore Search** (GPL) est le successeur libre de **Sphinx Search**. On l'interroge en **SQL** via le protocole **MySQL** (client `mysql` standard) ou en HTTP JSON.

```bash
docker run -d --name manticore -p 127.0.0.1:9306:9306 -p 127.0.0.1:9308:9308 -v /srv/manticore:/var/lib/manticore manticoresearch/manticore
mysql -h 127.0.0.1 -P 9306
```

```sql
CREATE TABLE articles (titre text, contenu text, categorie string, publie_le timestamp) morphology='stem_fr' min_infix_len='3';
INSERT INTO articles (titre, contenu, categorie, publie_le) VALUES ('Migration VLAN', 'Bascule des ports…', 'réseau', 1762819200);
SELECT id, titre, HIGHLIGHT() FROM articles WHERE MATCH('vlan bascule') AND categorie = 'réseau' ORDER BY WEIGHT() DESC LIMIT 10;
SHOW TABLES ; SHOW STATUS;
```

- Tables **temps réel** (insertion immédiate) ou tables **simples** construites depuis une base SQL par l'indexeur.
- Recherche **vectorielle** (KNN), recherche floue, autocomplétion ; réplication multi-maîtres (Galera) ; API partiellement compatible Elasticsearch pour certains outils.
- Très économe en ressources ; bon choix pour ajouter la recherche à une application MySQL/MariaDB.

## ZincSearch

**ZincSearch** (Go, Apache 2.0) se présente comme une alternative **légère** à Elasticsearch, avec une API d'ingestion compatible (bulk) et une interface web.

```bash
docker run -d --name zincsearch -p 127.0.0.1:4080:4080 -v /srv/zinc:/data \
  -e ZINC_DATA_PATH=/data -e ZINC_FIRST_ADMIN_USER=admin -e ZINC_FIRST_ADMIN_PASSWORD='…' \
  public.ecr.aws/zinclabs/zincsearch:latest
```

> [!NOTE]
> Ses auteurs développent désormais **OpenObserve** (journaux, métriques, traces) et ZincSearch n'évolue plus guère. Pour la recherche dans les journaux, préférer OpenObserve, OpenSearch ou Quickwit.

## Tantivy

**Tantivy** (MIT) n'est pas un serveur mais une **bibliothèque Rust** de recherche plein texte, inspirée de Lucene et très rapide. Elle sert de moteur à **Quickwit** (recherche dans les journaux sur stockage objet), à **ParadeDB** (recherche BM25 dans PostgreSQL via `pg_search`) et à de nombreux outils. On l'utilise directement en Rust ou en Python (`tantivy-py`).

```bash
python3 -m pip install tantivy
```

```python
import tantivy
schema = tantivy.SchemaBuilder().add_text_field("titre", stored=True).add_text_field("corps").build()
index = tantivy.Index(schema, path="index")
w = index.writer()
w.add_document(tantivy.Document(titre="Procédure DNS", corps="Ajouter une zone inverse"))
w.commit(); index.reload()
recherche = index.searcher()
print([recherche.doc(a)["titre"] for _, a in recherche.search(index.parse_query("zone", ["corps"]), 5).hits])
```

## Choisir

| Besoin | Outil |
| --- | --- |
| Moteur d'entreprise éprouvé, intégré à un logiciel existant | Solr |
| Recherche SQL légère pour une application MySQL | Manticore |
| Recherche instantanée pour une interface web | [[01-meilisearch-typesense-sonic\|Meilisearch ou Typesense]] |
| Recherche intégrée à un programme, sans serveur | Tantivy |
| Journaux et analytique | [[01-elasticsearch/01-presentation-installation\|Elasticsearch]], [[02-opensearch/01-presentation-installation\|OpenSearch]], Quickwit |

Commandes : [[90-aide-memoire|aide-mémoire]].
