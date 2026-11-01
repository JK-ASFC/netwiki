# Publier NetWiki sur toutes les plateformes

*Copyright (c) 2026 JK-ASFC — licence MIT.*

Ce guide décrit comment publier NetWiki pour **Windows, macOS, Linux, Android et iOS** à partir du dépôt GitHub `JK-ASFC/netwiki`. Les compilations sont automatiques (GitHub Actions, fichier `.github/workflows/build.yml`) ; seules les étapes liées à **vos comptes** (GitHub, Apple, Google, certificats) restent à faire par vous.

## 1. Dépôt GitHub (une fois)

1. Créez le dépôt **public** `netwiki` sur votre compte **JK-ASFC** (c'est l'adresse que l'application interroge pour les mises à jour).
2. Depuis le dossier du projet :

   ```bash
   git init -b main
   git add .
   git commit -m "NetWiki 1.40.0"
   git remote add origin https://github.com/JK-ASFC/netwiki.git
   git push -u origin main
   ```

3. Ajoutez le secret **`NETWIKI_SIGNING_KEY`** (*Settings → Secrets and variables → Actions*) : copiez le contenu complet du fichier `~/.netwiki-signing/netwiki-ed25519-private.pem` (généré par `node scripts/gen-signing-key.js`). **Ne versionnez jamais ce fichier** ; gardez-en une copie hors ligne. Sans cette clé, l'application refusera tout paquet de contenu téléchargé en ligne.
4. Recommandé : activez la signature de vos commits (*Settings → SSH and GPG keys*) et la protection de la branche `main`.

## 2. Publier une version

```bash
# 1. mettre à jour la version dans package.json (et mobile/package.json)
# 2. étiqueter et pousser
git tag v1.40.0
git push origin v1.40.0
```

Le pipeline construit et joint à la *release* GitHub :

| Plateforme | Fichiers |
| --- | --- |
| Windows | `NetWiki-Setup-x.y.z.exe` (installeur), `NetWiki-portable.exe` (portable, nom fixe : il se remplace lui-même lors des mises à jour) |
| macOS | `.dmg`, `.zip` (Intel et Apple Silicon selon le runner) |
| Linux | `.AppImage`, `.deb` |
| Contenu | `netwiki-content-x.y.z.netwiki` signé — pour les postes hors ligne |
| Mises à jour | `netwiki-update.json` : empreintes SHA-256 de tous les fichiers, signées Ed25519 — vérifiées par NetWiki avant d'installer une nouvelle version |

### Publication hebdomadaire du contenu

Le workflow `.github/workflows/contenu.yml` s'exécute **chaque lundi à 5 h UTC** (et à la demande : *Actions → Publication hebdomadaire du contenu → Run workflow*, option « forcer »). Il empaquette et signe le dossier `content/` de `main`, puis publie sur la branche **`contenu`** (un seul commit, remplacé à chaque fois — ce n'est pas une Release) :

| Fichier | Rôle |
| --- | --- |
| `contenu.json` | Index : version datée du contenu (`AAAA.MM.JJ.HHMM`), nombre d'articles, taille, empreintes |
| `netwiki-contenu.netwiki` | Paquet signé de tous les articles |

Rien n'est publié si aucun article n'a changé. NetWiki lit l'index à chaque démarrage (si l'utilisateur l'a accepté) ou à la demande ; si le paquet est plus récent que le contenu installé, il affiche la liste des nouveautés, l'applique après accord puis redémarre. GitHub suspend les tâches planifiées d'un dépôt public après 60 jours sans activité : un commit ou un lancement manuel les réactive.
| Android | `app-debug.apk` (test), `app-release.aab` (Play Store, signé si la clé est configurée) |
| iOS | `NetWiki-simulateur.zip` (test sur simulateur ; la version App Store nécessite la signature Apple) |

## 3. Signature de code (supprime les avertissements)

| Plateforme | Ce qu'il faut | Secrets GitHub |
| --- | --- | --- |
| Windows | Certificat de signature de code (OV/EV, ou Azure Trusted Signing) | `WIN_CSC_LINK` (PFX en base64), `WIN_CSC_KEY_PASSWORD` |
| macOS | Compte **Apple Developer** (99 $/an), certificat « Developer ID Application », mot de passe d'application | `MAC_CSC_LINK`, `MAC_CSC_KEY_PASSWORD`, `APPLE_ID`, `APPLE_APP_SPECIFIC_PASSWORD`, `APPLE_TEAM_ID` |
| Android | Clé de téléversement (keystore) générée par vous : `keytool -genkeypair -v -keystore netwiki.keystore -alias netwiki -keyalg RSA -keysize 4096 -validity 10000` | `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD` |

Sans certificat, les versions bureau fonctionnent mais Windows SmartScreen et macOS Gatekeeper affichent un avertissement à la première ouverture.

### Supprimer l'avertissement « Windows a protégé votre ordinateur » (SmartScreen)

SmartScreen bloque les exécutables **non signés** (« Éditeur inconnu ») et ceux dont la signature n'a pas encore de **réputation**. L'empreinte SHA-256 et la signature Ed25519 de NetWiki protègent les mises à jour, mais Windows ne les connaît pas : seule une signature **Authenticode** compte. Solutions, de la moins chère à la plus complète :

| Solution | Coût | Effet |
| --- | --- | --- |
| **SignPath Foundation** (programme de signature gratuit pour les projets open source, à demander sur signpath.org) | Gratuit, après acceptation du projet | Exécutables signés par la fondation depuis GitHub Actions ; l'avertissement disparaît une fois la réputation acquise |
| **Azure Artifact Signing** (ex-Trusted Signing, Microsoft) | Abonnement mensuel ; vérification d'identité (conditions d'éligibilité selon le pays) | Certificat géré par Microsoft, réputation SmartScreen rapide, intégration GitHub Actions |
| Certificat **OV / EV** d'une autorité (Sectigo, DigiCert, Certum…) | De ~60 €/an (Certum open source) à plusieurs centaines d'euros/an | Signature classique ; EV : réputation immédiate (clé sur jeton matériel ou HSM cloud) |
| **Microsoft Store** (compte développeur individuel gratuit) | Gratuit | Application signée et distribuée par Microsoft : aucun avertissement pour les utilisateurs du Store |

En attendant, l'utilisateur clique sur **Informations complémentaires → Exécuter quand même** ; il peut vérifier le fichier téléchargé avec `Get-FileHash .\NetWiki-Setup-x.y.z.exe` et comparer l'empreinte à celle de `netwiki-update.json` ou de la page de la Release.

### Installateurs aux couleurs de NetWiki

- **Windows** (`build/installer.nsh`) : thème sombre sur toutes les pages, pages « Sécurité et confidentialité » et « Soutenir NetWiki » (don Liberapay), installation pour l'utilisateur courant sans droits administrateur ; pages d'information sautées lors d'une mise à jour (`--updated`).
- **macOS** (DMG) : fond personnalisé (glisser vers Applications, sécurité, premier lancement) et raccourci « Soutenir NetWiki ».
- Visuels régénérés par `npm run installer-art` (`scripts/make-installer-art.js`) : `installerSidebar.bmp`, `uninstallerSidebar.bmp`, `installerHeader.bmp`, `background.png`, `background@2x.png`.

## 4. Google Play Store

1. Créez un compte **Google Play Console** (frais uniques de 25 $) au nom de JK-ASFC.
2. Créez l'application « NetWiki » (identifiant `io.netwiki.app`), remplissez la fiche (descriptions, captures, icône 512 px), la **déclaration de confidentialité** (URL de `PRIVACY.md` sur GitHub), le questionnaire « Sécurité des données » (*aucune donnée collectée ni partagée*) et la classification du contenu.
3. Activez la **signature d'application par Google Play**, puis téléversez `app-release.aab` dans un canal de test interne, puis en production.

## 5. Apple App Store

1. Compte **Apple Developer** (99 $/an) ; enregistrez l'identifiant `io.netwiki.app` et créez l'application dans **App Store Connect**.
2. Signature : un Mac avec Xcode est le plus simple (`cd mobile && npm run ios`, puis *Product → Archive → Distribute App*). Sans Mac, utilisez **Xcode Cloud** ou un runner macOS avec les certificats et profils de provisionnement importés depuis des secrets.
3. Fiche App Store : descriptions, captures (iPhone et iPad), URL de la politique de confidentialité, étiquette de confidentialité « Données non collectées ».

## 6. Tester localement

```bash
npm start                                   # version de bureau
node scripts/build-web.mjs --prod           # version web/mobile dans mobile/www
python -m http.server 8765 --directory mobile/www   # puis http://127.0.0.1:8765
node scripts/pack-content.js                # paquet de contenu signé dans release/
```

## Différences de la version mobile

La version Android/iOS reprend la même interface et tout le contenu, sans accès au système de fichiers : les articles modifiés ou créés sont conservés dans le stockage interne de l'application (IndexedDB). L'export/import de paquets et les pièces jointes images sont réservés à la version de bureau ; les mises à jour passent par les magasins d'applications.
