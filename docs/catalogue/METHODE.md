# Méthode de rédaction des fiches du catalogue

Règles communes à la rédaction manuelle et à l'agent IA (`.github/workflows/agent.yml`). Objectif : chaque service du [catalogue](catalogue-services.txt) a une fiche utile en production, au même niveau que les fiches existantes du wiki.

## 1. Choisir le travail

```bash
node scripts/catalogue.mjs                 # met à jour suivi.json et SUIVI.md
node scripts/catalogue.mjs --suivant 10    # 10 prochains services à rédiger (ordre du catalogue)
```

- **Service déjà dans le wiki** (`statut: existant`) : ne pas dupliquer. Lire la fiche ; si un système d'exploitation, une commande courante, une nouveauté de version ou l'interface graphique manque, **l'ajouter** dans la fiche existante, puis passer le statut à `ameliore`.
- **Nouveau service** (`statut: a-faire`) : créer la fiche dans la catégorie `cible` (existante ou nouvelle, voir `categoriesNouvelles` dans `suivi.json`) ; un service très proche d'une fiche existante (module, client, variante) va **dans la fiche existante** sous forme de section ou d'article.
- Plusieurs petits outils d'une même famille peuvent partager un dossier (comme `21-outils/02-reseau-diagnostic`).

## 2. Structure d'une fiche

```text
content/<catégorie>/<NN>-<service>/
├── _folder.json                       { "title", "icon" (Lucide), "color", "description" }
├── 01-presentation-installation.md    présentation, architecture, installation par OS, premiers pas
├── 02-configuration-exploitation.md   configuration, sécurité, sauvegarde, mise à jour, dépannage
├── 03-interface-graphique.md          interface web ou bureau (si elle existe), avec emplacements de captures
├── _assets/                           captures d'écran (PNG/WebP) ajoutées par JK-ASFC
└── 90-aide-memoire.md                 commandes avec exemples prêts à copier
```

Petit outil : `01` + `90` (+ `03` s'il a une interface graphique). Service important : `02` peut être découpé (`02-…`, `03-…`, `04-…`), l'interface graphique prend alors le numéro suivant.

En-tête de chaque article :

```yaml
---
title: Présentation et installation
description: Une phrase riche en mots-clés (recherche), qui résume tout l'article.
tags: [service, rôle, linux, windows, docker]
icon: download
---
```

## 3. Contenu attendu

**Présentation** : rôle, cas d'usage, alternatives (liens `[[…]]` vers les fiches voisines), licence, architecture (schéma Mermaid si utile), ports et protocoles (tableau), prérequis.

**Installation — tous les systèmes indiqués dans le catalogue**, chacun avec les commandes exactes :

| Système | À couvrir |
| --- | --- |
| Debian / Ubuntu | dépôt officiel ou paquet de la distribution, `systemctl` |
| RHEL / Rocky / Alma / Fedora | `dnf`, SELinux et pare-feu (`firewall-cmd`) si besoin |
| Autres Linux pertinents | Alpine (`apk`), Arch (`pacman`), openSUSE (`zypper`), NixOS… |
| Windows | `winget`, Chocolatey, MSI, service Windows, pare-feu (`New-NetFirewallRule`) |
| macOS | Homebrew (`brew install`, `brew services`) |
| BSD | `pkg install`, `rc.conf` |
| Conteneur | `docker run` et `compose.yaml` |
| Kubernetes | Helm quand c'est le mode d'installation courant |

Si un système n'est pas pris en charge, le dire en une ligne (et proposer le conteneur ou la VM).

**Configuration et exploitation** : fichiers et emplacements, réglages essentiels, sécurisation (TLS, authentification, comptes de service, durcissement), sauvegarde/restauration, mise à jour, journaux, supervision, tableau « symptôme → cause → correction ».

**Interface graphique** (`03-interface-graphique.md`) : adresse et port d'accès, premier compte, parcours des écrans principaux et des tâches courantes faites à la souris, équivalent CLI de chaque action importante.

**Aide-mémoire** : commandes groupées par thème, chacune avec un exemple réaliste (noms d'hôtes `srv-…`, domaine `corp.exemple.fr`, réseaux `10.0.x.0/24`).

## 4. Captures d'écran

Ne jamais insérer une image qui n'existe pas. Placer un **emplacement de capture** (commentaire HTML, invisible dans NetWiki) :

```markdown
<!-- CAPTURE: Tableau de bord après la première connexion | _assets/grafana-tableau-de-bord.png -->
```

- `node scripts/captures.mjs` liste toutes les captures attendues dans `docs/catalogue/CAPTURES.md` (fichier, article, description).
- Il suffit de déposer l'image au nom indiqué dans le dossier `_assets/` de la fiche, puis `node scripts/captures.mjs --appliquer` remplace l'emplacement par l'image légendée `![…](…"…")`.

## 5. Style

- Français, ton technique et direct, phrases courtes ; termes anglais en *italique* à la première occurrence.
- Exemples **copiables tels quels** en CLI : aucune variable non expliquée, pas de `…` dans une commande.
- Versions : citer la version majeure documentée (« Grafana 12 ») et éviter les dates relatives.
- Encadrés : `> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`.
- Liens internes : `[[NN-service/01-presentation-installation|Nom]]` ; dans un tableau, échapper la barre : `[[NN-service/01-presentation-installation\|Nom]]` (jamais de `|` non échappé dans une cellule, y compris dans du code : `\|`).

## 5 bis. Documentation de référence complète d'un service

Pour les services majeurs, la fiche peut être complétée par la **documentation officielle complète**, organisée en arborescence comme un navigateur de documentation : `Commandes`, `Guides`, `Modules`, `Directives` (ou l'équivalent du service). Exemple : Apache HTTP Server (`05-web/02-apache/10-commandes` … `13-directives`).

- Partir des **sources** de la documentation officielle (dépôt Git, XML, Markdown), jamais d'une copie de site.
- Vérifier la **licence** (Apache 2.0, CC BY…) et citer la source en pied de chaque page.
- Prendre la **traduction française officielle** quand elle existe ; sinon reproduire le texte original et le signaler par un encadré.
- Générer les pages avec un script versionné (`scripts/import-<service>-docs.py`) pour pouvoir les régénérer à chaque nouvelle version ; ne pas les modifier à la main.
- Une page par élément (commande, module, directive), un sous-dossier par thème pour les guides, liens wiki entre les éléments (directive → module, module → directives, guide → directives).
- Ajouter un renvoi vers ces sections dans la page de présentation du service et passer le statut du catalogue à `ameliore`.

## 6. Valider et enregistrer

```bash
npm run validate                      # liens, tableaux, code, diagrammes, images : « Aucun problème détecté. »
node scripts/catalogue.mjs            # SUIVI.md à jour
```

Dans `docs/catalogue/suivi.json`, pour chaque service traité : `statut` (`fait` ou `ameliore`), `lot`, `wiki` (chemin de la fiche) et, pour la veille automatique, `depot` (`propriétaire/dépôt` GitHub) et/ou `eol` (identifiant [endoflife.date](https://endoflife.date)).

Un lot = un commit (« Contenu : lot N — … »). Les nouvelles catégories reçoivent un `_folder.json` ; la page [[00-feuille-de-route]] reçoit une ligne par lot.
