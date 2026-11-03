---
title: "mod_md"
description: "Module Apache mod_md — Gestion des domaines au sein des serveurs virtuels et obtention de certificats via le protocole ACME. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_md]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Gestion des domaines au sein des serveurs virtuels et obtention de certificats via le protocole ACME |
| **Statut** | Expérimental |
| **Identificateur** | `md_module` |
| **Fichier source** | `mod_md.c` |
| **Compatibilité** | Disponible à partir de la version 2.4.30 du serveur HTTP Apache |

## Sommaire

Ce module permet de gérer les propriétés courantes des domaines pour un ou plusieurs serveurs virtuels. Il fournit deux fonctionnalités principales : la première permet la supervision et le renouvellement des certificats TLS via le protocole ACME ([RFC 8555](https://www.rfc-editor.org/rfc/rfc8555)). Le module effectue le renouvellement des certificats avant leur expiration afin d'éviter une interruption des services internet. Il est possible de monitorer l'état de tous les certificats gérés par mod\_md et de configurer le serveur de façon à ce qu'il envoie des notifications de renouvellement, d'expiration ou d'erreur personnalisées.

La seconde fonctionnalité principale fournit une implémentation alternative de l'agrafage OCSP, et ceci aussi bien pour les certificats gérés par mod\_md que pour les certificats que vous gérez vous-même. Composant nécessaire pour tout site https, l'agrafage OCSP influence la vitesse de chargement des pages et suivant la configuration, la disponibilité de ces dernières. Vous trouverez plus de détails dans la section agrafage ci-dessous.

L'autorité ACME par défaut pour la gestion des certificats est [Let's Encrypt](https://letsencrypt.org/), mais il est possible de configurer une autre CA si cette dernière supporte le protocole.

Exemple de configuration simple :

> [!NOTE]
> **TLS dans un contexte de serveur virtuel**
>
> ```apache
> MDomain example.org
>
> <VirtualHost *:443>
>     ServerName example.org
>     DocumentRoot htdocs/a
>
>     SSLEngine on
>     # aucun certificat spécifié
> </VirtualHost>
> ```
>
> Au démarrage, un serveur ainsi configuré contactera [Let's Encrypt](https://letsencrypt.org/) pour demander un certificat pour le domaine considéré. Si Let's Encrypt peut vérifier le propriétaire du domaine, le module obtiendra le certificat et sa chaîne de certification, le stockera dans son système de fichiers (voir la directive [[13-directives/mdstoredir|MDStoreDir]]) et le proposera au prochain redémarrage à [[12-modules/mod_ssl|mod_ssl]].
>
> Ce processus se déroule pendant l'exécution du serveur. Tous les autres serveurs virtuels continueront à fonctionner normalement, mais tant que le certificat ne sera pas disponible, toute requête pour le domaine considéré génèrera une réponse du type '503 Service Unavailable'.

> [!NOTE]
> **Prérequis**
>
> Pour pouvoir être utilisé, ce module nécessite le chargement préalable du module [[12-modules/mod_watchdog|mod_watchdog]].
>
> Pour que Let's Encrypt puisse signer et renouveler votre certificat, votre serveur doit être accessible depuis l'internet public sur le port 80 (http:) et/ou 443 (https:), à moins que votre serveur soit configuré pour utiliser les vérifications DNS - pour plus de détails, voir "certificats génériques".
>
> Le module choisit une des méthodes proposées par Let's Encrypt. En général, LE propose des méthodes de vérification sur les ports ou le DNS et Apache choisit une des méthodes disponibles.
>
> Pour déterminer quelles méthodes sont disponibles, le module consulte les ports sur lesquels écoute Apache httpd. Si le port 80 en fait partie, le module supposera que la vérification http: nommée http-01 est disponible. Si le port 443 en fait aussi partie, la vérification https: nommée tls-alpn-01 sera ajoutée à la liste des méthodes disponibles. Enfin, si la directive [[13-directives/mdchallengedns01|MDChallengeDns01]] est définie, la méthode de vérification dns-01 sera aussi ajoutée.
>
> Si votre configuration est plus complexe, deux méthodes permettent d'orienter ce choix. En premier lieu, voyez du côté de la directive [[13-directives/mdportmap|MDPortMap]] si le serveur se trouve derrière un redirecteur de port comme un pare-feu. En second lieu, vous pouvez court-circuiter entièrement le processus de choix du module en définissant directement la directive [[13-directives/mdcachallenges|MDCAChallenges]].

> [!NOTE]
> **Vérifications https:**
>
> Pour la vérification de domaine via le protocole TLS, le nom de la méthode correspondante est "tls-alpn-01". Le serveur Apache doit alors être en écoute sur le port 443 (voir la directive [[13-directives/mdportmap|MDPortMap]] si vous redirigez ce port vers un autre).
>
> Let's Encrypt ouvrira alors une connexion TLS avec Apache en utilisant l'indicateur spécial "acme-tls/1" (cette portion indication de TLS se nomme ALPN, d'où le nom de la méthode de vérification. ALPN est aussi utilisé par les navigateurs pour ouvrir une connexion HTTP/2.
>
> Si vous ne souhaitez cependant qu'aucun de vos sites ne soit accessible sur le port 80, vous pouvez laiser ce dernier ouvert et rediriger toutes les requêtes vers vos sites en https:. Pour ce faire, utilisez la directive [[13-directives/mdrequirehttps|MDRequireHttps]] décrite plus loin. Votre serveur pourra alors continuer à répondre au requêtes en http: en provenance de Let's Encrypt. Comme dans le cas du protocole HTTP/2, vous pouvez configurer ceci de la manière suivante :
>
> ```apache
> Protocols h2 http/1.1 acme-tls/1
> ```
>
> La méthode de vérification "tls-alpn-01" sera alors disponible.

> [!NOTE]
> **Certificats génériques**
>
> Les certificats génériques sont supportés à partir de la version 2.x de mod\_md, mais leur obtention n'est pas triviale. Let's Encrypt impose pour ces derniers la vérification "dns-01". Aucune autre n'est considérée comme suffisamment efficace.
>
> Apache ne peut cependant pas implémenter cette vérification de lui-même . Comme son nom l'indique, "dns-01" vous demande de présenter certains enregistrement DNS spécifiques à votre domaine qui doivent contenir certaines données de vérification. Vous devez donc être en mesure d'éditer et modifier les enregistrements DNS de votre domaine.
>
> Si c'est le cas, vous pouvez procéder via mod\_md. Supposons que vous disposiez pour cela du script /usr/bin/acme-setup-dns ; vous configurez alors Apache comme suit :
>
> ```apache
> MDChallengeDns01 /usr/bin/acme-setup-dns
> ```
>
> Apache fera alors appel à ce script lorsqu'il aura besoin de définir ou détruire un enregistrement DNS de vérification pour le domaine considéré.
>
> Supposons ainsi que vous souhaitiez obtenir un certificat pour \*.mydomain.com ; mod\_md va appeler :
>
> ```apache
> /usr/bin/acme-setup-dns setup mydomain.com challenge-data
> # ceci nécessite de supprimer tout enregistrement DNS TXT pour
> # _acme-challenge.mydomain.com et d'en créer un nouveau dont le contenu sera
> # "challenge-data"
> ```
>
> il appellera ensuite :
>
> ```apache
> /usr/bin/acme-setup-dns teardown mydomain.com
> # ceci nécessite de supprimer tout enregistrement DNS TXT pour
> # _acme-challenge.mydomain.com
> ```

> [!NOTE]
> **Monitoring**
>
> Apache possède un module de monitoring standard : [[12-modules/mod_status|mod_status]]. mod\_md y ajoute une section et facilite le monitoring de votre domaine.
>
> Vous pouvez alors visualiser tous vos domaines gérés par ordre alphabétique, les noms de domaine qu'ils contiennent, un état global, les date d'expiration ainsi que des paramètres spécifiques. Ces derniers comprennent la périodicité de renouvellement que vous avez sélectionnée (ou la valeur par défaut), la CA (autorité de certification) utilisée, etc...
>
> La colonne "Renewal" montre des rapports d'activité ou d'erreur à propos des renouvellements de certificats, ce qui devrait faciliter la vie des utilisateurs qui souhaitent savoir si tout fonctionne correctement ou si des problèmes se produisent.
>
> Si un des domaines gérés provoque une erreur, elle apparaîtra aussi ici, ce qui vous permettra de visualiser les éventuels problèmes sans devoir vous plonger dans les journaux du serveur.
>
> Il existe aussi un nouveau gestionnaire, « `md-status` », qui peut vous fournir les informations à propos des domaines gérés à partir de « `server-status` » et au format JSON. Vous pouvez le configurer comme suit sur votre serveur :
>
> ```apache
> <Location "/md-status">
>   SetHandler md-status
>   Require host example.com
> </Location>
> ```
>
> sur votre serveur. Comme pour « `server-status` », vous **devez** protéger la sortie de `md-status` de la vue du public en instaurant des restrictions d’autorisation (telles que [[12-modules/mod_authz_host|mod_authz_host]]).
>
> Si vous ne souhaitez recevoir l'état JSON que pour un domaine spécifique, ajoutez le simplement à votre URL d'état :
>
> ```apache
> > curl https://<yourhost>/md-status/another-domain.org
> {
>   "name": "another-domain.org",
>   "domains": [
>     "another-domain.org",
>     "www.another-domain.org"
>   ],
>   ...
> ```
>
> Cet état JSON montre aussi un journal des renouvellements de certificats :
>
> ```apache
> {
> "when": "Wed, 19 Jun 2019 14:45:58 GMT",
> "type": "progress", "detail": "The certificate for the managed domain has been renewed successfully and can be used. A graceful server restart now is recommended."
> },{
> "when": "Wed, 19 Jun 2019 14:45:58 GMT",
> "type": "progress", "detail": "Retrieving certificate chain for test-901-003-1560955549.org"
> },{
> "when": "Wed, 19 Jun 2019 14:45:58 GMT",
> "type": "progress", "detail": "Waiting for finalized order to become valid"
> },{
> "when": "Wed, 19 Jun 2019 14:45:50 GMT",
> "type": "progress", "detail": "Submitting CSR to CA for test-901-003-1560955549.org"
> },
> ...
> ```
>
> Vous trouverez aussi ces informations dans le fichier "job.json" dans votre répertoire de test et, s'il est activé, dans le répertoire des domaines. Vous pourrez ainsi les consulter à tout moment.
>
> Enfin, la directive [[13-directives/mdcertificatestatus|MDCertificateStatus]] donne accès au informations à propos du certificat spécifié au format JSON.

> [!NOTE]
> **Agrafage**
>
> Si vous voulez commencer par tester l'agrafage pour un seul domaine géré, utilisez cette configuration :
>
> ```apache
> <MDomain mydomain.net>
>   MDStapling on
> </MDomain>
> ```
>
> et utilisez « `server-status` » et/ou [[13-directives/mdmessagecmd|MDMessageCmd]] pour voir comment tout cela fonctionne. Vous pourrez alors vérifier si l'information d'agrafage est présente, sa durée de validité, son origine et à quel moment elle sera rafraîchie.
>
> Si tout fonctionne comme vous le souhaitez, vous pouvez définir cette configuration pour tous les certificats ou seulement vos certificats gérés.
>
> De nombreux sites utilisent l'implémentation d'agrafage existante de mod\_ssl depuis des années. Les implémentations par mod-ssl et mod\_md présentent deux différences principales :
>
> 1. Lecture des informations à la demande ou de manière planifiée : mod\_ssl extrait les informations d'agrafage lorsque le besoin s'en fait sentir, par exemple lors d'une nouvelle connexion. mod\_md quant à lui, extrait ces informations au démarrage du serveur et lorsqu'elles ont atteint les deux tiers de leur durée de vie.
> 2. Conservation des informations en mémoire ou de manière persistante : mod\_ssl *peut* conserver ces informations de manière persistante, mais la plupart des configurations exemples utilisent un cache en mémoire. mod\_md quant à lui, stocke systématiquement les informations dans le système de fichiers.
>
> Si par malchance vous redémarrez votre serveur alors que le service OCSP de votre CA est en panne, les utilisateurs ne pourront plus atteindre vos sites. Sans persistance des informations, votre serveur n'est plus en mesure de fournir au client les données nécessaires, et le navigateur client ne peut pas les obtenir lui-même car le service OCSP ne répond pas.
>
> Avec l'implémentation de mod\_md, l'information d'agrafage est stockée de manière persistante, et elle peut donc être réchargée au démarrage du serveur et être ainsi disponible pour les connexions entrantes. Un jour ou deux avant expiration des informations, mod\_md va les renouveler, ce qui permet de faire face à un temps d'indisponibilité du service OCSP assez long.
>
> Pour conserver une compatibilité ascendante, l'implémentation de mod\_ssl n'a pas pu être modifiée en profondeur. Par exemple, mod\_ssl est incapable d'ajouter une dépendance à mod\_watchdog sans rendre inutilisables de nombreuses configurations existantes qui ne chargent pas ce module.

## Directives

- [[13-directives/mdomain|MDomain]]
- [[13-directives/mdomainset|<MDomainSet>]]
- [[13-directives/mdcertificateagreement|MDCertificateAgreement]]
- [[13-directives/mdcertificateauthority|MDCertificateAuthority]]
- [[13-directives/mdcertificateprotocol|MDCertificateProtocol]]
- [[13-directives/mddrivemode|MDDriveMode]]
- [[13-directives/mdrenewmode|MDRenewMode]]
- [[13-directives/mdhttpproxy|MDHttpProxy]]
- [[13-directives/mdmember|MDMember]]
- [[13-directives/mdmembers|MDMembers]]
- [[13-directives/mdmuststaple|MDMustStaple]]
- [[13-directives/mdnotifycmd|MDNotifyCmd]]
- [[13-directives/mdportmap|MDPortMap]]
- [[13-directives/mdprivatekeys|MDPrivateKeys]]
- [[13-directives/mdrenewwindow|MDRenewWindow]]
- [[13-directives/mdrequirehttps|MDRequireHttps]]
- [[13-directives/mdstoredir|MDStoreDir]]
- [[13-directives/mdcachallenges|MDCAChallenges]]
- [[13-directives/mdbaseserver|MDBaseServer]]
- [[13-directives/mdcertificatefile|MDCertificateFile]]
- [[13-directives/mdcertificatekeyfile|MDCertificateKeyFile]]
- [[13-directives/mdcertificatestatus|MDCertificateStatus]]
- [[13-directives/mdchallengedns01|MDChallengeDns01]]
- [[13-directives/mdmessagecmd|MDMessageCmd]]
- [[13-directives/mdwarnwindow|MDWarnWindow]]
- [[13-directives/mdserverstatus|MDServerStatus]]
- [[13-directives/mdcertificatemonitor|MDCertificateMonitor]]
- [[13-directives/mdstapling|MDStapling]]
- [[13-directives/mdstapleothers|MDStapleOthers]]
- [[13-directives/mdstaplingkeepresponse|MDStaplingKeepResponse]]
- [[13-directives/mdstaplingrenewwindow|MDStaplingRenewWindow]]
- [[13-directives/mdcertificatecheck|MDCertificateCheck]]
- [[13-directives/mdactivationdelay|MDActivationDelay]]
- [[13-directives/mdcontactemail|MDContactEmail]]
- [[13-directives/mdexternalaccountbinding|MDExternalAccountBinding]]
- [[13-directives/mdretrydelay|MDRetryDelay]]
- [[13-directives/mdretryfailover|MDRetryFailover]]
- [[13-directives/mdstorelocks|MDStoreLocks]]
- [[13-directives/mdchallengedns01version|MDChallengeDns01Version]]
- [[13-directives/mdmatchnames|MDMatchNames]]
- [[13-directives/mdcheckinterval|MDCheckInterval]]
- [[13-directives/mdprofile|MDProfile]]
- [[13-directives/mdprofilemandatory|MDProfileMandatory]]
- [[13-directives/mdrenewviaari|MDRenewViaARI]]
- [[13-directives/mdinitialdelay|MDInitialDelay]]
- [[13-directives/mdcacertificatefile|MDCACertificateFile]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
