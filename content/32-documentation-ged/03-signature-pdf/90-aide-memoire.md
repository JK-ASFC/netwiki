---
title: Signature électronique et outils PDF — aide-mémoire
description: Certificat de scellement (openssl pkcs12), commandes LibreSign (occ), ports de Documenso, OpenSign, Stirling-PDF et Gotenberg, appels d'API de conversion et outils PDF en ligne de commande (qpdf, ocrmypdf, pdfsig).
tags: [aide-mémoire, documenso, opensign, libresign, stirling-pdf, gotenberg, pdf]
icon: terminal
---

Explications : [[01-documenso-opensign-libresign|Documenso, OpenSign et LibreSign]] · [[02-stirling-pdf-gotenberg|Stirling-PDF et Gotenberg]].

| Outil | Port |
| --- | --- |
| Documenso | 3000 |
| OpenSign | 3000 (client), 8080 (serveur) selon le Compose |
| Stirling-PDF | 8080 |
| Gotenberg | 3000 |

```bash
# Certificat de scellement
openssl req -x509 -newkey rsa:4096 -keyout cle.pem -out cert.pem -days 1095 -nodes -subj "/CN=Signature"
openssl pkcs12 -export -out signature.p12 -inkey cle.pem -in cert.pem

# LibreSign
sudo -u www-data php occ app:install libresign
sudo -u www-data php occ libresign:install --java --pdftk --jsignpdf

# Gotenberg
curl -X POST http://127.0.0.1:3000/forms/libreoffice/convert -F files=@doc.docx -o doc.pdf
curl -X POST http://127.0.0.1:3000/forms/pdfengines/merge -F files=@a.pdf -F files=@b.pdf -o fusion.pdf
curl http://127.0.0.1:3000/health

# Stirling-PDF
curl -X POST http://127.0.0.1:8080/api/v1/misc/compress-pdf -F fileInput=@f.pdf -F optimizeLevel=3 -o f-min.pdf

# Ligne de commande
libreoffice --headless --convert-to pdf --outdir sortie/ *.docx
ocrmypdf -l fra --output-type pdfa scan.pdf scan-ocr.pdf
qpdf --empty --pages a.pdf b.pdf -- fusion.pdf
qpdf --encrypt 'MdpLecture' 'MdpProprietaire' 256 -- entree.pdf protege.pdf
pdfsig contrat-signe.pdf                 # vérifie les signatures (poppler-utils)
exiftool -all= -overwrite_original document.pdf   # supprime les métadonnées
```
