---
title: Nuclei
description: Nuclei (ProjectDiscovery, MIT) — scanner de vulnérabilités rapide piloté par modèles YAML communautaires (plus de 10 000 : CVE, mauvaises configurations, expositions, panneaux d'administration, défauts de configuration DNS et TLS) : installation (Go, binaires Windows, Linux, macOS, Docker), mise à jour des modèles, ciblage (URL, listes, sortie de httpx), filtres par gravité, étiquettes et identifiants, limitation de débit, écriture d'un modèle maison, rapports (JSON, Markdown, export vers Jira ou GitHub), usage en CI et cadre légal.
tags: [nuclei, projectdiscovery, scanner, vulnérabilités, cve, modèles]
icon: info
---

**Nuclei** vérifie rapidement de nombreuses cibles contre une base de **modèles** maintenus par la communauté : une CVE publiée aujourd'hui a souvent son modèle dans la journée. Idéal pour contrôler régulièrement son **exposition** et réagir vite à une vulnérabilité médiatisée. Pour un audit applicatif approfondi, utiliser en plus [[03-cybersecurite/02-owasp-zap|OWASP ZAP]] ou [[03-cybersecurite/03-burp-suite|Burp Suite]].

> [!WARNING]
> Ne scannez que des systèmes pour lesquels vous avez une **autorisation écrite**. Certains modèles envoient des charges intrusives : commencez par `-severity critical,high` et `-etags intrusive`… en production, avec un débit limité.

## Installation

| Système | Commande |
| --- | --- |
| Toutes (Go) | `go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest` |
| Windows, Linux, macOS | Binaire des versions GitHub ; `brew install nuclei` (macOS) |
| Docker | `projectdiscovery/nuclei` |

```bash
nuclei -update-templates              # modèles dans ~/nuclei-templates (mis à jour automatiquement)
nuclei -version
```

## Utilisation

```bash
nuclei -u https://intranet.corp.exemple.fr -severity critical,high
nuclei -l cibles.txt -tags cve,exposure,misconfig -rl 50 -c 10 -o resultats.txt          # débit limité à 50 requêtes/s
nuclei -l cibles.txt -id CVE-2024-3400 -jsonl -o cve.jsonl                               # une CVE précise
nuclei -l cibles.txt -etags intrusive,dos -severity medium,high,critical -me rapport/    # rapport Markdown
cat domaines.txt | httpx -silent | nuclei -t http/technologies/ -silent                   # découvrir les technologies
```

## Modèle maison

```yaml
id: corp-panneau-admin-expose
info:
  name: Panneau d'administration interne exposé
  author: equipe-securite
  severity: high
http:
  - method: GET
    path: ["{{BaseURL}}/admin/login"]
    matchers-condition: and
    matchers:
      - type: status
        status: [200]
      - type: word
        words: ["Console d'administration Corp"]
```

```bash
nuclei -t corp-panneau-admin-expose.yaml -l cibles-publiques.txt
```

Suite : [[02-nikto-wapiti-sqlmap|Nikto, Wapiti, Arachni et sqlmap]] · [[90-aide-memoire|aide-mémoire]].
