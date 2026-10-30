---
title: Dépannage et mémo des commandes
description: Méthode de diagnostic Active Directory, dcdiag, repadmin, nltest, netdom, klist, setspn, w32tm, ntdsutil, requêtes LDAP, événements significatifs, tests de ports et problèmes courants (connexion lente, verrouillages, relation d'approbation, SYSVOL, DNS).
tags: [active directory, dépannage, dcdiag, repadmin, nltest, mémo, commandes, événements]
icon: bug
---

## Bilan de santé rapide

```powershell
dcdiag /e /c /q                         # tous les DC, tous les tests, uniquement les erreurs
dcdiag /test:dns /e /v                  # santé DNS
repadmin /replsummary                   # réplication AD
dfsrdiag backlog /rgname:"Domain System Volume" /rfname:"SYSVOL Share" /smem:DC01 /rmem:DC02   # réplication SYSVOL
w32tm /monitor                          # dérive de l'heure
Get-ADDomainController -Filter * | Select-Object Name, Site, IPv4Address, OperatingSystem, IsGlobalCatalog, IsReadOnly
netdom query fsmo
```

> [!TIP]
> Planifiez ce bilan chaque matin (tâche planifiée qui envoie un rapport) ou intégrez-le à la supervision : Centreon fournit le plugin `apps::activedirectory::local::plugin` (modes `dcdiag` et `netdom`) exécuté localement sur les DC via un agent (voir [[01-centreon/05-supervision-agents|supervision par agent]]).

## Mémo des commandes

### dcdiag

| Commande | Usage |
| --- | --- |
| `dcdiag /s:DC01` | Diagnostic d'un DC précis |
| `dcdiag /test:replications` | Réplication |
| `dcdiag /test:netlogons` | Partages SYSVOL/NETLOGON et droits |
| `dcdiag /test:advertising` | Le DC s'annonce-t-il correctement (DC, GC, KDC, temps) ? |
| `dcdiag /test:fsmocheck` | Rôles FSMO joignables |
| `dcdiag /test:knowsofroleholders` | Chaque DC connaît-il les détenteurs ? |
| `dcdiag /test:sysvolcheck /test:dfsrevent` | SYSVOL et événements DFSR |
| `dcdiag /test:ridmanager /v` | Pool RID restant |
| `dcdiag /test:dns /dnsforwarders /dnsdelegation` | Tests DNS ciblés |

### nltest

```powershell
nltest /dsgetdc:corp.exemple.fr                 # DC trouvé pour ce poste (site, drapeaux)
nltest /dsgetdc:corp.exemple.fr /force /kdc     # redécouverte, KDC uniquement
nltest /dsgetsite                               # site du poste
nltest /dclist:corp.exemple.fr                  # liste des DC
nltest /sc_query:corp.exemple.fr                # canal sécurisé du poste
nltest /sc_verify:corp.exemple.fr               # vérification
nltest /sc_reset:corp.exemple.fr\DC02           # réinitialiser vers un DC précis
nltest /dsregdns                                # (sur un DC) réenregistrer les SRV
nltest /domain_trusts /all_trusts               # approbations
```

### netdom / Test-ComputerSecureChannel

```powershell
Test-ComputerSecureChannel -Verbose
Test-ComputerSecureChannel -Repair -Credential CORP\adm-t2-amartin
netdom resetpwd /server:DC01 /userd:CORP\adm-t0 /passwordd:*     # sur un DC dont le compte ordinateur est désynchronisé
netdom computername PC01 /enumerate
```

### Kerberos

```powershell
klist                           # tickets de la session
klist tgt
klist purge                     # vider (tester un nouvel accès / une nouvelle appartenance)
klist -li 0x3e7 purge           # tickets du compte ordinateur (SYSTEM) — après ajout à un groupe
klist get HTTP/intranet.corp.exemple.fr    # demander explicitement un ticket de service
setspn -L CORP\gmsa-intranet$   # SPN d'un compte
setspn -Q HTTP/intranet*        # rechercher un SPN
setspn -X                       # doublons (cause d'échecs Kerberos KRB_AP_ERR_MODIFIED)
```

### Recherches LDAP en ligne de commande

```powershell
dsquery user -name "Alice*" | dsget user -samid -email -memberof
dsquery computer -inactive 12                    # inactifs depuis 12 semaines
dsquery * "DC=corp,DC=exemple,DC=fr" -filter "(&(objectCategory=person)(objectClass=user)(pwdLastSet=0))" -attr sAMAccountName
Get-ADObject -LDAPFilter "(servicePrincipalName=*)" -Properties servicePrincipalName
ldp.exe                                          # client LDAP graphique (tests de liaison, LDAPS)
```

### Tester les ports

```powershell
$dc = "dc01.corp.exemple.fr"
53,88,135,389,445,464,636,3268,3269,9389 | ForEach-Object {
  [pscustomobject]@{ Port = $_; Ouvert = (Test-NetConnection $dc -Port $_ -WarningAction SilentlyContinue).TcpTestSucceeded }
}
portqry -n dc01.corp.exemple.fr -e 389 -p udp    # PortQry (Microsoft) : teste aussi l'UDP et interroge le mappeur RPC
portqry -n dc01.corp.exemple.fr -e 135           # liste des points de terminaison RPC
```

## Événements significatifs

| Journal / ID | Signification |
| --- | --- |
| Directory Service **1311** | Le KCC ne peut pas construire une topologie complète (sites/liens) |
| Directory Service **1865** / **1566** | Sites isolés, aucun DC joignable dans un site |
| Directory Service **2042** | Pas de réplication depuis plus longtemps que la durée de vie des tombstones |
| Directory Service **2087** / **2088** | Échec / repli de la résolution DNS du partenaire de réplication |
| Directory Service **2095** | **USN rollback** détecté : le DC a été restauré incorrectement (snapshot) → le rétrograder |
| Directory Service **1988** | Objet persistant (*lingering object*) reçu |
| Directory Service **2887 / 2889** | Liaisons LDAP non signées (voir sécurité) |
| DFS Replication **2213 / 4012 / 4614** | SYSVOL : arrêt incorrect / déconnexion trop longue / en attente de réplication initiale |
| System / Netlogon **5719** | Le poste ne trouve pas de DC au démarrage |
| System / Netlogon **5722 / 5805** | Échec du canal sécurisé (compte ordinateur) |
| System / Netlogon **5807** | Clients hors des sous-réseaux déclarés |
| System / NETLOGON **5774 / 5781** | Échec d'enregistrement DNS des SRV du DC |
| DNS Server **4013** | Le serveur DNS attend la réplication AD initiale (normal au démarrage, anormal s'il persiste) |
| DNS Server **4000 / 4007** | Zone AD inaccessible / impossible à charger |
| System / Time-Service **24 / 36 / 47 / 129** | Problèmes de synchronisation de l'heure |
| GroupPolicy **1058 / 1030 / 1129** | GPO non appliquées (SYSVOL, connectivité) |
| Security **4740** | Compte verrouillé (avec le poste d'origine) |
| Security **4771** code 0x18 | Mauvais mot de passe en pré-authentification Kerberos |

```powershell
Get-WinEvent -FilterHashtable @{LogName='Directory Service'; Level=1,2,3; StartTime=(Get-Date).AddDays(-1)} |
  Group-Object Id | Sort-Object Count -Descending | Select-Object Count, Name, @{n='Exemple';e={$_.Group[0].Message.Substring(0,120)}}
```

## Problèmes courants

### Ouverture de session lente

1. `nltest /dsgetsite` et `nltest /dsgetdc:` sur le poste : le DC trouvé est-il dans le bon site ? → déclarer le sous-réseau.
2. DNS du poste : uniquement les DC internes ?
3. `gpresult /h` : temps de traitement des GPO (scripts, mappages réseau vers des serveurs injoignables, filtres WMI lents).
4. Profils itinérants volumineux, redirection de dossiers vers un serveur distant.
5. Journal *GroupPolicy → Opérationnel* : durée de chaque extension.

### Verrouillages de compte répétés

```powershell
# Trouver le poste d'origine : événement 4740 sur l'émulateur PDC
$pdc = (Get-ADDomain).PDCEmulator
Get-WinEvent -ComputerName $pdc -FilterHashtable @{LogName='Security'; Id=4740; StartTime=(Get-Date).AddHours(-24)} |
  Select-Object TimeCreated, @{n='Compte';e={$_.Properties[0].Value}}, @{n='Source';e={$_.Properties[1].Value}}
```

Causes classiques : mot de passe enregistré dans un smartphone (messagerie, Wi-Fi 802.1X), lecteur réseau mappé avec d'anciens identifiants, tâche planifiée ou service sous le compte de l'utilisateur, session RDP déconnectée. L'outil Microsoft **LockoutStatus.exe** affiche l'état sur chaque DC.

### « La relation d'approbation entre cette station de travail et le domaine principal a échoué »

Le mot de passe du compte ordinateur est désynchronisé (restauration d'une VM, poste éteint très longtemps, clonage) :

```powershell
# Ouvrir une session locale (ou avec des identifiants en cache) puis :
Test-ComputerSecureChannel -Repair -Credential CORP\adm-t2-amartin
# ou : Reset-ComputerMachinePassword -Server DC01 -Credential CORP\adm-t2-amartin
```

### SYSVOL / NETLOGON absents ou GPO non répliquées

- `net share` sur le DC : partages présents ?
- Clé `HKLM\SYSTEM\CurrentControlSet\Services\Netlogon\Parameters\SysvolReady` = 1 ?
- Journal *DFS Replication* (2213 : suivre la commande de reprise indiquée ; 4012 : DC déconnecté trop longtemps → restauration non autoritaire de SYSVOL).
- `dfsrdiag pollad`, puis vérifier le backlog.

### Le DC ne s'enregistre pas dans le DNS

```powershell
ipconfig /registerdns
Restart-Service Netlogon
Get-Content $env:SystemRoot\System32\Config\netlogon.dns | Select-Object -First 20   # ce qui devrait exister
dcdiag /test:registerindns /dnsdomain:corp.exemple.fr /v
```

Vérifier que la zone accepte les mises à jour dynamiques sécurisées et que la configuration DNS de la carte réseau pointe vers des DC.

### Heure décalée (erreurs Kerberos KRB_AP_ERR_SKEW)

```powershell
w32tm /query /source            # « Local CMOS Clock » ou « VM IC Time Synchronization Provider » = problème
w32tm /config /syncfromflags:domhier /update ; Restart-Service w32time ; w32tm /resync
```

Sur le PDC racine : vérifier la configuration NTP externe (voir [[07-fsmo-maintenance]]).

### Erreur « Accès refusé » à une ressource malgré l'ajout au groupe

L'appartenance est dans le **jeton** : se déconnecter/reconnecter, ou `klist purge` (accès réseau) ; pour un compte ordinateur (`Install-ADServiceAccount`, accès d'un serveur) : `klist -li 0x3e7 purge` ou redémarrer. Vérifier aussi la limite de ~1 000 groupes (jeton trop grand → `MaxTokenSize`).

## Outils de référence

| Outil | Usage |
| --- | --- |
| RSAT (consoles ADUC, ADAC, GPMC, DNS, Sites et services) | Administration graphique |
| **ADAC** (`dsac.exe`) + Historique PowerShell | Voir les commandes PowerShell correspondant aux actions de la console |
| **LDP** / **ADSI Edit** | Accès bas niveau aux objets et attributs |
| **AD Replication Status Tool** (Microsoft) | Vue consolidée des erreurs de réplication |
| **Sysinternals AD Explorer** | Navigation, instantanés comparables |
| **PingCastle** | Audit de santé et de sécurité |
| **DSInternals** (module PowerShell) | Analyse hors ligne de la base, qualité des mots de passe |
