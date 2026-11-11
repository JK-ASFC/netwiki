---
title: Bureautique — aide-mémoire
description: Ports et commandes d'ONLYOFFICE Docs (Docker, healthcheck, JWT, connecteur Nextcloud), Collabora CODE (Docker, discovery, richdocuments) et LibreOffice (installation, MSI silencieux, conversions headless, réinitialisation du profil).
tags: [aide-mémoire, onlyoffice, collabora, libreoffice, openoffice, bureautique]
icon: terminal
---

Explications : [[01-onlyoffice-collabora|ONLYOFFICE Docs et Collabora Online]] · [[02-libreoffice-openoffice|LibreOffice et Apache OpenOffice]].

| Serveur | Port | Contrôle |
| --- | --- | --- |
| ONLYOFFICE Docs | 80 dans le conteneur | `/healthcheck` |
| Collabora CODE | 9980 | `/hosting/discovery`, console `/browser/dist/admin/admin.html` |

```bash
# ONLYOFFICE
docker run -d -p 127.0.0.1:8081:80 -e JWT_ENABLED=true -e JWT_SECRET='…' onlyoffice/documentserver
curl -s http://127.0.0.1:8081/healthcheck
sudo -u www-data php occ app:install onlyoffice

# Collabora
docker run -d -p 127.0.0.1:9980:9980 -e "aliasgroup1=https://cloud\\.exemple\\.fr:443" \
  -e "extra_params=--o:ssl.enable=false --o:ssl.termination=true" collabora/code
curl -s http://127.0.0.1:9980/hosting/discovery | head
sudo -u www-data php occ app:install richdocuments
sudo -u www-data php occ config:app:set richdocuments wopi_url --value="https://office.exemple.fr"

# LibreOffice
sudo apt install libreoffice libreoffice-l10n-fr hunspell-fr
soffice --headless --convert-to pdf --outdir sortie/ *.docx
soffice --headless --convert-to xlsx tableau.ods
mv ~/.config/libreoffice/4/user ~/.config/libreoffice/4/user.ancien      # réinitialiser le profil
```

```powershell
winget install --id TheDocumentFoundation.LibreOffice
msiexec /i LibreOffice_x64.msi /qn /norestart ALLUSERS=1 REGISTER_ALL_MSO_TYPES=0 ISCHECKFORPRODUCTUPDATES=0 UI_LANGS=fr
Rename-Item "$env:APPDATA\LibreOffice\4\user" user.ancien
```
