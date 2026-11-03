---
title: "Chiffrement fort SSL/TLS : Compatibilité"
description: "Apache HTTP Server — Chiffrement fort SSL/TLS : Compatibilité. WARNING Document historique Ce document décrit la compatibilité avec des produits SSL qui ont été abandonnés depuis de nombreuses années (Apache-SSL, Stronghold, Raven SSL, Red Hat Secure Web Server). Il n'est conservé qu'à titre de référen"
tags: [apache, guide]
icon: book-open
---

> [!WARNING]
> **Document historique**
>
> Ce document décrit la compatibilité avec des produits SSL qui ont été abandonnés depuis de nombreuses années (Apache-SSL, Stronghold, Raven SSL, Red Hat Secure Web Server). Il n'est conservé qu'à titre de référence historique. Si vous configurez mod\_ssl sur une installation actuelle de httpd, consultez le [[11-guides/04-chiffrement-ssl-tls/chiffrement-fort-ssl-tls-mode-d-emploi|didacticiel SSL/TLS]]. Cette page sera probablement supprimée dans une future version.

Cette page couvre la compatibilité ascendante entre mod\_ssl et d'autres solutions SSL. mod\_ssl n'est pas la seule solution SSL pour Apache ; quatre autres produits sont (ou ont été) également disponibles : [Apache-SSL](http://www.apache-ssl.org/), le produit libre de Ben Laurie (d'où mod\_ssl est issu à l'origine en 1998), Secure Web Server, un produit commercial de Red Hat (basé sur mod\_ssl), Raven SSL Module, un produit commercial de Covalent (basé lui aussi sur mod\_ssl), et enfin Stronghold, produit commercial de C2Net et maintenant de Red Hat, (basé sur une branche d'évolution différente appelée Sioux jusqu'à Stronghold 2.x et basé sur mod\_ssl depuis Stronghold 3.x).

En plus de ses fonctionnalités propres, mod\_ssl rassemble la plupart de celles des autres solutions SSL, si bien qu'il est très simple de migrer depuis un module plus ancien vers mod\_ssl. Les directives de configuration et les noms des variables d'environnement utilisés par les solutions SSL plus anciennes diffèrent de ceux qu'utilise mod\_ssl ; les tableaux de correspondance ci-dessous fournissent les équivalences de termes utilisés par mod\_ssl.

## Directives de configuration

La correspondance entre les directives de configuration qu'utilise Apache-SSL 1.x et mod\_ssl 2.0.x est fournie dans le Tableau 1. La correspondance depuis Sioux 1.x et Stronghold 2.x n'est que partielle car certaines fonctionnalités de ces interfaces ne sont pas supportées par mod\_ssl.

### Tableau 1: Correspondance entre les directives de configuration

| Ancienne directive | Directive mod\_ssl | Commentaires |
| --- | --- | --- |
| Compatibilité entre Apache-SSL 1.x et mod\_ssl 2.0.x : |   |   |
| `SSLEnable` | `SSLEngine on` | plus compacte |
| `SSLDisable` | `SSLEngine off` | plus compacte |
| `SSLLogFile` *file* |   | Utilisez plutôt la directive de niveau module [[13-directives/loglevel\|LogLevel]]. |
| `SSLRequiredCiphers` *spec* | `SSLCipherSuite` *spec* | renommée |
| `SSLRequireCipher` *c1* ... | `SSLRequire %{SSL_CIPHER} in {"`*c1*`", ...}` | plus générale |
| `SSLBanCipher` *c1* ... | `SSLRequire not (%{SSL_CIPHER} in {"`*c1*`", ...})` | plus générale |
| `SSLFakeBasicAuth` | `SSLOptions +FakeBasicAuth` | rassemblées |
| `SSLCacheServerPath` *dir* | - | fonctionnalité supprimée |
| `SSLCacheServerPort` *integer* | - | fonctionnalité supprimée |
| Compatibilité avec Apache-SSL 1.x : |   |   |
| `SSLExportClientCertificates` | `SSLOptions +ExportCertData` | rassemblées |
| `SSLCacheServerRunDir` *dir* | - | fonctionnalité non supportée |
| Compatibilité avec Sioux 1.x : |   |   |
| `SSL_CertFile` *file* | `SSLCertificateFile` *file* | renommée |
| `SSL_KeyFile` *file* | `SSLCertificateKeyFile` *file* | renommée |
| `SSL_CipherSuite` *arg* | `SSLCipherSuite` *arg* | renommée |
| `SSL_X509VerifyDir` *arg* | `SSLCACertificatePath` *arg* | renommée |
| `SSL_Log` *file* | `-` | Utilisez plutôt la directive de niveau module [[13-directives/loglevel\|LogLevel]] |
| `SSL_Connect` *flag* | `SSLEngine` *flag* | renommée |
| `SSL_ClientAuth` *arg* | `SSLVerifyClient` *arg* | renommée |
| `SSL_X509VerifyDepth` *arg* | `SSLVerifyDepth` *arg* | renommée |
| `SSL_FetchKeyPhraseFrom` *arg* | - | pas de véritable équivalent ; utiliser SSLPassPhraseDialog |
| `SSL_SessionDir` *dir* | - | pas de véritable équivalent ; utiliser SSLSessionCache |
| `SSL_Require` *expr* | - | pas de véritable équivalent ; utiliser SSLRequire |
| `SSL_CertFileType` *arg* | - | fonctionnalité non supportée |
| `SSL_KeyFileType` *arg* | - | fonctionnalité non supportée |
| `SSL_X509VerifyPolicy` *arg* | - | fonctionnalité non supportée |
| `SSL_LogX509Attributes` *arg* | - | fonctionnalité non supportée |
| Compatibilité avec Stronghold 2.x : |   |   |
| `StrongholdAccelerator` *engine* | `SSLCryptoDevice` *engine* | renommée |
| `StrongholdKey` *dir* | - | sans objet |
| `StrongholdLicenseFile` *dir* | - | sans objet |
| `SSLFlag` *flag* | `SSLEngine` *flag* | renommée |
| `SSLSessionLockFile` *file* | `SSLMutex` *file* | renommée |
| `SSLCipherList` *spec* | `SSLCipherSuite` *spec* | renommée |
| `RequireSSL` | `SSLRequireSSL` | renommée |
| `SSLErrorFile` *file* | - | fonctionnalité non supportée |
| `SSLRoot` *dir* | - | fonctionnalité non supportée |
| `SSL_CertificateLogDir` *dir* | - | fonctionnalité non supportée |
| `AuthCertDir` *dir* | - | fonctionnalité non supportée |
| `SSL_Group` *name* | - | fonctionnalité non supportée |
| `SSLProxyMachineCertPath` *dir* | `SSLProxyMachineCertificatePath` *dir* | renommée |
| `SSLProxyMachineCertFile` *file* | `SSLProxyMachineCertificateFile` *file* | renommée |
| `SSLProxyCipherList` *spec* | `SSLProxyCipherSpec` *spec* | renommée |

## Variables d'environnement

La correspondance entre les noms des variables d'environnement utilisés par les solutions SSL plus anciennes et les noms utilisés par mod\_ssl est fournie dans le Tableau 2.

### Tableau 2: Dérivation des variables d'environnement

| Ancienne variable | Variable mod\_ssl | Commentaires |
| --- | --- | --- |
| `SSL_PROTOCOL_VERSION` | `SSL_PROTOCOL` | renommée |
| `SSLEAY_VERSION` | `SSL_VERSION_LIBRARY` | renommée |
| `HTTPS_SECRETKEYSIZE` | `SSL_CIPHER_USEKEYSIZE` | renommée |
| `HTTPS_KEYSIZE` | `SSL_CIPHER_ALGKEYSIZE` | renommée |
| `HTTPS_CIPHER` | `SSL_CIPHER` | renommée |
| `HTTPS_EXPORT` | `SSL_CIPHER_EXPORT` | renommée |
| `SSL_SERVER_KEY_SIZE` | `SSL_CIPHER_ALGKEYSIZE` | renommée |
| `SSL_SERVER_CERTIFICATE` | `SSL_SERVER_CERT` | renommée |
| `SSL_SERVER_CERT_START` | `SSL_SERVER_V_START` | renommée |
| `SSL_SERVER_CERT_END` | `SSL_SERVER_V_END` | renommée |
| `SSL_SERVER_CERT_SERIAL` | `SSL_SERVER_M_SERIAL` | renommée |
| `SSL_SERVER_SIGNATURE_ALGORITHM` | `SSL_SERVER_A_SIG` | renommée |
| `SSL_SERVER_DN` | `SSL_SERVER_S_DN` | renommée |
| `SSL_SERVER_CN` | `SSL_SERVER_S_DN_CN` | renommée |
| `SSL_SERVER_EMAIL` | `SSL_SERVER_S_DN_Email` | renommée |
| `SSL_SERVER_O` | `SSL_SERVER_S_DN_O` | renommée |
| `SSL_SERVER_OU` | `SSL_SERVER_S_DN_OU` | renommée |
| `SSL_SERVER_C` | `SSL_SERVER_S_DN_C` | renommée |
| `SSL_SERVER_SP` | `SSL_SERVER_S_DN_SP` | renommée |
| `SSL_SERVER_L` | `SSL_SERVER_S_DN_L` | renommée |
| `SSL_SERVER_IDN` | `SSL_SERVER_I_DN` | renommée |
| `SSL_SERVER_ICN` | `SSL_SERVER_I_DN_CN` | renommée |
| `SSL_SERVER_IEMAIL` | `SSL_SERVER_I_DN_Email` | renommée |
| `SSL_SERVER_IO` | `SSL_SERVER_I_DN_O` | renommée |
| `SSL_SERVER_IOU` | `SSL_SERVER_I_DN_OU` | renommée |
| `SSL_SERVER_IC` | `SSL_SERVER_I_DN_C` | renommée |
| `SSL_SERVER_ISP` | `SSL_SERVER_I_DN_SP` | renommée |
| `SSL_SERVER_IL` | `SSL_SERVER_I_DN_L` | renommée |
| `SSL_CLIENT_CERTIFICATE` | `SSL_CLIENT_CERT` | renommée |
| `SSL_CLIENT_CERT_START` | `SSL_CLIENT_V_START` | renommée |
| `SSL_CLIENT_CERT_END` | `SSL_CLIENT_V_END` | renommée |
| `SSL_CLIENT_CERT_SERIAL` | `SSL_CLIENT_M_SERIAL` | renommée |
| `SSL_CLIENT_SIGNATURE_ALGORITHM` | `SSL_CLIENT_A_SIG` | renommée |
| `SSL_CLIENT_DN` | `SSL_CLIENT_S_DN` | renommée |
| `SSL_CLIENT_CN` | `SSL_CLIENT_S_DN_CN` | renommée |
| `SSL_CLIENT_EMAIL` | `SSL_CLIENT_S_DN_Email` | renommée |
| `SSL_CLIENT_O` | `SSL_CLIENT_S_DN_O` | renommée |
| `SSL_CLIENT_OU` | `SSL_CLIENT_S_DN_OU` | renommée |
| `SSL_CLIENT_C` | `SSL_CLIENT_S_DN_C` | renommée |
| `SSL_CLIENT_SP` | `SSL_CLIENT_S_DN_SP` | renommée |
| `SSL_CLIENT_L` | `SSL_CLIENT_S_DN_L` | renommée |
| `SSL_CLIENT_IDN` | `SSL_CLIENT_I_DN` | renommée |
| `SSL_CLIENT_ICN` | `SSL_CLIENT_I_DN_CN` | renommée |
| `SSL_CLIENT_IEMAIL` | `SSL_CLIENT_I_DN_Email` | renommée |
| `SSL_CLIENT_IO` | `SSL_CLIENT_I_DN_O` | renommée |
| `SSL_CLIENT_IOU` | `SSL_CLIENT_I_DN_OU` | renommée |
| `SSL_CLIENT_IC` | `SSL_CLIENT_I_DN_C` | renommée |
| `SSL_CLIENT_ISP` | `SSL_CLIENT_I_DN_SP` | renommée |
| `SSL_CLIENT_IL` | `SSL_CLIENT_I_DN_L` | renommée |
| `SSL_EXPORT` | `SSL_CIPHER_EXPORT` | renommée |
| `SSL_KEYSIZE` | `SSL_CIPHER_ALGKEYSIZE` | renommée |
| `SSL_SECKEYSIZE` | `SSL_CIPHER_USEKEYSIZE` | renommée |
| `SSL_SSLEAY_VERSION` | `SSL_VERSION_LIBRARY` | renommée |
| `SSL_STRONG_CRYPTO` | `-` | Non supportée par mod\_ssl |
| `SSL_SERVER_KEY_EXP` | `-` | Non supportée par mod\_ssl |
| `SSL_SERVER_KEY_ALGORITHM` | `-` | Non supportée par mod\_ssl |
| `SSL_SERVER_KEY_SIZE` | `-` | Non supportée par mod\_ssl |
| `SSL_SERVER_SESSIONDIR` | `-` | Non supportée par mod\_ssl |
| `SSL_SERVER_CERTIFICATELOGDIR` | `-` | Non supportée par mod\_ssl |
| `SSL_SERVER_CERTFILE` | `-` | Non supportée par mod\_ssl |
| `SSL_SERVER_KEYFILE` | `-` | Non supportée par mod\_ssl |
| `SSL_SERVER_KEYFILETYPE` | `-` | Non supportée par mod\_ssl |
| `SSL_CLIENT_KEY_EXP` | `-` | Non supportée par mod\_ssl |
| `SSL_CLIENT_KEY_ALGORITHM` | `-` | Non supportée par mod\_ssl |
| `SSL_CLIENT_KEY_SIZE` | `-` | Non supportée par mod\_ssl |

## Fonctions de personnalisation des journaux

Quand mod\_ssl est activé, le [[12-modules/mod_log_config|Format de journal courant (Custom Log Format)]] du module [[12-modules/mod_log_config|mod_log_config]] possède des fonctions supplémentaires comme indiqué dans le chapitre de référence. En plus de la fonction de format étendu \`\``%{`*varname*`}x`'' que l'on peut utiliser pour extraire le contenu d'une variable fournie par n'importe quel module, la fonction de format cryptographique \`\``%{`*name*`}c`'' a été ajoutée à des fins de compatibilité ascendante. Les appels de fonctions actuellement implémentés sont énumérés dans le Tableau 3.

### Table 3: Fonctions cryptographiques du format de journal courant

| Appel de fonction | Description |
| --- | --- |
| `%...{version}c` | Version du protocole SSL |
| `%...{cipher}c` | Chiffrement SSL |
| `%...{subjectdn}c` | Nom distinctif du sujet du certificat du client |
| `%...{issuerdn}c` | Nom distinctif de l'émetteur du certificat du client |
| `%...{errcode}c` | Erreur lors de la vérification du certificat (numérique) |
| `%...{errstr}c` | Erreur lors de la vérification du certificat (chaîne de caractères) |

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
