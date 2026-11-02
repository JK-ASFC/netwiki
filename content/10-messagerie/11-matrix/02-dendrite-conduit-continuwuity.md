---
title: Dendrite, Conduit et Continuwuity
description: Serveurs Matrix alternatifs à Synapse — Dendrite (Go, AGPL : serveur de deuxième génération d'Element, monolithe avec PostgreSQL ou SQLite, maintenance réduite depuis 2024), Conduit (Rust, Apache 2.0 : binaire unique, base RocksDB, très économe pour une petite instance) et Continuwuity (fork communautaire actif de conduwuit, lui-même dérivé de Conduit, après l'archivage de conduwuit en 2025) : installation (binaire, paquets, Docker), configuration, délégation, limites fonctionnelles (sliding sync, administration, workers), migration et choix.
tags: [matrix, dendrite, conduit, continuwuity, conduwuit, rust, go]
icon: info
---

Ces serveurs conviennent à des **petites instances** (famille, association, équipe) ou à des machines modestes (Raspberry Pi, petit VPS). Pour une organisation, [[01-synapse-ess|Synapse]] reste le choix le plus complet et le mieux supporté (fonctions récentes, administration, authentification d'entreprise).

| | **Dendrite** | **Conduit** | **Continuwuity** |
| --- | --- | --- | --- |
| Langage | Go | Rust | Rust |
| Base | PostgreSQL ou SQLite | RocksDB intégrée | RocksDB intégrée |
| État | Maintenance réduite (correctifs de sécurité) | Maintenu, rythme modéré | **Actif** (fork communautaire de conduwuit) |
| Pour | Instances existantes | Très petites instances | Petites et moyennes instances légères |

## Conduit / Continuwuity

```bash
docker run -d --name continuwuity -p 8008:8008 -v continuwuity-db:/var/lib/continuwuity \
  -e CONTINUWUITY_SERVER_NAME=corp.exemple.fr -e CONTINUWUITY_DATABASE_PATH=/var/lib/continuwuity \
  -e CONTINUWUITY_ALLOW_REGISTRATION=false -e CONTINUWUITY_ADDRESS=0.0.0.0 forgejo.ellis.link/continuwuation/continuwuity:latest
```

Conduit : binaire statique ou image `matrixconduit/matrix-conduit`, configuration `conduit.toml` (`server_name`, `database_path`, `port`, `allow_registration`, `trusted_servers`). Les variables, chemins et noms d'image exacts dépendent de la version : suivre la documentation du projet.

## Dendrite

```bash
# Binaire Go ou image ghcr.io/element-hq/dendrite-monolith ; générer la clé et la configuration
./bin/generate-keys --private-key matrix_key.pem && ./bin/generate-config -server corp.exemple.fr -db postgres://dendrite:…@localhost/dendrite > dendrite.yaml
./bin/dendrite --config dendrite.yaml
```

Délégation `.well-known` et reverse proxy : identiques à Synapse. **Migration** d'un serveur à un autre : pas d'outil officiel général ; prévoir une nouvelle instance (et éventuellement un nouveau nom de serveur), puis l'invitation des utilisateurs dans les salons.

Commandes : [[90-aide-memoire|aide-mémoire]].
