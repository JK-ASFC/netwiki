---
title: MailHog et smtp4dev
description: Deux autres serveurs SMTP de test — MailHog (Go, MIT : capture des e-mails, interface web 8025, API, Jim pour simuler des pannes ; projet abandonné, migration vers Mailpit) et smtp4dev (.NET, BSD : interface web, IMAP pour lire les messages dans un client, relais vers un vrai serveur, règles, plusieurs boîtes, Windows et Docker) ; configuration des applications et usage en intégration continue.
tags: [mailhog, smtp4dev, smtp, tests, développement, docker, mailpit]
icon: flask-conical
---

Comme [[01-presentation-installation|Mailpit]], ces outils **capturent tous les e-mails** envoyés par une application en développement ou en recette, sans jamais les remettre à de vrais destinataires, et les affichent dans une interface web.

| | Mailpit | MailHog | smtp4dev |
| --- | --- | --- | --- |
| Langage, licence | Go, MIT | Go, MIT | .NET, BSD |
| État | **Actif** (recommandé) | **Abandonné** depuis plusieurs années | Actif |
| Ports par défaut | SMTP 1025, web 8025 | SMTP 1025, web 8025 | SMTP 25, web 80 (5000 en développement), IMAP 143 |
| Points forts | Rapide, recherche, API complète, contrôles HTML et liens | Simulation de pannes SMTP (Jim) | **IMAP** pour lire dans Outlook ou Thunderbird, relais, interface Windows |

## MailHog

```bash
docker run -d --name mailhog -p 1025:1025 -p 8025:8025 mailhog/mailhog
# Interface : http://localhost:8025 ; API : http://localhost:8025/api/v2/messages
curl -s http://localhost:8025/api/v2/messages | jq '.total'
curl -s -X DELETE http://localhost:8025/api/v1/messages
```

- **Jim** (option `-invite-jim`) simule des comportements SMTP défaillants (connexions refusées, réponses lentes) pour tester la robustesse de l'application.
- **mhsendmail** remplace `sendmail` pour PHP (`sendmail_path = "/usr/local/bin/mhsendmail --smtp-addr=mailhog:1025"`).

> [!NOTE]
> MailHog n'est plus maintenu. **Mailpit** reprend les mêmes ports (1025, 8025) et une API proche : il suffit souvent de remplacer l'image Docker `mailhog/mailhog` par `axllent/mailpit`.

## smtp4dev

```bash
docker run -d --name smtp4dev -p 5000:80 -p 2525:25 -p 143:143 rnwood/smtp4dev
```

```powershell
dotnet tool install -g Rnwood.Smtp4dev     # ou winget install Rnwood.smtp4dev (application de bureau)
smtp4dev --urls "http://*:5000" --smtpport 2525 --imapport 1143
```

| Fonction | Usage |
| --- | --- |
| Interface web | Messages, en-têtes, source, pièces jointes, rendu HTML ; sessions SMTP détaillées |
| **IMAP** | Configurer un compte IMAP dans un vrai client pour vérifier le rendu dans Outlook ou Thunderbird |
| **Relais** | Transmettre certains messages (règles par destinataire) à un vrai serveur SMTP pour un test de bout en bout |
| Plusieurs boîtes | Classer les messages par destinataire ou par règle |
| Authentification, TLS | Tester une application qui exige STARTTLS ou SMTP AUTH |

Les réglages se placent dans `appsettings.json` ou en variables d'environnement (`ServerOptions__SmtpPort=25`, `ServerOptions__TlsMode=StartTls`, `RelayOptions__SmtpServer=…`).

## Brancher une application

| Application | Réglage |
| --- | --- |
| PHP (`mail()`) | `sendmail_path = "/usr/sbin/sendmail -S localhost:1025"` (sendmail de Mailpit) ou un client SMTP |
| Symfony, Laravel | `MAILER_DSN=smtp://localhost:1025` / `MAIL_HOST=localhost MAIL_PORT=1025` |
| Django | `EMAIL_HOST = "localhost"`, `EMAIL_PORT = 1025` |
| Node.js (Nodemailer) | `host: "localhost", port: 1025, secure: false` |

En intégration continue, lancer l'outil comme **service** du pipeline et interroger son API pour vérifier qu'un e-mail a bien été envoyé avec le bon contenu.

Voir aussi : [[01-presentation-installation|Mailpit]]. Commandes : [[90-aide-memoire|aide-mémoire]].
