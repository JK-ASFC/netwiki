---
title: Présentation, installation et utilisation
description: SOPS (Secrets OPerationS, CNCF, anciennement Mozilla SOPS) — chiffrement des valeurs dans les fichiers YAML, JSON, ENV, INI et binaires tout en laissant les clés lisibles (diffs Git exploitables) : installation (Linux, Windows, macOS), clés age, PGP, AWS/GCP/Azure KMS, HashiCorp Vault/OpenBao Transit, fichier .sops.yaml (règles par chemin, encrypted_regex), sops edit, encrypt, decrypt, exec-env, updatekeys et rotation, intégration Git (diff), Ansible (community.sops), Kubernetes (Flux natif, KSOPS pour Argo CD, helm-secrets) et bonnes pratiques.
tags: [sops, secrets, gitops, age, chiffrement, kubernetes, ansible]
icon: info
---

**SOPS** chiffre **les valeurs** d'un fichier de configuration et laisse les **clés** en clair : un `values.yaml` ou un inventaire Ansible peut être versionné dans Git, relu en revue de code (on voit *quelle* clé change), et déchiffré seulement par les personnes ou systèmes autorisés. Le projet est passé de Mozilla à la **CNCF** (« Mozilla SOPS » et « SOPS » désignent le même outil).

## Installation

| Système | Commande |
| --- | --- |
| Linux | Binaire ou paquet `.deb`/`.rpm` des versions GitHub (`getsops/sops`) |
| Windows | Binaire `.exe` des versions GitHub |
| macOS | `brew install sops` |

## Configuration et usage (avec age)

```yaml
# .sops.yaml à la racine du dépôt
creation_rules:
  - path_regex: inventaires/prod/.*\.ya?ml$
    encrypted_regex: '^(mot_de_passe|password|secret|token|cle_.*)$'
    age: age1equipeprod…,age1ciprod…
  - path_regex: kubernetes/.*secret.*\.yaml$
    encrypted_regex: '^(data|stringData)$'
    age: age1equipeprod…,age1flux…
```

```bash
export SOPS_AGE_KEY_FILE=~/.config/sops/age/keys.txt
sops edit inventaires/prod/group_vars/all/coffre.yml       # ouvre l'éditeur sur la version déchiffrée, rechiffre à l'enregistrement
sops encrypt -i kubernetes/base/secret-app.yaml
sops decrypt kubernetes/base/secret-app.yaml | kubectl apply -f -
sops exec-env secrets.env 'terraform apply'                 # variables déchiffrées seulement pour la commande
sops updatekeys inventaires/prod/group_vars/all/coffre.yml  # après modification des destinataires dans .sops.yaml
sops rotate -i fichier.yaml                                 # nouvelle clé de données
```

Diffs lisibles : `git config diff.sopsdiffer.textconv "sops decrypt"` + `*.yaml diff=sopsdiffer` dans `.gitattributes`.

## Intégrations

- **Ansible** : collection `community.sops` (lookup et chargement de fichiers chiffrés).
- **Flux** : déchiffrement natif (secret contenant la clé age) — voir [[30-gitops-argocd-flux/02-flux|Flux]].
- **Argo CD** : greffon KSOPS ou helm-secrets ; **Helm** : greffon helm-secrets.
- **Terraform** : fournisseur `carlpett/sops`.

> [!WARNING]
> Révoquer un accès ne protège pas les anciennes versions déjà dans l'historique Git : après le départ d'une personne, retirez sa clé, **changez les secrets eux-mêmes** puis rechiffrez.

Commandes : [[90-aide-memoire|aide-mémoire]].
