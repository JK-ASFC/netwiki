// NetWiki — activité principale : vue web Capacitor, module natif NetWiki et bouton Retour.
// Copyright (c) 2026 JK-ASFC — licence MIT.
package io.netwiki.app;

import android.os.Bundle;
import androidx.activity.OnBackPressedCallback;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.PluginHandle;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(NetWikiPlugin.class);
        super.onCreate(savedInstanceState);
        // Retour : confié à l'interface (fermer une fenêtre, le panneau, revenir à l'article précédent) ;
        // sinon comportement normal d'Android.
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                NetWikiPlugin p = plugin();
                if (p != null && p.onBack()) return;
                setEnabled(false);
                getOnBackPressedDispatcher().onBackPressed();
                setEnabled(true);
            }
        });
    }

    private NetWikiPlugin plugin() {
        if (bridge == null) return null;
        PluginHandle h = bridge.getPlugin("NetWiki");
        return h != null ? (NetWikiPlugin) h.getInstance() : null;
    }
}
