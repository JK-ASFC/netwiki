---
title: "Sécurité : TLS, SASL et ACL"
description: Sécuriser Kafka — listeners SSL et SASL_SSL, magasins de clés, authentification SCRAM-SHA-512 (création des identifiants par kafka-configs), mTLS, OAUTHBEARER et Kerberos, autorisation par ACL avec StandardAuthorizer en KRaft, super-utilisateurs, configuration des clients et quotas.
tags: [kafka, sécurité, tls, sasl, scram, acl, kraft, quotas]
icon: shield-check
---

## Listeners chiffrés et authentifiés

```kafka /opt/kafka/config/server.properties (extrait)
listeners=SASL_SSL://:9092,CONTROLLER://:9093
advertised.listeners=SASL_SSL://kafka1.corp.exemple.fr:9092
listener.security.protocol.map=CONTROLLER:SSL,SASL_SSL:SASL_SSL
inter.broker.listener.name=SASL_SSL
controller.listener.names=CONTROLLER

# TLS
ssl.keystore.type=PKCS12
ssl.keystore.location=/opt/kafka/ssl/kafka1.p12
ssl.keystore.password=MotDePasseKeystore
ssl.truststore.type=PKCS12
ssl.truststore.location=/opt/kafka/ssl/truststore.p12
ssl.truststore.password=MotDePasseTruststore
ssl.client.auth=required                 # pour le listener CONTROLLER (mTLS entre contrôleurs)
ssl.endpoint.identification.algorithm=https

# SASL
sasl.enabled.mechanisms=SCRAM-SHA-512
sasl.mechanism.inter.broker.protocol=SCRAM-SHA-512
listener.name.sasl_ssl.scram-sha-512.sasl.jaas.config=org.apache.kafka.common.security.scram.ScramLoginModule required \
  username="broker" password="MotDePasseBroker";

# Autorisation (KRaft)
authorizer.class.name=org.apache.kafka.metadata.authorizer.StandardAuthorizer
super.users=User:broker;User:admin;User:CN=kafka1.corp.exemple.fr
allow.everyone.if.no.acl.found=false
```

```bash
# Magasin PKCS#12 à partir d'un certificat et d'une clé émis par l'AC interne
openssl pkcs12 -export -in kafka1.crt -inkey kafka1.key -certfile ca.crt -name kafka1 \
  -out /opt/kafka/ssl/kafka1.p12 -passout pass:MotDePasseKeystore
keytool -importcert -noprompt -alias ac-interne -file ca.crt -keystore /opt/kafka/ssl/truststore.p12 \
  -storetype PKCS12 -storepass MotDePasseTruststore
```

## Identifiants SCRAM

En KRaft, les identifiants SCRAM du compte inter-broker doivent être créés **au formatage** du stockage :

```bash
sudo -u kafka /opt/kafka/bin/kafka-storage.sh format -t "$KAFKA_CLUSTER_ID" -c /opt/kafka/config/server.properties \
  --add-scram 'SCRAM-SHA-512=[name=broker,password=MotDePasseBroker]' \
  --add-scram 'SCRAM-SHA-512=[name=admin,password=MotDePasseAdmin]'
```

Les comptes applicatifs se créent ensuite à chaud :

```bash
/opt/kafka/bin/kafka-configs.sh --bootstrap-server kafka1:9092 --command-config admin.properties \
  --alter --add-config 'SCRAM-SHA-512=[password=MotDePasseApp]' --entity-type users --entity-name app_siem
```

```kafka admin.properties (client)
security.protocol=SASL_SSL
sasl.mechanism=SCRAM-SHA-512
sasl.jaas.config=org.apache.kafka.common.security.scram.ScramLoginModule required username="admin" password="MotDePasseAdmin";
ssl.truststore.type=PKCS12
ssl.truststore.location=/opt/kafka/ssl/truststore.p12
ssl.truststore.password=MotDePasseTruststore
```

| Mécanisme | Usage |
| --- | --- |
| **SCRAM-SHA-512** | Mots de passe gérés dans Kafka : simple et courant |
| **mTLS** (`SSL` + `ssl.client.auth=required`) | Certificat client ; le principal est le DN (`ssl.principal.mapping.rules` pour le simplifier) |
| OAUTHBEARER (OIDC) | Jetons d'un fournisseur d'identité (Keycloak, Entra ID) |
| GSSAPI (Kerberos) | Intégration Active Directory |
| PLAIN | Uniquement sous TLS, mots de passe en clair dans la configuration JAAS |

## ACL

```bash
K="/opt/kafka/bin/kafka-acls.sh --bootstrap-server kafka1:9092 --command-config admin.properties"
# Producteur : écrire dans les topics journaux-*
$K --add --allow-principal User:app_fluentbit --operation Write --operation Describe --topic journaux- --resource-pattern-type prefixed
# Consommateur : lire et utiliser son groupe
$K --add --allow-principal User:app_siem --operation Read --operation Describe --topic journaux- --resource-pattern-type prefixed
$K --add --allow-principal User:app_siem --operation Read --group siem
$K --list --topic journaux- --resource-pattern-type prefixed
```

| Opération | Ressource |
| --- | --- |
| `Write`, `Read`, `Describe`, `Create`, `Delete`, `Alter` | Topic |
| `Read` | Groupe de consommateurs |
| `IdempotentWrite`, `Describe`, `Alter` | Cluster |
| `Write`, `Describe` | Transactional ID |

## Quotas

```bash
/opt/kafka/bin/kafka-configs.sh --bootstrap-server kafka1:9092 --command-config admin.properties \
  --alter --add-config 'producer_byte_rate=10485760,consumer_byte_rate=20971520' --entity-type users --entity-name app_fluentbit
```

Les quotas protègent le cluster d'un client trop gourmand (octets/s par utilisateur ou identifiant client).

## Durcissement

- [ ] Aucun listener `PLAINTEXT` exposé ; TLS partout (clients, inter-brokers, contrôleurs)
- [ ] Authentification de chaque client, ACL au moindre privilège, `allow.everyone.if.no.acl.found=false`
- [ ] Mots de passe des magasins hors des fichiers lisibles (droits 600, ou fournisseurs de configuration externes)
- [ ] Pare-feu : 9092 vers les clients, 9093 entre contrôleurs/brokers seulement
