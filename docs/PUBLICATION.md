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
| Windows | `NetWiki Setup x.y.z.exe` (installeur), `NetWiki x.y.z.exe` (portable) |
| macOS | `.dmg`, `.zip` (Intel et Apple Silicon selon le runner) |
| Linux | `.AppImage`, `.deb` |
| Contenu | `netwiki-content-x.y.z.netwiki` signé — utilisé par la mise à jour en ligne et pour les postes hors ligne |
| Android | `app-debug.apk` (test), `app-release.aab` (Play Store, signé si la clé est configurée) |
| iOS | `NetWiki-simulateur.zip` (test sur simulateur ; la version App Store nécessite la signature Apple) |

## 3. Signature de code (supprime les avertissements)

| Plateforme | Ce qu'il faut | Secrets GitHub |
| --- | --- | --- |
| Windows | Certificat de signature de code (OV/EV, ou Azure Trusted Signing) | `WIN_CSC_LINK` (PFX en base64), `WIN_CSC_KEY_PASSWORD` |
| macOS | Compte **Apple Developer** (99 $/an), certificat « Developer ID Application », mot de passe d'application | `MAC_CSC_LINK`, `MAC_CSC_KEY_PASSWORD`, `APPLE_ID`, `APPLE_APP_SPECIFIC_PASSWORD`, `APPLE_TEAM_ID` |
| Android | Clé de téléversement (keystore) générée par vous : `keytool -genkeypair -v -keystore netwiki.keystore -alias netwiki -keyalg RSA -keysize 4096 -validity 10000` | `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD` |

Sans certificat, les versions bureau fonctionnent mais Windows SmartScreen et macOS Gatekeeper affichent un avertissement à la première ouverture.

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
