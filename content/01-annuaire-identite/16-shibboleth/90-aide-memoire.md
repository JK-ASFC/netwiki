---
title: Shibboleth — aide-mémoire des commandes
description: Référence complète des commandes Shibboleth avec exemples — IdP 5 (Java 17, Jetty 12, installation, état, rechargement des services de métadonnées, d'attributs, de filtres, de parties de confiance et de journalisation, test de résolution d'attributs aacli, modules et greffons dont OpenID Connect, clé de scellement, reconstruction du WAR, métadonnées, journaux), SP 3 (paquets Apache, vérification de configuration, clés et certificat, métadonnées, mdquery, gestionnaires /Shibboleth.sso, protection Apache par attribut, journaux), vérification de la signature des métadonnées de fédération (Renater, eduGAIN) avec xmlsec1.
tags: [aide-mémoire, shibboleth, saml, idp, sp, fédération, renater, apache]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Shibboleth]]. Exemples : IdP `https://idp.univ-exemple.fr/idp/shibboleth` installé dans `/opt/shibboleth-idp`, SP `https://appli.univ-exemple.fr/shibboleth`.

## IdP : installation et service

```bash
sudo apt install openjdk-17-jre-headless                          # Debian / Ubuntu (RHEL : java-17-openjdk-headless)
tar xzf shibboleth-identity-provider-5.1.3.tar.gz && cd shibboleth-identity-provider-5.1.3
sudo ./bin/install.sh                                              # questions : répertoire, nom d'hôte, scope, entityID
sudo systemctl status jetty12
sudo systemctl restart jetty12
/opt/shibboleth-idp/bin/version.sh
/opt/shibboleth-idp/bin/status.sh                                  # état, versions, métadonnées chargées
```

## IdP : rechargement sans redémarrage

```bash
cd /opt/shibboleth-idp
./bin/reload-service.sh -id shibboleth.MetadataResolverService
./bin/reload-service.sh -id shibboleth.AttributeResolverService
./bin/reload-service.sh -id shibboleth.AttributeFilterService
./bin/reload-service.sh -id shibboleth.RelyingPartyResolverService
./bin/reload-service.sh -id shibboleth.LoggingService
```

## IdP : tests d'attributs

```bash
# Attributs que recevrait le SP pour l'utilisateur alice (résolution + filtre)
/opt/shibboleth-idp/bin/aacli.sh -n alice -r https://appli.univ-exemple.fr/shibboleth --saml2
/opt/shibboleth-idp/bin/aacli.sh -n alice -r https://appli.univ-exemple.fr/shibboleth
```

## IdP : modules, greffons, clés

```bash
cd /opt/shibboleth-idp
./bin/module.sh -l                                                 # modules disponibles et activés
./bin/module.sh -e idp.authn.Password
./bin/plugin.sh -l                                                 # greffons installés
./bin/plugin.sh -L                                                 # greffons disponibles
./bin/plugin.sh -I net.shibboleth.idp.plugin.oidc.op               # fournisseur OpenID Connect
./bin/build.sh                                                     # reconstruire le WAR, puis redémarrer Jetty
# Nouvelle version de la clé de scellement (cookies et jetons chiffrés)
./bin/seckeygen.sh --storefile credentials/sealer.jks --storepass "$(grep idp.sealer.storePassword credentials/secrets.properties | cut -d= -f2 | tr -d ' ')" --versionfile credentials/sealer.kver --alias secret
```

## IdP : métadonnées et journaux

```bash
curl -s https://idp.univ-exemple.fr/idp/shibboleth -o idp-metadata.xml
sudo tail -f /opt/shibboleth-idp/logs/idp-process.log
sudo tail -f /opt/shibboleth-idp/logs/idp-audit.log                # une ligne par assertion émise
sudo tail -f /opt/shibboleth-idp/logs/idp-warn.log
grep -c "alice" /opt/shibboleth-idp/logs/idp-audit.log
```

Le niveau de détail se règle dans `conf/logback.xml` (propriétés `idp.loglevel.*`, par exemple `idp.loglevel.idp=DEBUG` le temps d'un diagnostic), puis rechargement de `shibboleth.LoggingService`.

## SP : installation et service

```bash
sudo apt install libapache2-mod-shib                               # Debian / Ubuntu (module + démon shibd)
sudo a2enmod shib && sudo systemctl restart apache2
# RHEL : dépôt officiel Shibboleth (générateur sur shibboleth.net), puis « dnf install shibboleth »
sudo shibd -t                                                      # vérifier shibboleth2.xml et les fichiers liés
sudo systemctl restart shibd
sudo systemctl status shibd
# Clé et certificat du SP (signature, chiffrement)
sudo shib-keygen -f -u _shibd -h appli.univ-exemple.fr -e https://appli.univ-exemple.fr/shibboleth -y 10
```

## SP : métadonnées et gestionnaires

```bash
curl -s https://appli.univ-exemple.fr/Shibboleth.sso/Metadata -o sp-metadata.xml
curl -s https://localhost/Shibboleth.sso/Status -k                 # accès limité à localhost par défaut
mdquery -e https://idp.univ-exemple.fr/idp/shibboleth -saml2 -idp   # métadonnées de l'IdP connues du SP
# Dans le navigateur
#   https://appli.univ-exemple.fr/Shibboleth.sso/Login?target=https://appli.univ-exemple.fr/secure/
#   https://appli.univ-exemple.fr/Shibboleth.sso/Session             # attributs reçus
#   https://appli.univ-exemple.fr/Shibboleth.sso/Logout
sudo tail -f /var/log/shibboleth/shibd.log /var/log/shibboleth/transaction.log
```

## SP : protection Apache

```apache /etc/apache2/conf-available/shib-appli.conf
<Location /secure>
    AuthType shibboleth
    ShibRequestSetting requireSession 1
    Require valid-user
</Location>
<Location /secure/personnels>
    AuthType shibboleth
    ShibRequestSetting requireSession 1
    Require shib-attr affiliation staff@univ-exemple.fr
</Location>
```

```bash
sudo a2enconf shib-appli && sudo apache2ctl configtest && sudo systemctl reload apache2
```

## Métadonnées de fédération

```bash
# Vérifier la signature d'un lot de métadonnées avec le certificat publié par la fédération
xmlsec1 --verify --pubkey-cert-pem renater-metadata-signing-cert-2016.pem --id-attr:ID urn:oasis:names:tc:SAML:2.0:metadata:EntitiesDescriptor metadata.xml
xmllint --noout --xpath "count(//*[local-name()='EntityDescriptor'])" metadata.xml          # nombre d'entités
xmllint --noout --xpath "string(//*[local-name()='EntitiesDescriptor']/@validUntil)" metadata.xml   # date de validité
```
