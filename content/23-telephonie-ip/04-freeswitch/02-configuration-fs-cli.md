---
title: FreeSWITCH — configuration, dialplan XML et fs_cli
description: Configurer FreeSWITCH — utilisateurs de l'annuaire, profils Sofia et réglages NAT, gateway opérateur, dialplan XML (conditions, expressions régulières, bridge, voicemail, IVR, conférence), ACL, commandes fs_cli de référence (sofia status, reloadxml, show channels, originate, uuid_kill, siptrace) et dépannage.
tags: [freeswitch, sofia, dialplan, xml, fs_cli, gateway, configuration]
icon: settings-2
---

## Utilisateur (poste)

```xml
<!-- /etc/freeswitch/directory/default/1001.xml -->
<include>
  <user id="1001">
    <params>
      <param name="password" value="Xq7vR2pL9mZt4KwBn3Hs"/>
      <param name="vm-password" value="4826"/>
    </params>
    <variables>
      <variable name="user_context" value="default"/>
      <variable name="effective_caller_id_name" value="Alice Martin"/>
      <variable name="effective_caller_id_number" value="1001"/>
      <variable name="outbound_caller_id_number" value="0123456789"/>
      <variable name="toll_allow" value="local,national"/>
    </variables>
  </user>
</include>
```

## Profils Sofia et NAT

Dans `vars.xml`, l'adresse publique est détectée (`external_rtp_ip`, `external_sip_ip` valent `stun:stun.freeswitch.org` ou une adresse fixe) ; pour un serveur derrière NAT avec adresse publique fixe :

```xml
<X-PRE-PROCESS cmd="set" data="external_rtp_ip=203.0.113.10"/>
<X-PRE-PROCESS cmd="set" data="external_sip_ip=203.0.113.10"/>
```

Paramètres utiles du profil `internal.xml` : `apply-inbound-acl` (réseaux autorisés), `local-network-acl`, `aggressive-nat-detection`, `NDLB-force-rport`, `tls` et `tls-sip-port` pour TLS.

## Gateway opérateur

```xml
<!-- /etc/freeswitch/sip_profiles/external/operateur.xml -->
<include>
  <gateway name="operateur">
    <param name="username" value="0123456789"/>
    <param name="password" value="MotDePasseFourniParOperateur"/>
    <param name="realm" value="sip.operateur.example"/>
    <param name="proxy" value="sip.operateur.example"/>
    <param name="register" value="true"/>
    <param name="caller-id-in-from" value="true"/>
    <param name="expire-seconds" value="600"/>
    <param name="retry-seconds" value="30"/>
  </gateway>
</include>
```

## Dialplan XML

```xml
<!-- /etc/freeswitch/dialplan/default/10_routes.xml -->
<include>
  <extension name="interne">
    <condition field="destination_number" expression="^(1\d{3})$">
      <action application="set" data="call_timeout=20"/>
      <action application="bridge" data="user/$1@${domain_name}"/>
      <action application="answer"/>
      <action application="voicemail" data="default ${domain_name} $1"/>
    </condition>
  </extension>

  <extension name="national">
    <condition field="${toll_allow}" expression="national"/>
    <condition field="destination_number" expression="^(0[1-79]\d{8})$">
      <action application="set" data="effective_caller_id_number=${outbound_caller_id_number}"/>
      <action application="bridge" data="sofia/gateway/operateur/$1"/>
    </condition>
  </extension>

  <extension name="urgences">
    <condition field="destination_number" expression="^(1[578]|112|114)$">
      <action application="bridge" data="sofia/gateway/operateur/$1"/>
    </condition>
  </extension>

  <extension name="conference">
    <condition field="destination_number" expression="^(800)$">
      <action application="answer"/>
      <action application="conference" data="$1@default"/>
    </condition>
  </extension>
</include>
```

Appels entrants : le contexte `public` (`dialplan/public/`) reçoit les appels des gateways ; on y transfère vers le contexte `default` :

```xml
<!-- /etc/freeswitch/dialplan/public/10_entrant.xml -->
<include>
  <extension name="sda-standard">
    <condition field="destination_number" expression="^(0123456789|33123456789)$">
      <action application="transfer" data="5000 XML default"/>
    </condition>
  </extension>
</include>
```

Le numéro `5000` de la configuration d'exemple est un SVI de démonstration (`ivr_menus/demo_ivr.xml`) à adapter.

## Référence fs_cli

| Commande | Usage |
| --- | --- |
| `status` / `version` | État et version |
| `reloadxml` | Recharger la configuration XML (dialplan, annuaire) |
| `sofia status` | Profils et gateways |
| `sofia status profile internal reg` | Postes enregistrés |
| `sofia status gateway operateur` | État d'un trunk (`REGED`, `FAIL_WAIT`) |
| `sofia profile external rescan` / `restart` | Prendre en compte une nouvelle gateway / redémarrer le profil |
| `show channels` / `show calls` / `show registrations` | Canaux, appels, enregistrements |
| `uuid_kill <uuid>` | Raccrocher un appel |
| `originate user/1001 &echo` | Appeler un poste et lui faire écouter un écho |
| `originate user/1001 1002 XML default` | Mettre en relation 1001 puis 1002 |
| `sofia global siptrace on` / `off` | Trace SIP dans la console |
| `console loglevel debug` / `/log 7` | Niveau de journal |
| `fsctl shutdown elegant` | Arrêt après la fin des appels |
| `load mod_xxx` / `reload mod_xxx` | Modules |

```bash
fs_cli -x "sofia status gateway operateur"
fs_cli -x "show registrations" | head
```

## Dépannage

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Postes refusés (`403`) | ACL du profil, mot de passe | `sofia global siptrace on`, `apply-inbound-acl` |
| Gateway en `FAIL_WAIT` | Identifiants, `realm`, pare-feu | `sofia status gateway operateur`, trace SIP |
| Audio absent derrière NAT | `external_rtp_ip`, plage RTP fermée | Fixer l'adresse publique, ouvrir 16384–32768/UDP |
| Appel entrant rejeté (`404`/`NO_ROUTE_DESTINATION`) | Numéro absent du contexte `public` | Adapter l'expression régulière au format reçu |
| Fraude | `default_password` inchangé, `toll_allow` absent | Changer les mots de passe, conditions `toll_allow` sur les routes payantes |
