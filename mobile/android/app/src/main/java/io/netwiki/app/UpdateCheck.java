// NetWiki — recherche des nouvelles versions sur GitHub (logiciel et contenu du wiki) et notifications.
// Requêtes HTTPS anonymes vers github.com/JK-ASFC/netwiki uniquement ; aucune donnée personnelle envoyée.
// Copyright (c) 2026 JK-ASFC — licence MIT.
package io.netwiki.app;

import android.Manifest;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Build;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.ContextCompat;
import androidx.work.Constraints;
import androidx.work.ExistingPeriodicWorkPolicy;
import androidx.work.NetworkType;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import org.json.JSONObject;

public final class UpdateCheck {

    public static final String REPO = "JK-ASFC/netwiki";
    public static final String LATEST = "https://api.github.com/repos/" + REPO + "/releases/latest";
    public static final String CONTENT_INDEX = "https://raw.githubusercontent.com/" + REPO + "/contenu/contenu.json";
    public static final String CHANNEL = "updates";
    public static final String EXTRA_ACTION = "netwiki_action";
    public static final String PREFS = "netwiki_updates";
    static final String WORK = "netwiki-update-check";
    static final Set<String> HOSTS = new HashSet<>(
        Arrays.asList("api.github.com", "github.com", "objects.githubusercontent.com", "release-assets.githubusercontent.com", "raw.githubusercontent.com")
    );

    private UpdateCheck() {}

    static SharedPreferences prefs(Context ctx) {
        return ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    /** Ouvre une connexion HTTPS vers un hôte GitHub autorisé (redirections suivies et contrôlées une à une). */
    static HttpURLConnection open(String url, String accept) throws IOException {
        for (int i = 0; i < 6; i++) {
            URL u = new URL(url);
            if (!"https".equals(u.getProtocol()) || !HOSTS.contains(u.getHost())) throw new IOException("Adresse de téléchargement refusée.");
            HttpURLConnection c = (HttpURLConnection) u.openConnection();
            c.setInstanceFollowRedirects(false);
            c.setConnectTimeout(20000);
            c.setReadTimeout(60000);
            c.setRequestProperty("Accept", accept);
            c.setRequestProperty("User-Agent", "NetWiki/" + BuildConfig.VERSION_NAME + " (Android)");
            int code = c.getResponseCode();
            if (code >= 300 && code < 400 && c.getHeaderField("Location") != null) {
                url = new URL(u, c.getHeaderField("Location")).toString();
                c.disconnect();
                continue;
            }
            return c;
        }
        throw new IOException("Trop de redirections.");
    }

    static String getText(String url, String accept, int maxBytes) throws IOException {
        HttpURLConnection c = open(url, accept);
        try {
            int code = c.getResponseCode();
            if (code == 404) return null;
            if (code != 200) throw new IOException("GitHub a répondu " + code + ".");
            try (InputStream in = c.getInputStream()) {
                ByteArrayOutputStream out = new ByteArrayOutputStream();
                byte[] buf = new byte[16384];
                int n;
                while ((n = in.read(buf)) > 0) {
                    out.write(buf, 0, n);
                    if (out.size() > maxBytes) throw new IOException("Réponse trop volumineuse.");
                }
                return new String(out.toByteArray(), StandardCharsets.UTF_8);
            }
        } finally {
            c.disconnect();
        }
    }

    /** Compare deux versions « 1.46.0 » ou « 2026.11.02.0800 » : > 0 si a est plus récente. */
    static int compare(String a, String b) {
        String[] pa = a.split("\\.");
        String[] pb = b.split("\\.");
        for (int i = 0; i < Math.max(pa.length, pb.length); i++) {
            long x = i < pa.length ? parse(pa[i]) : 0;
            long y = i < pb.length ? parse(pb[i]) : 0;
            if (x != y) return x > y ? 1 : -1;
        }
        return 0;
    }

    private static long parse(String s) {
        try {
            return Long.parseLong(s.replaceAll("[^0-9].*$", ""));
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    /** Planifie (ou arrête) la vérification en arrière-plan, deux fois par jour, uniquement avec une connexion. */
    static void schedule(Context ctx, boolean enabled) {
        WorkManager wm = WorkManager.getInstance(ctx);
        if (!enabled) {
            wm.cancelUniqueWork(WORK);
            return;
        }
        Constraints net = new Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build();
        PeriodicWorkRequest req = new PeriodicWorkRequest.Builder(UpdateWorker.class, 12, TimeUnit.HOURS, 2, TimeUnit.HOURS)
            .setConstraints(net)
            .setInitialDelay(15, TimeUnit.MINUTES)
            .build();
        wm.enqueueUniquePeriodicWork(WORK, ExistingPeriodicWorkPolicy.UPDATE, req);
    }

    /** Vérification faite par la tâche de fond : notifie une seule fois par nouvelle version. */
    static void runBackgroundCheck(Context ctx) throws Exception {
        SharedPreferences p = prefs(ctx);
        if (!p.getBoolean("notify", false)) return;
        String rel = getText(LATEST, "application/vnd.github+json", 2 * 1024 * 1024);
        if (rel != null) {
            JSONObject o = new JSONObject(rel);
            String latest = o.optString("tag_name", "").replaceFirst("^[vV]", "");
            if (!latest.isEmpty() && compare(latest, BuildConfig.VERSION_NAME) > 0 && !latest.equals(p.getString("notifiedApp", ""))) {
                String text = BuildConfig.SELF_UPDATE
                    ? "Touchez pour télécharger et installer la mise à jour. Vos articles et réglages sont conservés."
                    : "Une nouvelle version est disponible. Touchez pour en savoir plus.";
                notify(ctx, 1, "NetWiki " + latest + " est disponible", text, "app-update");
                p.edit().putString("notifiedApp", latest).apply();
            }
        }
        String installed = p.getString("contentVersion", "");
        if (p.getBoolean("contentNotify", true) && !installed.isEmpty()) {
            String idx = getText(CONTENT_INDEX, "application/json", 512 * 1024);
            if (idx != null) {
                JSONObject o = new JSONObject(idx);
                String v = o.optString("version", "");
                if (!v.isEmpty() && compare(v, installed) > 0 && !v.equals(p.getString("notifiedContent", ""))) {
                    notify(ctx, 2, "Nouveaux articles dans NetWiki", "Le contenu du wiki a été mis à jour. Touchez pour voir les nouveautés.", "content-update");
                    p.edit().putString("notifiedContent", v).apply();
                }
            }
        }
    }

    static void createChannel(Context ctx) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;
        NotificationChannel ch = new NotificationChannel(CHANNEL, "Mises à jour", NotificationManager.IMPORTANCE_DEFAULT);
        ch.setDescription("Nouvelle version de NetWiki ou nouveaux articles du wiki.");
        ctx.getSystemService(NotificationManager.class).createNotificationChannel(ch);
    }

    static boolean canNotify(Context ctx) {
        if (Build.VERSION.SDK_INT >= 33 && ContextCompat.checkSelfPermission(ctx, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            return false;
        }
        return NotificationManagerCompat.from(ctx).areNotificationsEnabled();
    }

    static void notify(Context ctx, int id, String title, String text, String action) {
        if (!canNotify(ctx)) return;
        createChannel(ctx);
        Intent open = new Intent(ctx, MainActivity.class)
            .setAction(Intent.ACTION_MAIN)
            .addCategory(Intent.CATEGORY_LAUNCHER)
            .addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
            .putExtra(EXTRA_ACTION, action);
        PendingIntent pi = PendingIntent.getActivity(ctx, id, open, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        NotificationCompat.Builder b = new NotificationCompat.Builder(ctx, CHANNEL)
            .setSmallIcon(R.drawable.ic_stat_netwiki)
            .setColor(0xFF6366F1)
            .setContentTitle(title)
            .setContentText(text)
            .setStyle(new NotificationCompat.BigTextStyle().bigText(text))
            .setContentIntent(pi)
            .setAutoCancel(true)
            .setCategory(NotificationCompat.CATEGORY_RECOMMENDATION)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT);
        try {
            NotificationManagerCompat.from(ctx).notify(id, b.build());
        } catch (SecurityException ignored) {}
    }
}
