---
title: Shibboleth — aide-mémoire des commandes
description: Commandes Shibboleth avec exemples — IdP (status.sh, reload-service.sh, aacli.sh, build.sh, journaux, Jetty), SP (shibd -t, shib-keygen, metagen, handlers Shibboleth.sso Session/Metadata/Status, journaux), test d'une session et vérification des métadonnées.
tags: [aide-mémoire, shibboleth, saml, idp, sp]
icon: terminal
---

Référence rapide ; explications dans [[01-presentation-installation|Shibboleth]].

## IdP

```bash
/opt/shibboleth-idp/bin/status.sh
/opt/shibboleth-idp/bin/reload-service.sh -id shibboleth.AttributeResolverService
/opt/shibboleth-idp/bin/reload-service.sh -id shibboleth.MetadataResolverService
/opt/shibboleth-idp/bin/aacli.sh -n alice -r https://appli.univ-exemple.fr/shibboleth --saml2
/opt/shibboleth-idp/bin/build.sh               # reconstruire le WAR après ajout d'un module
/opt/shibboleth-idp/bin/module.sh -l           # modules installés
tail -f /opt/shibboleth-idp/logs/idp-process.log /opt/shibboleth-idp/logs/idp-audit.log
systemctl status jetty12
```

## SP

```bash
sudo shibd -t                                  # vérifier la configuration
sudo systemctl restart shibd
sudo shib-keygen -f -h appli.univ-exemple.fr -e https://appli.univ-exemple.fr/shibboleth
curl -k https://appli.univ-exemple.fr/Shibboleth.sso/Status
curl -k https://appli.univ-exemple.fr/Shibboleth.sso/Metadata > sp-metadata.xml
# Dans un navigateur après connexion : https://appli.univ-exemple.fr/Shibboleth.sso/Session
tail -f /var/log/shibboleth/shibd.log /var/log/shibboleth/transaction.log
xmlsec1 --verify --pubkey-cert-pem renater-metadata-signing-cert-2016.pem metadata.xml   # signature des métadonnées
```
