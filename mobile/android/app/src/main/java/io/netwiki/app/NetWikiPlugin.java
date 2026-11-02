// NetWiki — fonctions natives Android exposées à l'interface (window.Capacitor.Plugins.NetWiki) :
//  - mise à jour de l'application : téléchargement vérifié (SHA-256 de la liste signée, même signature que l'application installée)
//    puis installation par l'installeur d'Android ;
//  - notifications de nouvelle version (tâche de fond, avec l'accord de l'utilisateur) ;
//  - PDF : enregistrement dans Téléchargements, partage, impression ; partage de texte ;
//  - bouton Retour, couleurs des barres système.
// Copyright (c) 2026 JK-ASFC — licence MIT.
package io.netwiki.app;

import android.Manifest;
import android.content.ClipData;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.print.PdfExporter;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintManager;
import android.provider.MediaStore;
import android.provider.Settings;
import android.view.View;
import android.view.Window;
import android.webkit.WebView;
import androidx.activity.result.ActivityResult;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.security.MessageDigest;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@CapacitorPlugin(name = "NetWiki", permissions = { @Permission(alias = "notifications", strings = { Manifest.permission.POST_NOTIFICATIONS }) })
public class NetWikiPlugin extends Plugin {

    private static final long MAX_APK = 300L * 1024 * 1024;
    private String launchAction = null;
    private File pendingPdf = null;
    private boolean backHandledByJs = false;
    private final ExecutorService io = Executors.newCachedThreadPool();

    @Override
    public void load() {
        UpdateCheck.createChannel(getContext());
    }

    // ------------------------------------------------------------------ informations

    @PluginMethod
    public void getInfo(PluginCall call) {
        Context ctx = getContext();
        JSObject r = new JSObject();
        r.put("version", BuildConfig.VERSION_NAME);
        r.put("versionCode", BuildConfig.VERSION_CODE);
        r.put("selfUpdate", BuildConfig.SELF_UPDATE);
        r.put("store", BuildConfig.FLAVOR);
        r.put("sdk", Build.VERSION.SDK_INT);
        r.put("device", Build.MANUFACTURER + " " + Build.MODEL);
        r.put("canInstall", canInstall());
        r.put("notifications", UpdateCheck.canNotify(ctx));
        r.put("backgroundCheck", UpdateCheck.prefs(ctx).getBoolean("notify", false));
        call.resolve(r);
    }

    private boolean canInstall() {
        if (!BuildConfig.SELF_UPDATE) return false;
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return true;
        return getContext().getPackageManager().canRequestPackageInstalls();
    }

    // ------------------------------------------------------------------ requêtes GitHub (lecture seule)

    /** Lit un document texte sur GitHub (liste signée, index du contenu…) : hôtes GitHub uniquement, taille limitée. */
    @PluginMethod
    public void httpGet(PluginCall call) {
        String url = call.getString("url", "");
        int max = call.getInt("maxBytes", 2 * 1024 * 1024);
        io.execute(() -> {
            try {
                String text = UpdateCheck.getText(url, call.getString("accept", "application/octet-stream"), Math.min(max, 250 * 1024 * 1024));
                JSObject r = new JSObject();
                r.put("status", text == null ? 404 : 200);
                r.put("text", text == null ? "" : text);
                call.resolve(r);
            } catch (Exception e) {
                call.reject(message(e, "Connexion à GitHub impossible."));
            }
        });
    }

    // ------------------------------------------------------------------ mise à jour de l'application

    @PluginMethod
    public void downloadUpdate(PluginCall call) {
        if (!BuildConfig.SELF_UPDATE) {
            call.reject("Cette version de NetWiki est mise à jour par le magasin d'applications.", "STORE");
            return;
        }
        String url = call.getString("url", "");
        String sha = call.getString("sha256", "").toLowerCase();
        String name = call.getString("name", "NetWiki.apk").replaceAll("[^A-Za-z0-9._-]", "_");
        if (!sha.matches("[0-9a-f]{64}")) {
            call.reject("Empreinte attendue absente de la liste signée.");
            return;
        }
        io.execute(() -> {
            File dir = new File(getContext().getCacheDir(), "updates");
            File out = new File(dir, name);
            try {
                deleteAll(dir);
                dir.mkdirs();
                HttpURLConnection c = UpdateCheck.open(url, "application/octet-stream");
                try {
                    if (c.getResponseCode() != 200) throw new IOException("Téléchargement impossible (" + c.getResponseCode() + ").");
                    long total = c.getContentLengthLong();
                    if (total > MAX_APK) throw new IOException("Fichier trop volumineux.");
                    MessageDigest md = MessageDigest.getInstance("SHA-256");
                    long received = 0;
                    long last = 0;
                    try (InputStream in = c.getInputStream(); OutputStream os = new FileOutputStream(out)) {
                        byte[] buf = new byte[65536];
                        int n;
                        while ((n = in.read(buf)) > 0) {
                            os.write(buf, 0, n);
                            md.update(buf, 0, n);
                            received += n;
                            if (received > MAX_APK) throw new IOException("Fichier trop volumineux.");
                            long now = System.currentTimeMillis();
                            if (now - last > 250) {
                                last = now;
                                progress(received, total);
                            }
                        }
                    }
                    progress(received, total);
                    if (!hex(md.digest()).equals(sha)) throw new IOException("Empreinte du fichier téléchargé incorrecte : mise à jour annulée.");
                } finally {
                    c.disconnect();
                }
                checkApk(out);
                JSObject r = new JSObject();
                r.put("path", out.getAbsolutePath());
                r.put("size", out.length());
                call.resolve(r);
            } catch (SignatureMismatch e) {
                out.delete();
                call.reject(e.getMessage(), "SIGNATURE");
            } catch (Exception e) {
                out.delete();
                call.reject(message(e, "Téléchargement impossible."));
            }
        });
    }

    private static class SignatureMismatch extends Exception {

        SignatureMismatch(String m) {
            super(m);
        }
    }

    /** Le fichier doit être NetWiki, plus récent, et signé par la même clé que l'application installée. */
    @SuppressWarnings("deprecation")
    private void checkApk(File apk) throws Exception {
        PackageManager pm = getContext().getPackageManager();
        PackageInfo archive = pm.getPackageArchiveInfo(apk.getAbsolutePath(), PackageManager.GET_SIGNATURES);
        if (archive == null) throw new IOException("Le fichier téléchargé n'est pas une application Android valide.");
        if (!getContext().getPackageName().equals(archive.packageName)) throw new IOException("Le fichier téléchargé n'est pas NetWiki.");
        PackageInfo installed = pm.getPackageInfo(getContext().getPackageName(), PackageManager.GET_SIGNATURES);
        if (archive.signatures != null && installed.signatures != null && !sameSigners(archive.signatures, installed.signatures)) {
            throw new SignatureMismatch(
                "La nouvelle version est signée avec la clé officielle de JK-ASFC, différente de celle de l'application installée " +
                "(ancienne version de test). Désinstallez NetWiki une seule fois puis installez la nouvelle version : les mises à jour suivantes seront automatiques."
            );
        }
    }

    private static boolean sameSigners(Signature[] a, Signature[] b) {
        Set<String> x = new HashSet<>();
        Set<String> y = new HashSet<>();
        for (Signature s : a) x.add(s.toCharsString());
        for (Signature s : b) y.add(s.toCharsString());
        return x.equals(y);
    }

    private void progress(long received, long total) {
        JSObject p = new JSObject();
        p.put("received", received);
        p.put("total", total);
        notifyListeners("updateProgress", p);
    }

    @PluginMethod
    public void installUpdate(PluginCall call) {
        File apk = new File(call.getString("path", ""));
        File dir = new File(getContext().getCacheDir(), "updates");
        if (!BuildConfig.SELF_UPDATE || !apk.isFile() || !dir.equals(apk.getParentFile())) {
            call.reject("Mise à jour introuvable : relancez la recherche de mise à jour.");
            return;
        }
        if (!canInstall()) {
            // Android exige une autorisation unique « Installer des applications inconnues » pour NetWiki.
            Intent i = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, Uri.parse("package:" + getContext().getPackageName()));
            startActivityForResult(call, i, "installPermissionResult");
            return;
        }
        startInstall(call, apk);
    }

    @ActivityCallback
    private void installPermissionResult(PluginCall call, ActivityResult result) {
        if (call == null) return;
        if (!canInstall()) {
            call.reject("Autorisez NetWiki à installer des applications (Paramètres d'Android) pour mettre à jour automatiquement.", "INSTALL_PERMISSION");
            return;
        }
        startInstall(call, new File(call.getString("path", "")));
    }

    private void startInstall(PluginCall call, File apk) {
        try {
            Uri uri = FileProvider.getUriForFile(getContext(), getContext().getPackageName() + ".fileprovider", apk);
            Intent i = new Intent(Intent.ACTION_VIEW)
                .setDataAndType(uri, "application/vnd.android.package-archive")
                .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
            getActivity().startActivity(i);
            call.resolve();
        } catch (Exception e) {
            call.reject(message(e, "Ouverture de l'installeur d'Android impossible."));
        }
    }

    @PluginMethod
    public void openInstallSettings(PluginCall call) {
        try {
            Intent i = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
                ? new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, Uri.parse("package:" + getContext().getPackageName()))
                : new Intent(Settings.ACTION_SECURITY_SETTINGS);
            getActivity().startActivity(i);
            call.resolve();
        } catch (Exception e) {
            call.reject(message(e, "Paramètres indisponibles."));
        }
    }

    // ------------------------------------------------------------------ notifications

    /** Active ou arrête la vérification en arrière-plan ; mémorise la version du contenu installé. */
    @PluginMethod
    public void configureUpdates(PluginCall call) {
        android.content.SharedPreferences.Editor e = UpdateCheck.prefs(getContext()).edit();
        Boolean notify = call.getBoolean("notify");
        if (notify != null) e.putBoolean("notify", notify);
        Boolean content = call.getBoolean("contentNotify");
        if (content != null) e.putBoolean("contentNotify", content);
        String cv = call.getString("contentVersion");
        if (cv != null) e.putString("contentVersion", cv);
        e.apply();
        if (notify != null) UpdateCheck.schedule(getContext(), notify);
        call.resolve();
    }

    @PluginMethod
    public void requestNotifications(PluginCall call) {
        if (Build.VERSION.SDK_INT >= 33 && getPermissionState("notifications") != PermissionState.GRANTED) {
            requestPermissionForAlias("notifications", call, "notificationsResult");
            return;
        }
        notificationsResult(call);
    }

    @PermissionCallback
    private void notificationsResult(PluginCall call) {
        JSObject r = new JSObject();
        r.put("granted", UpdateCheck.canNotify(getContext()));
        call.resolve(r);
    }

    @PluginMethod
    public void openNotificationSettings(PluginCall call) {
        try {
            Intent i = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
                ? new Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS).putExtra(Settings.EXTRA_APP_PACKAGE, getContext().getPackageName())
                : new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:" + getContext().getPackageName()));
            getActivity().startActivity(i);
            call.resolve();
        } catch (Exception e) {
            call.reject(message(e, "Paramètres indisponibles."));
        }
    }

    /** Tests sur émulateur (version de débogage uniquement) : lance tout de suite la vérification de la tâche de fond. */
    @PluginMethod
    public void runBackgroundCheck(PluginCall call) {
        if (!BuildConfig.DEBUG) {
            call.reject("Réservé aux versions de test.");
            return;
        }
        io.execute(() -> {
            try {
                UpdateCheck.runBackgroundCheck(getContext());
                call.resolve();
            } catch (Exception e) {
                call.reject(message(e, "Vérification impossible."));
            }
        });
    }

    /** Action demandée par une notification touchée au lancement (« app-update », « content-update »). */
    @PluginMethod
    public void consumeLaunchAction(PluginCall call) {
        JSObject r = new JSObject();
        r.put("action", launchAction);
        launchAction = null;
        call.resolve(r);
    }

    @Override
    protected void handleOnNewIntent(Intent intent) {
        if (intent == null) return;
        String a = intent.getStringExtra(UpdateCheck.EXTRA_ACTION);
        if (a == null) return;
        intent.removeExtra(UpdateCheck.EXTRA_ACTION);
        if (hasListeners("launchAction")) {
            JSObject r = new JSObject();
            r.put("action", a);
            notifyListeners("launchAction", r);
        } else {
            launchAction = a;
        }
    }

    // ------------------------------------------------------------------ PDF, impression et partage

    private PrintAttributes a4() {
        return new PrintAttributes.Builder()
            .setMediaSize(PrintAttributes.MediaSize.ISO_A4)
            .setResolution(new PrintAttributes.Resolution("pdf", "pdf", 600, 600))
            .setMinMargins(new PrintAttributes.Margins(400, 400, 400, 400))
            .build();
    }

    private static String pdfName(String title) {
        String n = (title == null ? "" : title).replaceAll("[\\\\/:*?\"<>|\\p{Cntrl}]", " ").replaceAll("\\s+", " ").trim();
        if (n.length() > 80) n = n.substring(0, 80).trim();
        return (n.isEmpty() ? "NetWiki" : n) + ".pdf";
    }

    /** action : « save » (dossier Téléchargements/NetWiki), « share » (applications d'Android). */
    @PluginMethod
    public void savePdf(PluginCall call) {
        String name = pdfName(call.getString("name"));
        String action = call.getString("action", "save");
        getActivity().runOnUiThread(() -> {
            WebView wv = getBridge().getWebView();
            File dir = new File(getContext().getCacheDir(), "pdf");
            deleteAll(dir);
            dir.mkdirs();
            File out = new File(dir, name);
            PrintDocumentAdapter adapter = wv.createPrintDocumentAdapter(name.replaceAll("\\.pdf$", ""));
            try {
                PdfExporter.export(adapter, a4(), out, new PdfExporter.Callback() {
                    @Override
                    public void onDone(File f) {
                        if ("share".equals(action)) sharePdf(call, f);
                        else storePdf(call, f);
                    }

                    @Override
                    public void onError(String m) {
                        call.reject(m);
                    }
                });
            } catch (Throwable t) {
                call.reject("Génération du PDF impossible sur cet appareil : utilisez « Imprimer », puis « Enregistrer au format PDF ».", "PDF_UNAVAILABLE");
            }
        });
    }

    private void sharePdf(PluginCall call, File f) {
        try {
            Uri uri = FileProvider.getUriForFile(getContext(), getContext().getPackageName() + ".fileprovider", f);
            Intent send = new Intent(Intent.ACTION_SEND)
                .setType("application/pdf")
                .putExtra(Intent.EXTRA_STREAM, uri)
                .putExtra(Intent.EXTRA_SUBJECT, f.getName().replaceAll("\\.pdf$", ""))
                .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            send.setClipData(ClipData.newRawUri(f.getName(), uri));
            Intent chooser = Intent.createChooser(send, "Partager le PDF");
            chooser.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            getActivity().startActivity(chooser);
            JSObject r = new JSObject();
            r.put("shared", true);
            call.resolve(r);
        } catch (Exception e) {
            call.reject(message(e, "Partage impossible."));
        }
    }

    private void storePdf(PluginCall call, File f) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            io.execute(() -> {
                ContentResolver cr = getContext().getContentResolver();
                ContentValues v = new ContentValues();
                v.put(MediaStore.MediaColumns.DISPLAY_NAME, f.getName());
                v.put(MediaStore.MediaColumns.MIME_TYPE, "application/pdf");
                v.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/NetWiki");
                v.put(MediaStore.MediaColumns.IS_PENDING, 1);
                Uri uri = cr.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, v);
                if (uri == null) {
                    call.reject("Enregistrement dans Téléchargements impossible.");
                    return;
                }
                try (InputStream in = new FileInputStream(f); OutputStream os = cr.openOutputStream(uri)) {
                    copy(in, os);
                    v.clear();
                    v.put(MediaStore.MediaColumns.IS_PENDING, 0);
                    cr.update(uri, v, null, null);
                    JSObject r = new JSObject();
                    r.put("uri", uri.toString());
                    r.put("location", "Téléchargements/NetWiki/" + f.getName());
                    call.resolve(r);
                } catch (Exception e) {
                    cr.delete(uri, null, null);
                    call.reject(message(e, "Enregistrement dans Téléchargements impossible."));
                }
            });
            return;
        }
        // Android 9 et antérieur : l'utilisateur choisit l'emplacement (aucune autorisation de stockage nécessaire).
        pendingPdf = f;
        Intent i = new Intent(Intent.ACTION_CREATE_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType("application/pdf").putExtra(Intent.EXTRA_TITLE, f.getName());
        startActivityForResult(call, i, "pdfLocationResult");
    }

    @ActivityCallback
    private void pdfLocationResult(PluginCall call, ActivityResult result) {
        if (call == null) return;
        Uri uri = result.getData() != null ? result.getData().getData() : null;
        if (result.getResultCode() != android.app.Activity.RESULT_OK || uri == null || pendingPdf == null) {
            JSObject r = new JSObject();
            r.put("cancelled", true);
            call.resolve(r);
            return;
        }
        try (InputStream in = new FileInputStream(pendingPdf); OutputStream os = getContext().getContentResolver().openOutputStream(uri)) {
            copy(in, os);
            JSObject r = new JSObject();
            r.put("uri", uri.toString());
            r.put("location", pendingPdf.getName());
            call.resolve(r);
        } catch (Exception e) {
            call.reject(message(e, "Enregistrement impossible."));
        }
    }

    /** Ouvre un fichier enregistré (PDF) avec l'application de lecture choisie par l'utilisateur. */
    @PluginMethod
    public void openFile(PluginCall call) {
        try {
            Intent i = new Intent(Intent.ACTION_VIEW)
                .setDataAndType(Uri.parse(call.getString("uri", "")), call.getString("mime", "application/pdf"))
                .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
            getActivity().startActivity(i);
            call.resolve();
        } catch (Exception e) {
            call.reject("Aucune application ne peut ouvrir ce fichier sur cet appareil.");
        }
    }

    /** Boîte d'impression d'Android (imprimante ou « Enregistrer au format PDF »). */
    @PluginMethod
    public void printPage(PluginCall call) {
        String name = pdfName(call.getString("name")).replaceAll("\\.pdf$", "");
        getActivity().runOnUiThread(() -> {
            try {
                PrintManager pm = (PrintManager) getActivity().getSystemService(Context.PRINT_SERVICE);
                pm.print(name, getBridge().getWebView().createPrintDocumentAdapter(name), a4());
                call.resolve();
            } catch (Exception e) {
                call.reject(message(e, "Impression indisponible."));
            }
        });
    }

    @PluginMethod
    public void shareText(PluginCall call) {
        try {
            String title = call.getString("title", "NetWiki");
            Intent send = new Intent(Intent.ACTION_SEND)
                .setType("text/plain")
                .putExtra(Intent.EXTRA_SUBJECT, title)
                .putExtra(Intent.EXTRA_TEXT, call.getString("text", ""));
            getActivity().startActivity(Intent.createChooser(send, call.getString("dialogTitle", "Partager")));
            call.resolve();
        } catch (Exception e) {
            call.reject(message(e, "Partage impossible."));
        }
    }

    // ------------------------------------------------------------------ bouton Retour et barres système

    /** L'interface gère le bouton Retour (fermer une fenêtre, revenir à l'article précédent…). */
    @PluginMethod
    public void setBackHandler(PluginCall call) {
        backHandledByJs = call.getBoolean("enabled", true);
        call.resolve();
    }

    /** Appelé par MainActivity : true si l'interface a pris en charge l'appui. */
    boolean onBack() {
        if (!backHandledByJs || !hasListeners("backButton")) return false;
        notifyListeners("backButton", new JSObject());
        return true;
    }

    /** Quitte l'application (tâche mise en arrière-plan, comme le bouton Accueil). */
    @PluginMethod
    public void exitApp(PluginCall call) {
        call.resolve();
        getActivity().runOnUiThread(() -> getActivity().moveTaskToBack(true));
    }

    /** Couleur des barres d'état et de navigation, et icônes claires ou sombres selon le thème de NetWiki. */
    @PluginMethod
    public void setSystemBars(PluginCall call) {
        boolean dark = call.getBoolean("dark", true);
        String color = call.getString("color", dark ? "#0b0d14" : "#f6f7fb");
        getActivity().runOnUiThread(() -> {
            try {
                int c = android.graphics.Color.parseColor(color);
                Window w = getActivity().getWindow();
                w.getDecorView().setBackgroundColor(c);
                if (Build.VERSION.SDK_INT < 35) {
                    w.setStatusBarColor(c);
                    w.setNavigationBarColor(c);
                }
                View decor = w.getDecorView();
                WindowInsetsControllerCompat ctl = WindowCompat.getInsetsController(w, decor);
                ctl.setAppearanceLightStatusBars(!dark);
                ctl.setAppearanceLightNavigationBars(!dark);
                call.resolve();
            } catch (Exception e) {
                call.reject(message(e, "Couleur invalide."));
            }
        });
    }

    // ------------------------------------------------------------------ outils

    private static void copy(InputStream in, OutputStream os) throws IOException {
        if (os == null) throw new IOException("Destination indisponible.");
        byte[] buf = new byte[65536];
        int n;
        while ((n = in.read(buf)) > 0) os.write(buf, 0, n);
    }

    private static void deleteAll(File dir) {
        File[] files = dir.listFiles();
        if (files != null) for (File f : files) f.delete();
    }

    private static String hex(byte[] b) {
        StringBuilder s = new StringBuilder();
        for (byte x : b) s.append(String.format("%02x", x));
        return s.toString();
    }

    private static String message(Exception e, String fallback) {
        String m = e.getMessage();
        if (e instanceof java.net.UnknownHostException) return "Pas de connexion Internet.";
        if (e instanceof java.net.SocketTimeoutException) return "GitHub ne répond pas : réessayez plus tard.";
        return m != null && !m.isEmpty() ? m : fallback;
    }
}
