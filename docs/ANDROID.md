# NetWiki pour Android

Copyright (c) 2026 JK-ASFC — licence MIT.

## Ce que fait l'application

| Fonction | Fonctionnement |
| --- | --- |
| **Mise à jour de l'application** | Au démarrage (si l'utilisateur l'a accepté) ou depuis Paramètres → Mises à jour. NetWiki télécharge `NetWiki-<version>.apk` depuis la dernière Release, vérifie son empreinte SHA-256 dans `netwiki-update.json` (signé Ed25519 par JK-ASFC) et contrôle que l'APK porte la même signature que l'application installée. Android affiche ensuite « Mettre à jour » : vos articles et réglages sont conservés. |
| **Notifications** | Facultatives (premier lancement ou Paramètres). Une tâche de fond (WorkManager, deux fois par jour, uniquement avec une connexion) prévient d'une nouvelle version ou de nouveaux articles. Toucher la notification ouvre la fenêtre de mise à jour. |
| **Mise à jour du wiki** | Même paquet `.netwiki` hebdomadaire et signé que la version de bureau (branche `contenu`). Le récapitulatif des ajouts est affiché avant l'installation ; les articles modifiés sur l'appareil sont conservés. Import d'un fichier `.netwiki` possible hors connexion. |
| **PDF et partage** | Bouton *Partager* de chaque article : enregistrement en PDF (dossier Téléchargements/NetWiki), partage du PDF ou du texte Markdown, impression. |
| **Bouton Retour** | Ferme la fenêtre ou le panneau ouvert, revient à l'article précédent, puis à l'accueil, puis met NetWiki en arrière-plan. |

Deux variantes sont compilées (`mobile/android/app/build.gradle`) :

- **github** : APK publié sur les Releases, avec mise à jour intégrée (autorisation « Installer des applications inconnues » demandée une seule fois) ;
- **play** : bundle AAB pour Google Play, sans mise à jour intégrée (le magasin s'en charge).

Le numéro de version vient de `package.json` : `1.46.0` donne `versionName 1.46.0` et `versionCode 14600`.

## Clé de signature (obligatoire pour publier l'APK)

Android n'installe une mise à jour **que si elle est signée avec la même clé** que l'application installée.
La clé est conservée uniquement dans les secrets du dépôt (Settings → Secrets and variables → Actions) :

| Secret | Valeur |
| --- | --- |
| `ANDROID_KEYSTORE_BASE64` | le fichier `.jks` encodé en base64 (une seule ligne) |
| `ANDROID_KEYSTORE_PASSWORD` | mot de passe du fichier |
| `ANDROID_KEY_ALIAS` | alias de la clé (`netwiki`) |
| `ANDROID_KEY_PASSWORD` | mot de passe de la clé (identique au précédent pour un fichier PKCS12) |

Créer une clé soi-même (`keytool` est fourni avec Android Studio, dossier `jbr/bin`) :

```bash
keytool -genkeypair -keystore netwiki-release.jks -storetype PKCS12 -alias netwiki \
  -keyalg RSA -keysize 4096 -validity 10000 -dname "CN=NetWiki, O=JK-ASFC"
base64 -w0 netwiki-release.jks > keystore.base64.txt        # Linux
# Windows (PowerShell) : [Convert]::ToBase64String([IO.File]::ReadAllBytes("netwiki-release.jks")) > keystore.base64.txt
```

**Gardez une copie de sauvegarde du fichier `.jks` et du mot de passe hors de GitHub** : sans eux, aucune mise à jour
ne pourra plus s'installer sur les appareils existants. Ne versionnez jamais ce fichier (`*.jks` est ignoré par Git).

Sans ces secrets, une étiquette `v*` publie la version de bureau mais **pas** l'application Android (erreur explicite
dans le job Android) ; un lancement manuel produit un APK de test signé avec une clé temporaire.

### Passage depuis la version 1.45.0 ou antérieure

Les anciennes versions Android étaient des APK de test (`app-debug.apk`) signés avec une clé jetable : Android refuse de
les remplacer. **Désinstallez NetWiki une seule fois**, puis installez `NetWiki-1.46.0.apk` : toutes les versions suivantes
se mettront à jour depuis l'application. (Les articles créés ou modifiés sur l'appareil sont perdus lors de la désinstallation.)

## Développement

```bash
npm ci && node scripts/build-web.mjs           # interface web dans mobile/www
cd mobile && npm install && npx cap sync android
npx cap open android                            # Android Studio : variante « githubDebug »
python3 scripts/make-android-icons.py           # régénère icônes et écrans de démarrage depuis build/icon.png
```

Test automatique : le workflow **Test Android** (`.github/workflows/android-test.yml`) compile une version numérotée 1.0.0,
la lance sur un émulateur Android 14 et rejoue `mobile/test/e2e.js` (mises à jour, notification, PDF, partage, Retour…).
Les captures d'écran et le rapport sont publiés dans l'artefact `test-android` et sur la branche `tests-android`.
