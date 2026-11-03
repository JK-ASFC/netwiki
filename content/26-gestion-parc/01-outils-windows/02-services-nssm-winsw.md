---
title: NSSM et WinSW — programmes en services Windows
description: Transformer un programme quelconque (Node.js, Python, Java, Caddy, agent) en service Windows démarré au boot — NSSM (domaine public : nssm install, set AppDirectory, AppStdout, rotation des journaux, redémarrage automatique, compte de service, suppression) et WinSW (MIT : fichier XML de service, id, executable, arguments, env, journaux roll-by-size, onfailure ; WinSW 2 renommé ou WinSW 3 winsw install), alternative native sc.exe et New-Service, comptes gMSA et dépannage.
tags: [windows, services, nssm, winsw, sc.exe, node.js, python, java]
icon: cog
---

Un service Windows doit répondre au **gestionnaire de services** (démarrage, arrêt, état). Un programme ordinaire (`node server.js`, `python app.py`, `java -jar app.jar`) ne le fait pas : `sc.exe create` seul donne l'erreur 1053. NSSM et WinSW servent d'**enveloppe** : ils sont le service et lancent, surveillent et relancent le programme.

| | NSSM | WinSW |
| --- | --- | --- |
| Configuration | Base de registre (commandes ou interface) | Fichier **XML** versionnable |
| Journaux | Redirection et rotation | Plusieurs modes de rotation |
| Maintenance | Dernière version stable ancienne (2.24) | Active (2.x stable, 3.x) |
| Licence | Domaine public | MIT |

## NSSM

Télécharger l'archive (ou `choco install nssm`), copier `nssm.exe` (dossier `win64`) dans `C:\Outils` ; en administrateur :

```powershell
nssm install ApiInterne "C:\Program Files\nodejs\node.exe" "C:\Apps\api\server.js"
nssm set ApiInterne AppDirectory C:\Apps\api
nssm set ApiInterne AppEnvironmentExtra NODE_ENV=production PORT=3000
nssm set ApiInterne AppStdout C:\Apps\api\logs\sortie.log
nssm set ApiInterne AppStderr C:\Apps\api\logs\erreurs.log
nssm set ApiInterne AppRotateFiles 1
nssm set ApiInterne AppRotateBytes 10485760
nssm set ApiInterne Start SERVICE_AUTO_START
nssm set ApiInterne ObjectName "CORP\svc-api$" ""          # compte gMSA (mot de passe vide)
nssm start ApiInterne ; nssm status ApiInterne
nssm edit ApiInterne                                        # interface graphique
nssm remove ApiInterne confirm
```

## WinSW

WinSW 2 : renommer `WinSW-x64.exe` en `api-interne.exe` et placer à côté `api-interne.xml`. WinSW 3 : un seul `winsw.exe` qui reçoit le chemin du XML.

```xml
<service>
  <id>api-interne</id>
  <name>API interne</name>
  <description>API Node.js du service informatique</description>
  <executable>C:\Program Files\nodejs\node.exe</executable>
  <arguments>server.js</arguments>
  <workingdirectory>C:\Apps\api</workingdirectory>
  <env name="NODE_ENV" value="production"/>
  <startmode>Automatic</startmode>
  <delayedAutoStart>true</delayedAutoStart>
  <onfailure action="restart" delay="10 sec"/>
  <onfailure action="restart" delay="30 sec"/>
  <log mode="roll-by-size">
    <sizeThreshold>10240</sizeThreshold>
    <keepFiles>8</keepFiles>
  </log>
  <serviceaccount>
    <username>CORP\svc-api$</username>
    <allowservicelogon>true</allowservicelogon>
  </serviceaccount>
</service>
```

```powershell
.\api-interne.exe install ; .\api-interne.exe start ; .\api-interne.exe status     # WinSW 2
winsw install api-interne.xml ; winsw start api-interne.xml                       # WinSW 3
.\api-interne.exe restart ; .\api-interne.exe uninstall
```

## Natif et dépannage

Pour un vrai exécutable de service : `New-Service -Name MonSvc -BinaryPathName '"C:\Apps\svc.exe"' -StartupType Automatic` ou `sc.exe create MonSvc binPath= "C:\Apps\svc.exe" start= auto`. Réglages de relance : `sc.exe failure MonSvc reset= 86400 actions= restart/10000/restart/30000//`.

- Le service démarre puis s'arrête : lire le journal de sortie, vérifier le **répertoire de travail** et les **chemins absolus**.
- Accès refusé à un partage réseau : le compte `LocalSystem` n'a pas les droits réseau d'un utilisateur ; utiliser un compte de service géré (**gMSA**) avec les bons droits.
- Ne jamais lancer un service applicatif en administrateur du domaine.

Commandes : [[90-aide-memoire|aide-mémoire]].
