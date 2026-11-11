---
title: Stirling-PDF et Gotenberg
description: Outils PDF auto-hébergés — Stirling-PDF (boîte à outils web : fusionner, découper, compresser, OCR, convertir, signer, caviarder, filigrane, métadonnées ; image Docker complète ou allégée, port 8080, authentification et comptes, pipelines, API REST) et Gotenberg (API de conversion sans état : Chromium pour HTML et URL vers PDF, LibreOffice pour documents Office, fusion, PDF/A, métadonnées ; port 3000, options de sécurité, utilisation par Paperless-ngx et d'autres applications) ; intérêt face aux sites en ligne.
tags: [stirling-pdf, gotenberg, pdf, conversion, ocr, pdf/a, api, docker]
icon: file-cog
---

Envoyer un contrat ou une fiche de paie sur un site gratuit « pour fusionner des PDF » expose des données confidentielles. Ces deux outils font le même travail **sur vos serveurs**.

## Stirling-PDF

Une **application web** qui regroupe plus de 50 opérations PDF dans une interface simple, utilisable par tout le monde dans l'entreprise.

| Catégorie | Exemples |
| --- | --- |
| Organiser | Fusionner, découper, réordonner, faire pivoter, extraire des pages |
| Convertir | Image ↔ PDF, Office → PDF (LibreOffice), HTML → PDF, PDF → Word, PDF/A |
| Sécurité | Mot de passe, permissions, **caviardage** (suppression réelle de zones), signature par certificat, suppression des métadonnées |
| Améliorer | **OCR** (Tesseract, langue française), compression, réparation |
| Autres | Filigrane, numérotation, tampons, comparaison de documents |

```bash
docker run -d --name stirling-pdf -p 127.0.0.1:8080:8080 \
  -v /srv/stirling/tessdata:/usr/share/tessdata \
  -v /srv/stirling/configs:/configs \
  -e DOCKER_ENABLE_SECURITY=true \
  -e SECURITY_ENABLELOGIN=true \
  -e LANGS=fr_FR \
  stirlingtools/stirling-pdf:latest
# Variante allégée (sans LibreOffice ni OCR) : étiquette « latest-ultra-lite »
```

- Avec la sécurité activée, un compte administrateur initial est créé (identifiants indiqués dans la documentation et les journaux) : **le changer à la première connexion**, puis créer les comptes utilisateurs.
- Paramètres dans `/configs/settings.yml` (connexion, SSO OAuth2 selon l'édition, limites de taille, fonctions masquées).
- **Pipelines** : enchaîner des opérations (OCR → compression → filigrane) et les appliquer à un dossier surveillé.
- **API REST** documentée (Swagger) pour automatiser : `POST /api/v1/general/merge-pdfs`, `/api/v1/misc/ocr-pdf`…

```bash
curl -X POST http://127.0.0.1:8080/api/v1/misc/compress-pdf \
  -F fileInput=@rapport.pdf -F optimizeLevel=3 -o rapport-compresse.pdf
```

## Gotenberg

**Gotenberg** (MIT) est une **API sans état** de conversion vers PDF, destinée aux **applications** (génération de factures, rapports, archivage). Elle embarque **Chromium** et **LibreOffice**.

```bash
docker run -d --name gotenberg -p 127.0.0.1:3000:3000 gotenberg/gotenberg:8 \
  gotenberg --chromium-disable-javascript=true --api-timeout=60s
```

| Route | Fonction |
| --- | --- |
| `/forms/chromium/convert/html` | HTML (avec CSS, images) → PDF |
| `/forms/chromium/convert/url` | Page web → PDF |
| `/forms/chromium/convert/markdown` | Markdown → PDF |
| `/forms/libreoffice/convert` | DOCX, XLSX, PPTX, ODT… → PDF |
| `/forms/pdfengines/merge` | Fusion de PDF |
| `/forms/pdfengines/convert` | Conversion en **PDF/A** |
| `/health` | Santé |

```bash
curl -X POST http://127.0.0.1:3000/forms/libreoffice/convert -F files=@contrat.docx -o contrat.pdf
curl -X POST http://127.0.0.1:3000/forms/chromium/convert/html -F files=@index.html -F paperWidth=8.27 -F paperHeight=11.7 -o facture.pdf
curl -X POST http://127.0.0.1:3000/forms/libreoffice/convert -F files=@note.odt -F pdfa=PDF/A-2b -o note-pdfa.pdf
```

Gotenberg est utilisé par [[01-ged-legere/01-paperless-ngx|Paperless-ngx]] et de nombreuses applications métiers.

### Sécurité

> [!WARNING]
> La conversion d'URL ou de HTML par Chromium peut servir à **atteindre le réseau interne** (SSRF) ou lire des fichiers locaux si l'API est accessible à n'importe qui. Garder Gotenberg sur un réseau interne, désactiver JavaScript si inutile, restreindre les URL autorisées (`--chromium-allow-list`, `--chromium-deny-list`) et activer l'authentification basique (`--api-enable-basic-auth`) si plusieurs applications l'utilisent.

## Choisir

| Besoin | Outil |
| --- | --- |
| Les utilisateurs manipulent leurs PDF eux-mêmes | Stirling-PDF |
| Une application génère ou convertit des documents | Gotenberg |
| Conversion ponctuelle en ligne de commande | LibreOffice `--headless --convert-to pdf`, `qpdf`, `ocrmypdf`, `pdftk` |

Commandes : [[90-aide-memoire|aide-mémoire]].
