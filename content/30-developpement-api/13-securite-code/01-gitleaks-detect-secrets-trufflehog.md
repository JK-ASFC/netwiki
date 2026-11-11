---
title: Gitleaks, detect-secrets et TruffleHog
description: Détecter les secrets dans le code et l'historique Git — pourquoi (clés et mots de passe commités restent dans l'historique), Gitleaks (règles, scan du dépôt et de l'historique, hook pre-commit, CI, rapport SARIF, allowlist), detect-secrets (Yelp : base de référence .secrets.baseline, audit, pre-commit), TruffleHog OSS (détecteurs avec vérification active des secrets, scan git/GitHub/S3) ; que faire quand un secret a fuité (révocation, purge de l'historique).
tags: [gitleaks, detect-secrets, trufflehog, secrets, sécurité, git, ci, pre-commit]
icon: shield-check
---

Un mot de passe ou une clé d'API **commité par erreur** reste dans l'**historique Git** même après suppression du fichier, et se propage à tous les clones. Ces outils détectent les secrets **avant** le commit (hook) et **en continu** (CI, audit de l'historique).

## Gitleaks

**Gitleaks** recherche des secrets par **motifs** (clés AWS, jetons, clés privées…) et **entropie**, dans les fichiers et dans tout l'**historique**.

```bash
# binaire des versions GitHub ; brew install gitleaks ; image zricethezav/gitleaks
gitleaks detect --source . --report-format sarif --report-path gitleaks.sarif    # tout l'historique
gitleaks detect --no-git --source .            # répertoire seul (pas d'historique)
gitleaks protect --staged                      # avant commit : seulement l'index
```

```toml .gitleaks.toml (extrait)
[extend]
useDefault = true
[[rules]]
id = "cle-interne"
regex = '''INT-[A-Z0-9]{32}'''
[allowlist]
paths = ['''(.*)?tests/fixtures/.*''']
regexes = ['''EXAMPLE_KEY_[0-9]+''']
```

Hook **pre-commit** et étape **CI** (sortie **SARIF** affichable dans l'onglet sécurité des forges) :

```yaml .pre-commit-config.yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.x.x
    hooks: [ { id: gitleaks } ]
```

## detect-secrets

**detect-secrets** (Yelp) mise sur une **base de référence** : on enregistre l'état connu (`.secrets.baseline`), et la CI échoue seulement sur les **nouveaux** secrets, ce qui évite de bloquer sur des faux positifs existants.

```bash
python3 -m pip install detect-secrets
detect-secrets scan > .secrets.baseline            # créer la base
detect-secrets audit .secrets.baseline             # marquer vrais/faux positifs
detect-secrets scan --baseline .secrets.baseline   # en CI : échoue sur du nouveau
```

```yaml .pre-commit-config.yaml
  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.x.x
    hooks: [ { id: detect-secrets, args: ["--baseline", ".secrets.baseline"] } ]
```

## TruffleHog OSS

**TruffleHog** se distingue par la **vérification active** : pour de nombreux types de secrets, il teste si la clé trouvée est **encore valide** (en interrogeant le service), réduisant drastiquement les faux positifs. Il scanne dépôts Git, organisations GitHub/GitLab, S3, systèmes de fichiers.

```bash
# image trufflesecurity/trufflehog ; binaire des versions GitHub
trufflehog git https://github.com/org/depot --only-verified
trufflehog filesystem ./ --only-verified
trufflehog github --org=mon-org --only-verified
```

## Quand un secret a fuité

> [!WARNING]
> La priorité absolue est la **révocation** : considérer le secret comme **compromis** et le **remplacer immédiatement** (régénérer la clé, changer le mot de passe) — le retirer de l'historique ne suffit pas, il a pu être lu ou cloné.
> 1. **Révoquer et renouveler** le secret auprès du service concerné.
> 2. Purger l'historique Git si nécessaire (`git filter-repo`, BFG), puis forcer la mise à jour — opération lourde qui réécrit l'historique partagé, à coordonner avec l'équipe.
> 3. Mettre en place la **prévention** : hook pre-commit + scan CA/CI, et stocker les secrets dans un coffre de secrets, jamais dans le code.

## Choisir

| Besoin | Outil |
| --- | --- |
| Scan rapide, règles, CI, historique | Gitleaks |
| Gérer les faux positifs par une base de référence | detect-secrets |
| Savoir si un secret trouvé est encore actif | TruffleHog (`--only-verified`) |

Les trois sont complémentaires et s'utilisent souvent ensemble : pre-commit (Gitleaks/detect-secrets) + scan périodique vérifié (TruffleHog).

Voir aussi : [[02-iac-checkov-kics|analyse IaC]] · [[03-linters-shellcheck|linters]]. Commandes : [[90-aide-memoire|aide-mémoire]].
