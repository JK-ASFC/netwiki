---
title: Support et parc — aide-mémoire (AnyDesk, TeamViewer, RustDesk, MeshCentral, GLPI, Zammad, OCS, Lansweeper, PDQ, Intune)
description: Commandes des outils de support et de gestion de parc avec exemples — déploiement silencieux et options de ligne de commande d'AnyDesk et TeamViewer, RustDesk (client et serveur hbbs/hbbr), MeshCentral (installation, mise à jour, agent), GLPI (console bin/console, agent GLPI, API REST), Zammad (rails r, sauvegarde), OCS Inventory (agent), Lansweeper, PDQ Deploy/Inventory, Intune (synchronisation, journaux, Graph PowerShell).
tags: [aide-mémoire, glpi, intune, rustdesk, meshcentral, zammad, ocs, pdq, anydesk]
icon: terminal
---

Référence rapide ; les explications sont dans [[02-rustdesk|RustDesk]], [[03-meshcentral|MeshCentral]], [[04-glpi-installation|GLPI]], [[06-zammad|Zammad]] et [[10-intune-inscription|Intune]].

## AnyDesk et TeamViewer (déploiement)

```powershell
# AnyDesk : installation silencieuse et mot de passe d'accès non surveillé (à réserver aux postes gérés)
.\AnyDesk.exe --install "C:\Program Files (x86)\AnyDesk" --start-with-win --silent --create-shortcuts --create-desktop-icon
echo $env:ANYDESK_MDP | & "C:\Program Files (x86)\AnyDesk\AnyDesk.exe" --set-password
& "C:\Program Files (x86)\AnyDesk\AnyDesk.exe" --get-id
# TeamViewer : MSI avec affectation à la console de gestion
msiexec /i TeamViewer_Host.msi /qn CUSTOMCONFIGID=xxxxxxx ASSIGNMENTOPTIONS="--grant-easy-access"
& "C:\Program Files\TeamViewer\TeamViewer.exe" info
```

## RustDesk

```bash
# Serveur auto-hébergé (ID/relais) : ports 21115-21117 TCP, 21116 UDP
docker run -d --name hbbs --net=host -v ./data:/root rustdesk/rustdesk-server hbbs
docker run -d --name hbbr --net=host -v ./data:/root rustdesk/rustdesk-server hbbr
cat ./data/id_ed25519.pub                       # clé à renseigner dans les clients
```

```powershell
.\rustdesk.exe --silent-install
& "C:\Program Files\RustDesk\rustdesk.exe" --config "<chaîne-de-configuration-exportée>"
& "C:\Program Files\RustDesk\rustdesk.exe" --get-id
```

## MeshCentral

```bash
sudo npm install meshcentral --prefix /opt/meshcentral
cd /opt/meshcentral && sudo node node_modules/meshcentral --cert support.exemple.fr
sudo node node_modules/meshcentral --install          # service système
sudo npm install meshcentral@latest --prefix /opt/meshcentral && sudo systemctl restart meshcentral
```

L'agent s'installe depuis l'interface (*Ajouter un agent*) : binaire Windows, script Linux/macOS, ou commande unique fournie par le groupe d'appareils.

## GLPI

```bash
cd /var/www/glpi
sudo -u www-data php bin/console system:check_requirements
sudo -u www-data php bin/console db:update
sudo -u www-data php bin/console cache:clear
sudo -u www-data php bin/console maintenance:enable && sudo -u www-data php bin/console maintenance:disable
sudo -u www-data php bin/console ldap:synchronize_users
sudo -u www-data php bin/console glpi:security:change_key       # après une fuite supposée de la clé de chiffrement
sudo -u www-data php bin/console plugin:list
sudo -u www-data php front/cron.php                              # tâches planifiées (cron toutes les minutes)
```

```powershell
# Agent GLPI (inventaire) sur Windows
msiexec /i GLPI-Agent-x64.msi /quiet SERVER="https://glpi.exemple.fr/" RUNNOW=1 ADD_FIREWALL_EXCEPTION=1
& "C:\Program Files\GLPI-Agent\glpi-agent.bat" --force
```

```bash
glpi-agent --server https://glpi.exemple.fr/ --force                     # Linux
curl -s -H "App-Token: $APP" -H "Authorization: user_token $UTOK" https://glpi.exemple.fr/apirest.php/initSession | jq -r .session_token
curl -s -H "App-Token: $APP" -H "Session-Token: $STOK" "https://glpi.exemple.fr/apirest.php/Computer?range=0-9" | jq '.[].name'
```

## Zammad

```bash
sudo zammad run rails r "puts Ticket.count"
sudo zammad run rails r "User.find_by(email: 'admin@exemple.fr').update!(password: 'NouveauMotDePasse2026')"
sudo zammad run rake zammad:searchindex:rebuild
sudo /opt/zammad/contrib/backup/zammad_backup.sh
sudo systemctl status zammad zammad-web zammad-worker zammad-websocket
```

## OCS Inventory, Lansweeper, PDQ

```powershell
.\OCS-Windows-Agent-Setup-x64.exe /S /SERVER=https://ocs.exemple.fr/ocsinventory /SSL=1 /NOW
& "C:\Program Files\OCS Inventory Agent\OCSInventory.exe" /SERVER=https://ocs.exemple.fr/ocsinventory /FORCE
.\LsAgent-windows.exe --mode unattended --server lansweeper.exemple.fr --port 9524 --agentkey "CLE"
PDQDeploy.exe Deploy -Package "Mise à jour navigateur" -Targets PC-PARIS-042,PC-PARIS-043
PDQInventory.exe ScanComputers -Computers PC-PARIS-042 -ScanProfile "Standard"
```

## Intune (postes)

```powershell
# Forcer la synchronisation MDM d'un poste
Get-ScheduledTask -TaskPath "\Microsoft\Windows\EnterpriseMgmt\*" | Where-Object TaskName -like "*Schedule #3*" | Start-ScheduledTask
dsregcmd /status                                     # jonction Entra ID, état PRT
mdmdiagnosticstool.exe -area DeviceEnrollment;DeviceProvisioning;Autopilot -cab C:\Temp\mdm.cab
Get-Content "C:\ProgramData\Microsoft\IntuneManagementExtension\Logs\IntuneManagementExtension.log" -Tail 30
# Microsoft Graph PowerShell
Install-Module Microsoft.Graph.DeviceManagement -Scope CurrentUser
Connect-MgGraph -Scopes "DeviceManagementManagedDevices.Read.All"
Get-MgDeviceManagementManagedDevice -Filter "complianceState eq 'noncompliant'" | Select-Object DeviceName, UserPrincipalName, LastSyncDateTime
```
