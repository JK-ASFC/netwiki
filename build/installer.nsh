; NetWiki - installateur Windows aux couleurs du logiciel (NSIS, electron-builder).
; Copyright (c) 2026 JK-ASFC - licence MIT (voir LICENSE).
;
; Parcours : Accueil -> Securite et confidentialite -> Dossier -> Installation -> Soutenir -> Fin (utilisateur courant).
; Theme sombre sur toutes les pages (fond #0B0D14, texte #E6EDF6) ; visuels generes par scripts/make-installer-art.js.
; Lors d'une mise a jour lancee depuis NetWiki (--updated), les pages d'information sont sautees.

!include nsDialogs.nsh
!include LogicLib.nsh

!define NW_BG "0B0D14"
!define NW_PANEL "121624"
!define NW_TEXT "E6EDF6"
!define NW_DIM "8B98AD"
!define NW_GREEN "34D399"
!define NW_CYAN "22D3EE"
!define NW_PINK "F472B6"
!define NW_DON "https://liberapay.com/JK-ASFC/donate"
!define NW_SITE "https://github.com/JK-ASFC/netwiki"

; Couleurs Modern UI : en-tete, pages d'accueil et de fin.
!define MUI_BGCOLOR "${NW_BG}"
!define MUI_TEXTCOLOR "${NW_TEXT}"
!define MUI_INSTFILESPAGE_COLORS "${NW_TEXT} ${NW_PANEL}"
!define MUI_INSTFILESPAGE_PROGRESSBAR "smooth"
!define MUI_ABORTWARNING
!define MUI_ABORTWARNING_TEXT "Voulez-vous vraiment quitter l'installation de NetWiki ?"
!define MUI_UNABORTWARNING


; ------------------------------------------------------------------ theme sombre commun

; Fenetre principale (bas de page, ligne, texte de marque) et page courante : fond sombre, texte clair.
!macro NW_DARKEN
  SetCtlColors $HWNDPARENT ${NW_TEXT} ${NW_BG}
  GetDlgItem $R9 $HWNDPARENT 1028 ; texte de marque "Nullsoft Install System"
  SetCtlColors $R9 ${NW_DIM} ${NW_BG}
  SendMessage $R9 ${WM_SETTEXT} 0 "STR:NetWiki - (c) 2026 JK-ASFC - licence MIT  "
  GetDlgItem $R9 $HWNDPARENT 1256
  SetCtlColors $R9 ${NW_DIM} ${NW_BG}
  FindWindow $R8 "#32770" "" $HWNDPARENT
  SetCtlColors $R8 ${NW_TEXT} ${NW_BG}
  StrCpy $R9 0
  ${Do}
    FindWindow $R9 "" "" $R8 $R9
    ${If} $R9 == 0
      ${Break}
    ${EndIf}
    SetCtlColors $R9 ${NW_TEXT} ${NW_BG}
  ${Loop}
!macroend



; Ligne de texte d'une page personnalisee : $0 = handle.
!macro NW_LABEL X Y W H TEXT COLOR FONT
  ${NSD_CreateLabel} ${X} ${Y} ${W} ${H} "${TEXT}"
  Pop $0
  SetCtlColors $0 ${COLOR} ${NW_BG}
  SendMessage $0 ${WM_SETFONT} ${FONT} 1
!macroend

; ------------------------------------------------------------------ page d'accueil + securite

!macro customWelcomePage
  Var nwFont
  Var nwFontTitle
  Var nwFontBold
  ; Fonctions definies ici (et non au niveau global) : les greffons NSIS ne sont declares qu'apres l'en-tete.
  Function nwDarkPage
    !insertmacro NW_DARKEN
  FunctionEnd

  Function nwFonts
    ${If} $nwFont == ""
      CreateFont $nwFont "Segoe UI" 9 400
      CreateFont $nwFontBold "Segoe UI" 9 700
      CreateFont $nwFontTitle "Segoe UI Semibold" 15 600
    ${EndIf}
  FunctionEnd
  Function nwSkipIfUpdated
    ${If} ${isUpdated}
      Abort
    ${EndIf}
  FunctionEnd

  Function nwSecurityPage
    ${If} ${isUpdated}
      Abort
    ${EndIf}
    !insertmacro MUI_HEADER_TEXT "Sécurité et confidentialité" "Ce que NetWiki fait, et ne fait pas, sur votre ordinateur."
    nsDialogs::Create 1018
    Pop $1
    ${If} $1 == error
      Abort
    ${EndIf}
    Call nwFonts
    SetCtlColors $1 ${NW_TEXT} ${NW_BG}
    !insertmacro NW_LABEL 0 0 100% 11u "Vos données restent chez vous" ${NW_GREEN} $nwFontBold
    !insertmacro NW_LABEL 10u 11u 290u 20u "Articles en simples fichiers Markdown sur votre poste. Aucune télémétrie, aucune publicité, aucun compte." ${NW_TEXT} $nwFont
    !insertmacro NW_LABEL 0 34u 100% 11u "Mises à jour vérifiées" ${NW_CYAN} $nwFontBold
    !insertmacro NW_LABEL 10u 45u 290u 20u "Contenu et logiciel installés seulement s'ils sont signés par JK-ASFC (Ed25519), et avec votre accord." ${NW_TEXT} $nwFont
    !insertmacro NW_LABEL 0 68u 100% 11u "Application cloisonnée" ${NW_GREEN} $nwFontBold
    !insertmacro NW_LABEL 10u 79u 290u 20u "Bac à sable Electron, isolation du contexte, ni caméra ni micro, outils de développement désactivés." ${NW_TEXT} $nwFont
    !insertmacro NW_LABEL 0 102u 100% 11u "Libre et transparent" ${NW_CYAN} $nwFontBold
    !insertmacro NW_LABEL 10u 113u 130u 10u "Code source ouvert, licence MIT :" ${NW_TEXT} $nwFont
    ${NSD_CreateLink} 140u 113u 150u 10u "github.com/JK-ASFC/netwiki"
    Pop $0
    SetCtlColors $0 ${NW_CYAN} ${NW_BG}
    SendMessage $0 ${WM_SETFONT} $nwFont 1
    ${NSD_OnClick} $0 nwOpenSite
    Call nwDarkPage
    nsDialogs::Show
  FunctionEnd

  Function nwOpenSite
    ExecShell "open" "${NW_SITE}"
  FunctionEnd

  !define MUI_WELCOMEPAGE_TITLE "Bienvenue dans NetWiki"
  !define MUI_WELCOMEPAGE_TEXT "Le wiki hors ligne de l'architecte réseau : services, Windows Server, équipements Cisco, Fortinet, Palo Alto, Juniper, téléphonie IP et des centaines d'aide-mémoires de commandes.$\r$\n$\r$\nCet assistant installe NetWiki ${VERSION} sur votre ordinateur. Vos articles restent sur votre poste, et le contenu du wiki est mis à jour chaque semaine si vous le souhaitez.$\r$\n$\r$\nCliquez sur Suivant pour continuer."
  !define MUI_PAGE_CUSTOMFUNCTION_PRE nwSkipIfUpdated
  !define MUI_PAGE_CUSTOMFUNCTION_SHOW nwDarkPage
  !insertmacro MUI_PAGE_WELCOME
  Page custom nwSecurityPage
  ; Page suivante generee par electron-builder : choix du dossier, en theme sombre.
  !define MUI_PAGE_CUSTOMFUNCTION_SHOW nwDarkPage
!macroend

; Installation pour l'utilisateur courant, sans droits administrateur : la page « pour qui installer » est sautee.
!macro customInstallMode
  StrCpy $isForceCurrentInstall "1"
!macroend

; ------------------------------------------------------------------ dossier d'installation (theme sombre)

!macro customPageAfterChangeDir
  ; Choix du dossier (theme sombre) : remplace la page d'electron-builder (allowToChangeInstallationDirectory: false).
  !include StrContains.nsh
  Function nwDirLeave
    ; Toujours installer dans un sous-dossier NetWiki, comme electron-builder.
    ${StrContains} $0 "${APP_FILENAME}" $INSTDIR
    ${If} $0 == ""
      StrCpy $INSTDIR "$INSTDIR\${APP_FILENAME}"
    ${EndIf}
  FunctionEnd
  !define MUI_PAGE_CUSTOMFUNCTION_PRE nwSkipIfUpdated
  !define MUI_PAGE_CUSTOMFUNCTION_SHOW nwDarkPage
  !define MUI_PAGE_CUSTOMFUNCTION_LEAVE nwDirLeave
  !define MUI_DIRECTORYPAGE_TEXT_TOP "NetWiki sera installé pour votre compte, sans droits administrateur. Vos articles sont enregistrés à part et sont conservés lors des mises à jour."
  !insertmacro MUI_PAGE_DIRECTORY
  ; Page d'installation : theme sombre.
  !define MUI_PAGE_CUSTOMFUNCTION_SHOW nwDarkPage
!macroend

; ------------------------------------------------------------------ soutien + fin

!macro customFinishPage
  Function nwSupportPage
    ${If} ${isUpdated}
      Abort
    ${EndIf}
    !insertmacro MUI_HEADER_TEXT "Soutenir NetWiki" "Un projet gratuit, libre et sans publicité."
    nsDialogs::Create 1018
    Pop $1
    ${If} $1 == error
      Abort
    ${EndIf}
    Call nwFonts
    SetCtlColors $1 ${NW_TEXT} ${NW_BG}
    !insertmacro NW_LABEL 0 0 100% 16u "♥  Merci d'avoir installé NetWiki" ${NW_PINK} $nwFontTitle
    !insertmacro NW_LABEL 0 24u 100% 28u "NetWiki est rédigé, vérifié et maintenu bénévolement par JK-ASFC, avec de nouveaux articles chaque semaine. Si le wiki vous fait gagner du temps, un don, même modeste, aide à le faire vivre." ${NW_TEXT} $nwFont
    ${NSD_CreateButton} 0 62u 150u 18u "Faire un don sur Liberapay"
    Pop $0
    SendMessage $0 ${WM_SETFONT} $nwFontBold 1
    ${NSD_OnClick} $0 nwOpenDonate
    !insertmacro NW_LABEL 0 86u 100% 11u "Autres façons d'aider" ${NW_CYAN} $nwFontBold
    !insertmacro NW_LABEL 10u 97u 290u 20u "Une étoile sur GitHub, une erreur signalée ou un article proposé dans les Issues. Le bouton ♥ de NetWiki ouvre aussi cette page." ${NW_TEXT} $nwFont
    !insertmacro NW_LABEL 0 122u 100% 10u "Le don est facultatif : NetWiki reste entièrement gratuit." ${NW_DIM} $nwFont
    Call nwDarkPage
    nsDialogs::Show
  FunctionEnd

  Function nwFinishShow
    Call nwDarkPage
    ; Lien de don en rose (le lien est cree par MUI : on le retrouve par son texte).
    FindWindow $R8 "#32770" "" $HWNDPARENT
    StrCpy $R9 0
    ${Do}
      FindWindow $R9 "" "" $R8 $R9
      ${If} $R9 == 0
        ${Break}
      ${EndIf}
      System::Call "user32::GetWindowTextW(p R9, w .R7, i 64)"
      StrCpy $R7 $R7 1
      ${If} $R7 == "♥"
        SetCtlColors $R9 ${NW_PINK} ${NW_BG}
      ${EndIf}
    ${Loop}
  FunctionEnd

  Function nwOpenDonate
    ExecShell "open" "${NW_DON}"
  FunctionEnd

  Page custom nwSupportPage
  !ifndef HIDE_RUN_AFTER_FINISH
    Function StartApp
      ${if} ${isUpdated}
        StrCpy $1 "--updated"
      ${else}
        StrCpy $1 ""
      ${endif}
      ${StdUtils.ExecShellAsUser} $0 "$launchLink" "open" "$1"
    FunctionEnd

    !define MUI_FINISHPAGE_RUN
    !define MUI_FINISHPAGE_RUN_TEXT "Lancer NetWiki"
    !define MUI_FINISHPAGE_RUN_FUNCTION "StartApp"
  !endif
  !define MUI_FINISHPAGE_TITLE "NetWiki est installé"
  !define MUI_FINISHPAGE_TEXT "NetWiki ${VERSION} est prêt.$\r$\n$\r$\nAstuce : Ctrl+K ouvre la recherche instantanée dans tout le wiki.$\r$\n$\r$\nMerci d'utiliser NetWiki !"
  !define MUI_FINISHPAGE_LINK "♥ Soutenir NetWiki sur Liberapay"
  !define MUI_FINISHPAGE_LINK_LOCATION "${NW_DON}"
  !define MUI_FINISHPAGE_LINK_COLOR "${NW_PINK}"
  !define MUI_PAGE_CUSTOMFUNCTION_SHOW nwFinishShow
  !insertmacro MUI_PAGE_FINISH
!macroend

; ------------------------------------------------------------------ desinstallation

!macro customUnWelcomePage
  Function un.nwDarkPage
    !insertmacro NW_DARKEN
  FunctionEnd
  !define MUI_WELCOMEPAGE_TITLE "Désinstaller NetWiki"
  !define MUI_WELCOMEPAGE_TEXT "Cet assistant supprime NetWiki de votre ordinateur.$\r$\n$\r$\nVos articles et vos réglages, stockés dans votre dossier de données, sont conservés : vous les retrouverez si vous réinstallez NetWiki.$\r$\n$\r$\nCliquez sur Suivant pour continuer."
  !define MUI_PAGE_CUSTOMFUNCTION_SHOW un.nwDarkPage
  !insertmacro MUI_UNPAGE_WELCOME
!macroend
