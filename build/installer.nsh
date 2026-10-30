; NetWiki - personnalisation de l'installateur Windows (NSIS, electron-builder).
; Copyright (c) 2026 JK-ASFC - licence MIT (voir LICENSE).
;
; Page de fin : meme comportement que la page par defaut d'electron-builder
; (case "Lancer NetWiki"), avec en plus un lien pour soutenir le projet.

!macro customFinishPage
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
    !define MUI_FINISHPAGE_RUN_FUNCTION "StartApp"
  !endif
  !define MUI_FINISHPAGE_LINK "Soutenir NetWiki : faire un don sur Liberapay"
  !define MUI_FINISHPAGE_LINK_LOCATION "https://liberapay.com/JK-ASFC/donate"
  !insertmacro MUI_PAGE_FINISH
!macroend
