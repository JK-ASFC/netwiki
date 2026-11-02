---
title: Présentation, installation et configuration
description: Shibboleth — fédération d'identité SAML 2.0 du monde de l'enseignement et de la recherche (fédération RENATER, eduGAIN), Identity Provider (IdP 5, Java/Jetty) et Service Provider (SP 3, module Apache mod_shib et IIS), installation de l'IdP (installateur, Jetty), connexion à l'annuaire LDAP/AD, attributs (eduPerson, SupAnn), filtres de libération, métadonnées, installation du SP (Debian/Ubuntu, RHEL, Windows IIS), protection d'une application, tests et dépannage.
tags: [shibboleth, saml, fédération, renater, eduGAIN, idp, sp, supann]
icon: info
---

**Shibboleth** (consortium Shibboleth, Apache 2.0) est l'implémentation SAML 2.0 de référence de l'**enseignement supérieur et de la recherche** : la fédération **RENATER** (France) et l'inter-fédération **eduGAIN** relient les établissements (IdP) et les services (SP) partagés.

| Composant | Rôle | Technologie |
| --- | --- | --- |
| **Identity Provider (IdP)** | Authentifie les utilisateurs de l'établissement et libère leurs attributs | Java 17 + Jetty (IdP 5) |
| **Service Provider (SP)** | Protège une application web, consomme les assertions SAML | Démon `shibd` + module Apache `mod_shib` ou IIS |
| Métadonnées | Liste signée des IdP et SP de la fédération (certificats, URL) | XML |
| Service de découverte (WAYF) | Choix de l'établissement d'origine | — |

## IdP (serveur d'établissement)

Prérequis : Java 17 (Temurin/OpenJDK), [[09-openjdk/01-installation-exploitation|OpenJDK]], Jetty 12 (conteneur recommandé), nom `idp.univ-exemple.fr`, certificat TLS, annuaire LDAP ou AD.

```bash
wget https://shibboleth.net/downloads/identity-provider/latest5/shibboleth-identity-provider-5.1.4.tar.gz
tar xzf shibboleth-identity-provider-5.*.tar.gz && cd shibboleth-identity-provider-5.*/
sudo ./bin/install.sh        # répertoire /opt/shibboleth-idp, nom d'hôte, entityID https://idp.univ-exemple.fr/idp/shibboleth, scope univ-exemple.fr
```

Fichiers clés (`/opt/shibboleth-idp/conf/`) :

| Fichier | Rôle |
| --- | --- |
| `ldap.properties` | Connexion à l'annuaire (URL `ldaps://`, base, compte de liaison, filtre `(uid={user})` ou `(sAMAccountName={user})`) |
| `attribute-resolver.xml` | Construction des attributs (eduPersonPrincipalName, mail, displayName, supannEtablissement…) |
| `attribute-filter.xml` | Quels attributs libérer à quel SP (minimisation des données, RGPD) |
| `metadata-providers.xml` | Métadonnées de la fédération (URL RENATER, vérification de signature) |
| `idp.properties` | Paramètres généraux (sessions, journaux, consentement) |

```bash
/opt/shibboleth-idp/bin/status.sh                 # état de l'IdP
/opt/shibboleth-idp/bin/reload-service.sh -id shibboleth.AttributeFilterService   # recharger un service
/opt/shibboleth-idp/bin/aacli.sh -n alice -r https://sp.exemple.fr/shibboleth --saml2   # attributs libérés à un SP
```

Journaux : `/opt/shibboleth-idp/logs/idp-process.log`, `idp-audit.log`.

## SP (application à protéger)

```bash
# Debian / Ubuntu
sudo apt install libapache2-mod-shib && sudo a2enmod shib
# RHEL / Rocky / Alma : dépôt Shibboleth (shibboleth.net/downloads/service-provider/RPMS), puis :
# sudo dnf install shibboleth
sudo shib-keygen -h appli.univ-exemple.fr -e https://appli.univ-exemple.fr/shibboleth   # paire de clés du SP
```

```xml /etc/shibboleth/shibboleth2.xml (extrait)
<ApplicationDefaults entityID="https://appli.univ-exemple.fr/shibboleth" REMOTE_USER="eppn subject-id">
  <Sessions lifetime="28800" timeout="3600" checkAddress="false" handlerSSL="true" cookieProps="https">
    <SSO discoveryProtocol="SAMLDS" discoveryURL="https://discovery.renater.fr/renater/WAYF">SAML2</SSO>
    <Logout>SAML2 Local</Logout>
  </Sessions>
  <MetadataProvider type="XML" url="https://metadata.federation.renater.fr/renater/main/main-idps-renater-metadata.xml"
                    backingFilePath="renater-idps.xml" maxRefreshDelay="3600">
    <MetadataFilter type="Signature" certificate="renater-metadata-signing-cert-2016.pem"/>
  </MetadataProvider>
</ApplicationDefaults>
```

```apache /etc/apache2/sites-available/appli.conf (extrait)
<Location /appli>
  AuthType shibboleth
  ShibRequestSetting requireSession 1
  Require shib-attr affiliation member@univ-exemple.fr
</Location>
```

```bash
sudo shibd -t && sudo systemctl restart shibd apache2
curl -k https://appli.univ-exemple.fr/Shibboleth.sso/Metadata     # métadonnées à déclarer dans la fédération
```

Windows : installateur MSI du SP pour **IIS** (module natif), même fichier `shibboleth2.xml`.

## Tests et dépannage

| Outil / symptôme | Action |
| --- | --- |
| `https://appli…/Shibboleth.sso/Session` | Affiche la session et les attributs reçus |
| « Unable to locate metadata for identity provider » | Métadonnées non chargées ou IdP absent de la fédération |
| Attribut manquant côté SP | Filtre de libération de l'IdP, `attribute-map.xml` du SP |
| Horloges | Assertions refusées si l'heure diffère de plus de quelques minutes : NTP obligatoire |

Journaux du SP : `/var/log/shibboleth/shibd.log`, `transaction.log`. Commandes : [[90-aide-memoire|aide-mémoire]].
