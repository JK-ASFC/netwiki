---
title: Thunderbird
description: Thunderbird en entreprise (MPL) — installation, configuration automatique des comptes (autoconfig, ISPDB, SRV), IMAP, SMTP, OAuth2, agendas et contacts CalDAV/CardDAV intégrés, Exchange, chiffrement OpenPGP et S/MIME, déploiement et verrouillage par stratégies (policies.json, modèles ADMX), profils et sauvegarde, filtres, Thunderbird pour Android et dépannage.
tags: [thunderbird, client mail, imap, caldav, carddav, autoconfig, policies.json, openpgp, s/mime]
icon: mail
---

**Thunderbird** (fondation MZLA, filiale de Mozilla) est le client de messagerie libre le plus répandu : courrier IMAP/POP, **agendas** et **contacts** (CalDAV, CardDAV) intégrés, chiffrement **OpenPGP** et **S/MIME**, et une version **Android** (issue de K-9 Mail).

```powershell
winget install Mozilla.Thunderbird.fr
```

```bash
sudo apt install thunderbird thunderbird-l10n-fr ; flatpak install flathub org.mozilla.Thunderbird
brew install --cask thunderbird
```

## Configuration automatique des comptes

Quand l'utilisateur saisit son adresse, Thunderbird cherche les paramètres dans cet ordre :

1. `https://autoconfig.exemple.fr/mail/config-v1.1.xml` (fichier publié par l'organisation) ;
2. `https://exemple.fr/.well-known/autoconfig/mail/config-v1.1.xml` ;
3. la base **ISPDB** de Thunderbird (grands fournisseurs) ;
4. les enregistrements **MX** et **SRV** (`_imaps._tcp`, `_submission._tcp`) ;
5. des noms d'hôtes devinés (`imap.`, `smtp.`).

```xml config-v1.1.xml
<clientConfig version="1.1">
  <emailProvider id="exemple.fr">
    <domain>exemple.fr</domain>
    <displayName>Messagerie Exemple</displayName>
    <incomingServer type="imap">
      <hostname>mail.exemple.fr</hostname>
      <port>993</port>
      <socketType>SSL</socketType>
      <authentication>password-cleartext</authentication>
      <username>%EMAILADDRESS%</username>
    </incomingServer>
    <outgoingServer type="smtp">
      <hostname>mail.exemple.fr</hostname>
      <port>465</port>
      <socketType>SSL</socketType>
      <authentication>password-cleartext</authentication>
      <username>%EMAILADDRESS%</username>
    </outgoingServer>
  </emailProvider>
</clientConfig>
```

(`password-cleartext` désigne un mot de passe transmis **dans** la connexion TLS.)

## Agendas, contacts et Exchange

- **CalDAV / CardDAV** : *Nouvel agenda → Sur le réseau* ou *Nouveau carnet d'adresses CardDAV*, avec l'adresse du serveur (Nextcloud, SOGo, Radicale, Baïkal) : la découverte automatique trouve les agendas.
- **Exchange / Microsoft 365** : IMAP avec **OAuth2** ; les versions récentes ajoutent la prise en charge native d'Exchange (EWS) pour le courrier ; sinon, modules complémentaires (Owl, TbSync avec EAS).

## Chiffrement

- **OpenPGP** intégré (*Paramètres des comptes → Chiffrement de bout en bout*) : générer ou importer une clé, publier la clé publique.
- **S/MIME** : importer le certificat personnel (PKCS#12) et faire confiance à l'AC de l'organisation.

## Déploiement en entreprise : stratégies

Les **stratégies** (*policies*) imposent des réglages et masquent des options, sur le même principe que Firefox.

```json policies.json
{
  "policies": {
    "DisableAppUpdate": true,
    "DisableTelemetry": true,
    "OfflineStorage": "Enabled",
    "Certificates": { "Install": ["/etc/ssl/certs/ac-interne.pem"] },
    "Preferences": {
      "mail.server.default.check_new_mail": { "Value": true, "Status": "locked" },
      "mailnews.start_page.enabled": { "Value": false, "Status": "locked" }
    },
    "Extensions": { "Install": ["https://addons.thunderbird.net/thunderbird/downloads/latest/tbsync/latest.xpi"] }
  }
}
```

| Système | Emplacement |
| --- | --- |
| Linux | `/etc/thunderbird/policies/policies.json` (ou `distribution/` dans le dossier d'installation) |
| Windows | Modèles **ADMX** (GPO / Intune) ou `distribution\policies.json` dans le dossier d'installation |
| macOS | Profil de configuration (MDM) ou `Thunderbird.app/Contents/Resources/distribution/` |

`about:policies` dans Thunderbird affiche les stratégies appliquées et les erreurs.

## Profils et sauvegarde

```text
Linux   : ~/.thunderbird/<profil>/        Windows : %APPDATA%\Thunderbird\Profiles\<profil>\
macOS   : ~/Library/Thunderbird/Profiles/<profil>/
```

Fermer Thunderbird et copier le dossier du profil (comptes, filtres, carnet local, clés OpenPGP). `thunderbird -P` ouvre le gestionnaire de profils. Avec IMAP, les messages sont sur le serveur : la sauvegarde du profil protège surtout les réglages et les **dossiers locaux**.

## Dépannage

| Symptôme | Piste |
| --- | --- |
| Certificat refusé | Chaîne incomplète côté serveur, ou AC interne non importée |
| Mot de passe redemandé sans cesse | Authentification erronée (normal/OAuth2), mot de passe enregistré obsolète (*Paramètres → Vie privée → Mots de passe enregistrés*) |
| Lenteur, index corrompu | Réparer le dossier (*Propriétés → Réparer le dossier*), compacter |
| Journaux détaillés | `about:config` → `mailnews.imap.loglevel`, ou variable `MOZ_LOG=IMAP:5` |

Voir aussi : [[02-evolution-kmail-claws|Evolution, KMail, Claws Mail]] · [[03-davx5-sogo-connector|DAVx5 et SOGo Connector]]. Commandes : [[90-aide-memoire|aide-mémoire]].
