---
title: LibreOffice et Apache OpenOffice
description: Suites bureautiques libres de bureau — LibreOffice (The Document Foundation, MPL : Writer, Calc, Impress, Draw, Base, Math ; versions « Fresh » et « Still », installation sur Linux, Windows MSI et macOS, déploiement silencieux et politiques par GPO ou fichiers xcd, extensions, profil utilisateur, mode headless pour conversions en lot, macros et sécurité, compatibilité Office) et Apache OpenOffice (état du projet, maintenance minimale, migration vers LibreOffice) ; conseils de migration depuis Microsoft Office.
tags: [libreoffice, openoffice, bureautique, odf, déploiement, msi, headless, conversion]
icon: file-text
---

## LibreOffice

**LibreOffice** est la suite bureautique libre de référence, développée par **The Document Foundation**. Elle utilise le format ouvert **ODF** (ODT, ODS, ODP) et lit et écrit les formats Microsoft Office.

| Module | Équivalent |
| --- | --- |
| Writer | Traitement de texte |
| Calc | Tableur |
| Impress | Présentations |
| Draw | Dessin, diagrammes, édition légère de PDF |
| Base | Base de données de bureau (HSQLDB/Firebird intégrés, connexion ODBC/JDBC) |
| Math | Formules |

Deux branches : **« Fresh »** (dernières fonctions) et **« Still »** (plus ancienne, plus stable, conseillée en entreprise). Des sociétés (Collabora, allotropia…) proposent des versions avec support à long terme.

### Installation

```bash
sudo apt install libreoffice libreoffice-l10n-fr libreoffice-help-fr hunspell-fr     # Debian/Ubuntu
sudo dnf install libreoffice libreoffice-langpack-fr                                  # Fedora/RHEL
flatpak install flathub org.libreoffice.LibreOffice                                   # version récente
brew install --cask libreoffice libreoffice-language-pack                             # macOS
winget install --id TheDocumentFoundation.LibreOffice                                 # Windows
```

### Déploiement sur un parc Windows

```powershell
msiexec /i LibreOffice_x64.msi /qn /norestart ALLUSERS=1 CREATEDESKTOPLINK=0 REGISTER_ALL_MSO_TYPES=0 ISCHECKFORPRODUCTUPDATES=0 QUICKSTART=0 UI_LANGS=fr ADDLOCAL=ALL REMOVE=gm_o_Onlineupdate
```

- `REGISTER_ALL_MSO_TYPES=0` : ne pas associer les fichiers Office à LibreOffice (cohabitation) ; `=1` pour remplacer Office.
- Paramètres verrouillés pour tous : **modèles d'administration ADMX/GPO** (projets communautaires) ou fichiers de configuration `.xcd` placés dans `share/registry` du dossier d'installation (format d'enregistrement par défaut, désactivation des macros, chemins des modèles).
- Profil utilisateur : `%APPDATA%\LibreOffice\4\user` (Windows), `~/.config/libreoffice/4/user` (Linux) — le renommer pour réparer une installation qui se bloque.

### Conversion en ligne de commande

```bash
soffice --headless --convert-to pdf --outdir /srv/pdf /srv/docs/*.docx
soffice --headless --convert-to docx rapport.odt
soffice --headless --convert-to "csv:Text - txt - csv (StarCalc):59,34,76,1" tableau.xlsx     # CSV séparateur ; UTF-8
soffice --headless --convert-to pdf:writer_pdf_Export:'{"SelectPdfVersion":{"type":"long","value":"2"}}' contrat.odt   # PDF/A-2
```

Une seule instance headless traite les conversions à la fois : pour un service, préférer [[03-signature-pdf/02-stirling-pdf-gotenberg|Gotenberg]] ou utiliser un profil séparé (`-env:UserInstallation=file:///tmp/lo-$$`).

### Sécurité

- **Macros** : niveau de sécurité « Élevé » ou « Très élevé » (seules les macros signées ou d'emplacements de confiance s'exécutent) ; les documents piégés par macro visent aussi LibreOffice.
- Appliquer rapidement les mises à jour (failles dans les filtres d'import).
- Extensions : seulement depuis le site officiel des extensions ou une source interne validée.

### Migrer depuis Microsoft Office

1. Inventorier les usages : macros VBA (souvent à réécrire), modèles, liaisons avec des applications métiers.
2. Choisir le format par défaut : ODF (ouvert, recommandé par le RGI pour l'administration) ou OOXML pour les échanges externes.
3. Convertir les modèles, installer les **polices** compatibles (Carlito pour Calibri, Caladea pour Cambria, Liberation pour Arial et Times).
4. Former et accompagner ; garder quelques licences Office pour les cas incompatibles.

## Apache OpenOffice

**Apache OpenOffice** est l'héritier direct d'OpenOffice.org, dont LibreOffice est issu (2010). Le projet ne publie plus que des **versions de maintenance rares**, avec des correctifs de sécurité tardifs et sans nouveautés notables.

> [!WARNING]
> Pour toute nouvelle installation ou mise à jour de parc, préférer **LibreOffice**, mieux maintenu, plus compatible et plus sûr. La migration est transparente : mêmes formats ODF, interface très proche. Désinstaller OpenOffice (`msiexec /x {GUID}` ou le désinstalleur), puis déployer LibreOffice.

Voir aussi : [[01-onlyoffice-collabora|ONLYOFFICE Docs et Collabora Online]]. Commandes : [[90-aide-memoire|aide-mémoire]].
