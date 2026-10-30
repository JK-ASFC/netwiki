---
title: Raccorder les applications, API et intégration continue
description: Envoyer le courrier des applications vers Mailpit (PHP sendmail, Django, .NET, PowerShell, Postfix en environnement de recette), utiliser l'API REST pour les tests automatisés (lister, rechercher, lire, supprimer), intégration dans une chaîne CI, relais vers un vrai serveur et dépannage.
tags: [mailpit, api, tests, ci, postfix, php, django, powershell, recette]
icon: plug
---

## Raccorder les applications

| Application | Configuration |
| --- | --- |
| PHP | `sendmail_path = "/usr/local/bin/mailpit sendmail"` (php.ini), ou SMTP `localhost:1025` |
| Django | `EMAIL_HOST = "localhost"`, `EMAIL_PORT = 1025` |
| Laravel / Symfony | `MAIL_MAILER=smtp`, `MAIL_HOST=127.0.0.1`, `MAIL_PORT=1025` / `MAILER_DSN=smtp://localhost:1025` |
| Node.js (Nodemailer) | `host: "localhost", port: 1025, secure: false` |
| .NET | `SmtpClient("localhost", 1025)` ou MailKit |
| Outils de supervision (Centreon, Zabbix) en recette | Relais SMTP = serveur Mailpit, port 1025 |
| Commande `sendmail` du système | `mailpit sendmail` (compatible avec les options courantes) |

```powershell
# Test rapide depuis Windows (cmdlet obsolète mais pratique en test)
Send-MailMessage -SmtpServer localhost -Port 1025 -From app@test.local -To alice@test.local `
  -Subject "Test Mailpit" -Body "Bonjour"
```

```bash
swaks --server 127.0.0.1:1025 --to alice@test.local --from app@test.local --header "Subject: Test"
```

### Capturer tout le courrier d'un serveur de recette

Pour qu'un environnement de recette n'écrive **jamais** à de vrais clients, on redirige tout le courrier sortant de son Postfix vers Mailpit :

```postfix /etc/postfix/main.cf (serveur de recette)
relayhost = [mailpit.recette.exemple.fr]:1025
smtp_tls_security_level = none
```

Voir [[01-postfix/03-configuration-base|Postfix : relais via un smarthost]].

## API REST

| Requête | Effet |
| --- | --- |
| `GET /api/v1/messages?limit=50` | Liste des messages (résumés) |
| `GET /api/v1/search?query=to:alice@test.local subject:Bienvenue` | Recherche |
| `GET /api/v1/message/{ID}` | Message complet (en-têtes, texte, HTML, pièces jointes) ; `latest` = le dernier |
| `GET /api/v1/message/{ID}/raw` | Source brute |
| `GET /api/v1/message/{ID}/html-check` | Rapport de compatibilité HTML |
| `GET /api/v1/message/{ID}/link-check` | Vérification des liens |
| `DELETE /api/v1/messages` | Tout supprimer (début de test) |
| `POST /api/v1/send` | Envoyer un message via HTTP (sans SMTP) |

```bash
curl -s http://localhost:8025/api/v1/message/latest | jq '{Subject, From, To: [.To[].Address]}'
curl -s "http://localhost:8025/api/v1/search?query=to:alice@test.local" | jq '.messages_count'
curl -s -X DELETE http://localhost:8025/api/v1/messages
```

## Intégration continue

```yaml .gitlab-ci.yml (extrait)
tests-e2e:
  image: python:3.12
  services:
    - name: axllent/mailpit
      alias: mailpit
  variables:
    EMAIL_HOST: mailpit
    EMAIL_PORT: "1025"
  script:
    - pip install -r requirements.txt
    - pytest tests/e2e
```

```python tests/e2e/test_inscription.py
import requests

MAILPIT = "http://mailpit:8025/api/v1"

def test_courriel_de_bienvenue(client):
    requests.delete(f"{MAILPIT}/messages")
    client.post("/inscription", data={"email": "alice@test.local"})
    resultat = requests.get(f"{MAILPIT}/search", params={"query": "to:alice@test.local"}).json()
    assert resultat["messages_count"] == 1
    message = requests.get(f"{MAILPIT}/message/{resultat['messages'][0]['ID']}").json()
    assert "Bienvenue" in message["Subject"]
    assert "https://" in message["HTML"]
```

## Relais vers un vrai serveur

```yaml /etc/mailpit/relais.yaml
host: relais.corp.exemple.fr
port: 587
starttls: true
auth: plain
username: recette@exemple.fr
password: MotDePasse
allowed-recipients: '@exemple\.fr$'      # n'autoriser le relais que vers le domaine interne
```

```bash
mailpit --smtp-relay-config /etc/mailpit/relais.yaml
```

Le relais se déclenche depuis l'interface (*Release*) ; `--smtp-relay-all` relaie tout automatiquement (à réserver à des cas précis, avec `allowed-recipients`).

## Dépannage

| Symptôme | Cause | Solution |
| --- | --- | --- |
| L'application signale `Connection refused` | Mailpit écoute sur `127.0.0.1` alors que l'application est sur une autre machine ou un conteneur | `--smtp 0.0.0.0:1025` sur un réseau de recette, nom du service Docker |
| `530 Authentication required` / `AUTH not supported` | L'application impose une authentification | `--smtp-auth-accept-any` (+ `--smtp-auth-allow-insecure` sans TLS) |
| L'application exige TLS | STARTTLS obligatoire côté client | `--smtp-tls-cert` / `--smtp-tls-key` ou désactiver TLS dans l'application de test |
| Messages perdus au redémarrage | Pas de base persistante | `--database` sur un volume |
| Les plus anciens messages disparaissent | Limite `--max` atteinte | Augmenter `--max` ou vider régulièrement |
| Interface inaccessible derrière un reverse proxy | Sous-chemin non déclaré, WebSocket non transmis | `--webroot`, en-têtes `Upgrade`/`Connection` dans le proxy |
